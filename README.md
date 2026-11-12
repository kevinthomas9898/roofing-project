# Summit Roofing Co. — Whop Websites Template

A production-ready, reusable website template for US roofing companies built on **Whop Websites** (TanStack Start + Vite on Cloudflare Workers) and deployed live to a verified Whop-hosted domain.

- **Live Deployed URL:** [https://roofing-business-demo.whop.app](https://roofing-business-demo.whop.app) (routes to [https://roofing-business-demo.whop.site](https://roofing-business-demo.whop.site))
- **Registered Whop App:** `Roofing Business Demo` (`app_kpqA6uSE5MOQCv`)
- **Whop Account ID:** `biz_7cssbY71PQfJ99` (Roofind business)
- **GitHub Repository:** [https://github.com/kevinthomas9898/roofing-project](https://github.com/kevinthomas9898/roofing-project)

---

## 🌟 Whop Features Implemented

1. **Whop Payment Elements (Zero Custom Card Forms)**
   - Integrated `@whop/elements-react` and `@whop/elements`.
   - Uses `WhopElements` wrapper, `Checkout`, `CheckoutElement`, `ExpressCheckoutElement` (Apple Pay & Google Pay), and the mandatory `BrandingElement`.
   - Dynamically surfaces Buy Now, Pay Later (BNPL) financing options such as Klarna, Splitit, and card installments for qualified buyers.

2. **Real Products & Checkout Configurations on Whop**
   - **Professional Roof Inspection ($149.00 USD):** One-time inspection fee (`prod_EZQrGmvuweoFU` / `plan_XTj2fOvhwDQJN` / `ch_KK0xYef1ZaPatSp`).
   - **Roofing Project Deposit ($500.00 USD):** High-ticket job lock deposit (`prod_BxKhlSnSktO0p` / `plan_KQCSQRC6VXqjE` / `ch_UbBROzKAljFaAAq`).
   - **Roof Maintenance Tune-Up ($299.00 USD):** Flat-rate preventive service (`prod_tV07Atpfhzh7y` / `plan_tAHQfKL2vuyXC` / `ch_TZyjxQxYnZHSRUE`).
   - **Card-on-File Setup Intent:** Setup mode configuration (`ch_j3qOpmNOe0f5zqI`).

3. **"Request an Estimate" Form Wired to Whop Leads API**
   - Located at `#estimate`.
   - Submits homeowner details (name, email, phone, street address, Central Texas area, service needed, roof age, notes) to `POST /api/lead`, forwarding to Whop's Leads API (`POST https://api.whop.com/api/v1/leads`).
   - Quote requests land directly as actionable leads under Whop Account `biz_7cssbY71PQfJ99`.

4. **Deposit → Job → Final Invoice Workflow (Whop Invoices API)**
   - Interactive live demo section at `#invoice-workflow`.
   - Demonstrates the high-ticket vertical cycle:
     1. Homeowner pays $500 project deposit while storing payment method on file via Setup Intent (`mode: "setup"`).
     2. Roofing crew executes tear-off and GAF architectural roof replacement.
     3. Final remaining balance ($7,300.00) is generated via Whop Invoices API (`POST https://api.whop.com/api/v1/invoices`) and automatically charged to the stored card on file (`POST /api/v1/invoices/{id}/charge`).

5. **Custom Pixel Event Tracking (`whop.track`)**
   - Implements `trackWhopEvent()` using Whop's native tracking SDK:
     - `estimate_requested`: Fires when a customer submits the estimate request form.
     - `service_viewed`: Fires whenever a homeowner views or explores a roofing service card.
     - `deposit_started`: Fires when opening the $500 project deposit checkout modal.
   - Includes a floating **Live Whop Pixel Event Stream Inspector** on the bottom right of the page for real-time verification during reviews and demo recordings.

6. **100% Template Reusability**
   - Centralized metadata in `src/lib/whop-config.ts`.
   - Any roofing contractor can rebrand company name, phone, license, service areas, Whop account ID, product plans, and pricing from a single configuration file without touching layout or structural code.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** TanStack Start / Vite on Cloudflare Workers
- **Deployment:** Whop CLI (`whop apps deploy`)
- **Styling:** Tailwind CSS + custom high-contrast design tokens
- **Icons:** Lucide React
- **Payments:** `@whop/elements-react` + `@whop/elements`

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
# -> http://localhost:3000

# Build for production
npm run build

# Deploy to live Whop-hosted domain
npx whop apps deploy
```

---

## 📋 Submission Checklist

- [x] Live `whop.app` URL: [https://roofing-business-demo.whop.app](https://roofing-business-demo.whop.app)
- [x] Source code on GitHub: [https://github.com/kevinthomas9898/roofing-project](https://github.com/kevinthomas9898/roofing-project)
- [x] Whop Payment Elements with `CheckoutElement`, `ExpressCheckoutElement`, and `BrandingElement`
- [x] Whop Leads API integration on Estimate Request Form
- [x] Whop Invoices API & Setup Intent demo for $7,300 balance billing
- [x] Verified `whop.track` pixel events (`estimate_requested`, `service_viewed`, `deposit_started`)
- [x] 3 real Whop plans ($149 inspection, $500 deposit, $299 flat-rate tune-up)
- [x] Mobile and desktop responsive design
