import React from "react";
import { CalendarIcon, DollarIcon, CheckCircleIcon } from "../common/Icons";

export default function OwnerMetricsSection({ totalThisWeek, totalRevenue, confirmedCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Metric 1 */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 flex items-center gap-5 shadow-sm sunnah-card-hover group">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] border border-[#E8E2D5] flex items-center justify-center text-[#16261A] group-hover:scale-110 transition-transform duration-300">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-[#16261A] m-0 leading-none">
            {totalThisWeek}
          </h3>
          <p className="text-xs sm:text-sm text-[#556054] font-medium mt-1 mb-0">
            Bookings This Week
          </p>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 flex items-center gap-5 shadow-sm sunnah-card-hover group">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] border border-[#E8D5A0] flex items-center justify-center text-[#C49337] group-hover:scale-110 transition-transform duration-300">
          <DollarIcon size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-[#C49337] m-0 leading-none">
            ${totalRevenue}
          </h3>
          <p className="text-xs sm:text-sm text-[#556054] font-medium mt-1 mb-0">
            Upcoming Revenue
          </p>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 flex items-center gap-5 shadow-sm sunnah-card-hover group sm:col-span-2 lg:col-span-1">
        <div className="w-12 h-12 rounded-2xl bg-[#F0F7F0] border border-[#C5DEC0] flex items-center justify-center text-[#203626] group-hover:scale-110 transition-transform duration-300">
          <CheckCircleIcon size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-[#16261A] m-0 leading-none">
            {confirmedCount}
          </h3>
          <p className="text-xs sm:text-sm text-[#556054] font-medium mt-1 mb-0">
            Confirmed Slots
          </p>
        </div>
      </div>

    </div>
  );
}
