import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
//import { ClerkProvider } from "@clerk/clerk-react";
//import { Header } from "@radix-ui/react-accordion";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "AI carrer coach",
  description:
    "The AI Career Coach App is an intelligent, interactive platform designed to guide users on their career journey through personalized insights, skill assessments, and real-time mentorship.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme:dark
    }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header />

            {/* footer */}
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with Love by AnuVidhya</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
