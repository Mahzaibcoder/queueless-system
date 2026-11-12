import React from "react";
import { StarIcon, BuildingIcon } from "../common/Icons";
import "../../styles/components.css";

export default function BusinessCard({ business }) {
  const defaultImage =
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&h=500&q=80";

  return (
    <div
      className="business-card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: "340px",
        margin: "0 auto",
        width: "100%",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        transition: "var(--transition)",
      }}
    >
      <div
        className="business-card-image-wrapper"
        style={{ height: "170px", position: "relative", overflow: "hidden" }}
      >
        <img
          src={business.image || defaultImage}
          alt={business.name}
          className="business-card-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <span
          className="business-category-tag"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(15, 32, 56, 0.9)",
            color: "#FFFFFF",
            fontSize: "0.72rem",
            fontWeight: 800,
            padding: "0.25rem 0.65rem",
            borderRadius: "9999px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            backdropFilter: "blur(4px)",
          }}
        >
          {business.category || "Service"}
        </span>
      </div>

      <div
        className="business-card-content"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "1.35rem",
        }}
      >
        <h3 className="business-card-title" style={{ margin: 0, marginBottom: "0.4rem" }}>
          <a
            href={`/business/${business.id}`}
            style={{
              color: "var(--navy)",
              fontWeight: 800,
              fontSize: "1.15rem",
              textDecoration: "none",
              letterSpacing: "-0.2px",
            }}
          >
            {business.name}
          </a>
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          <span style={{ fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <BuildingIcon size={14} style={{ color: "var(--teal)" }} />
            {business.location || business.address || "Verified Location"}
          </span>
          <span style={{ fontWeight: 800, color: "var(--navy)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <StarIcon size={14} style={{ color: "var(--teal)" }} />
            {business.rating || "4.9"}
          </span>
        </div>

        <div
          className="business-card-footer"
          style={{
            marginTop: "auto",
            paddingTop: "0.85rem",
            borderTop: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
          }}
        >
          <span
            style={{
              color: "var(--navy)",
              fontWeight: 700,
              fontSize: "0.8rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--teal)" }} />
            Live slots open
          </span>

          <a
            href={`/business/${business.id}`}
            className="btn-primary"
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", fontWeight: 700, borderRadius: "9999px" }}
          >
            View &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
