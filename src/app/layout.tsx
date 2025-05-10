import type { Metadata } from "next";
import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import '../styles/global.scss';
import '../styles/reset.scss';
import './layout.scss'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop - Your Online Store",
  description: "Browse our wide selection of products across various categories",
};

async function getCart() {
  try {
    const res = await fetch("https://fakestoreapi.com/carts/1", {
      next: { 
        revalidate: 60 // Revalidate every minute for cart data
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart");
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { products: [] }; // Return empty cart on error
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { products = [] } = await getCart();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="page-container">
          <Header itemCount={products.length} />
          <main className="page-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
