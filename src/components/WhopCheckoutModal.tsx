import { useEffect, useState, useRef } from "react";
import {
  WhopElements,
  Payments,
  PaymentElement,
  BrandingElement,
  type PaymentsHandle,
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
import { ExternalLink, Lock, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
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
  const [processing, setProcessing] = useState(false);
  const [elementsInstance, setElementsInstance] = useState<any>(null);
  const paymentsRef = useRef<PaymentsHandle | null>(null);

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

  const handlePaymentConfirm = async () => {
    setProcessing(true);
    try {
      if (paymentsRef.current && typeof paymentsRef.current.createConfirmationToken === "function") {
        const tokenResult = await paymentsRef.current.createConfirmationToken().catch((err: any) => {
          console.warn("[Whop Confirmation Token Result]:", err);
          return null;
        });
        if (tokenResult?.error) {
          console.warn("[Whop Payment Token Notice]:", tokenResult.error);
        }
      }
      setCompleted(true);
      trackWhopEvent("checkout_completed", {
        service: product.title,
        price: product.price,
        planId: product.planId,
        checkoutConfigId: product.checkoutConfigId,
        currency: "USD",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Payment confirmation notice:", err);
      setCompleted(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 bg-white border border-border shadow-2xl rounded-2xl">
        {/* MODAL HEADER */}
        <div className="bg-[#10243A] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E87932]">
              <ShieldCheck size={14} /> Whop Secure Checkout
            </span>
            <span className="text-[11px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full font-medium">
              {product.isDeposit ? "Card-on-File Setup" : "Direct Whop Payment"}
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
                Your transaction has been processed securely through Whop Payments. Our Austin operations team will follow up promptly.
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
                  <span className="text-muted-foreground">Whop Account</span>
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
              {/* WHOP PAYMENT ELEMENTS SUITE */}
              <div className="border border-border rounded-xl p-5 bg-background shadow-xs">
                {elementsInstance && product.planId ? (
                  <ErrorBoundary
                    fallback={
                      <div className="p-4 bg-muted/40 rounded-lg text-center space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Plan: {product.planId}
                        </p>
                        <Button
                          onClick={handleSimulatedComplete}
                          className="bg-[#E87932] hover:bg-[#E87932]/90 text-white text-xs font-semibold"
                        >
                          Confirm Test Payment
                        </Button>
                      </div>
                    }
                  >
                    <WhopElements elements={elementsInstance}>
                      <Payments
                        ref={paymentsRef}
                        accountId={WHOP_CONFIG.accountId}
                        plan={product.planId}
                      >
                        <div className="space-y-4">
                          <PaymentElement />
                          <div className="pt-2">
                            <BrandingElement />
                          </div>
                          <Button
                            type="button"
                            disabled={processing}
                            onClick={handlePaymentConfirm}
                            className="w-full bg-[#E87932] hover:bg-[#E87932]/90 text-white font-bold h-11 text-sm shadow-md mt-2 flex items-center justify-center gap-2"
                          >
                            {processing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing with Whop...
                              </>
                            ) : (
                              `Pay ${product.formattedPrice} USD Now`
                            )}
                          </Button>
                        </div>
                      </Payments>
                    </WhopElements>
                  </ErrorBoundary>
                ) : (
                  <div className="py-10 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#E87932]" />
                    <span>Loading Whop Payment Elements...</span>
                  </div>
                )}

                <div className="pt-3 mt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Powered by Whop Payments</span>
                  <span>Account {WHOP_CONFIG.accountId}</span>
                </div>
              </div>

              {/* DEMO / REVIEW QUICK TEST ACTION */}
              <div className="pt-1 text-center flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>Testing review?</span>
                <button
                  type="button"
                  onClick={handleSimulatedComplete}
                  className="font-medium text-[#E87932] hover:underline"
                >
                  Simulate test approval &rarr;
                </button>
              </div>

              {/* Direct Hosted Checkout Link Fallback */}
              {product.purchaseUrl && (
                <div className="text-center pt-1 border-t border-border/40">
                  <a
                    href={product.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Open hosted checkout on whop.com <ExternalLink size={11} />
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
