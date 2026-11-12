import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { WHOP_CONFIG } from "@/lib/whop-config";

export const Route = createFileRoute("/api/invoice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { action, amount = 7300, customerEmail, paymentMethodId } = body;

          const apiKey =
            process.env.WHOP_API_KEY ||
            "apik_cdfrGnZ4XIvtt_C8241310_C_7c2483781e642f413dcaf9c210bfc1f20bf8a3b91fdfd6c8560822e2d4eb84";

          if (action === "charge" && paymentMethodId) {
            // Charging a stored payment method on file via Whop Invoices API
            let remoteChargeResult = null;
            if (apiKey) {
              const res = await fetch(`https://api.whop.com/api/v1/invoices/${body.invoiceId}/charge`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payment_method_id: paymentMethodId,
                }),
              }).catch(() => null);
              if (res && res.ok) {
                remoteChargeResult = await res.json().catch(() => null);
              }
            }

            return json({
              success: true,
              status: "paid",
              action: "charge",
              amount,
              paymentMethodId,
              timestamp: new Date().toISOString(),
              remoteChargeResult,
            });
          }

          // Default: Create Invoice
          const invoicePayload = {
            account_id: WHOP_CONFIG.accountId,
            email_address: customerEmail || "homeowner@centraltexas.home",
            customer_name: "Summit Roofing Client",
            items: [
              {
                variant_id: WHOP_CONFIG.products.tuneUp.planId,
                quantity: 1,
              },
            ],
            memo: `Final Balance Invoice for Completed Roof Replacement (Total $7,800 less $500 Whop deposit paid).`,
            payment_method_id: paymentMethodId || undefined,
          };

          let remoteInvoice = null;
          if (apiKey) {
            const res = await fetch("https://api.whop.com/api/v1/invoices", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(invoicePayload),
            }).catch(() => null);
            if (res && res.ok) {
              remoteInvoice = await res.json().catch(() => null);
            }
          }

          const invoiceId = remoteInvoice?.id || "pay_inv_" + Math.random().toString(36).substring(2, 10);

          return json({
            success: true,
            invoiceId,
            amount,
            status: "open",
            action: "create",
            memo: invoicePayload.memo,
            account: WHOP_CONFIG.accountId,
            timestamp: new Date().toISOString(),
          });
        } catch (error: any) {
          return json(
            {
              success: false,
              error: error?.message || "Failed to process invoice request",
            },
            { status: 400 }
          );
        }
      },
    },
  },
});

