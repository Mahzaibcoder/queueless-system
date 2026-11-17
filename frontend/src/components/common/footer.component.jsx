export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#16261A] text-[#FAF7F2] border-t border-[#253A2A]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#FAF7F2]">
                Queue<span className="text-[#D9A948]">Less</span>
              </span>
              <span className="text-[0.68rem] font-semibold text-[#A8B3A3] tracking-wider uppercase">
                Smart Appointment &amp; Queue Assurance
              </span>
            </div>
            <p className="text-xs text-[#A8B3A3] leading-relaxed max-w-sm m-0">
              Zero-wait punctuality and continuous real-time queue management for local service businesses.
            </p>
          </div>

          {/* Explore Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[0.72rem] font-bold uppercase tracking-wider text-[#D9A948] m-0">
              Explore
            </h4>
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0 text-xs">
              <li>
                <a href="/#about" className="text-[#C8D1C4] hover:text-[#D9A948] transition-colors no-underline">
                  About QueueLess
                </a>
              </li>
              <li>
                <a href="/browse" className="text-[#C8D1C4] hover:text-[#D9A948] transition-colors no-underline">
                  Browse Businesses
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-[#C8D1C4] hover:text-[#D9A948] transition-colors no-underline">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[0.72rem] font-bold uppercase tracking-wider text-[#D9A948] m-0">
              Portal
            </h4>
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0 text-xs">
              <li>
                <a href="/#updates" className="text-[#C8D1C4] hover:text-[#D9A948] transition-colors no-underline">
                  Announcements
                </a>
              </li>
              <li>
                <a href="/owner-dashboard" className="text-[#C8D1C4] hover:text-[#D9A948] transition-colors no-underline">
                  Business Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#top"
                  onClick={scrollToTop}
                  className="text-[#D9A948] hover:text-[#FAF7F2] font-semibold transition-colors no-underline inline-flex items-center gap-1"
                >
                  <span>Back to top</span>
                  <span>&uarr;</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#253A2A] flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.72rem] text-[#8E9B89]">
          <div>&copy; {new Date().getFullYear()} QueueLess. Simple, transparent appointments.</div>
          <div>Designed for clarity, punctuality, and convenience.</div>
        </div>
      </div>
    </footer>
  );
}
