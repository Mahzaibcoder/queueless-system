import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import "./../../styles/components.css";

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", width: "100%", overflowX: "hidden" }}>
      <Navbar />
      <main style={{ flex: 1, width: "100%" }}>{children}</main>
      <Footer />
    </div>
  );
}
