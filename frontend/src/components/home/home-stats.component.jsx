import React from "react";
import { DocumentTextIcon, GlobeOutlineIcon } from "../../components/common/Icons";

export default function HomeStatsBannerSection() {
  return (
    <section className="w-full bg-[#182B1F] py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-y border-[#273D2E]">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="bg-[#203626]/70 border border-[#2E4A35] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center sunnah-card-hover group">
            <div className="w-11 h-11 rounded-2xl bg-[#2A4432] text-[#D9A948] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <DocumentTextIcon size={22} />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#FAF7F2] mb-2 tracking-tight">
              99.4%
            </div>
            <p className="text-xs sm:text-sm text-[#B4C2AF] leading-relaxed max-w-xs m-0">
              On-time arrival rate with verified virtual queue slots.
            </p>
          </div>

          <div className="bg-[#203626]/70 border border-[#2E4A35] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center sunnah-card-hover group">
            <div className="w-11 h-11 rounded-2xl bg-[#2A4432] text-[#D9A948] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <GlobeOutlineIcon size={22} />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#FAF7F2] mb-2 tracking-tight">
              15,000+
            </div>
            <p className="text-xs sm:text-sm text-[#B4C2AF] leading-relaxed max-w-xs m-0">
              Appointments booked across local salons, clinics, and studios.
            </p>
          </div>

          <div className="bg-[#203626]/70 border border-[#2E4A35] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center sunnah-card-hover group">
            <div className="w-11 h-11 rounded-2xl bg-[#2A4432] text-[#D9A948] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <DocumentTextIcon size={22} />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#FAF7F2] mb-2 tracking-tight">
              100%
            </div>
            <p className="text-xs sm:text-sm text-[#B4C2AF] leading-relaxed max-w-xs m-0">
              Free online booking with instant digital confirmation.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
