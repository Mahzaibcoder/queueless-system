import { useState } from "react";
import { useAuth } from "../context/auth.context";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Beauty");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const categories = ["Beauty", "Healthcare", "Fitness", "Consulting", "Restaurants"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (role === "owner" && (!businessName || !businessName.trim())) {
      setError("Please enter your business name.");
      return;
    }

    setLoading(true);
    const userData = {
      name,
      email,
      password,
      role,
      ...(role === "owner" && { businessName, businessCategory }),
    };

    const { user, error: err } = await register(userData);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: role === "owner" ? "/owner-dashboard" : "/browse" },
      })
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-[#E8E2D5] rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 sunnah-card-hover">
      
      {/* Left Column: Sign Up Form (7 cols) */}
      <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
        {/* Brand Kicker - Clean typography, no logo box */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-black tracking-tight text-[#16261A]">
            Queue<span className="text-[#C49337]">Less</span>
          </span>
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#A37422] bg-[#FFF8E6] border border-[#E8D5A0] px-2.5 py-0.5 rounded-full">
            Registration
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#16261A] tracking-tight mb-2">
          Create Portal Account
        </h1>
        <p className="text-xs sm:text-sm text-[#556054] mb-5">
          Join QueueLess to book appointments or manage verified capacity.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF5F4] border border-[#F5C2BE] text-[#C0392B] text-xs sm:text-sm mb-4 flex items-center gap-2 font-medium">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Segmented Role Control */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#FAF6EF] p-1.5 rounded-2xl border border-[#E8E2D5]">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-none ${
                role === "customer"
                  ? "bg-white text-[#16261A] shadow-sm"
                  : "bg-transparent text-[#636D62] hover:text-[#16261A]"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-none ${
                role === "owner"
                  ? "bg-white text-[#16261A] shadow-sm"
                  : "bg-transparent text-[#636D62] hover:text-[#16261A]"
              }`}
            >
              Business Owner
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="signup-name"
              className="text-xs font-bold text-[#16261A]"
            >
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="Alex Jordan"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="signup-email"
              className="text-xs font-bold text-[#16261A]"
            >
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@institution.edu.pk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="signup-password"
              className="text-xs font-bold text-[#16261A]"
            >
              Password (min. 6 chars)
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
            />
          </div>

          {/* Conditional Owner fields */}
          {role === "owner" && (
            <div className="bg-[#FAF6EF] border border-[#E8E2D5] rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#16261A]">
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="Apex Health Clinic"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-white text-[#16261A] outline-none focus:border-[#C49337] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#16261A]">
                  Category
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-white text-[#16261A] outline-none focus:border-[#C49337] transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>{loading ? "Registering..." : "Complete Registration"}</span>
            <span>&rarr;</span>
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-5 pt-4 border-t border-[#F2ECE0] text-center">
          <p className="text-xs sm:text-sm text-[#556054] m-0">
            Already registered?{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("navigate", { detail: { href: "/login" } }));
              }}
              className="font-bold text-[#C49337] hover:text-[#A37422] no-underline"
            >
              Sign in here &rarr;
            </a>
          </p>
        </div>
      </div>

      {/* Right Column: Statement & Value (5 cols) */}
      <div className="md:col-span-5 bg-[#182B1F] p-8 sm:p-10 text-[#FAF7F2] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#273D2E]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9A948] bg-[#253E2C] border border-[#D9A948]/30 px-3 py-1 rounded-full mb-6">
            Verified Directory
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
            Punctual scheduling, <br />
            <span className="text-[#D9A948]">zero waiting lines.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#B4C2AF] leading-relaxed mb-6">
            Join thousands of customers and premier local businesses standardizing appointment flow.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#D9A948]" />
              <span>Guaranteed time slots with no double-booking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#D9A948]" />
              <span>Automated arrival and status notifications</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#D9A948]" />
              <span>Dedicated customer and business dashboards</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#273D2E] flex items-center justify-between text-xs text-[#8E9B89]">
          <span>Thousands of verified bookings</span>
          <span className="text-[#D9A948] font-bold">Quality Assured</span>
        </div>
      </div>

    </div>
  );
}
