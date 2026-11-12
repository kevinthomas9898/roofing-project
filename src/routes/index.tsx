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
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  { label: "Areas", href: "#areas" },
  { label: "Invoice Workflow", href: "#invoice-workflow" },
  { label: "Estimate", href: "#estimate" },
];

const values = [
  { icon: ShieldCheck, title: "Quality workmanship" },
  { icon: ClipboardCheck, title: "Transparent estimates" },
  { icon: Clock3, title: "Reliable scheduling" },
  { icon: House, title: "Homeowner focused" },
];

const benefits = [
  "Professional Texas-certified workmanship",
  "Clear, upfront communication on every detail",
  "Transparent project estimates with zero surprise fees",
  "Dependable scheduling and full site cleanup",
];

const steps = [
  "Request an Estimate",
  "Schedule an Inspection",
  "Review Your Proposal",
  "Start Your Project",
];

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" aria-label="Summit Roofing Co. home" className="brand-mark">
      <span className={`brand-icon${light ? " brand-icon-light" : ""}`} aria-hidden="true">
        <House size={22} strokeWidth={2.2} />
      </span>
      <span className={`brand-copy${light ? " brand-copy-light" : ""}`}>
        <span className="brand-name font-display">SUMMIT</span>
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

  const servicesData = [
    {
      number: "01",
      title: "Roof Repair",
      description: "Protect your home from leaks, wind damage, and broken shingles before interior structural damage occurs.",
      image: repairImage,
      alt: "Roofing professional repairing asphalt shingles",
      icon: Hammer,
      action: () => {
        trackWhopEvent("service_viewed", { service: "Roof Repair", category: "repair" });
        const el = document.getElementById("estimate");
        el?.scrollIntoView({ behavior: "smooth" });
      },
      actionLabel: "Request Repair Estimate",
      badge: "Free Estimate",
      priceTag: "Custom Quote",
    },
    {
      number: "02",
      title: "Roof Replacement",
      description: "Upgrade your home with a lifetime GAF architectural roof. Includes tear-off, synthetic underlayment, and ridge ventilation.",
      image: replacementImage,
      alt: "Fresh architectural shingle roof installation",
      icon: House,
      action: () => {
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
      actionLabel: "Book $500 Project Deposit",
      badge: "High-Ticket Vertical",
      priceTag: "$500 Deposit",
    },
    {
      number: "03",
      title: "Professional Roof Inspection",
      description: "Comprehensive 21-point visual inspection of flashing, chimney seals, shingles, and decking condition with a full written photo report.",
      image: inspectionImage,
      alt: "Roof inspector examining shingles with homeowner",
      icon: ClipboardCheck,
      action: () => {
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
      actionLabel: "Book Inspection ($149)",
      badge: "One-Time Fee",
      priceTag: "$149 Flat-Rate",
    },
    {
      number: "04",
      title: "Roof Maintenance Tune-Up",
      description: "Our signature flat-rate preventive maintenance: reseal pipe boots, re-caulk flashing, nail down popped fasteners, and clear roof valleys.",
      image: heroImage,
      alt: "Completed roof maintenance in Austin",
      icon: Sparkles,
      action: () => {
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
      actionLabel: "Order Tune-Up ($299)",
      badge: "Flat-Rate Service",
      priceTag: "$299 Flat-Rate",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-[#E87932]/20 selection:text-[#10243A]">
      {/* TOP NOTIFICATION BAR */}
      <div className="topline bg-[#10243A] text-white/90 text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-white/10">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#E87932] inline-block animate-pulse" />
          {WHOP_CONFIG.company.tagline}
        </span>
        <div className="flex items-center gap-4 text-white/80">
          <span className="hidden sm:inline">Whop Websites Production Template</span>
          <span className="topline-location flex items-center gap-1 font-semibold text-white">
            <MapPin size={13} className="text-[#E87932]" /> {WHOP_CONFIG.company.location}
          </span>
        </div>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="site-header sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="nav-shell max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <BrandMark />

          <nav
            className={`desktop-nav flex items-center gap-6 text-sm font-medium ${
              menuOpen ? "mobile-open" : ""
            }`}
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="text-foreground/80 hover:text-[#E87932] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="nav-cta bg-[#E87932] hover:bg-[#E87932]/90 text-white font-semibold">
              <a href="#estimate" onClick={closeMenu}>
                Get Free Estimate <ArrowRight size={16} />
              </a>
            </Button>
          </nav>

          <a
            className="phone-link hidden lg:flex items-center gap-3 text-left pl-4 border-l border-border"
            href={`tel:${WHOP_CONFIG.company.displayPhone}`}
          >
            <span className="phone-icon p-2 rounded-full bg-[#10243A]/5 text-[#E87932]">
              <Phone size={16} />
            </span>
            <span>
              <small className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                CALL 24/7 ROOFING
              </small>
              <strong className="text-sm font-bold text-[#10243A]">{WHOP_CONFIG.company.displayPhone}</strong>
            </span>
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="menu-toggle md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero relative min-h-[640px] md:min-h-[720px] flex items-center" id="home">
        <img
          className="hero-image absolute inset-0 w-full h-full object-cover object-center"
          src={heroImage}
          alt="Beautiful Austin-area suburban home with a brand new architectural shingle roof"
          fetchPriority="high"
        />
        <div className="hero-shade absolute inset-0 bg-gradient-to-r from-[#10243A]/95 via-[#10243A]/80 to-transparent" />

        <div className="hero-inner relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="hero-copy max-w-2xl text-white space-y-6">
            <SectionEyebrow>ROOFING, DONE RIGHT</SectionEyebrow>
            <h1 id="hero-title" className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.05] tracking-tight">
              Your Home Deserves a <span className="text-[#E87932]">Stronger Roof.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed font-normal">
              Expert roof repairs, replacements, and inspections for homeowners across Austin, Texas. Powered by modern Whop checkout &amp; instant digital estimates.
            </p>

            <div className="hero-actions flex flex-wrap items-center gap-4 pt-2">
              <Button asChild className="button-orange button-large h-13 px-7 text-base font-bold bg-[#E87932] hover:bg-[#E87932]/90 text-white shadow-xl shadow-[#E87932]/25">
                <a href="#estimate">
                  Get a Free Estimate <ArrowRight size={18} />
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-13 px-6 text-base font-semibold border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs"
              >
                <a href="#services">
                  Explore Our Services <ArrowDownRight size={18} />
                </a>
              </Button>
            </div>

            <div className="hero-trust flex items-center gap-2.5 text-sm text-white/85 pt-3">
              <span className="trust-check p-1 rounded-full bg-[#E87932] text-white">
                <Check size={14} strokeWidth={3} />
              </span>
              <span>Clear estimates. Whop Payment Elements. A roof you can feel good about.</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS: THE SUMMIT STANDARD */}
      <section className="values-strip bg-white border-b border-border py-6 px-6" aria-label="Our commitments">
        <div className="values-inner max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="values-intro text-xs font-extrabold uppercase tracking-widest text-[#E87932] pr-6 border-r border-border hidden lg:block">
            THE SUMMIT STANDARD
          </div>
          {values.map(({ icon: Icon, title }) => (
            <div className="value-item flex items-center gap-3 text-sm font-semibold text-[#10243A]" key={title}>
              <span className="p-2 rounded-lg bg-[#E87932]/10 text-[#E87932]">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span>{title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section py-20 px-6 max-w-7xl mx-auto" id="services">
        <div className="section-heading flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionEyebrow>CORE SERVICES &amp; REAL PLANS</SectionEyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[#10243A] tracking-tight">
              Good work starts <span className="text-[#E87932]">overhead.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            From minor leak repairs to full roof installations, book flat-rate inspections or deposit locks with integrated Whop Payment Elements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="service-card group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-[#E87932]/40 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#10243A]/90 text-white text-xs font-mono font-bold backdrop-blur-xs">
                      {service.number}
                    </span>
                    <Badge className="bg-[#E87932] text-white hover:bg-[#E87932] text-[11px] font-semibold border-none">
                      {service.badge}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 text-[#10243A] text-xs font-bold shadow-xs">
                      {service.priceTag}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[#E87932]">
                      <Icon size={18} strokeWidth={2.2} />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summit Scope</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#10243A] group-hover:text-[#E87932] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <Button
                    onClick={service.action}
                    className="w-full text-xs font-semibold bg-[#10243A] hover:bg-[#E87932] text-white transition-colors"
                  >
                    {service.actionLabel} <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE SUMMIT (SPLIT SECTION) */}
      <section className="about-section py-20 bg-muted/40 border-y border-border" id="about">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 lg:aspect-square">
            <img
              src={inspectionImage}
              alt="Summit Roofing inspector reviewing shingles with Austin homeowner"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#10243A]/90 backdrop-blur-md p-4 rounded-xl text-white text-xs flex items-center justify-between">
              <span><strong>GAF Master Elite Standard:</strong> Built for Central Texas hail &amp; heat.</span>
              <span className="text-[#E87932] font-bold">100% Insured</span>
            </div>
          </div>

          <div className="space-y-6">
            <SectionEyebrow>WHY CENTRAL TEXAS CHOOSES SUMMIT</SectionEyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[#10243A] leading-tight">
              Good people.
              <br />
              Solid roofs.
              <br />
              <span className="text-[#E87932]">No surprises.</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Choosing a roofing contractor is a high-stakes decision for your family. We pair honest on-roof inspections with digital transparency through Whop Websites.
            </p>

            <ul className="space-y-3 pt-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm font-semibold text-[#10243A]">
                  <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex items-center gap-4">
              <Button asChild className="bg-[#E87932] hover:bg-[#E87932]/90 text-white font-semibold">
                <a href="#estimate">
                  Start Your Estimate <ArrowRight size={16} />
                </a>
              </Button>
              <a href="#invoice-workflow" className="text-sm font-bold text-[#10243A] hover:text-[#E87932] flex items-center gap-1.5">
                See Deposit &amp; Invoices Flow <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR STEP PROCESS SECTION */}
      <section className="process-section py-20 px-6 max-w-7xl mx-auto" id="process">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionEyebrow>A CLEARER WAY FORWARD</SectionEyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#10243A] mt-2">
            Four steps. <span className="text-[#E87932]">One less thing to worry about.</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            From initial estimate request to final certified completion, know exactly where your project stands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={step} className="p-6 rounded-2xl border border-border bg-card shadow-xs relative space-y-3">
              <span className="text-3xl font-extrabold font-display text-[#E87932]/30">
                0{idx + 1}
              </span>
              <h3 className="text-lg font-bold text-[#10243A]">{step}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {idx === 0 && "Fill out our quick estimate form — immediately creating a Whop lead for our estimators."}
                {idx === 1 && "Book an onsite inspection or lock an agreed project start date with a $500 deposit."}
                {idx === 2 && "Review transparent material options (GAF shingles, metal, tile) and warranty options."}
                {idx === 3 && "Professional install in 1–2 days. Final balance billed via the Whop Invoices API."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINANCING CALLOUT BANNER */}
      <section className="financing-section py-16 px-6 bg-[#10243A] text-white" id="financing">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-[#E87932] text-white hover:bg-[#E87932] text-xs font-semibold uppercase px-3 py-1">
              Flexible Homeowner Options
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              Your Roofing Project, <span className="text-[#E87932]">Made More Manageable.</span>
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              Ask our team about available financing options for eligible homeowners. Powered directly by Whop Payments with automated Klarna, Splitit, and card installment options.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 pt-2">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-[#E87932]" /> 0% APR promotional plans available</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-[#E87932]" /> Fast digital approvals via Whop Elements</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-[#E87932]" /> No prepayment penalties</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
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
              className="h-12 px-6 bg-[#E87932] hover:bg-[#E87932]/90 text-white font-bold shadow-lg"
            >
              <CreditCard size={17} className="mr-2" /> Explore Financing Options
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-12 px-6 border-white/30 text-white hover:bg-white/10"
            >
              <a href="#estimate">Talk to Estimator</a>
            </Button>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS (CENTRAL TEXAS) */}
      <section className="areas-section py-20 px-6 max-w-7xl mx-auto" id="areas">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionEyebrow>NEARBY, BY DESIGN</SectionEyebrow>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[#10243A] tracking-tight">
              Roofing rooted in <span className="text-[#E87932]">Central Texas.</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-lg">
              Local homes deserve local attention. Our mobile inspection crews are stationed throughout Travis and Williamson counties for prompt estimates and emergency storm response.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-[#10243A]">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                Crews Available Today
              </span>
              <span>•</span>
              <span>Austin Metro Coverage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHOP_CONFIG.serviceAreas.map((area) => (
              <div
                key={area.name}
                className="p-5 rounded-xl border border-border bg-card shadow-xs hover:border-[#E87932] transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-[#10243A] text-base">{area.name}, TX</h4>
                  <p className="text-xs text-muted-foreground">Area {area.zipPrefix} · Dispatch {area.responseTime}</p>
                </div>
                <div className="p-2 rounded-full bg-[#E87932]/10 text-[#E87932]">
                  <MapPin size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS & TRUST INDICATORS */}
      <section className="testimonial-section py-20 bg-muted/30 border-y border-border" id="reviews">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="border-border text-xs uppercase px-3 py-1 font-semibold text-muted-foreground mb-2">
              Verified Homeowner Feedback (Sample Template)
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#10243A]">
              Austin Homeowners Trust <span className="text-[#E87932]">Summit Roofing</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border shadow-xs space-y-4">
              <div className="flex text-amber-500">★★★★★</div>
              <p className="text-xs text-foreground/80 leading-relaxed italic">
                “After the April hail storm, Summit came out the next morning for an inspection. The Whop invoice and deposit process was frictionless, and the crew completed our new roof in two days.”
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <strong className="text-[#10243A]">David &amp; Sarah M.</strong>
                <span className="text-muted-foreground">Round Rock, TX</span>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border shadow-xs space-y-4">
              <div className="flex text-amber-500">★★★★★</div>
              <p className="text-xs text-foreground/80 leading-relaxed italic">
                “No aggressive salesmen, no confusing contracts. Transparent 21-point inspection report with photos of every valley. Truly the highest standard in Austin.”
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <strong className="text-[#10243A]">Marcus K.</strong>
                <span className="text-muted-foreground">Cedar Park, TX</span>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border shadow-xs space-y-4">
              <div className="flex text-amber-500">★★★★★</div>
              <p className="text-xs text-foreground/80 leading-relaxed italic">
                “Being able to pay the project deposit with Apple Pay on Whop and have our final balance billed automatically saved us hours. Outstanding customer care.”
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <strong className="text-[#10243A]">Elena R.</strong>
                <span className="text-muted-foreground">Austin (South Congress), TX</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* HIGH-TICKET VERTICAL: DEPOSIT & INVOICES API WORKFLOW DEMO */}
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

      {/* REQUEST AN ESTIMATE FORM (WIRED TO WHOP LEADS API) */}
      <section className="py-20 px-6 bg-muted/20" id="estimate">
        <div className="max-w-7xl mx-auto">
          <EstimateForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer bg-[#10243A] text-white pt-16 pb-12 border-t border-white/10" id="footer">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <BrandMark light />
            <p className="text-xs text-white/70 leading-relaxed">
              {WHOP_CONFIG.company.tagline}
              <br />
              Commercial &amp; residential roofing contractor serving Central Texas.
            </p>
            <div className="space-y-1 text-xs text-white/60">
              <div>{WHOP_CONFIG.company.license}</div>
              <div>Whop Websites Account ID: <code className="text-[#E87932]">{WHOP_CONFIG.accountId}</code></div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a href="#services" className="hover:text-[#E87932]">Roof Leak Repair</a></li>
              <li><a href="#services" className="hover:text-[#E87932]">Architectural Replacement</a></li>
              <li><a href="#services" className="hover:text-[#E87932]">Roof Inspection ($149)</a></li>
              <li><a href="#services" className="hover:text-[#E87932]">Maintenance Tune-Up ($299)</a></li>
              <li><a href="#financing" className="hover:text-[#E87932]">Whop Financing &amp; Klarna</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Service Areas</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>Austin (Travis County)</li>
              <li>Round Rock (Williamson County)</li>
              <li>Cedar Park, TX</li>
              <li>Pflugerville, TX</li>
              <li>Georgetown, TX</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact &amp; Hours</h4>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#E87932]" />
                <span className="font-semibold text-white">{WHOP_CONFIG.company.displayPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#E87932]" />
                <span>Austin, Texas, USA</span>
              </div>
              <div className="pt-2 text-[11px] text-white/50">
                Mon – Sat: 7:00 AM – 7:00 PM<br />
                Emergency Leak Response: 24/7
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <div>© 2026 Summit Roofing Co. All rights reserved. Powered by Whop Websites.</div>
          <div className="flex items-center gap-4">
            <span>Whop Payment Elements</span>
            <span>•</span>
            <span>Whop Leads API</span>
            <span>•</span>
            <span>Whop Invoices API</span>
          </div>
        </div>
      </footer>

      {/* WHOP CHECKOUT MODAL (WITH WHOP PAYMENT ELEMENTS) */}
      <WhopCheckoutModal
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        product={activeCheckoutProduct}
      />

      {/* LIVE WHOP PIXEL STREAM INSPECTOR */}
      <WhopEventInspector />
    </main>
  );
}
