import { useState } from "react";
import {
  ShieldCheckIcon,
  DeviceMobileIcon,
  ChartTrendIcon,
  DocumentTextIcon,
  GlobeOutlineIcon,
  SearchIcon,
  CheckCircleIcon,
} from "../components/common/Icons";
import "./../styles/components.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = "/browse";
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero-editorial">
        <div className="hero-editorial-grid">
          {/* Left Column */}
          <div>
            <div className="hero-kicker">
              A Stronger Future for Scheduling
            </div>
            <h1 className="hero-main-title">
              Building confidence in <br />
              <span className="highlight">seamless scheduling.</span>
            </h1>
            <p className="hero-desc">
              A trusted framework for quality, continuous improvement, and zero-wait
              punctuality across service businesses and customer appointments.
            </p>

            <div className="hero-buttons-row">
              <a href="/browse" className="hero-pill-primary">
                <span>Explore businesses</span>
                <span>&rarr;</span>
              </a>
              <a href="#about" className="hero-pill-secondary">
                <span>Discover QueueLess</span>
                <span>&rarr;</span>
              </a>
            </div>

            {/* Quality Feature Badge (matching photo with teal icon) */}
            <div className="hero-feature-badge">
              <div className="hero-feature-icon">
                <ShieldCheckIcon size={20} style={{ color: "var(--teal)" }} />
              </div>
              <div className="hero-feature-text">
                <h4>Quality with purpose</h4>
                <p>Clear standards. Meaningful punctuality.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Framework Preview Card */}
          <div className="hero-card-wrapper">
            <div className="hero-floating-badge-top">
              <ShieldCheckIcon size={16} style={{ color: "var(--teal)" }} />
              <div>
                <strong>Quality first</strong>
                <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  Standardized schedules
                </span>
              </div>
            </div>

            <div className="hero-preview-card">
              <div className="hero-card-header">
                <span className="card-tag-framework">
                  <CheckCircleIcon size={13} style={{ color: "var(--teal-dark)" }} />
                  Framework
                </span>
              </div>

              <h3 className="hero-card-title">
                Era of <br />
                <span style={{ color: "var(--teal)" }}>continuous improvement.</span>
              </h3>

              {/* Graphic Chart with Axis Markers */}
              <div className="chart-container">
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                  {/* Y-Axis percentages */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "140px", paddingBottom: "0.5rem", fontSize: "0.68rem", color: "var(--text-light)", fontWeight: 600 }}>
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>

                  <div className="chart-bars" style={{ flex: 1 }}>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "35%" }} />
                      <span className="chart-label">Morning</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "65%" }} />
                      <span className="chart-label">Noon</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "95%" }} />
                      <span className="chart-label">Peak</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "80%" }} />
                      <span className="chart-label">Evening</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "100%" }} />
                      <span className="chart-label">Standard</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-status-badge">
                <ShieldCheckIcon size={14} style={{ color: "var(--teal)" }} />
                <span>Consistent standard progress</span>
              </div>
            </div>

            {/* Bottom floating badge matching photo */}
            <div className="hero-floating-badge-bottom">
              <div className="floating-badge-icon">
                <ChartTrendIcon size={18} style={{ color: "var(--teal)" }} />
              </div>
              <div className="floating-badge-text">
                <h5>Keeps improving</h5>
                <p>Progress that matters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMITMENT STRIP */}
      <section className="commitment-strip">
        <div className="commitment-inner">
          <div className="commitment-header">
            <span>Supporting quality across service businesses</span>
            <span>Standards &bull; Evidence &bull; Improvement</span>
          </div>

          <div className="commitment-grid">
            <div className="commitment-item-lead">
              <div className="commitment-tag">Our Commitment</div>
              <h3>Quality that moves scheduling forward.</h3>
            </div>

            <div className="commitment-col">
              <span className="commitment-num">01</span>
              <h4>Clear standards</h4>
              <p>Consistent expectations for real-time open slots.</p>
            </div>

            <div className="commitment-col">
              <span className="commitment-num">02</span>
              <h4>Transparent process</h4>
              <p>A structured path through discovery and booking.</p>
            </div>

            <div className="commitment-col">
              <span className="commitment-num">03</span>
              <h4>Better outcomes</h4>
              <p>Zero wait times that respect everyone's daily schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE QUEUELESS APPROACH */}
      <section id="about" className="section-approach">
        <div className="approach-inner">
          <div className="section-kicker">The QueueLess Approach</div>

          <div className="approach-header-split">
            <h2 className="approach-title">
              Quality is not a finish line. <br />
              <span className="teal-text">It is a shared commitment.</span>
            </h2>
            <p className="approach-desc">
              QueueLess supports a culture where service providers assess their capacity,
              identify opportunities, and continually work toward seamless customer outcomes.
            </p>
          </div>

          <div className="approach-cards-grid">
            {/* Card 1 */}
            <div className="approach-card">
              <div className="approach-card-top">
                <div className="approach-icon-box">
                  <ShieldCheckIcon size={24} style={{ color: "var(--teal)" }} />
                </div>
                <span className="approach-card-num">01</span>
              </div>
              <h3>Quality assurance</h3>
              <p>
                Promoting consistent appointment standards through transparent availability,
                automated slot reservation, and real-time reviews.
              </p>
              <a href="/browse" className="approach-card-link">
                <span>Learn more</span>
                <span className="arrow">&rarr;</span>
              </a>
            </div>

            {/* Card 2 */}
            <div className="approach-card">
              <div className="approach-card-top">
                <div className="approach-icon-box">
                  <DeviceMobileIcon size={24} style={{ color: "var(--teal)" }} />
                </div>
                <span className="approach-card-num">02</span>
              </div>
              <h3>Academic excellence</h3>
              <p>
                Supporting service businesses as they strengthen appointment throughput,
                reduce no-shows, and improve customer satisfaction.
              </p>
              <a href="/browse" className="approach-card-link">
                <span>Learn more</span>
                <span className="arrow">&rarr;</span>
              </a>
            </div>

            {/* Card 3 */}
            <div className="approach-card">
              <div className="approach-card-top">
                <div className="approach-icon-box">
                  <ChartTrendIcon size={24} style={{ color: "var(--teal)" }} />
                </div>
                <span className="approach-card-num">03</span>
              </div>
              <h3>Continuous improvement</h3>
              <p>
                Encouraging evidence-based scheduling decisions, queue elimination,
                and measurable wait-time reduction across every branch.
              </p>
              <a href="/browse" className="approach-card-link">
                <span>Learn more</span>
                <span className="arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DARK SECTION: A CLEAR PATH FORWARD */}
      <section id="how-it-works" className="section-dark-path">
        <div className="dark-watermark">Q</div>
        <div className="dark-path-inner">
          <div className="dark-path-left">
            <div className="section-kicker section-kicker-light">A Clear Path Forward</div>
            <h2 className="dark-title">
              Make quality a part of <br />
              <span className="teal-highlight">every step.</span>
            </h2>
            <p className="dark-desc">
              A well-defined booking journey helps customers and businesses turn standards
              into action and action into progress.
            </p>
            <a href="/browse" className="btn-dark-cta">
              <span>Explore the framework</span>
              <span>&rarr;</span>
            </a>
          </div>

          <div className="dark-steps-list">
            <div className="dark-step-item">
              <span className="dark-step-num">01</span>
              <div className="dark-step-content">
                <h4>Explore the framework</h4>
                <p>Understand accreditation criteria, standards, and the review process.</p>
              </div>
              <a href="/browse" className="dark-step-btn" aria-label="Explore step 1">&rarr;</a>
            </div>

            <div className="dark-step-item">
              <span className="dark-step-num">02</span>
              <div className="dark-step-content">
                <h4>Prepare your program</h4>
                <p>Organize program evidence and evaluate learning outcomes against the criteria.</p>
              </div>
              <a href="/browse" className="dark-step-btn" aria-label="Explore step 2">&rarr;</a>
            </div>

            <div className="dark-step-item">
              <span className="dark-step-num">03</span>
              <div className="dark-step-content">
                <h4>Track progress</h4>
                <p>Use a clear process to follow reviews, updates, and quality improvement actions.</p>
              </div>
              <a href="/browse" className="dark-step-btn" aria-label="Explore step 3">&rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RESOURCES / STARTING POINT SECTION */}
      <section id="resources" className="section-resources">
        <div className="resources-inner">
          <div className="section-kicker">Your Starting Point</div>

          <div className="resources-header-split">
            <h2 className="resources-title">
              Resources for the <br />
              <span className="teal-text">next step.</span>
            </h2>
            <p className="resources-desc">
              Find the information you need to understand the process and prepare with confidence.
            </p>
          </div>

          <div className="resource-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="resource-search-bar">
              <SearchIcon size={18} className="resource-search-icon" />
              <input
                type="text"
                className="resource-search-input"
                placeholder="Search standards, guidelines, and resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="resource-search-btn" aria-label="Search">&rarr;</button>
            </form>
          </div>

          <div className="resources-cards-grid">
            <div className="resource-card">
              <div className="resource-card-icon">
                <DeviceMobileIcon size={22} style={{ color: "var(--teal)" }} />
              </div>
              <span className="resource-card-category">Guidance</span>
              <h3>Accreditation framework</h3>
              <p>Get familiar with the principles and criteria that guide program quality.</p>
              <a href="/browse" className="resource-card-link">
                <span>Explore framework</span>
                <span className="arrow">&rarr;</span>
              </a>
            </div>

            <div className="resource-card">
              <div className="resource-card-icon">
                <DocumentTextIcon size={22} style={{ color: "var(--teal)" }} />
              </div>
              <span className="resource-card-category">Preparation</span>
              <h3>Program documentation</h3>
              <p>Understand how evidence and documentation support the review process.</p>
              <a href="/browse" className="resource-card-link">
                <span>View guidance</span>
                <span className="arrow">&rarr;</span>
              </a>
            </div>

            <div className="resource-card">
              <div className="resource-card-icon">
                <GlobeOutlineIcon size={22} style={{ color: "var(--teal)" }} />
              </div>
              <span className="resource-card-category">Information</span>
              <h3>Portal announcements</h3>
              <p>Stay connected with relevant updates and information for institutions.</p>
              <a href="/browse" className="resource-card-link">
                <span>See updates</span>
                <span className="arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STAY CONNECTED SECTION */}
      <section id="updates" className="section-stay-connected">
        <div className="connected-inner">
          <div>
            <div className="section-kicker">Stay Connected</div>
            <h2 className="connected-title">
              Keep up with what <br />
              <span className="teal-text">comes next.</span>
            </h2>
            <p className="connected-desc">
              Receive portal announcements and important information as it becomes available.
            </p>
          </div>

          <div className="newsletter-card">
            <div className="newsletter-icon">
              <DocumentTextIcon size={22} style={{ color: "var(--teal)" }} />
            </div>
            <h3>Get portal updates</h3>
            <p>Enter your email to try the announcement sign-up experience.</p>

            {newsletterSuccess ? (
              <div style={{ padding: "0.85rem 1rem", background: "var(--teal-bg)", color: "var(--teal-dark)", borderRadius: "10px", fontWeight: "700", fontSize: "0.9rem", marginBottom: "1rem", border: "1px solid var(--teal-border)" }}>
                Signed up &mdash; you'll receive portal announcements.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input
                  type="email"
                  required
                  placeholder="you@institution.edu.pk"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn" aria-label="Submit email">&rarr;</button>
              </form>
            )}

            <div className="newsletter-footnote">
              Editorial concept. Sign up for real-time queue notices.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
