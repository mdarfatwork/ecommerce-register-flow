import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arfat Ecommerce",
  description: "Explore Arfat Ecommerce, a hobby project where users can mark their interests in categories like Shoes, Men's T-shirts, and more. Customize your shopping experience and find what you love effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
