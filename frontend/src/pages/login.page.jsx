import { useState } from "react";
import { useAuth } from "../context/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || !password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const { user, error: err } = await login(email, password);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: user?.role === "owner" ? "/owner-dashboard" : "/browse" },
      })
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-[#E8E2D5] rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 sunnah-card-hover">
      
      {/* Left Column: Sign In Form (7 cols) */}
      <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
        {/* Brand Kicker - Clean typography, no logo box */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-black tracking-tight text-[#16261A]">
            Queue<span className="text-[#C49337]">Less</span>
          </span>
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#A37422] bg-[#FFF8E6] border border-[#E8D5A0] px-2.5 py-0.5 rounded-full">
            Portal Access
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#16261A] tracking-tight mb-2">
          Sign in to QueueLess
        </h1>
        <p className="text-xs sm:text-sm text-[#556054] mb-6">
          Enter your credentials to access your verified portal.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF5F4] border border-[#F5C2BE] text-[#C0392B] text-xs sm:text-sm mb-5 flex items-center gap-2 font-medium">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-bold text-[#16261A]"
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="login-password"
                className="text-xs font-bold text-[#16261A]"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-[#C49337] hover:text-[#A37422] transition-colors no-underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>{loading ? "Signing in..." : "Sign in to Portal"}</span>
            <span>&rarr;</span>
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 p-3 bg-[#FAF6EF] border border-[#E8E2D5] rounded-xl text-xs text-[#556054]">
          <strong>Quick Demo:</strong> <code className="text-[#A37422] font-bold">alex@example.com</code> / <code className="text-[#A37422] font-bold">password123</code>
        </div>

        {/* Switch Link */}
        <div className="mt-6 pt-4 border-t border-[#F2ECE0] text-center">
          <p className="text-xs sm:text-sm text-[#556054] m-0">
            Don't have a portal account?{" "}
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("navigate", { detail: { href: "/signup" } }));
              }}
              className="font-bold text-[#C49337] hover:text-[#A37422] no-underline"
            >
              Register now &rarr;
            </a>
          </p>
        </div>
      </div>

      {/* Right Column: Statement & Value (5 cols) */}
      <div className="md:col-span-5 bg-[#182B1F] p-8 sm:p-10 text-[#FAF7F2] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#273D2E]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9A948] bg-[#253E2C] border border-[#D9A948]/30 px-3 py-1 rounded-full mb-6">
            National Framework
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
            Zero wait times. <br />
            <span className="text-[#D9A948]">Instant scheduling.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#B4C2AF] leading-relaxed mb-6">
            A verified platform synchronizing open capacity across top clinics, salons, and services.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#D9A948]" />
              <span>Real-time open slot verification</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#D9A948]" />
              <span>Automated on-time arrival alerts</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]">
              <span className="w-2 h-2 rounded-full bg-[#D9A948]" />
              <span>Instant booking confirmation</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#273D2E] flex items-center justify-between text-xs text-[#8E9B89]">
          <span>4.9 / 5 satisfaction</span>
          <span className="text-[#D9A948] font-bold">99.4% Punctual</span>
        </div>
      </div>

    </div>
  );
}
