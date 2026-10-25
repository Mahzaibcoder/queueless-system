import "./../../styles/components.css";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        background: "radial-gradient(ellipse at 50% 10%, rgba(204, 251, 241, 0.4) 0%, rgba(248, 250, 252, 0) 70%), #F8FAFC",
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1020px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
