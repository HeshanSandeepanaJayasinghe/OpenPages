import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";
import { Header, Footer } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPages - Publish Your Passion",
  description: "A content publishing platform to share creativity, novelty, and ideas. Review books, post quotes, and discuss thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent-ink/10 selection:text-accent-ink">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

