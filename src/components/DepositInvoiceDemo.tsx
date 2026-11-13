import { useState } from "react";
import { Button } from "./ui/button";
import { WHOP_CONFIG } from "@/lib/whop-config";
import { trackWhopEvent } from "@/lib/whop-tracker";

interface DepositInvoiceDemoProps {
  onOpenDepositCheckout: () => void;
}

export function DepositInvoiceDemo({ onOpenDepositCheckout }: DepositInvoiceDemoProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [invoiceStatus, setInvoiceStatus] = useState<"idle" | "creating" | "created" | "charged">("idle");
  const [invoiceId, setInvoiceId] = useState<string>("pay_inv_94827103");

  const handleCreateInvoice = async () => {
    setInvoiceStatus("creating");
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          amount: 7300,
          customerEmail: "customer@centraltexas.home",
          paymentMethodId: "payt_card_on_file_8841",
        }),
      }).catch(() => null);

      let createdInvoiceId = "pay_inv_" + Math.random().toString(36).substring(2, 10);
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.invoiceId) {
          createdInvoiceId = data.invoiceId;
        }
      }

      setInvoiceId(createdInvoiceId);
      setInvoiceStatus("created");

      trackWhopEvent("invoice_created", {
        invoiceId: createdInvoiceId,
        amount: 7300,
        customerEmail: "customer@centraltexas.home",
        account: WHOP_CONFIG.accountId,
      });
    } catch (err) {
      console.warn("Invoice API execution error:", err);
      const fallbackId = "pay_inv_" + Math.random().toString(36).substring(2, 10);
      setInvoiceId(fallbackId);
      setInvoiceStatus("created");
    }
  };

  const handleChargeCardOnFile = async () => {
    setInvoiceStatus("creating");
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "charge",
          amount: 7300,
          invoiceId,
          paymentMethodId: "payt_card_on_file_8841",
        }),
      }).catch(() => null);

      if (res && res.ok) {
        await res.json().catch(() => null);
      }

      setInvoiceStatus("charged");

      trackWhopEvent("invoice_charged", {
        invoiceId,
        amount: 7300,
        paymentMethodId: "payt_card_on_file_8841",
        status: "paid",
      });
    } catch (err) {
      console.warn("Charge API execution error:", err);
      setInvoiceStatus("charged");
    }
  };

  return (
    <section className="py-20 bg-[#10243A] text-white border-y border-white/10" id="invoice-workflow">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E87932] mb-3">
            <span className="w-5 h-0.5 bg-[#E87932]" />
            High-Ticket Workflow
            <span className="w-5 h-0.5 bg-[#E87932]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white">
            Deposit to Final Invoice Flow
          </h2>
          <p className="mt-4 text-white/75 text-base leading-relaxed">
            Roofing requires capturing an initial deposit, safely saving the payment method, and invoicing the remaining balance upon certified completion.
          </p>
        </div>

        {/* 3 Step Milestone Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* STEP 1 */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`text-left rounded-xl p-5 border transition-all ${
              step === 1
                ? "bg-white/10 border-[#E87932] ring-1 ring-[#E87932]"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-[#E87932] tracking-wider uppercase">01 / Deposit</span>
              <span className="text-[11px] text-white/60">Whop Setup Intent</span>
            </div>
            <h3 className="text-base font-bold text-white">$500 Project Lock</h3>
            <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
              Customer locks their crew schedule. Payment Elements safely stores the card on file.
            </p>
          </button>

          {/* STEP 2 */}
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`text-left rounded-xl p-5 border transition-all ${
              step === 2
                ? "bg-white/10 border-[#E87932] ring-1 ring-[#E87932]"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white/60 tracking-wider uppercase">02 / Execution</span>
              <span className="text-[11px] text-white/60">On-Site Work</span>
            </div>
            <h3 className="text-base font-bold text-white">Installation Complete</h3>
            <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
              Old roof tear-off, GAF architectural shingles installed, and city inspection passed.
            </p>
          </button>

          {/* STEP 3 */}
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`text-left rounded-xl p-5 border transition-all ${
              step === 3
                ? "bg-white/10 border-[#E87932] ring-1 ring-[#E87932]"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-emerald-400 tracking-wider uppercase">03 / Balance</span>
              <span className="text-[11px] text-white/60">Whop Invoices API</span>
            </div>
            <h3 className="text-base font-bold text-white">$7,300 Final Balance</h3>
            <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
              Automated invoice generation and balance settlement via stored payment method.
            </p>
          </button>
        </div>

        {/* Milestone Detail Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Initial Deposit &amp; Card-on-File
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Customer secures their job date through Whop Payment Elements.
                  </p>
                </div>
                <Button
                  onClick={onOpenDepositCheckout}
                  className="bg-[#E87932] hover:bg-[#E87932]/90 text-white font-semibold text-xs px-5 h-10 shadow-md shrink-0"
                >
                  Open Deposit Checkout ($500)
                </Button>
              </div>

              {/* Statement summary card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-3">
                  <div className="font-bold text-white text-sm">Customer Payment Record</div>
                  <div className="space-y-2 text-white/75">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/50">Deposit Amount</span>
                      <strong className="text-white">$500.00 USD</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/50">Stored Method</span>
                      <span className="text-white">Visa ending in 4242</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-white/50">Storage Method</span>
                      <span className="text-white">Whop Setup Intent (PCI Secure)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Status</span>
                      <span className="text-emerald-400 font-semibold">Active on Account</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-3">
                  <div className="font-bold text-white text-sm">Contractor Protection</div>
                  <ul className="space-y-2 text-white/75 text-xs leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#E87932] font-bold">•</span>
                      <span>Zero PCI burden: payment credentials are never handled by your server.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E87932] font-bold">•</span>
                      <span>Card stored safely for automated 1-click balance billing at project completion.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E87932] font-bold">•</span>
                      <span>Flexible financing options (Klarna &amp; Splitit) surface automatically for eligible buyers.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(3)}
                      className="w-full text-xs border-white/20 text-white hover:bg-white/10 h-9"
                    >
                      View Final Invoice Settlement
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Roofing Installation &amp; City Sign-off
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Austin, TX · Project #ROOF-2026-081
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
                  Work Completed: 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[#E87932] font-semibold">Stage 01</div>
                  <div className="font-bold text-white">Old Roof Tear-off</div>
                  <div className="text-white/60 text-[11px]">32 squares cleanly removed</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[#E87932] font-semibold">Stage 02</div>
                  <div className="font-bold text-white">Underlayment</div>
                  <div className="text-white/60 text-[11px]">Synthetic ice &amp; water shield</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[#E87932] font-semibold">Stage 03</div>
                  <div className="font-bold text-white">GAF Shingles</div>
                  <div className="text-white/60 text-[11px]">Architectural Weathered Wood</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-emerald-400 font-semibold">Final Sign-off</div>
                  <div className="font-bold text-white">City Inspection</div>
                  <div className="text-white/60 text-[11px]">Passed Austin code inspection</div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(3)}
                  className="bg-[#E87932] hover:bg-[#E87932]/90 text-white font-semibold text-xs h-9 px-5"
                >
                  Proceed to Final Balance Billing
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Final Balance Settlement (Whop Invoices API)
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Calculate remaining project balance and execute invoice collection.
                  </p>
                </div>
                <span className="text-xs font-semibold text-white/70 bg-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
                  Whop Invoices API
                </span>
              </div>

              {/* Statement breakdown */}
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
                <div className="font-bold text-white text-sm">Project Balance Breakdown</div>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Total Project Contract Value</span>
                    <span className="font-semibold text-white">$7,800.00 USD</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5 text-emerald-400">
                    <span>Less Initial Project Deposit (Paid via Whop)</span>
                    <span className="font-semibold">-$500.00 USD</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold text-white">
                    <span>Remaining Balance Due</span>
                    <span className="text-[#E87932] text-base">$7,300.00 USD</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-white/60">
                  {invoiceStatus === "charged" ? (
                    <span className="text-emerald-400 font-semibold">
                      Payment Confirmed: $7,300.00 settled via stored card on file.
                    </span>
                  ) : invoiceStatus === "created" ? (
                    <span>Invoice generated ({invoiceId}). Ready to charge card on file.</span>
                  ) : (
                    <span>Click below to generate the final invoice on Whop.</span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {invoiceStatus === "idle" && (
                    <Button
                      onClick={handleCreateInvoice}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-10 px-5"
                    >
                      1. Generate Invoice via Whop API
                    </Button>
                  )}

                  {invoiceStatus === "creating" && (
                    <Button disabled className="w-full sm:w-auto bg-white/20 text-white text-xs h-10 px-5">
                      Processing with Whop API...
                    </Button>
                  )}

                  {invoiceStatus === "created" && (
                    <Button
                      onClick={handleChargeCardOnFile}
                      className="w-full sm:w-auto bg-[#E87932] hover:bg-[#E87932]/90 text-white text-xs font-semibold h-10 px-5"
                    >
                      2. Charge Stored Card on File ($7,300)
                    </Button>
                  )}

                  {invoiceStatus === "charged" && (
                    <span className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
                      Invoice $7,300.00 Paid in Full
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
