import type { Metadata } from "next";
import { CartProvider } from "./contexts/CartContext";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mishaki Official",
  description: "Premium clothing and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        {/* GLOBAL BACKGROUND: Low Opacity Sketch of Flowers */}
        <div 
          className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "url('/elegant_floral_bg.jpg')",
            backgroundSize: "400px",
            backgroundRepeat: "repeat",
            backgroundPosition: "center"
          }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
