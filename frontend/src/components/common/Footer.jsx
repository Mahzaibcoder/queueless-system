import "./../../styles/components.css";

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand-box">
          <div className="footer-brand-header">
            <div className="footer-brand-icon">Q</div>
            <div>
              <div className="footer-brand-title">QueueLess</div>
              <div className="footer-brand-subtitle">Smart Appointment & Queue Assurance</div>
            </div>
          </div>
          <p className="footer-brand-desc">
            Supporting quality assurance, zero-wait punctuality, and continuous improvement across appointment systems and local services.
          </p>
        </div>

        {/* Explore Links */}
        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li><a href="/#about">About QueueLess</a></li>
            <li><a href="/browse">Browse Businesses</a></li>
            <li><a href="/#how-it-works">Booking Framework</a></li>
            <li><a href="/#resources">Resources & Standards</a></li>
          </ul>
        </div>

        {/* Portal Links */}
        <div className="footer-column">
          <h4>Portal</h4>
          <ul>
            <li><a href="/#updates">Announcements</a></li>
            <li><a href="/#resources">Guidance</a></li>
            <li><a href="/owner-dashboard">Business Dashboard</a></li>
            <li>
              <a href="#top" onClick={scrollToTop}>
                Back to top &uarr;
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div>&copy; {new Date().getFullYear()} QueueLess Portal. Editorial concept.</div>
        <div>Designed for clarity, access, and progress.</div>
      </div>
    </footer>
  );
}
