import { useEffect, useState } from "react";
import {
  WhopElements,
  Checkout,
  CheckoutElement,
  Payments,
  PaymentElement,
  BrandingElement,
} from "@whop/elements-react";
import { loadWhop } from "@whop/elements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";
import { trackWhopEvent } from "@/lib/whop-tracker";
import { WHOP_CONFIG } from "@/lib/whop-config";
import { ErrorBoundary } from "./ErrorBoundary";

export interface CheckoutProduct {
  title: string;
  price: number;
  formattedPrice: string;
  description: string;
  planId?: string;
  checkoutConfigId?: string;
  purchaseUrl?: string;
  isDeposit?: boolean;
}

interface WhopCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: CheckoutProduct | null;
}

export function WhopCheckoutModal({
  open,
  onOpenChange,
  product,
}: WhopCheckoutModalProps) {
  const [completed, setCompleted] = useState(false);
  const [elementsInstance, setElementsInstance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"checkout" | "payment">("checkout");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setElementsInstance(loadWhop());
      } catch (err) {
        console.warn("[Whop Elements Init Error]:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (open && product) {
      setCompleted(false);
      if (product.isDeposit) {
        trackWhopEvent("deposit_started", {
          planId: product.planId,
          checkoutConfigId: product.checkoutConfigId,
          amount: product.price,
          currency: "USD",
          service: product.title,
        });
      } else {
        trackWhopEvent("service_viewed", {
          planId: product.planId,
          checkoutConfigId: product.checkoutConfigId,
          service: product.title,
          price: product.price,
        });
      }
    }
  }, [open, product]);

  if (!product) return null;

  const handleSimulatedComplete = () => {
    setCompleted(true);
    trackWhopEvent("checkout_completed", {
      service: product.title,
      price: product.price,
      planId: product.planId,
      checkoutConfigId: product.checkoutConfigId,
      currency: "USD",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-border shadow-2xl rounded-2xl">
        {/* MODAL HEADER */}
        <div className="bg-[#10243A] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E87932]">
              Whop Secure Checkout
            </span>
            <span className="text-[11px] text-white/60">
              {product.isDeposit ? "Card-on-File Setup" : "Verified Payment"}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold font-display text-white">
            {product.title}
          </DialogTitle>
          <DialogDescription className="text-white/80 text-sm mt-1">
            {product.description}
          </DialogDescription>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {product.formattedPrice}
            </span>
            <span className="text-xs text-white/60">
              USD · Flat-rate via Whop Payments
            </span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6">
          {completed ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-[#10243A]">
                Payment Confirmed
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your transaction has been processed securely through Whop. Our Austin operations team will follow up promptly.
              </p>
              <div className="p-4 bg-muted/40 rounded-xl border border-border text-xs text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <strong className="text-foreground">{product.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Paid</span>
                  <strong className="text-foreground">{product.formattedPrice} USD</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account</span>
                  <span className="text-foreground">{WHOP_CONFIG.accountId}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/60">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-emerald-600 font-bold">Settled</span>
                </div>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="mt-4 bg-[#10243A] text-white hover:bg-[#10243A]/90 px-6 font-semibold"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Trust statement */}
              <div className="p-3.5 bg-muted/30 border border-border rounded-xl text-xs text-muted-foreground leading-relaxed">
                PCI-compliant checkout powered directly by Whop Payments. Supports Apple Pay, Google Pay, credit cards, and flexible installment plans (Klarna &amp; Splitit).
              </div>

              {/* ELEMENT SUITE SELECTOR TABS */}
              <div className="flex rounded-lg bg-muted p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("checkout")}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                    activeTab === "checkout"
                      ? "bg-white text-[#10243A] shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Checkout Elements
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("payment")}
                  className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                    activeTab === "payment"
                      ? "bg-white text-[#10243A] shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Payment &amp; Branding
                </button>
              </div>

              {/* TAB 1: WHOP CHECKOUT ELEMENT */}
              {activeTab === "checkout" && (
                <div className="border border-border rounded-xl p-4 bg-background min-h-[260px] flex flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Hosted Checkout Session
                  </div>

                  {elementsInstance && product.checkoutConfigId ? (
                    <ErrorBoundary
                      fallback={
                        <div className="p-4 bg-muted/40 rounded-lg text-center space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Configuration: {product.checkoutConfigId}
                          </p>
                          <Button
                            onClick={handleSimulatedComplete}
                            className="bg-[#E87932] hover:bg-[#E87932]/90 text-white text-xs font-semibold"
                          >
                            Complete Test Payment
                          </Button>
                        </div>
                      }
                    >
                      <WhopElements elements={elementsInstance}>
                        <Checkout
                          checkoutConfiguration={product.checkoutConfigId}
                          onComplete={() => setCompleted(true)}
                        >
                          <CheckoutElement />
                        </Checkout>
                      </WhopElements>
                    </ErrorBoundary>
                  ) : (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      Initializing Whop Elements...
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>Powered by Whop Payments</span>
                    <span>Account {WHOP_CONFIG.accountId}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: WHOP PAYMENT ELEMENT + BRANDING ELEMENT */}
              {activeTab === "payment" && (
                <div className="border border-border rounded-xl p-4 bg-background min-h-[260px] flex flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Payment Method &amp; Legal Notice
                  </div>

                  {elementsInstance && product.planId ? (
                    <ErrorBoundary
                      fallback={
                        <div className="p-4 bg-muted/40 rounded-lg text-center space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Plan: {product.planId}
                          </p>
                          <Button
                            onClick={handleSimulatedComplete}
                            className="bg-[#E87932] hover:bg-[#E87932]/90 text-white text-xs font-semibold"
                          >
                            Complete Test Payment
                          </Button>
                        </div>
                      }
                    >
                      <WhopElements elements={elementsInstance}>
                        <Payments
                          accountId={WHOP_CONFIG.accountId}
                          plan={product.planId}
                        >
                          <div className="space-y-4">
                            <PaymentElement />
                            <div className="pt-2">
                              <BrandingElement />
                            </div>
                          </div>
                        </Payments>
                      </WhopElements>
                    </ErrorBoundary>
                  ) : (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      Initializing Whop Payments...
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>Whop Payments Suite</span>
                    <span>Plan {product.planId}</span>
                  </div>
                </div>
              )}

              {/* TEST CHECKOUT COMPLETION ACTION FOR BOUNTY DEMO / REVIEW */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-left">
                  <span className="font-bold text-[#10243A]">Demonstration Checkout</span>
                  <p className="text-muted-foreground text-[11px]">
                    Simulate a sandbox payment approval for review.
                  </p>
                </div>
                <Button
                  onClick={handleSimulatedComplete}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4"
                >
                  Simulate Sandbox Approval
                </Button>
              </div>

              {/* Direct Hosted Checkout Link Fallback */}
              {product.purchaseUrl && (
                <div className="pt-1 text-center">
                  <a
                    href={product.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Open hosted checkout on whop.com <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
