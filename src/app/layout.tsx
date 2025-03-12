import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "DSA",
  description: "Revision DSA App",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${chakraPetch.variable} antialiased bg-black/10`}>
        <main className="">{children}</main>
      </body>
    </html>
  );
}
