import React from "react";
import { BuildingIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from "../common/Icons";

export default function HomeHowItWorksSection({ onBrowseClick }) {
  const steps = [
    {
      step: "01",
      icon: <BuildingIcon size={24} />,
      title: "1. Find a Service",
      description: "Search local salons, medical clinics, dentists, fitness studios, and professional consultants.",
    },
    {
      step: "02",
      icon: <CalendarIcon size={24} />,
      title: "2. Pick an Open Slot",
      description: "Select an available date and verified appointment time that fits seamlessly into your day.",
    },
    {
      step: "03",
      icon: <ClockIcon size={24} />,
      title: "3. Monitor Live Queue",
      description: "Get real-time updates and notifications on queue progress so you don't waste time sitting in a lobby.",
    },
    {
      step: "04",
      icon: <CheckCircleIcon size={24} />,
      title: "4. Walk In on Time",
      description: "Arrive right as your provider is ready for you. Fast, punctual service with zero unexpected delays.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#FAF6EF] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D5]">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-3">
            <span className="w-5 h-0.5 bg-[#C49337] rounded-full" />
            Simple &amp; Punctual
            <span className="w-5 h-0.5 bg-[#C49337] rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#16261A] tracking-tight mb-3">
            How QueueLess Works
          </h2>
          <p className="text-xs sm:text-sm text-[#556054] leading-relaxed m-0">
            Four easy steps from booking to arrival. No long phone calls, no double-booking, and no wasted hours in waiting rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 shadow-sm sunnah-card-hover flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <span className="text-sm font-black text-[#A37422]">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-[#556054] leading-relaxed m-0">
                  {s.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F2ECE0]">
                <a
                  href="/browse"
                  onClick={onBrowseClick}
                  className="text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors inline-flex items-center gap-1 no-underline"
                >
                  <span>Book now</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
