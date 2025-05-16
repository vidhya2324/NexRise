"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};


export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      industry: true
    }
  });

  if (!user) throw new Error("user not found");
  if (!user.industry) throw new Error("industry not found");

  // First check if industry insight exists
  let industryInsight = await db.industryInsight.findUnique({
    where: {
      industry: user.industry,
    },
  });

  // If not found, create it
  if (!industryInsight) {
    try {
      const insights = await generateAIInsights(user.industry);
      
      industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (error) {
      // If error is due to unique constraint, try to find it again
      // This handles race conditions where another request might have created it
      if (error.code === 'P2002') {
        industryInsight = await db.industryInsight.findUnique({
          where: {
            industry: user.industry,
          },
        });
        
        if (!industryInsight) {
          throw new Error("Failed to get or create industry insight");
        }
      } else {
        throw error;
      }
    }
  }

  return industryInsight;
}

// export async function getIndustryInsights() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: {
//       clerkUserId: userId,
//     },
//     include: {
//       industryInsight: true,
//     },
//   });

//   if (!user) throw new Error("user not found");

//   if (!user.industryInsight) {
//     const insights = await generateAIInsights(user.industry);

//     const industryInsight = await db.industryInsight.create({
//       data: {
//         industry: user.industry,
//         ...insights,
//         nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       },
//     });

//     return industryInsight;
//   }

//   return user.industryInsight;
// }

