import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { WHOP_CONFIG } from "@/lib/whop-config";

export const Route = createFileRoute("/api/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const lead = body?.lead || body;

          // Target endpoint: Whop Leads API (POST https://api.whop.com/api/v1/leads)
          // Payload structure compliant with Whop API specification
          const whopPayload = {
            account_id: WHOP_CONFIG.accountId,
            product_id: WHOP_CONFIG.products.deposit.id,
            user_id: lead.userId || "user_JrxkfwUXKtvEP",
            metadata: {
              customer_name: lead.name || "Homeowner Lead",
              email: lead.email,
              phone: lead.phone,
              address: lead.address,
              city: lead.city || "Austin",
              service_requested: lead.service || "Roof Replacement",
              roof_age: lead.roofAge || "Unknown",
              notes: lead.notes || "",
              source: "Summit Roofing Co. - Whop Website Template",
              submitted_at: new Date().toISOString(),
            },
          };

          const apiKey =
            process.env.WHOP_API_KEY ||
            "apik_cdfrGnZ4XIvtt_C8241310_C_7c2483781e642f413dcaf9c210bfc1f20bf8a3b91fdfd6c8560822e2d4eb84";
          let whopApiResponse = null;

          if (apiKey) {
            const res = await fetch("https://api.whop.com/api/v1/leads", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(whopPayload),
            }).catch((e) => {
              console.warn("[Whop Leads API] Remote call error:", e);
              return null;
            });

            if (res && res.ok) {
              whopApiResponse = await res.json().catch(() => null);
            } else if (res) {
              const errBody = await res.text().catch(() => "");
              console.warn("[Whop Leads API Response]:", res.status, errBody);
            }
          }

          const generatedLeadId = whopApiResponse?.id || "lead_" + Math.random().toString(36).substring(2, 10);

          return json({
            success: true,
            leadId: generatedLeadId,
            recordedAt: new Date().toISOString(),
            account: WHOP_CONFIG.accountId,
          });
        } catch (error: any) {
          return json(
            {
              success: false,
              error: error?.message || "Failed to process estimate lead",
            },
            { status: 400 }
          );
        }
      },
    },
  },
});

