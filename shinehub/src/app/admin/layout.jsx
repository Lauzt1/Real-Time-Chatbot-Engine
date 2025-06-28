import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/admin/NavBar";
import Footer from "@/components/admin/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shinehub Admin",
  description: "FYP Project",
};

export default function AdminLayout({ children }) {
  return (
    <>
        <Navbar />
          <main className="flex-grow">{children}</main>
        <Footer />
    </>

  );
}
