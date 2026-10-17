import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { BaseLayout } from "../components/layout/BaseLayout";

export const metadata: Metadata = {
  title: {
    default: "QueueLess",
    template: "%s | QueueLess",
  },
  description: "Skip the line, save time with QueueLess.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
