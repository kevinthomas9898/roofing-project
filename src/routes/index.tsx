import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ClipboardCheck,
  Clock3,
  Hammer,
  House,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/summit-hero.jpg";
import repairImage from "@/assets/summit-repair.jpg";
import replacementImage from "@/assets/summit-replacement.jpg";
import inspectionImage from "@/assets/summit-inspection.jpg";
import { WHOP_CONFIG } from "@/lib/whop-config";
import { trackWhopEvent } from "@/lib/whop-tracker";
import { WhopCheckoutModal, type CheckoutProduct } from "@/components/WhopCheckoutModal";
import { EstimateForm } from "@/components/EstimateForm";
import { DepositInvoiceDemo } from "@/components/DepositInvoiceDemo";
import { WhopEventInspector } from "@/components/WhopEventInspector";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Summit", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Financing", href: "#financing" },
  { label: "Service Areas", href: "#areas" },
  { label: "Invoices Flow", href: "#invoice-workflow" },
  { label: "Estimate", href: "#estimate" },
];

const values = [
  { icon: ShieldCheck, title: "Quality workmanship" },
  { icon: ClipboardCheck, title: "Transparent estimates" },
  { icon: Clock3, title: "Reliable scheduling" },
  { icon: House, title: "Homeowner focused" },
];

const benefits = [
  "Professional workmanship",
  "Clear communication",
  "Transparent project estimates",
  "Dependable service",
];

const steps = [
  "Request an Estimate",
  "Schedule an Inspection",
  "Review Your Proposal",
  "Start Your Project",
];

const areas = ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "Georgetown"];

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" aria-label="Summit Roofing Co. home" className="brand-mark">
      <span className={`brand-icon${light ? " brand-icon-light" : ""}`} aria-hidden="true">
        <House size={22} strokeWidth={2.2} />
      </span>
      <span className={`brand-copy${light ? " brand-copy-light" : ""}`}>
        <span className="brand-name">SUMMIT</span>
        <span className="brand-descriptor">ROOFING CO.</span>
      </span>
    </a>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="section-eyebrow">
      <span className="eyebrow-rule" />
      {children}
    </div>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const openCheckout = (prod: CheckoutProduct) => {
    setActiveCheckoutProduct(prod);
    setCheckoutModalOpen(true);
  };

  const services = [
    {
      number: "01",
      title: "Roof Repair",
      priceLabel: "Free Quote",
      description: "Protect your home from leaks and roofing damage.",
      image: repairImage,
      alt: "Roofing professional carefully repairing an asphalt shingle roof",
      icon: Hammer,
      onAction: () => {
        trackWhopEvent("service_viewed", { service: "Roof Repair", type: "estimate" });
        const el = document.getElementById("estimate");
        el?.scrollIntoView({ behavior: "smooth" });
      },
      actionText: "Request Repair Quote",
    },
    {
      number: "02",
      title: "Roof Replacement",
      priceLabel: "$500 Deposit",
      description: "Upgrade your home with a durable new roof. Secure your crew with a deposit.",
      image: replacementImage,
      alt: "A crew installing a fresh architectural shingle roof",
      icon: House,
      onAction: () => {
        openCheckout({
          title: WHOP_CONFIG.products.deposit.title,
          price: WHOP_CONFIG.products.deposit.price,
          formattedPrice: WHOP_CONFIG.products.deposit.formattedPrice,
          description: WHOP_CONFIG.products.deposit.description,
          planId: WHOP_CONFIG.products.deposit.planId,
          checkoutConfigId: WHOP_CONFIG.products.deposit.checkoutConfigId,
          purchaseUrl: WHOP_CONFIG.products.deposit.purchaseUrl,
          isDeposit: true,
        });
      },
      actionText: "Book $500 Deposit",
    },
    {
      number: "03",
      title: "Roof Inspection",
      priceLabel: "$149 Flat-Rate",
      description: "Understand your roof's condition before problems grow with a full 21-point report.",
      image: inspectionImage,
      alt: "A roofing professional reviewing roof details with a homeowner",
      icon: ClipboardCheck,
      onAction: () => {
        openCheckout({
          title: WHOP_CONFIG.products.inspection.title,
          price: WHOP_CONFIG.products.inspection.price,
          formattedPrice: WHOP_CONFIG.products.inspection.formattedPrice,
          description: WHOP_CONFIG.products.inspection.description,
          planId: WHOP_CONFIG.products.inspection.planId,
          checkoutConfigId: WHOP_CONFIG.products.inspection.checkoutConfigId,
          purchaseUrl: WHOP_CONFIG.products.inspection.purchaseUrl,
          isDeposit: false,
        });
      },
      actionText: "Book Inspection ($149)",
    },
    {
      number: "04",
      title: "Maintenance Tune-Up",
      priceLabel: "$299 Flat-Rate",
      description: "Signature flat-rate roof tune-up: seal exposed fasteners, pipe boots & flashing.",
      image: heroImage,
      alt: "Roofing maintenance tune up inspection in Austin",
      icon: Sparkles,
      onAction: () => {
        openCheckout({
          title: WHOP_CONFIG.products.tuneUp.title,
          price: WHOP_CONFIG.products.tuneUp.price,
          formattedPrice: WHOP_CONFIG.products.tuneUp.formattedPrice,
          description: WHOP_CONFIG.products.tuneUp.description,
          planId: WHOP_CONFIG.products.tuneUp.planId,
          checkoutConfigId: WHOP_CONFIG.products.tuneUp.checkoutConfigId,
          purchaseUrl: WHOP_CONFIG.products.tuneUp.purchaseUrl,
          isDeposit: false,
        });
      },
      actionText: "Order Tune-Up ($299)",
    },
  ];

  return (
    <main>
      {/* 1. TOPLINE */}
      <div className="topline">
        <span>Protecting Your Home, One Roof at a Time.</span>
        <span className="topline-location">
          <MapPin size={13} aria-hidden="true" /> Proudly serving Austin, Texas
        </span>
      </div>

      {/* 2. SITE HEADER */}
      <header className="site-header">
        <div className="nav-shell">
          <BrandMark />
          <nav
            className={`desktop-nav${menuOpen ? " mobile-open" : ""}`}
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <Button asChild className="nav-cta">
              <a href="#estimate" onClick={closeMenu}>
                Get Free Estimate <ArrowRight size={16} />
              </a>
            </Button>
          </nav>
          <a className="phone-link" href={`tel:${WHOP_CONFIG.company.displayPhone}`}>
            <span className="phone-icon">
              <Phone size={16} />
            </span>
            <span>
              <small>LET’S TALK ROOFING</small>
              <strong>{WHOP_CONFIG.company.displayPhone}</strong>
            </span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="hero" id="home" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src={heroImage}
          alt="Beautiful Austin-area home with a new charcoal shingle roof"
          width={1920}
          height={1200}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-inner">
          <div className="hero-copy">
            <SectionEyebrow>ROOFING, DONE RIGHT</SectionEyebrow>
            <h1 id="hero-title">
              Your Home Deserves a <span>Stronger Roof.</span>
            </h1>
            <p>
              Expert roof repairs, replacements, and inspections for homeowners across Austin,
              Texas.
            </p>
            <div className="hero-actions">
              <Button asChild className="button-orange button-large">
                <a href="#estimate">
                  Get a Free Estimate <ArrowRight size={17} />
                </a>
              </Button>
              <a className="text-link-light" href="#services">
                Explore Our Services <ArrowDownRight size={17} />
              </a>
            </div>
            <div className="hero-trust">
              <span className="trust-check">
                <Check size={14} />
              </span>
              Clear estimates. Thoughtful work. A roof you can feel good about.
            </div>
          </div>
          <div className="hero-caption">
            <span className="caption-dot" /> A better roof starts with a better conversation.
          </div>
        </div>
      </section>

      {/* 4. VALUES STRIP */}
      <section className="values-strip" aria-label="Our commitments">
        <div className="values-inner">
          <div className="values-intro">THE SUMMIT STANDARD</div>
          {values.map(({ icon: Icon, title }) => (
            <div className="value-item" key={title}>
              <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
              <span>{title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ROOFING SERVICES */}
      <section className="services-section section-pad" id="services">
        <div className="section-heading">
          <div>
            <SectionEyebrow>WHAT WE DO</SectionEyebrow>
            <h2>
              Good work starts <span>overhead.</span>
            </h2>
          </div>
          <p>
            From a small repair to a whole new roof, we bring care and clarity to every project. Book inspections or lock project deposits directly via Whop Payment Elements.
          </p>
        </div>
        <div className="services-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {services.map(({ number, title, priceLabel, description, image, alt, icon: Icon, onAction, actionText }) => (
            <article className="service-item" key={title}>
              <div
                onClick={onAction}
                className="service-photo-link cursor-pointer"
                aria-label={`Select ${title}`}
              >
                <div className="service-photo-wrap">
                  <img src={image} alt={alt} width={1200} height={1000} loading="lazy" />
                  <span className="service-number">{number}</span>
                  <span className="service-icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                </div>
              </div>
              <div className="service-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                  <h3 style={{ margin: 0 }}>{title}</h3>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--brand-orange)" }}>
                    {priceLabel}
                  </span>
                </div>
                <p>{description}</p>
                <button
                  type="button"
                  onClick={onAction}
                  className="service-more"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                >
                  {actionText} <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE SUMMIT (SPLIT SECTION) */}
      <section className="about-section" id="about">
        <div className="about-photo">
          <img
            src={inspectionImage}
            alt="A Summit roofing professional discussing an inspection with a homeowner"
            width={1408}
            height={1200}
            loading="lazy"
          />
          <div className="photo-note">
            <span>01 /</span> A more considered way to roof.
          </div>
        </div>
        <div className="about-copy">
          <SectionEyebrow>WHY SUMMIT</SectionEyebrow>
          <h2>
            Good people.
            <br />
            Solid roofs.
            <br />
            <span>No surprises.</span>
          </h2>
          <p className="about-lede">
            Choosing a roofer is a big decision. We make the process feel straightforward, from the
            first look to the final shingle.
          </p>
          <ul className="benefit-list">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <span>
                  <Check size={14} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <a href="#invoice-workflow" className="text-link-dark">
            Explore our deposit &amp; invoice workflow <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* 7. FOUR-STEP PROCESS */}
      <section className="process-section section-pad" id="process">
        <div className="process-heading">
          <SectionEyebrow>A CLEARER WAY FORWARD</SectionEyebrow>
          <h2>
            Four steps. <span>One less thing to worry about.</span>
          </h2>
        </div>
        <div className="process-line" aria-label="Our four-step roofing process">
          {steps.map((step, index) => (
            <div className="process-step" key={step}>
              <div className="step-marker">
                <span>0{index + 1}</span>
                <i />
              </div>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINANCING BANNER */}
      <section className="financing-section" id="financing">
        <div className="financing-inner">
          <div className="financing-mark">
            <MessageCircle size={23} strokeWidth={1.6} />
          </div>
          <div className="financing-copy">
            <SectionEyebrow>FLEXIBLE OPTIONS</SectionEyebrow>
            <h2>
              Your Roofing Project,
              <br />
              <span>Made More Manageable.</span>
            </h2>
            <p>
              Ask our team about available financing options for eligible homeowners — powered by Whop Payments with Klarna, Splitit, and Affirm.
            </p>
          </div>
          <Button
            onClick={() => {
              openCheckout({
                title: WHOP_CONFIG.products.deposit.title,
                price: WHOP_CONFIG.products.deposit.price,
                formattedPrice: WHOP_CONFIG.products.deposit.formattedPrice,
                description: "Explore financing options on your $500 project deposit.",
                planId: WHOP_CONFIG.products.deposit.planId,
                checkoutConfigId: WHOP_CONFIG.products.deposit.checkoutConfigId,
                purchaseUrl: WHOP_CONFIG.products.deposit.purchaseUrl,
                isDeposit: true,
              });
            }}
            variant="outline"
            className="financing-button"
          >
            Explore Financing <ArrowRight size={16} />
          </Button>
          <div className="financing-lines" aria-hidden="true" />
        </div>
      </section>

      {/* 9. SERVICE AREAS */}
      <section className="areas-section section-pad" id="areas">
        <div className="areas-copy">
          <SectionEyebrow>NEARBY, BY DESIGN</SectionEyebrow>
          <h2>
            Roofing rooted
            <br />
            in <span>Central Texas.</span>
          </h2>
          <p>
            Local homes deserve local attention. Our team works with homeowners throughout the
            greater Austin area.
          </p>
        </div>
        <div className="area-list" aria-label="Service areas">
          {areas.map((area, index) => (
            <div className="area-row" key={area}>
              <span className="area-index">0{index + 1}</span>
              <span className="area-name">{area}</span>
              <MapPin size={17} strokeWidth={1.6} aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* 10. REVIEWS & TRUST */}
      <section className="testimonial-section section-pad" aria-labelledby="testimonial-title">
        <div className="testimonial-label">
          <span>SAMPLE CONTENT</span>
          <span>FOR DESIGN PREVIEW</span>
        </div>
        <div className="testimonial-content">
          <SectionEyebrow>A HOMEOWNER’S PERSPECTIVE</SectionEyebrow>
          <h2 id="testimonial-title">
            “The whole process felt <span>clear and considered.</span> I knew what to expect at
            every step.”
          </h2>
          <div className="testimonial-attribution">
            <span className="quote-mark">“</span>
            <span>
              <strong>Sample homeowner</strong>
              <small>Austin, Texas · Sample testimonial</small>
            </span>
          </div>
        </div>
        <div className="testimonial-aside">
          <span className="aside-mark">S</span>
          <p>We believe the best recommendation is the one a neighbor can give with confidence.</p>
          <span className="aside-rule" />
        </div>
      </section>

      {/* 11. DEPOSIT -> JOB -> FINAL INVOICE FLOW (WHOP INVOICES & SETUP INTENTS API) */}
      <DepositInvoiceDemo
        onOpenDepositCheckout={() => {
          openCheckout({
            title: WHOP_CONFIG.products.deposit.title,
            price: WHOP_CONFIG.products.deposit.price,
            formattedPrice: WHOP_CONFIG.products.deposit.formattedPrice,
            description: WHOP_CONFIG.products.deposit.description,
            planId: WHOP_CONFIG.products.deposit.planId,
            checkoutConfigId: WHOP_CONFIG.products.deposit.checkoutConfigId,
            purchaseUrl: WHOP_CONFIG.products.deposit.purchaseUrl,
            isDeposit: true,
          });
        }}
      />

      {/* 12. ESTIMATE REQUEST FORM (WIRED TO WHOP LEADS API) */}
      <section className="section-pad" id="estimate" style={{ background: "var(--warm-white)" }}>
        <EstimateForm />
      </section>

      {/* 13. CLOSING CTA BANNER */}
      <section className="closing-cta" id="contact">
        <img
          src={heroImage}
          alt="A well-kept home beneath a sturdy new roof"
          width={1920}
          height={1200}
          loading="lazy"
        />
        <div className="closing-shade" />
        <div className="closing-content">
          <SectionEyebrow>LET’S START WITH A CONVERSATION</SectionEyebrow>
          <h2>
            Ready to Protect
            <br />
            <span>What Matters Most?</span>
          </h2>
          <p>Tell us what your home needs. We’ll help you figure out the next step.</p>
          <Button asChild className="button-orange button-large">
            <a href="#estimate">
              Get Your Free Estimate <ArrowRight size={17} />
            </a>
          </Button>
          <span className="cta-footnote">No pressure. Just a clear place to start.</span>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer className="site-footer" id="footer">
        <div className="footer-main">
          <div className="footer-brand-col">
            <BrandMark light />
            <p>
              Protecting Your Home, One Roof at a Time.
              <br />
              Proudly serving Austin, Texas and the surrounding communities.
            </p>
            <a href={`tel:${WHOP_CONFIG.company.displayPhone}`} className="footer-contact">
              <Phone size={15} /> {WHOP_CONFIG.company.displayPhone}
            </a>
            <a href="#areas" className="footer-contact">
              <MapPin size={15} /> Austin, Texas, USA
            </a>
          </div>
          <div className="footer-links-col">
            <h3>Roofing services</h3>
            <a href="#services">Roof repair</a>
            <a href="#services">Roof replacement</a>
            <a href="#services">Roof inspection ($149)</a>
            <a href="#services">Maintenance tune-up ($299)</a>
            <a href="#financing">Financing options</a>
          </div>
          <div className="footer-links-col">
            <h3>Explore Summit</h3>
            <a href="#about">About us</a>
            <a href="#areas">Service areas</a>
            <a href="#process">Our process</a>
            <a href="#invoice-workflow">Invoice workflow</a>
            <a href="#estimate">Get an estimate</a>
          </div>
          <div className="footer-area-col">
            <h3>Where we work</h3>
            <p>
              Austin · Round Rock
              <br />
              Cedar Park · Pflugerville
              <br />
              Georgetown
            </p>
            <span className="footer-note">Serving Central Texas homeowners.</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Summit Roofing Co. All rights reserved. Powered by Whop Websites.</span>
          <span className="footer-legal">
            <a href="#footer">Privacy</a>
            <a href="#footer">Terms</a>
            <span>Whop Account: {WHOP_CONFIG.accountId}</span>
          </span>
        </div>
      </footer>

      {/* 15. WHOP PAYMENT ELEMENTS MODAL */}
      <WhopCheckoutModal
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        product={activeCheckoutProduct}
      />

      {/* 16. LIVE WHOP PIXEL EVENT STREAM INSPECTOR */}
      <WhopEventInspector />
    </main>
  );
}
