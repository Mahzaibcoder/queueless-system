import React from "react";

export default function HomeCommitmentSection() {
  return (
    <section className="w-full bg-[#FAF6EF] border-b border-[#E8E2D5] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E8E2D5] text-[0.72rem] font-bold uppercase tracking-wider text-[#636D62]">
          <span>Designed for everyday convenience</span>
          <span className="text-[#A37422]">Zero Waiting &bull; Direct Service &bull; Live Updates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="md:border-r md:border-[#E8E2D5] md:pr-6 flex flex-col justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A37422] mb-1">
              Our Promise
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#16261A] leading-snug">
              Quality scheduling that respects your day.
            </h3>
          </div>

          <div className="flex flex-col bg-white/70 md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none border border-[#E8E2D5] md:border-none sunnah-card-hover md:hover:transform-none md:hover:shadow-none">
            <span className="text-2xl font-black text-[#C49337] mb-1">01</span>
            <h4 className="text-base font-bold text-[#16261A] mb-1">Verified Schedules</h4>
            <p className="text-xs sm:text-sm text-[#556054] leading-relaxed m-0">
              Direct live sync with provider staff and chair availability.
            </p>
          </div>

          <div className="flex flex-col bg-white/70 md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none border border-[#E8E2D5] md:border-none sunnah-card-hover md:hover:transform-none md:hover:shadow-none">
            <span className="text-2xl font-black text-[#C49337] mb-1">02</span>
            <h4 className="text-base font-bold text-[#16261A] mb-1">Virtual Waiting</h4>
            <p className="text-xs sm:text-sm text-[#556054] leading-relaxed m-0">
              Spend wait times wherever you want, not in a crowded lobby.
            </p>
          </div>

          <div className="flex flex-col bg-white/70 md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none border border-[#E8E2D5] md:border-none sunnah-card-hover md:hover:transform-none md:hover:shadow-none">
            <span className="text-2xl font-black text-[#C49337] mb-1">03</span>
            <h4 className="text-base font-bold text-[#16261A] mb-1">Zero Delays</h4>
            <p className="text-xs sm:text-sm text-[#556054] leading-relaxed m-0">
              Automated reminders keep providers and clients on time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
