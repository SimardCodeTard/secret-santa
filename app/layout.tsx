import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Noyeux Joël !!",
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
