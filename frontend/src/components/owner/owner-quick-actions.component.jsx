import React from "react";
import { ArrowRightIcon, TrashIcon } from "../common/Icons";

export default function OwnerQuickActions({ business, handleDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Card 1: Business Settings */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 shadow-sm sunnah-card-hover flex flex-col justify-between group">
        <div>
          <h3 className="text-lg font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
            Business Settings
          </h3>
          <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-6">
            Update business profile details, photo image, contact info, and address.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="/create-business"
            className="flex-1 py-2.5 px-4 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all no-underline"
          >
            <span>Edit Profile</span>
            <ArrowRightIcon size={14} />
          </a>
          {business?.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="py-2.5 px-3.5 rounded-full bg-[#FEF5F4] hover:bg-[#FDD8D5] text-[#C0392B] border border-[#F5C2BE] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Remove Business"
            >
              <TrashIcon size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Card 2: Services Catalog */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 shadow-sm sunnah-card-hover flex flex-col justify-between group">
        <div>
          <h3 className="text-lg font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
            Services Catalog
          </h3>
          <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-6">
            Add, edit, or remove service offerings, prices, and appointment durations.
          </p>
        </div>
        <a
          href="/manage-services"
          className="w-full py-2.5 px-4 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all no-underline"
        >
          <span>Manage Services</span>
          <ArrowRightIcon size={14} />
        </a>
      </div>

      {/* Card 3: Operating Schedule */}
      <div className="bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-7 shadow-sm sunnah-card-hover flex flex-col justify-between group">
        <div>
          <h3 className="text-lg font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
            Operating Schedule
          </h3>
          <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-6">
            Configure opening and closing working hours for weekly booking slots.
          </p>
        </div>
        <a
          href="/set-availability"
          className="w-full py-2.5 px-4 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all no-underline"
        >
          <span>Set Availability</span>
          <ArrowRightIcon size={14} />
        </a>
      </div>

    </div>
  );
}
