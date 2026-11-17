import { useState } from "react";
import HomeHeroSection from "../components/home/home-hero.component";
import HomeHowItWorksSection from "../components/home/home-how-it-works.component";
import HomeCommitmentSection from "../components/home/home-commitment.component";
import HomeApproachSection from "../components/home/home-approach.component";
import HomeStatsBannerSection from "../components/home/home-stats.component";
import HomeResourcesSection from "../components/home/home-resources.component";
import HomeNewsletterSection from "../components/home/home-newsletter.component";
import Toast from "../components/common/toast.component";
import { useAuth } from "../context/auth.context";

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const { isAuthenticated } = useAuth();

  // Guard for any /browse link click from landing page sections
  const handleBrowseClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setToast({ message: "Please log in first to browse businesses", type: "warning" });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen flex flex-col">
      {/* 1. HERO SECTION */}
      <HomeHeroSection />

      {/* 2. HOW IT WORKS */}
      <HomeHowItWorksSection onBrowseClick={handleBrowseClick} />

      {/* 3. COMMITMENT STRIP */}
      <HomeCommitmentSection />

      {/* 4. THE QUEUELESS APPROACH */}
      <HomeApproachSection onBrowseClick={handleBrowseClick} />

      {/* 5. STATS BANNER */}
      <HomeStatsBannerSection />

      {/* 6. RESOURCES SECTION */}
      <HomeResourcesSection onBrowseClick={handleBrowseClick} />

      {/* 7. STAY CONNECTED SECTION */}
      <HomeNewsletterSection
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterSuccess={newsletterSuccess}
        handleNewsletterSubmit={handleNewsletterSubmit}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
