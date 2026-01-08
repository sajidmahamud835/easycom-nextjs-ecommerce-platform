<div align="center">

# 🚀 EasyCom — AI-Powered Next.js E-Commerce Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Sanity CMS](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity)](https://www.sanity.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![AI Recommendations](https://img.shields.io/badge/AI-Recommendations-purple?style=for-the-badge&logo=openai)](./docs/RECOMMENDATION_ENGINE.md)

**A production-ready, full-stack e-commerce platform with AI-powered personalization, built using Next.js 15 App Router, React Server Components, and Sanity CMS.**

> 🤖 **LLM-Optimized Documentation**: This repository is structured for discoverability by AI assistants and language models. See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for technical details.

*🔄 Open Source — Contributions welcome!*

[🌐 Live Demo](https://easycom-opal.vercel.app) · [📖 Documentation](./docs/) · [🐛 Report Bug](https://github.com/sajidmahamud835/easycom-nextjs-ecommerce-platform/issues) · [💡 Request Feature](https://github.com/sajidmahamud835/easycom-nextjs-ecommerce-platform/issues)

</div>

---

## 🤖 AI & Machine Learning Features

This platform implements **next-generation AI-powered commerce** capabilities:

| Feature | Technology | Description |
|---------|------------|-------------|
| **Personalized Recommendations** | GROQ Scoring | Privacy-preserving, real-time product suggestions using behavioral analysis |
| **Implicit Gamification** | Variable Ratio Reinforcement | "Flash Deal Injection" system inspired by social media feed algorithms |
| **Dynamic Pricing** | Price Calculator | Configurable product variants with real-time price computation |

> 📄 **Research**: Read our [Whitepaper on AI Recommendations](./docs/RESEARCH_WHITEPAPER.md) for technical deep-dives.

---

![EasyCom Preview](./public/preview.png)

## 🌟 About The Project

**EasyCom** is an **enterprise-grade, AI-powered e-commerce platform** built with the latest web technologies. It demonstrates production-ready patterns for:

- **Next.js 15 App Router** with React Server Components (RSC)
- **AI-Driven Personalization** without external ML infrastructure
- **Headless CMS Architecture** using Sanity.io
- **Type-Safe Full-Stack Development** with TypeScript
- **Modern Payment Processing** via Stripe

### 🎯 Why EasyCom?

| Problem | EasyCom Solution |
|---------|------------------|
| Complex ML pipelines for recommendations | GROQ-based "Query-Time Inference" with sub-100ms latency |
| Expensive vector databases | Client-side behavioral tracking + server-side scoring |
| Low user engagement | Implicit gamification using variable reward psychology |
| Slow product pages | React Server Components + Edge caching |

### ⚡ Performance Optimizations

EasyCom implements aggressive caching for **blazing-fast guest user experiences**:

| Data Source | Cache Duration | Revalidation Tag |
|-------------|----------------|------------------|
| **Homepage Products** | 1 hour | `products` |
| **Today's Deals** | 15 minutes | `deals` |
| **Trending Products** | 1 hour | `trending` |

**Key Optimizations:**
- ✅ **Sanity CDN Enabled** — Reads go through Sanity's global CDN
- ✅ **Next.js Fetch Caching** — All public queries use `next.revalidate` and `next.tags`
- ✅ **On-Demand Revalidation** — `/api/revalidate` endpoint for Sanity webhooks to purge cache instantly

---

## ✨ Features

### 🟢 Implemented Features

| Category | Features |
|----------|----------|
| **🛍️ Shopping** | Product catalog, categories, brands, advanced search & filters |
| **🛒 Cart & Checkout** | Persistent shopping cart, real-time updates, multi-step checkout |
| **💝 Wishlist** | Save favorites, move to cart functionality |
| **👤 Authentication** | Secure auth via Clerk, social logins, protected routes |
| **📦 Orders** | Order tracking, history, status updates, email notifications |
| **💳 Payments** | Stripe integration, Cash on Delivery support |
| **📱 Responsive** | Mobile-first design, works on all devices |
| **🎨 Modern UI** | Tailwind CSS, Framer Motion animations, shadcn/ui components |
| **⭐ Reviews** | Customer ratings, product reviews |
| **📧 Notifications** | Email confirmations via Nodemailer |
| **📍 Location** | IP-based detection, detailed location selection modal |
| **🔥 Deals** | "Today's Deal" algorithm, time-limited offers |
| **🎫 Support** | Customer Service ticketing system |
| **🎁 Gift Cards** | Purchase and redeem digital gift cards |
| **🏪 Sellers** | Seller onboarding and business account application |

### 🟡 In Progress
- 📊 **Analytics Dashboard** — Comprehensive business insights

### 🔵 Planned Features

- 📝 Review moderation tools
- 📬 Newsletter & email campaigns
- 📈 Advanced customer insights
- 📥 Data export (Excel/CSV)
- 🎨 Custom admin branding
- 🌐 Multi-language support
- 🔔 Push notifications

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm**
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sajidmahamud835/easycom-nextjs-ecommerce-platform.git
   cd easycom-nextjs-ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials (see [Environment Variables](#environment-variables) section below).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```bash
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-11-09
SANITY_API_TOKEN=your_token

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email (Nodemailer)
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

> 💡 See `.env.example` for the complete list of available variables.

---

## 📁 Project Structure

```
easycom/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard routes
│   ├── (auth)/            # Authentication pages
│   ├── (client)/          # Customer-facing routes
│   ├── (public)/          # Public pages
│   └── (user)/            # Protected user routes
├── components/            # React components
├── actions/              # Server actions
├── lib/                  # Utilities & helpers
├── sanity/               # Sanity CMS config
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### Ways to Contribute

| Type | Description |
|------|-------------|
| 🐛 **Bug Reports** | Found a bug? Open an issue with details |
| 💡 **Feature Ideas** | Suggest new features or improvements |
| 🔧 **Code Contributions** | Submit PRs for bug fixes or features |
| 📝 **Documentation** | Improve docs, add examples, fix typos |
| 🎨 **UI/UX** | Design improvements and accessibility |
| 🧪 **Testing** | Add tests, report edge cases |

### Getting Started

1. **Fork the repository**
   
   Click the "Fork" button at [https://github.com/sajidmahamud835/easycom-nextjs-ecommerce-platform](https://github.com/sajidmahamud835/easycom-nextjs-ecommerce-platform)

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/easycom-nextjs-ecommerce-platform.git
   cd easycom-nextjs-ecommerce-platform
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Add tests if applicable

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```
   Then open a PR on GitHub!

### Development Guidelines

- ✅ Use TypeScript for type safety
- ✅ Follow the existing project structure
- ✅ Keep components small and focused
- ✅ Write descriptive commit messages
- ✅ Test your changes before submitting
- ✅ Update documentation as needed

### Good First Issues

Look for issues labeled `good first issue` — these are great for newcomers!

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Next.js API Routes, Server Actions |
| **Database/CMS** | Sanity.io |
| **Authentication** | Clerk |
| **Payments** | Stripe |
| **Email** | Nodemailer |
| **Deployment** | Vercel |

---

## ⚡ Performance Changelog

| Date | Description | Impact | Author |
|------|-------------|--------|--------|
| 2026-01-05 | Optimized HomeBanner to only prioritize the first image, reducing LCP and bandwidth usage. | High (LCP) | Bolt |


## 📚 Research & Architecture

We believe in documenting not just the code, but the engineering philosophy behind it.

*   **[Whitepaper: Deterministic Personalized Recommendation Engine](./docs/RESEARCH_WHITEPAPER.md)**
    *   *Abstract*: How we achieved sub-100ms latency for personalized recommendations using GROQ scoring instead of vector databases, prioritizing privacy and minimizing infrastructure costs.

## 🚀 Feature Changelog

| Date | Description | Status |
|------|-------------|--------|
| 2026-01-08 | **Hidden Jackpot**: Gamification system with "Flash Deal Injection". | ✅ Released |
| 2026-01-08 | **Bug Fix**: Resolved critical 404 error on Single Product Pages (Cache Collision). | ✅ Fixed |
| 2026-01-08 | **Gift Card System**: Full purchase and redemption flow with Stripe integration. | ✅ Released |
| 2026-01-08 | **Seller Onboarding**: Dedicated page for new sellers to apply (`/sell`). | ✅ Released |
| 2026-01-07 | **Customer Service**: Ticketing system for support inquiries. | ✅ Released |
| 2026-01-07 | **Today's Deals**: Dynamic "Hot Deals" section with algorithmic selection. | ✅ Released |
| 2026-01-06 | **Location Services**: IP-based detection and manual location picker. | ✅ Released |
| 2026-01-06 | **Dynamic Categories**: Fetched directly from Sanity CMS with "All" dropdown. | ✅ Released |
| 2026-01-05 | **Track My Product**: Real-time order tracking replacement for Registry. | ✅ Released |

## 🛡️ Security Changelog

| Date | Description | Severity | Author |
|------|-------------|----------|--------|
| 2025-01-31 | Fixed IDOR vulnerability in user access request API. | Critical | Sentinel |

## ⚡ Performance Changelog

| Date | Description | Impact | Author |
|------|-------------|----------|--------|
| 2026-01-03 | Optimized AdSense script loading strategy from `beforeInteractive` to `afterInteractive` to prevent hydration blocking and improve TTI/TBT. | High | Bolt |

## 📜 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm run typegen   # Generate Sanity types
npm test          # Run automated tests
```

---

## 🧪 Testing

The project uses `jest` and `@testing-library` for automated testing.

### Complex Logic Tests
We maintain rigorous tests for critical business logic, specifically:
-   **Points Calculation**: Complex scenarios for reward and loyalty points allocation, including:
    -   tiered thresholds
    -   diminishing returns logic
    -   milestone tracking

Results are archived in [test-results.txt](./test-results.txt).

---

## 🤝 Related Projects

Explore other components of the research portfolio:

1.  **[BankSync](https://github.com/sajidmahamud835/banksync)** - Secure financial management platform, sharing security principles with EasyCom.
2.  **[InspectHealth](https://github.com/sajidmahamud835/inspecthealth)** - Healthcare platform demonstrating similar high-compliance user data handling.
3.  **[Shopping Cost Calculator](https://github.com/sajidmahamud835/shopping-cost-calculator-js)** - A fundamental utility for calculating shopping baskets, evolved into the full checkout logic here.

---

## 📄 License

This project is open for educational purposes. See the repository for more details.

---

## 👨‍💻 Author

**Sajid Mahamud**

- GitHub: [@sajidmahamud835](https://github.com/sajidmahamud835)
- Portfolio: [sajidmahamud835.github.io](https://sajidmahamud835.github.io/)

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [Next.js](https://nextjs.org/) — React framework
- [Sanity](https://www.sanity.io/) — Headless CMS
- [Clerk](https://clerk.com/) — Authentication
- [Stripe](https://stripe.com/) — Payments
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Framer Motion](https://www.framer.com/motion/) — Animations

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

*Made with ❤️ by [Sajid Mahamud](https://github.com/sajidmahamud835)*

</div>
