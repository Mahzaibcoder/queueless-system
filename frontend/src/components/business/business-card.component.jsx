import React from "react";
import { StarIcon, BuildingIcon } from "../common/Icons";

export default function BusinessCard({ business }) {
  const defaultImage =
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&h=500&q=80";

  return (
    <div className="bg-white border border-[#E8E2D5] rounded-3xl overflow-hidden shadow-sm sunnah-card-hover flex flex-col h-full max-w-sm w-full mx-auto group">
      <div className="h-44 relative overflow-hidden bg-[#FAF6EF]">
        <img
          src={business.image || defaultImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <span className="absolute top-3 right-3 bg-[#16261A]/85 backdrop-blur-md text-[#FAF7F2] text-[0.68rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {business.category || "Service"}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="m-0 mb-1.5 text-lg font-bold text-[#16261A] group-hover:text-[#203626] transition-colors">
          <a
            href={`/business/${business.id}`}
            className="no-underline text-inherit"
          >
            {business.name}
          </a>
        </h3>

        <div className="flex justify-between items-center text-xs text-[#556054] mb-4">
          <span className="inline-flex items-center gap-1.5 truncate max-w-[200px]">
            <BuildingIcon size={14} className="text-[#C49337] flex-shrink-0" />
            <span className="truncate">{business.location || business.address || "Verified Location"}</span>
          </span>
          <span className="font-bold text-[#16261A] inline-flex items-center gap-1 flex-shrink-0">
            <StarIcon size={14} className="text-[#C49337]" />
            {business.rating || "4.9"}
          </span>
        </div>

        <div className="mt-auto pt-3.5 border-t border-[#F2ECE0] flex items-center justify-between">
          <span className="text-xs font-bold text-[#16261A] inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#203626]" />
            Live slots open
          </span>

          <a
            href={`/business/${business.id}`}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#203626] hover:bg-[#16261A] text-white shadow-sm transition-all no-underline inline-flex items-center gap-1"
          >
            <span>View</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
