import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MockModeBanner } from '@/components/ui/MockModeBanner';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EDU-Bridge — English, Digital Literacy & Career Guidance",
  description: "Empowering public day school students in Rwanda with English communication, digital literacy, and career mentorship. Free for all students.",
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
          <MockModeBanner />
        </AuthProvider>
      </body>
    </html>
  );
}