# BN Hospital Enterprise Management System 🏥

A premium, high-fidelity Hospital Management System (HMS) built for modern clinical enterprises. This platform integrates high-end UI/UX (inspired by CarePulse) with robust backend logic to manage clinical, financial, and administrative operations.

## 🚀 Key Features

### 🏢 Clinical Intelligence (Dashboard)
- **Real-time Analytics:** Visual admission trends using Recharts.
- **Enterprise Metrics:** Live tracking of revenue, admissions, and lab throughput.
- **Data Stream:** Automated recent patient intake monitoring.

### 👨‍⚕️ Clinical Operations
- **Consultation Portal:** Comprehensive diagnosis, findings, and prescription interface.
- **Real Prescription Generation:** Automated PDF generation with tax-compliant clinical layouts.
- **Automated Lab Requests:** Diagnostic recommendations automatically trigger pending requests in the Lab module.

### 🧪 Diagnostics & Lab
- **Electronic Test Monitoring:** Full lifecycle tracking from request to result.
- **Diagnostic Reporting:** Real-time result uploading and status transitions (Pending -> Completed).

### 💳 Financial Services (Billing)
- **Enterprise Ledger:** Comprehensive tracking of paid and unpaid invoices.
- **Tax-Compliant Invoices:** Automated PDF generation for clinical settlements and hospital receipts.

### 💊 Pharmacy & Inventory
- **Central Inventory:** Real-time stock monitoring with status alerts (Optimal, Low, Depleted).
- **Restocking System:** One-click inventory updates for pharmaceutical items.

### 👥 Workforce Management
- **HR Dashboard:** Centralized administration of clinical staff and payroll.
- **Secure Onboarding:** Role-based staff registration and database integration.

### 📊 Enterprise Reports
- **Multi-Format Export:** High-fidelity Excel (.xlsx) and CSV exports for all core modules (Patients, Finance, Pharmacy, Staff).

## 🛠️ Technology Stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS (v4), Framer Motion, Lucide-React.
- **Backend:** API Routes, Prisma ORM.
- **Database:** Neon PostgreSQL (Cloud).
- **Utilities:** jsPDF (PDF Generation), XLSX (Spreadsheet Export), Recharts (Analytics).

## 🔒 Security & Roles
- **Admin Approval:** Staff members default to `isApproved: false` until verified by an administrator.
- **Protected Routes:** Middleware-level authentication and access control.

---
*Created with Excellence for BN Hospital Enterprise.*
