import React from "react";
import { CheckCircleIcon } from "../../components/common/Icons";
import queueIllustration from "../../assets/queue-illustration.png";

export default function HomeHeroSection() {
  return (
    <section className="w-full bg-[#FAF7F2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D5]/70">
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-black text-[#16261A] tracking-tight leading-[1.08] mb-6">
            Book appointments with <br />
            <span className="text-[#C49337]">zero wait time.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#556054] font-normal leading-relaxed max-w-xl mb-8">
            Reserve confirmed time slots and track live virtual queues across clinics, salons, and offices — all in one unified platform.
          </p>

          {/* Trust Tag */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#4D5A4C] bg-[#F2ECE0]/60 border border-[#E8E2D5] px-4 py-2.5 rounded-full">
            <CheckCircleIcon size={16} className="text-[#C49337]" />
            <span>Over 1,200 appointments scheduled this week</span>
          </div>
        </div>

        {/* Right Column: Minimal Theme-Matched Frame Around Illustration (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl bg-white border border-[#E8E2D5] shadow-sm p-6 sm:p-8 flex items-center justify-center">
            <img
              src={queueIllustration}
              alt="Queue and service counter line representation"
              className="w-full max-w-md lg:max-w-[460px] h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}