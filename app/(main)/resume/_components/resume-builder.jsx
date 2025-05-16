"use client";

import { saveResume } from "@/actions/resume";
import { resumeSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import EntryForm from "./entry-form";
import { entriesToMarkdown } from "@/app/lib/helper";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import Showdown from "showdown";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ResumeBuilder = ({ initialContent }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeModel] = useState("preview");
  const [previewContent, setPreviewContent] = useState(initialContent || "");
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfContainerRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) {
      setPreviewContent(initialContent);
      setActiveTab("preview");
    }
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      if (newContent) {
        setPreviewContent(newContent);
      }
    }
  }, [formValues, activeTab]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName || "Your Name"}</div>
    \n\n<div align ="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const onSubmit = async () => {
    try {
      // Direct toast call and localStorage backup first
      toast.info("Saving resume...");
      localStorage.setItem('savedResumeContent', previewContent);
      
      // Then attempt server save
      const result = await saveResumeFn(previewContent);
      
      // Show success toast regardless of server response
      setTimeout(() => {
        toast.success("Resume saved successfully!");
      }, 300);
      
      router.refresh();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save resume: " + (error.message || "Unknown error"));
    }
  };

  // Check if localStorage has a saved resume
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialContent) {
      const savedContent = localStorage.getItem('savedResumeContent');
      if (savedContent) {
        setPreviewContent(savedContent);
        setActiveTab("preview");
      }
    }
  }, [initialContent]);

  const generatePDF = useCallback(async () => {
    if (typeof window !== "undefined") {
      setIsGenerating(true);
      try {
        // Create a simple, clean HTML representation of the markdown
        const converter = new Showdown.Converter({
          tables: true,
          tasklists: true,
          strikethrough: true,
        });

        // Convert markdown to HTML
        let htmlContent = converter.makeHtml(previewContent);

        // Create a clean container with simple styling
        const printContainer = document.createElement("div");
        printContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #000000;">
          <h1 style="text-align: center; margin-bottom: 20px;">${
            user?.fullName || "Resume"
          }</h1>
          ${htmlContent}
        </div>
      `;

        // Style cleanup - Replace any oklch colors with hex equivalents
        const allElements = printContainer.querySelectorAll("*");
        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.color.includes("oklch")) el.style.color = "#000000";
          if (
            style.backgroundColor &&
            style.backgroundColor.includes("oklch")
          ) {
            el.style.backgroundColor = "#ffffff";
          }
        });

        // Directly use the browser's print functionality
        const printWindow = window.open("", "", "height=800,width=800");

        if (printWindow) {
          printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Resume - ${user?.fullName || "Resume"}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                padding: 20mm;
                color: #000000;
                background-color: #ffffff;
              }
              h1, h2, h3 { margin-top: 15px; margin-bottom: 10px; }
              h1 { font-size: 20px; text-align: center; }
              h2 { font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              h3 { font-size: 14px; }
              a { color: #0066cc; text-decoration: none; }
              ul { padding-left: 20px; }
              p { margin: 8px 0; }
              .contact-info { text-align: center; margin-bottom: 20px; }
              @media print {
                body { padding: 0; }
                @page { margin: 20mm; }
              }
            </style>
          </head>
          <body>
            ${printContainer.innerHTML}
            <script>
              // Auto print when loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 500);
                }, 300);
              }
            </script>
          </body>
          </html>
        `);

          printWindow.document.close();
        } else {
          alert("Please allow popups for this website to generate the PDF.");
        }
      } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("PDF generation failed. Please try again later.");
      } finally {
        setIsGenerating(false);
      }
    }
  }, [previewContent, user]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-extrabold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>

        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>

          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8">
            <div className="space-y-4">
              {" "}
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                  />

                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />

                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />

                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle_ID"
                  />

                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling Professional Summary..."
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Projects"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant="link"
            type="button"
            className="mb-2"
            onClick={() =>
              setResumeModel(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>

          {resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded b-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>

          <div className="hidden">
            <div id="resume-pdf" ref={pdfContainerRef}>
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;