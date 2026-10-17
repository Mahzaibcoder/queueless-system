import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

type BaseLayoutProps = {
  children: React.ReactNode;
};

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BaseLayout;
