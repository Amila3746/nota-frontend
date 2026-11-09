# Nōta Homepage Rebuild — Surge Global Assignment

A pixel-perfect, CMS-powered rebuild of the Nōta homepage, built as part of the Senior Web Developer evaluation for Surge Global.

## ✨ Overview
This project replicates the interactive Nōta homepage experience (https://nota.uprock.pro/) with a fully dynamic architecture. All copy, metadata, specifications, target audience sections, and products are managed through a self-hosted Strapi v5 CMS backend hosted on Railway, ensuring that content updates reflect live on the frontend without requiring a redeployment.

* **Live Frontend URL:** https://nota-frontend-production-9148.up.railway.app/
* **Live Backend / Admin URL:** https://nota-backend-production-708b.up.railway.app/admin

### 🔐 Strapi Admin Test Credentials
To evaluate the CMS dashboard and test content updates, use the following credentials:
* **Email / Username:** `isuru.amila5@gmail.com`
* **Password:** `Nota@12345`

## 🛠️ Tech Stack & Architecture
* **Frontend:** Next.js (App Router), React, Tailwind CSS, GSAP (ScrollTrigger) for fluid animations.
* **Backend / CMS:** Strapi v5 (Self-hosted).
* **Database & Hosting:** Railway (Cloud hosting with persistent storage for media uploads).

---

## 🚀 Repository Structure & Local Setup

This project consists of two separate codebases (Frontend and Backend):

### 1. Backend Setup (Strapi v5)
* **GitHub Repository:** https://github.com/Amila3746/nota-backend.git
* **Deployed Backend URL:** https://nota-backend-production-708b.up.railway.app/

To run locally:
```bash
git clone https://github.com/Amila3746/nota-backend.git
cd nota-backend
npm install
npm run develop
```

### 2. Frontend Setup (Next.js)
* **GitHub Repository:** https://github.com/Amila3746/nota-frontend.git

To run locally:
```bash
git clone https://github.com/Amila3746/nota-frontend.git
cd nota-frontend
npm install
```

Create a `.env.local` file in the root directory of the frontend and add the Strapi API URL:
```env
NEXT_PUBLIC_STRAPI_URL=https://nota-backend-production-708b.up.railway.app
```

Run the frontend development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Content Modeling (Strapi CMS)
The application decouples content from code completely:
* **Homepage (Single Type):** Manages hero title, badge, taglines, manifesto content, specifications items, and "Who it's for" dynamic components.
* **Product (Collection Type):** Manages "Inside the box" items (titles, descriptions, pricing, and promotional discount badges) dynamically.

## ⚖️ Key Trade-offs
* **SSR vs. Client-side Fetching:** Utilized a hybrid data-fetching approach with cache invalidation (`cache: 'no-store'`) to ensure instant content updates from Strapi while maintaining high animation performance with GSAP on the client side.
* **Media Persistence:** Configured Railway storage volumes to ensure uploaded CMS media files survive container redeploys.

## 🤖 AI Tools Used
* **OpenAI / Custom LLM Assistant:** Utilized for rapid boilerplate generation, debugging Railway environment variable formatting issues (`ERR_NAME_NOT_RESOLVED`), and structuring GSAP scroll-triggered animations.

## 📈 What I'd Improve with More Time
* Implement robust form validation and submission handling directly linked to Strapi database collections for the order/checkout flow.
* Add comprehensive end-to-end (E2E) testing using Playwright to verify cross-browser layout stability.