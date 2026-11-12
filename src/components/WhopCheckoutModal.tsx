import { useEffect, useState } from "react";
import { WhopElements, Checkout, CheckoutElement, ExpressCheckoutElement, BrandingElement } from "@whop/elements-react";
import { loadWhop } from "@whop/elements";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { trackWhopEvent } from "@/lib/whop-tracker";
import { WHOP_CONFIG } from "@/lib/whop-config";

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

export function WhopCheckoutModal({ open, onOpenChange, product }: WhopCheckoutModalProps) {
  const [completed, setCompleted] = useState(false);
  const [elementsInstance, setElementsInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setElementsInstance(loadWhop());
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-border shadow-2xl">
        <div className="bg-[#10243A] text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E87932] flex items-center gap-1.5">
              <ShieldCheck size={16} /> Whop Secure Checkout
            </span>
            <Badge variant="outline" className="border-white/20 text-white bg-white/10 text-xs">
              {product.isDeposit ? "Card-on-File Setup" : "Official Whop Payment"}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold font-display text-white">{product.title}</DialogTitle>
          <DialogDescription className="text-white/80 text-sm mt-1">{product.description}</DialogDescription>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{product.formattedPrice}</span>
            <span className="text-xs text-white/60">USD · Flat-rate via Whop Payments</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {completed ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Checkout Completed!</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Thank you! Your payment method has been verified through Whop. Our Austin operations team will contact you within 2 business hours.
              </p>
              <Button onClick={() => onOpenChange(false)} className="mt-4 bg-[#10243A] text-white hover:bg-[#10243A]/90">
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-md p-3 text-xs text-amber-900 flex items-center gap-2">
                <Lock size={14} className="shrink-0 text-[#E87932]" />
                <span>
                  <strong>Whop Payment Elements:</strong> Apple Pay, Google Pay, Cards, and flexible financing (Klarna / Splitit) powered directly by Whop.
                </span>
              </div>

              {/* WHOP PAYMENT ELEMENTS MOUNT */}
              {elementsInstance && product.checkoutConfigId && (
                <div className="whop-elements-container border border-border/80 rounded-lg p-4 bg-background min-h-[220px]">
                  <WhopElements elements={elementsInstance}>
                    <Checkout
                      checkoutConfiguration={product.checkoutConfigId}
                      onComplete={(res) => {
                        console.log("[Whop Checkout Complete]", res);
                        setCompleted(true);
                      }}
                    >
                      <div className="space-y-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Express Wallets
                        </div>
                        <ExpressCheckoutElement />
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-1">
                          Card & Buy Now, Pay Later
                        </div>
                        <CheckoutElement />
                        <div className="pt-2">
                          <BrandingElement />
                        </div>
                      </div>
                    </Checkout>
                  </WhopElements>
                </div>
              )}

              {/* Direct Hosted Checkout Link Fallback */}
              {product.purchaseUrl && (
                <div className="pt-2 text-center">
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

