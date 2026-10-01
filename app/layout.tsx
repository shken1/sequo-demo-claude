import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Shared Streak",
  description: "One shared habit streak for two.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
