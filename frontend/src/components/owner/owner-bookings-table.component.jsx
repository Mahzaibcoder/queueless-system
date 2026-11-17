import React from "react";
import { EditIcon, TrashIcon } from "../common/Icons";

export default function OwnerBookingsTable({ upcoming, handleReschedule, handleCancel }) {
  return (
    <div className="bg-white border border-[#E8E2D5] rounded-3xl overflow-hidden mb-8 shadow-sm sunnah-card-hover">
      <div className="p-5 sm:p-6 border-b border-[#E8E2D5] bg-[#FAF6EF] flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-[#16261A] m-0">
          Active Customer Appointments
        </h2>
        <span className="text-xs font-bold text-[#A37422] bg-[#FFF8E6] border border-[#E8D5A0] px-3 py-1 rounded-full">
          {upcoming.length} Confirmed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#182B1F] text-white">
              <th className="py-3 px-5 font-bold uppercase tracking-wider text-[0.7rem]">Customer</th>
              <th className="py-3 px-5 font-bold uppercase tracking-wider text-[0.7rem]">Service</th>
              <th className="py-3 px-5 font-bold uppercase tracking-wider text-[0.7rem]">Date &amp; Time</th>
              <th className="py-3 px-5 font-bold uppercase tracking-wider text-[0.7rem]">Price</th>
              <th className="py-3 px-5 font-bold uppercase tracking-wider text-[0.7rem]">Status</th>
              <th className="py-3 px-5 font-bold uppercase tracking-wider text-[0.7rem] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.length > 0 ? (
              upcoming.map((b) => (
                <tr key={b.id} className="border-b border-[#F2ECE0] hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16261A]">
                    Customer #{b.userId ? b.userId.slice(-4) : "1024"}
                  </td>
                  <td className="py-4 px-5 text-[#3D473C]">{b.serviceName}</td>
                  <td className="py-4 px-5 text-[#3D473C] font-medium">
                    {new Date(b.date).toLocaleDateString()} at {b.time}
                  </td>
                  <td className="py-4 px-5 font-bold text-[#C49337]">${b.price}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F0F7F0] text-[#203626] border border-[#C5DEC0] text-[0.72rem] font-bold">
                      Confirmed
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleReschedule(b.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#16261A] bg-[#FAF6EF] border border-[#E8E2D5] hover:bg-[#F2ECE0] transition-all cursor-pointer"
                      >
                        <EditIcon size={12} />
                        <span>Reschedule</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(b.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#C0392B] bg-[#FEF5F4] border border-[#F5C2BE] hover:bg-[#FDD8D5] transition-all cursor-pointer"
                      >
                        <TrashIcon size={12} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-[#636D62] py-12 px-6 text-sm">
                  No active appointments scheduled at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
