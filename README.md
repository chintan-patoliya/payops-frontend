# PayoutFlow MVP — Frontend

> Payout Management System frontend built with **Next.js 14**, **React 18**, **Tailwind CSS**, and **Axios** for API integration.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Features](#pages--features)
- [Authentication Flow](#authentication-flow)
- [Role-Based UI](#role-based-ui)
- [Deployment](#deployment)

---

## Tech Stack

| Technology    | Purpose                    |
|--------------|----------------------------|
| Next.js 14   | React framework (Pages Router) |
| React 18     | UI library                 |
| Tailwind CSS | Utility-first styling      |
| Axios        | HTTP client                |
| Context API  | Auth state management      |

---

## Project Structure

```
payops-frontend/
├── components/
│   ├── Layout.js              # App layout with navigation & user info
│   ├── ProtectedRoute.js      # Auth guard for protected pages
│   └── StatusBadge.js         # Payout status badge component
├── context/
│   └── AuthContext.js          # Authentication context (login, logout, user state)
├── pages/
│   ├── _app.js                # App wrapper with AuthProvider
│   ├── index.js               # Root redirect (→ /payouts or /login)
│   ├── login.js               # Login page with demo credentials
│   ├── vendors/
│   │   ├── index.js           # Vendor list page
│   │   └── create.js          # Add vendor form
│   └── payouts/
│       ├── index.js           # Payout list with filters (status, vendor)
│       ├── create.js          # Create payout form (OPS only)
│       └── [id].js            # Payout detail + audit trail + action buttons
├── services/
│   └── api.js                 # Axios instance + all API functions
├── styles/
│   └── globals.css            # Tailwind imports
├── .env.example               # Environment variable template
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **PayoutFlow Backend** running (see [payops-backend](https://github.com/<your-username>/payops-backend))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/payops-frontend.git
cd payops-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 5. Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable              | Required | Description                        | Default                    |
|----------------------|----------|------------------------------------|----------------------------|
| `NEXT_PUBLIC_API_URL`| **Yes**  | Backend API base URL               | http://localhost:5000/api  |

---

## Pages & Features

### Login Page (`/login`)

- Email + password form
- Error messages on invalid credentials
- Demo credentials displayed for convenience
- Auto-redirects to `/payouts` if already logged in

### Vendor List (`/vendors`)

- Table of all vendors with name, UPI ID, bank account, IFSC, status
- Link to add new vendor

### Add Vendor (`/vendors/create`)

- Form: Name (required), UPI ID, Bank Account, IFSC
- Validation and error handling
- Success redirect to vendor list

### Payout List (`/payouts`)

- Table: Vendor, Amount, Mode, Status, Created Date
- **Filters:** Status dropdown, Vendor dropdown
- "Create Payout" button visible to **OPS users only**
- Click any row to view details

### Create Payout (`/payouts/create`)

- **OPS role only** (redirects FINANCE users away)
- Form: Vendor (dropdown), Amount, Mode (UPI/IMPS/NEFT), Note
- Creates payout in Draft status

### Payout Detail (`/payouts/[id]`)

- Full payout information display
- Vendor payment details (UPI, bank account, IFSC)
- **Conditional action buttons** based on user role + payout status:

  | User Role | Payout Status | Available Actions       |
  |-----------|---------------|-------------------------|
  | OPS       | Draft         | **Submit for Approval** |
  | FINANCE   | Submitted     | **Approve**, **Reject** |

- Reject action requires a reason (text input)
- **Audit Trail** — chronological history of all actions with:
  - Action type (CREATED, SUBMITTED, APPROVED, REJECTED)
  - Who performed it (email + role)
  - Timestamp
- Success/error feedback messages

---

## Authentication Flow

1. User enters credentials on `/login`
2. Frontend calls `POST /api/auth/login`
3. On success: JWT token + user object stored in `localStorage`
4. `AuthContext` provides `user`, `login()`, `logout()` to all components
5. `ProtectedRoute` component redirects unauthenticated users to `/login`
6. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
7. On 401 response: auto-logout and redirect to `/login`

---

## Role-Based UI

The frontend conditionally renders UI elements based on user role:

- **OPS users** see: Create Payout button, Submit button on Draft payouts
- **FINANCE users** see: Approve/Reject buttons on Submitted payouts
- **Both roles** can: View all payouts, View all vendors, Create vendors

> **Important:** All role restrictions are enforced **server-side**. The frontend role-based UI is purely for UX — even if bypassed, the backend will reject unauthorized actions.

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = your deployed backend URL (e.g., `https://payops-backend.onrender.com/api`)
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

---

## Demo Credentials

| Role    | Email             | Password |
|---------|-------------------|----------|
| OPS     | ops@demo.com      | ops123   |
| FINANCE | finance@demo.com  | fin123   |

---

## License

MIT
