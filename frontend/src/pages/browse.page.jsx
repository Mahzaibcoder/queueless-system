import React, { useEffect, useState } from 'react';
import { businessService } from '../services/api';
import { SearchIcon, BuildingIcon } from '../components/common/Icons';

export default function Browse() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      const res = await businessService.getAll();
      if (!res.error) {
        setBusinesses(res.data || []);
      }
      setLoading(false);
    }
    fetchBusinesses();
  }, []);

  const categories = ['All', 'Beauty', 'Healthcare', 'Fitness', 'Consulting', 'Restaurants'];

  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      b.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.name?.toLowerCase().includes(query) ||
      b.description?.toLowerCase().includes(query) ||
      b.address?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const goToBusiness = (id, e) => {
    e.preventDefault();
    const path = `/business/${id}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { href: path } }));
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      {/* Editorial Deep Forest Green Hero Banner */}
      <div className="w-full bg-[#182B1F] text-[#FAF7F2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#273D2E]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9A948] mb-3">
            <span className="w-5 h-0.5 bg-[#D9A948] rounded-full" />
            Verified Business Directory
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Browse <span className="text-[#D9A948]">Verified Businesses</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B4C2AF] max-w-2xl leading-relaxed mb-6">
            Discover verified local businesses, check real-time availability, and book open appointments instantly.
          </p>

          {/* Search Box Pill */}
          <div className="relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D9A948] pointer-events-none flex items-center">
              <SearchIcon size={20} />
            </span>
            <input
              type="text"
              placeholder="Search by name, service, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/60 text-xs sm:text-sm outline-none focus:border-[#D9A948] focus:ring-2 focus:ring-[#D9A948]/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Dropdown & Result Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#E8E2D5]">
          <div className="flex items-center gap-3">
            <label htmlFor="category-select" className="text-xs sm:text-sm font-bold text-[#16261A]">
              Filter by Category:
            </label>
            <div className="relative">
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-[#E8E2D5] text-[#16261A] text-xs sm:text-sm font-bold py-2.5 pl-4 pr-10 rounded-full shadow-sm hover:border-[#C49337] focus:outline-none focus:ring-2 focus:ring-[#C49337]/20 transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Beauty">Beauty &amp; Salons</option>
                <option value="Healthcare">Healthcare &amp; Clinics</option>
                <option value="Fitness">Fitness &amp; Wellness</option>
                <option value="Consulting">Consulting &amp; Advisory</option>
                <option value="Restaurants">Dining &amp; Hospitality</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#16261A]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-bold text-[#636D62]">
            Showing {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
          </div>
        </div>

        {/* Business Results List */}
        {loading ? (
          <div className="text-center py-24 text-[#636D62]">
            <div className="w-8 h-8 border-3 border-[#203626] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Loading verified businesses...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E2D5] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#16261A] mb-2">
              No businesses found
            </h3>
            <p className="text-xs sm:text-sm text-[#556054] mb-6">
              Try adjusting your search query or category filters.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-white text-[#16261A] border border-[#E8E2D5] hover:bg-[#F2ECE0] text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business) => {
              const bId = business.id || business._id;
              const imgUrl = business.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={bId}
                  className="bg-white border border-[#E8E2D5] rounded-3xl overflow-hidden shadow-sm sunnah-card-hover flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#FAF6EF]">
                    <img
                      src={imgUrl}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <span className="absolute top-3.5 right-3.5 bg-[#16261A]/85 backdrop-blur-md text-[#FAF7F2] text-[0.68rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {business.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#A37422] mb-1.5">
                      {business.category}
                    </span>

                    <h3 className="text-xl font-bold text-[#16261A] mb-2 group-hover:text-[#203626] transition-colors">
                      {business.name}
                    </h3>

                    <p className="text-xs text-[#636D62] flex items-center gap-1.5 mb-3">
                      <BuildingIcon size={14} className="text-[#C49337] flex-shrink-0" />
                      <span className="truncate">{business.address}</span>
                    </p>

                    <p className="text-xs sm:text-sm text-[#556054] leading-relaxed mb-6 line-clamp-2 flex-1">
                      {business.description}
                    </p>

                    <div className="pt-4 border-t border-[#F2ECE0] mt-auto">
                      <a
                        href={`/business/${bId}`}
                        onClick={(e) => goToBusiness(bId, e)}
                        className="w-full py-2.5 px-4 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm group-hover:shadow transition-all no-underline"
                      >
                        <span>View Details &amp; Book</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
