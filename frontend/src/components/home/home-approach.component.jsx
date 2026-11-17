import React from "react";
import { ShieldCheckIcon, DeviceMobileIcon, ChartTrendIcon } from "../../components/common/Icons";

export default function HomeApproachSection({ onBrowseClick }) {
  return (
    <section id="about" className="w-full bg-[#FAF7F2] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D5]">
      <div className="w-full max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-3">
          <span className="w-5 h-0.5 bg-[#C49337] rounded-full" />
          The QueueLess Approach
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-12">
          <h2 className="lg:col-span-7 text-2xl sm:text-4xl font-black text-[#16261A] tracking-tight leading-tight">
            Punctuality is not a luxury. <br />
            <span className="text-[#C49337]">It's our daily standard.</span>
          </h2>
          <p className="lg:col-span-5 text-xs sm:text-sm text-[#556054] leading-relaxed">
            QueueLess partners with local service providers who respect your time. We replace unpredictable walk-in lines with organized, real-time schedule management.
          </p>
        </div>

        {/* 3 Approach Cards with Card Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm sunnah-card-hover group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon size={24} />
                </div>
                <span className="text-sm font-black text-[#A37422]">01</span>
              </div>
              <h3 className="text-lg font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
                Verified Open Slots
              </h3>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-5">
                Every appointment slot shown is synchronized with actual staff capacity. No overlapping reservations or surprise delays.
              </p>
            </div>
            <a
              href="/browse"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors no-underline pt-3.5 border-t border-[#F2ECE0]"
            >
              <span>Explore services</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm sunnah-card-hover group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DeviceMobileIcon size={24} />
                </div>
                <span className="text-sm font-black text-[#A37422]">02</span>
              </div>
              <h3 className="text-lg font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
                Live Queue Notifications
              </h3>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-5">
                Receive proactive reminders and estimated wait times on your device. Grab a coffee or finish errands until it's your turn.
              </p>
            </div>
            <a
              href="/browse"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors no-underline pt-3.5 border-t border-[#F2ECE0]"
            >
              <span>Explore services</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm sunnah-card-hover group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] text-[#C49337] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ChartTrendIcon size={24} />
                </div>
                <span className="text-sm font-black text-[#A37422]">03</span>
              </div>
              <h3 className="text-lg font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
                Punctuality Guaranteed
              </h3>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-5">
                Partner businesses maintain audited on-time turnaround metrics. Review real ratings from customers who were served on schedule.
              </p>
            </div>
            <a
              href="/browse"
              onClick={onBrowseClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49337] group-hover:text-[#16261A] transition-colors no-underline pt-3.5 border-t border-[#F2ECE0]"
            >
              <span>Explore services</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
