import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FrameWrapper from "@/components/FrameWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shinehub",
  description: "FYP Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
      >
        <FrameWrapper>{children}</FrameWrapper>
      </body>
    </html>
  );
}
