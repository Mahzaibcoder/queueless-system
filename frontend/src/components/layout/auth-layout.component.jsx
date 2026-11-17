export default function AuthLayout({ children }) {
  const handleBackToHome = () => {
    window.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { href: "/" },
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center w-full bg-[#FAF7F2] relative text-[#1A241C] p-4 sm:p-6">
      {/* Top Left Back to Home Button */}
      <div className="absolute top-5 left-5 z-20">
        <button
          type="button"
          onClick={handleBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-[#16261A] bg-white border border-[#E8E2D5] rounded-full hover:bg-[#F2ECE0] hover:border-[#C49337] transition-all duration-200 shadow-sm cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </button>
      </div>

      <main className="w-full max-w-4xl mx-auto my-auto py-8">
        {children}
      </main>
    </div>
  );
}
