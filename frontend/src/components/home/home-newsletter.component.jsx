import React from "react";
import { DocumentTextIcon } from "../../components/common/Icons";

export default function HomeNewsletterSection({
  newsletterEmail,
  setNewsletterEmail,
  newsletterSuccess,
  handleNewsletterSubmit,
}) {
  return (
    <section id="updates" className="w-full bg-[#FAF6EF] py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* Left text */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-3">
            <span className="w-5 h-0.5 bg-[#C49337] rounded-full" />
            Stay Updated
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#16261A] tracking-tight leading-tight mb-3">
            Get notified about new businesses <br />
            <span className="text-[#C49337]">and live queue features.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#556054] leading-relaxed max-w-lg m-0">
            Sign up to receive announcements when new salons, dental clinics, auto shops, and specialists join QueueLess in your neighborhood.
          </p>
        </div>

        {/* Right card */}
        <div className="lg:col-span-5 bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm sunnah-card-hover">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center mb-4">
            <DocumentTextIcon size={22} />
          </div>
          <h3 className="text-lg font-bold text-[#16261A] mb-1.5">Join our community newsletter</h3>
          <p className="text-xs text-[#556054] leading-relaxed mb-5">
            Get monthly updates on top-rated businesses and new scheduling tools.
          </p>

          {newsletterSuccess ? (
            <div className="p-3 bg-[#F0F7F0] text-[#203626] border border-[#C5DEC0] rounded-xl font-bold text-xs mb-3">
              ✓ Thanks for subscribing! You're on the list.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 mb-3">
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-[#FAF7F2] border border-[#E8E2D5] rounded-full px-4 py-2 text-xs sm:text-sm text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
              />
              <button
                type="submit"
                aria-label="Submit email"
                className="bg-[#203626] hover:bg-[#16261A] text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border-none text-sm font-bold shadow-sm"
              >
                &rarr;
              </button>
            </form>
          )}

          <div className="text-[0.7rem] text-[#8E9B89]">
            We respect your privacy. No spam, ever.
          </div>
        </div>

      </div>
    </section>
  );
}
