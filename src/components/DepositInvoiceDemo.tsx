import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  FileText,
  CreditCard,
  CheckCircle,
  Receipt,
  ArrowRight,
  Shield,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { WHOP_CONFIG } from "@/lib/whop-config";
import { trackWhopEvent } from "@/lib/whop-tracker";

interface DepositInvoiceDemoProps {
  onOpenDepositCheckout: () => void;
}

export function DepositInvoiceDemo({ onOpenDepositCheckout }: DepositInvoiceDemoProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [invoiceStatus, setInvoiceStatus] = useState<"idle" | "creating" | "created" | "charged">("idle");
  const [invoiceId, setInvoiceId] = useState<string>("pay_inv_94827103");
  const [paymentMethodId, setPaymentMethodId] = useState<string>("payt_card_on_file_8841");

  const handleCreateInvoice = async () => {
    setInvoiceStatus("creating");
    // Simulate API call to POST https://api.whop.com/api/v1/invoices
    await new Promise((r) => setTimeout(r, 900));
    const newId = "pay_inv_" + Math.random().toString(36).substring(2, 10);
    setInvoiceId(newId);
    setInvoiceStatus("created");

    trackWhopEvent("invoice_created", {
      invoiceId: newId,
      amount: 7300,
      customerEmail: "customer@centraltexas.home",
      account: WHOP_CONFIG.accountId,
    });
  };

  const handleChargeCardOnFile = async () => {
    setInvoiceStatus("creating");
    // Simulate API call to POST https://api.whop.com/api/v1/invoices/{id}/charge
    await new Promise((r) => setTimeout(r, 900));
    setInvoiceStatus("charged");

    trackWhopEvent("invoice_charged", {
      invoiceId,
      amount: 7300,
      paymentMethodId,
      status: "paid",
    });
  };

  return (
    <section className="py-16 bg-[#10243A] text-white" id="invoice-workflow">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-[#E87932] text-white hover:bg-[#E87932] mb-3 px-3 py-1 font-semibold uppercase text-xs tracking-wider">
            High-Ticket Vertical Workflow
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white">
            Deposit → Job → Final Invoice Flow
          </h2>
          <p className="mt-4 text-white/70 text-base md:text-lg">
            Roofing requires capturing a project deposit, holding the card on file via a Whop Setup Intent, and collecting the final balance via the Whop Invoices API.
          </p>
        </div>

        {/* 3 Step Interactive Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* STEP 1 */}
          <div
            onClick={() => setStep(1)}
            className={`cursor-pointer rounded-xl p-6 border transition-all ${
              step === 1
                ? "bg-white/10 border-[#E87932] ring-2 ring-[#E87932]/40"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E87932]">Step 01</span>
              <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-300 bg-emerald-950/40">
                Setup Intent
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard size={18} className="text-[#E87932]" /> $500 Deposit + Card-on-File
            </h3>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Customer locks their project start date. Whop Payment Elements securely stores their card on file without exposing sensitive PAN data.
            </p>
          </div>

          {/* STEP 2 */}
          <div
            onClick={() => setStep(2)}
            className={`cursor-pointer rounded-xl p-6 border transition-all ${
              step === 2
                ? "bg-white/10 border-[#E87932] ring-2 ring-[#E87932]/40"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Step 02</span>
              <Badge variant="outline" className="text-xs border-blue-400 text-blue-300 bg-blue-950/40">
                Crew Active
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-blue-400" /> Roofing Work Execution
            </h3>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Old roof tear-off, decking repairs, synthetic underlayment, and GAF architectural shingles installed. Passed city inspection.
            </p>
          </div>

          {/* STEP 3 */}
          <div
            onClick={() => setStep(3)}
            className={`cursor-pointer rounded-xl p-6 border transition-all ${
              step === 3
                ? "bg-white/10 border-[#E87932] ring-2 ring-[#E87932]/40"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 03</span>
              <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-300 bg-emerald-950/40">
                Invoices API
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt size={18} className="text-emerald-400" /> Final Balance Invoice
            </h3>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Create a final invoice for the remaining balance. Either auto-charge the stored payment method or send for manual homeowner checkout.
            </p>
          </div>
        </div>

        {/* Interactive Workspace Box */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="text-[#E87932]" size={20} />
                    Project Deposit Checkout ($500.00)
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Powered by Whop Payment Elements with Setup Intent mode enabled (`mode: "setup"`).
                  </p>
                </div>
                <Button
                  onClick={onOpenDepositCheckout}
                  className="bg-[#E87932] hover:bg-[#E87932]/90 text-white font-semibold flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <Zap size={16} /> Open Deposit Checkout Elements
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                <div className="bg-black/30 rounded-xl p-5 border border-white/10 space-y-2">
                  <div className="text-[#E87932] font-sans font-bold text-sm mb-2">Whop Setup Intent Payload</div>
                  <div><span className="text-white/50">account_id:</span> "{WHOP_CONFIG.accountId}"</div>
                  <div><span className="text-white/50">plan_id:</span> "{WHOP_CONFIG.products.deposit.planId}"</div>
                  <div><span className="text-white/50">deposit_amount:</span> "$500.00 USD"</div>
                  <div><span className="text-white/50">setup_intent_status:</span> <span className="text-emerald-400">succeeded</span></div>
                  <div><span className="text-white/50">stored_method:</span> "{paymentMethodId}"</div>
                  <div><span className="text-white/50">card_brand:</span> "Visa •••• 4242 (Expires 12/28)"</div>
                </div>

                <div className="bg-black/30 rounded-xl p-5 border border-white/10 space-y-3 font-sans">
                  <h5 className="font-bold text-sm text-white">How this satisfies Whop requirements:</h5>
                  <ul className="space-y-2 text-white/75 text-xs">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Zero PCI Burden:</strong> Card fields are hosted in sandboxed iframes via Whop Elements.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Financing Ready:</strong> Klarna, Splitit, and Affirm appear dynamically for qualified buyers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Pixel Fired:</strong> Triggers <code>whop.track('deposit_started')</code> automatically.</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(3)}
                    className="w-full mt-2 text-xs border-white/20 text-white hover:bg-white/10"
                  >
                    Proceed to Final Invoice Step <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="text-blue-400" size={20} />
                    Project Execution in Progress
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Job Address: 4812 Shoal Creek Blvd, Austin TX 78756 · Job #ROOF-2026-081
                  </p>
                </div>
                <Badge className="bg-blue-600 text-white text-xs px-3 py-1 self-start md:self-auto">
                  Work Completed: 100%
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-black/30 border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={13} /> Day 1</span>
                  <div className="font-semibold text-white">Old Roof Tear-off</div>
                  <div className="text-white/60">32 squares removed &amp; recycled</div>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={13} /> Day 2</span>
                  <div className="font-semibold text-white">Decking &amp; Flashing</div>
                  <div className="text-white/60">Synthetic ice &amp; water shield</div>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={13} /> Day 3</span>
                  <div className="font-semibold text-white">Shingle Installation</div>
                  <div className="text-white/60">Architectural Weathered Wood</div>
                </div>
                <div className="p-4 rounded-lg bg-black/30 border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={13} /> Final</span>
                  <div className="font-semibold text-white">City Final Sign-off</div>
                  <div className="text-white/60">Passed code inspection</div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(3)}
                  className="bg-[#E87932] hover:bg-[#E87932]/90 text-white text-xs font-semibold"
                >
                  Create Final Balance Invoice <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <Receipt className="text-emerald-400" size={20} />
                    Final Balance Invoicing via Whop Invoices API
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    Calculate remaining project balance and execute invoice collection.
                  </p>
                </div>
                <Badge variant="outline" className="border-emerald-400 text-emerald-300 text-xs px-3 py-1 self-start md:self-auto">
                  POST /api/v1/invoices
                </Badge>
              </div>

              {/* Invoice calculation summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <span className="text-xs text-white/60">Total Contract Value</span>
                  <div className="text-2xl font-bold text-white mt-1">$7,800.00</div>
                  <span className="text-[11px] text-white/50">Roof Replacement 32 SQ</span>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <span className="text-xs text-white/60">Deposit Collected (Whop)</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">-$500.00</div>
                  <span className="text-[11px] text-white/50">Paid via Checkout Elements</span>
                </div>
                <div className="bg-[#E87932]/20 border border-[#E87932]/50 rounded-xl p-4">
                  <span className="text-xs text-[#E87932] font-semibold">Remaining Invoice Balance</span>
                  <div className="text-2xl font-bold text-white mt-1">$7,300.00</div>
                  <span className="text-[11px] text-white/70">Due Upon Project Completion</span>
                </div>
              </div>

              {/* Invoice Actions */}
              <div className="p-6 bg-black/40 rounded-xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-white">Whop Invoices API Integration Actions</div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Target Account: <code className="text-[#E87932]">{WHOP_CONFIG.accountId}</code> · Invoice Ref: <code className="text-emerald-400">{invoiceId}</code>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {invoiceStatus === "idle" && (
                      <Button
                        onClick={handleCreateInvoice}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        <FileText size={14} className="mr-1.5" /> 1. Generate Invoice via Whop API
                      </Button>
                    )}

                    {invoiceStatus === "creating" && (
                      <Button disabled className="w-full sm:w-auto bg-white/20 text-white text-xs">
                        <Sparkles className="animate-spin mr-1.5" size={14} /> Communicating with Whop API...
                      </Button>
                    )}

                    {invoiceStatus === "created" && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleChargeCardOnFile}
                          className="bg-[#E87932] hover:bg-[#E87932]/90 text-white text-xs font-semibold"
                        >
                          <Zap size={14} className="mr-1.5" /> 2. Auto-Charge Stored Card (${paymentMethodId.slice(0, 10)}...)
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setInvoiceStatus("charged")}
                          className="border-white/20 text-white hover:bg-white/10 text-xs"
                        >
                          <Send size={14} className="mr-1.5" /> Send Link to Email
                        </Button>
                      </div>
                    )}

                    {invoiceStatus === "charged" && (
                      <Badge className="bg-emerald-500 text-white px-4 py-2 text-xs flex items-center gap-1.5">
                        <CheckCircle size={15} /> Invoice $7,300.00 Paid in Full!
                      </Badge>
                    )}
                  </div>
                </div>

                {/* API Request Log Snippet */}
                <div className="bg-black/60 rounded-lg p-3 text-[11px] font-mono text-white/80 border border-white/5 space-y-1">
                  <div className="text-white/40">// cURL equivalent executing in background:</div>
                  <div>
                    <span className="text-[#E87932]">POST</span> https://api.whop.com/api/v1/invoices
                  </div>
                  <div className="text-white/60">
                    &#123; "account_id": "{WHOP_CONFIG.accountId}", "email": "customer@centraltexas.home", "payment_method_id": "{paymentMethodId}", "amount": 730000 &#125;
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

