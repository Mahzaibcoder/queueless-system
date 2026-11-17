import React from "react";
import { DeviceMobileIcon, DocumentTextIcon, GlobeOutlineIcon } from "../../components/common/Icons";

export default function HomeResourcesSection({ onBrowseClick }) {

  return (
    <section id="resources" className="w-full bg-[#FAF7F2] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D5]">
      <div className="w-full max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-3">
          <span className="w-5 h-0.5 bg-[#C49337] rounded-full" />
          Help &amp; Resources
        </div>

        <div className="mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#16261A] tracking-tight leading-tight mb-3">
            Helpful guides for customers <br />
            <span className="text-[#C49337]">and business owners.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#556054] leading-relaxed max-w-2xl">
            Everything you need to get started — from booking your first appointment to setting up your business queue. Browse our guides below.
          </p>
        </div>

        {/* 3 Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm sunnah-card-hover group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <DeviceMobileIcon size={22} />
              </div>
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#A37422]">
                Customer Guide
              </span>
              <h3 className="text-lg font-bold text-[#16261A] mt-1 mb-2 group-hover:text-[#203626] transition-colors">
                How to Book &amp; Reschedule
              </h3>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-5">
                Learn how to reserve verified time slots, modify your bookings, and set SMS arrival reminders.
              </p>
            </div>
            <a
              href="/browse"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors no-underline pt-3.5 border-t border-[#F2ECE0]"
            >
              <span>Read guide</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </a>
          </div>

          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm sunnah-card-hover group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <DocumentTextIcon size={22} />
              </div>
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#A37422]">
                For Business Owners
              </span>
              <h3 className="text-lg font-bold text-[#16261A] mt-1 mb-2 group-hover:text-[#203626] transition-colors">
                Setting Up Your Live Queue
              </h3>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-5">
                Configure opening hours, customize service durations, and manage staff schedules to eliminate bottlenecks.
              </p>
            </div>
            <a
              href="/owner-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors no-underline pt-3.5 border-t border-[#F2ECE0]"
            >
              <span>View setup steps</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </a>
          </div>

          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm sunnah-card-hover group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <GlobeOutlineIcon size={22} />
              </div>
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#A37422]">
                Support
              </span>
              <h3 className="text-lg font-bold text-[#16261A] mt-1 mb-2 group-hover:text-[#203626] transition-colors">
                Punctuality Standards &amp; FAQs
              </h3>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-5">
                Understand how our verified zero-wait policy works and get answers to common questions about appointments.
              </p>
            </div>
            <a
              href="/#updates"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors no-underline pt-3.5 border-t border-[#F2ECE0]"
            >
              <span>Learn more</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
