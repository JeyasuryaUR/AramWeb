import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Toaster } from "react-hot-toast";
import {
  FaCoins,
  FaCompass,
  FaHandsHelping,
  FaHome,
  FaPlus,
  FaTrophy,
  FaUser,
} from "react-icons/fa";
import { GiWantedReward } from "react-icons/gi";

export const metadata: Metadata = {
  title: "Aram",
  description: "Fostering Social Good",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items = [
    { title: "Home", icon: <FaHome />, href: "/" },
    { title: "Helperhood", icon: <FaHandsHelping />, href: "/helperhood" },
    { title: "New Post", icon: <FaPlus />, href: "/new-post" },
    { title: "Rewards", icon: <FaTrophy />, href: "/rewards" },
    { title: "Profile", icon: <FaUser />, href: "/profile" },
  ];

  return (
    <html lang="en">
      <body className="bg-primary">
        <div className="z-10 min-h-screen mb-20">
          <Navbar />
          {children}
        </div>
        <FloatingDock items={items} className="fixed bottom-0 z-100 shadow-xs" />
        <Toaster />
      </body>
    </html>
  );
}