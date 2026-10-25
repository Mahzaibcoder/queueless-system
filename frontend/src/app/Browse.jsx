import { useState, useEffect } from "react";
import { businessService } from "../services/api";
import BusinessCard from "../components/business/BusinessCard";
import { SearchIcon } from "../components/common/Icons";
import "../styles/components.css";

export default function Browse() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Beauty", "Healthcare", "Fitness", "Consulting", "Restaurants"];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }

    businessService.getAll().then(({ data }) => {
      setBusinesses(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = businesses.filter((b) => {
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(search.toLowerCase())) ||
      (b.address && b.address.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="homepage-wrapper">
      {/* Header Banner */}
      <section style={{ background: "var(--navy)", color: "#FFFFFF", padding: "5rem 5vw 4rem" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div className="section-kicker section-kicker-light">Verified Directory</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1rem" }}>
            Browse Businesses
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "1.1rem", maxWidth: "600px", marginBottom: "2.5rem" }}>
            Discover verified businesses, check real-time availability, and book open appointments instantly.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: "650px", background: "#FFFFFF", borderRadius: "9999px", padding: "0.5rem", display: "flex", alignItems: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
            <span style={{ paddingLeft: "1.25rem", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
              <SearchIcon size={20} />
            </span>
            <input
              type="text"
              placeholder="Search by name, service, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                outline: "none",
                color: "var(--text-dark)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Directory Grid Section */}
      <section style={{ padding: "4rem 5vw", flex: 1 }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          {/* Category Filter Pills & Count */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    border: selectedCategory === cat ? "1px solid var(--teal)" : "1px solid var(--border)",
                    background: selectedCategory === cat ? "var(--teal)" : "var(--surface)",
                    color: selectedCategory === cat ? "#FFFFFF" : "var(--navy)",
                    transition: "var(--transition)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span style={{ color: "var(--text-muted)", fontSize: "0.92rem", fontWeight: "600" }}>
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          {/* Cards Grid */}
          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
              {filtered.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <h3 style={{ color: "var(--navy)", fontWeight: 700, marginBottom: "0.5rem" }}>No businesses found</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Try adjusting your search query or category filters.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                className="btn-navy-pill"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}