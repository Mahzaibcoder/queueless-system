import React from "react";
import { BuildingIcon, ServiceIcon, CalendarIcon, TrashIcon } from "../common/Icons";

export default function OwnerHeaderBanner({
  business,
  businesses,
  selectedBusinessId,
  setSelectedBusinessId,
  handleDelete,
}) {
  return (
    <div className="bg-[#182B1F] text-[#FAF7F2] border border-[#273D2E] rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <span className="px-3 py-1 rounded-full bg-[#253E2C] text-[#D9A948] border border-[#D9A948]/30 text-xs font-bold uppercase tracking-wider">
            Management Console
          </span>

          {businesses.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A8B3A3] font-semibold">Switch Business:</span>
              <select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="bg-[#253E2C] text-white border border-[#3D5C43] rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer outline-none focus:border-[#D9A948]"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#182B1F] text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
          {business?.name || "Owner Dashboard"}
        </h1>
        <p className="text-xs sm:text-sm text-[#B4C2AF] m-0">
          Control center for {business?.name || "your business"}. Manage schedules, appointments, and services.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <a href="/create-business" className="no-underline">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
          >
            <BuildingIcon size={14} />
            <span>Edit Profile</span>
          </button>
        </a>

        <a href="/manage-services" className="no-underline">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
          >
            <ServiceIcon size={14} />
            <span>Services</span>
          </button>
        </a>

        <a href="/set-availability" className="no-underline">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-[#C49337] hover:bg-[#A37422] text-white shadow-sm transition-all cursor-pointer border-none"
          >
            <CalendarIcon size={14} />
            <span>Set Hours &rarr;</span>
          </button>
        </a>

        {business?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#C0392B]/20 hover:bg-[#C0392B]/30 text-[#FCA5A5] border border-[#C0392B]/40 transition-all cursor-pointer"
          >
            <TrashIcon size={14} />
            <span>Delete Business</span>
          </button>
        )}
      </div>
    </div>
  );
}
