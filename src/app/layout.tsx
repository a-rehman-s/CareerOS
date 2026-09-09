import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CareerOS",
    default: "CareerOS — AI Career Management Platform",
  },
  description:
    "CareerOS is your AI-powered personal career operating system. Manage your profile, resumes, job applications, and interview preparation in one place.",
  keywords: ["career management", "job search", "AI career", "resume builder", "job applications"],
  authors: [{ name: "CareerOS" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CareerOS — AI Career Management Platform",
    description: "Your AI-powered personal career operating system",
    siteName: "CareerOS",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
