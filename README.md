# PayOps — Frontend

> Payout Operations Management frontend built with **Next.js 14**, **React 18**, **Tailwind CSS**, and **Axios** for API integration.

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

| Technology    | Version | Purpose                    |
|--------------|---------|----------------------------|
| Node.js      | >=18.0.0 | Runtime                   |
| Next.js      | 14.2.4  | React framework (Pages Router) |
| React        | ^18.3.1 | UI library                 |
| React DOM    | ^18.3.1 | React rendering            |
| Tailwind CSS | ^3.4.4  | Utility-first styling      |
| Axios        | ^1.7.2  | HTTP client                |
| PostCSS      | ^8.4.38 | CSS processing             |
| Autoprefixer | ^10.4.19| CSS vendor prefixes        |
| Context API  | Built-in| Auth state management      |

---

## Project Structure

```
payops-frontend/
├── components/
│   ├── Layout.js              # App layout with navigation & user info
│   ├── Loader.js              # Reusable loading component (full-screen & inline)
│   ├── ProtectedRoute.js      # Auth guard for protected pages
│   └── StatusBadge.js         # Payout status badge component
├── constants/
│   ├── index.js               # Status enums, colors, routes, API endpoints
│   └── messages.js            # Error, success, UI text, tooltips, demo credentials
├── context/
│   └── AuthContext.js          # Authentication context (login, logout, user state)
├── pages/
│   ├── _app.js                # App wrapper with AuthProvider
│   ├── index.js               # Root redirect (→ /payouts or /login)
│   ├── login.js               # Login page with custom validation & password toggle
│   ├── vendors/
│   │   ├── index.js           # Vendor list page
│   │   └── create.js          # Add vendor form with custom validation
│   └── payouts/
│       ├── index.js           # Payout list with filters (status, vendor)
│       ├── create.js          # Create payout form with custom validation
│       └── [id].js            # Payout detail + audit trail + action buttons
├── services/
│   └── api.js                 # Axios instance + CORS handling + API functions
├── styles/
│   └── globals.css            # Tailwind imports
├── .env.example               # Environment variable template
├── .gitignore
├── next.config.js             # Next.js config with static export option
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0 (LTS recommended)
- **npm** >= 9.0.0 (comes with Node.js)
- **PayOps Backend** running (see [payops-backend](https://github.com/<your-username>/payops-backend))

**Check your versions:**
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

**Recommended versions for development:**
- Node.js: 18.x LTS or 20.x LTS
- npm: 9.x or 10.x

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

## Code Organization

### Constants & Messages

All constants and static messages are centralized in the `constants/` directory:

**`constants/index.js`** - Application constants:
- `PAYOUT_STATUSES`: Draft, Submitted, Approved, Rejected
- `PAYMENT_MODES`: UPI, IMPS, NEFT
- `USER_ROLES`: OPS, FINANCE
- `AUDIT_ACTIONS`: CREATED, SUBMITTED, APPROVED, REJECTED
- `STATUS_COLORS`: Tailwind classes for status badges
- `API_ENDPOINTS`: All API endpoint paths
- `ROUTES`: Frontend route paths

**`constants/messages.js`** - All user-facing text:
- `ERROR_MESSAGES`: Validation and API error messages
- `SUCCESS_MESSAGES`: Success feedback messages
- `UI_TEXT`: All UI labels, buttons, tooltips, loading states
- `DEMO_CREDENTIALS`: Demo user credentials

**Usage Example:**
```javascript
import { ERROR_MESSAGES, UI_TEXT } from '../constants/messages';

// Validation
if (!email) return ERROR_MESSAGES.EMAIL_REQUIRED;

// UI Text
<button>{UI_TEXT.LOGIN_BUTTON}</button>
```

### Custom Form Validation

All forms use custom JavaScript validation instead of browser defaults:

**Features:**
- Field-level error messages below inputs
- Real-time validation on blur
- Error clearing on input change
- Red borders for invalid fields
- Tooltips on all form fields
- No page reload on validation errors

**Implemented in:**
- Login page: Email and password validation
- Vendor form: Name and IFSC validation
- Payout form: Vendor selection and amount validation

### Loader Component

Reusable loading indicator with two modes:

**Full-screen mode:**
```javascript
<Loader fullScreen text="Signing in..." />
```

**Inline mode:**
```javascript
<Loader text="Loading..." />
```

Used consistently across all pages for loading states.

---

## Pages & Features

### Login Page (`/login`)

- Email + password form with custom validation
- Password visibility toggle (eye icon)
- Field-level error messages (no browser defaults)
- Error messages auto-dismiss after 8 seconds
- Form values preserved on error (no page reload)
- Full-screen loader during sign-in
- Demo credentials displayed for convenience
- Auto-redirects to `/payouts` if already logged in
- Tooltips on all form fields

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
- "Create Payout" button visible to **all authenticated users**
- Click any row to view details

### Create Payout (`/payouts/create`)

- **Both OPS and FINANCE roles** can create payouts
- Form: Vendor (dropdown), Amount, Mode (UPI/IMPS/NEFT), Note
- Custom validation with field-level error messages
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
7. On 401 response: 
   - If on login page: show error (no redirect to avoid reload)
   - If on other pages: auto-logout and redirect to `/login`

### CORS Handling

The API service (`services/api.js`) handles CORS intelligently:

**Development:**
- Backend allows all localhost and local network IPs
- Supports multiple ports (3000, 8080, etc.)
- Works with `http://192.168.x.x:port` for testing on devices

**Production:**
- Backend only allows configured frontend URL
- Strict origin checking for security

---

## Role-Based UI

The frontend conditionally renders UI elements based on user role:

- **OPS users** see: Submit button on Draft payouts
- **FINANCE users** see: Approve/Reject buttons on Submitted payouts
- **Both roles** can: Create payouts, View all payouts, View all vendors, Create vendors

> **Important:** All role restrictions are enforced **server-side**. The frontend role-based UI is purely for UX — even if bypassed, the backend will reject unauthorized actions.

---

## Deployment

### Option 1: AWS Amplify (Recommended for AWS)

AWS Amplify provides automatic builds and deployments for Next.js applications.

**Steps:**

1. **Push code to GitHub/GitLab/Bitbucket**

2. **Go to AWS Amplify Console**
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"

3. **Connect repository**
   - Select your Git provider
   - Authorize and select your repository
   - Choose the branch (e.g., `main`)

4. **Configure build settings**
   - Amplify auto-detects Next.js
   - Default build settings should work:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Add environment variables**
   - Go to "Environment variables" section
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`

6. **Deploy**
   - Click "Save and deploy"
   - Amplify will build and deploy automatically
   - You'll get a URL like: `https://main.xxxxx.amplifyapp.com`

7. **Custom domain (Optional)**
   - Go to "Domain management"
   - Add your custom domain
   - Follow DNS configuration steps

**Cost:** Free tier includes 1000 build minutes/month and 15 GB served/month

---

### Option 2: AWS S3 + CloudFront (Static Export)

For a fully static deployment with CDN.

**Steps:**

1. **Export Next.js as static site**
   
   Update `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   module.exports = nextConfig
   ```

2. **Build the static site**
   ```bash
   npm run build
   # Creates 'out' directory with static files
   ```

3. **Create S3 Bucket**
   - Go to [S3 Console](https://s3.console.aws.amazon.com/)
   - Create bucket (e.g., `payops-frontend`)
   - Uncheck "Block all public access"
   - Enable "Static website hosting" in bucket properties

4. **Upload files**
   ```bash
   aws s3 sync out/ s3://payops-frontend --delete
   ```

5. **Set bucket policy** (make public)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::payops-frontend/*"
       }
     ]
   }
   ```

6. **Create CloudFront Distribution**
   - Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
   - Create distribution
   - Origin domain: Select your S3 bucket
   - Default root object: `index.html`
   - Create custom error response: 404 → /404.html

7. **Update environment variable**
   - Since it's static, set `NEXT_PUBLIC_API_URL` before build
   - Or use `.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

**Cost:** S3 storage (~$0.023/GB) + CloudFront data transfer (~$0.085/GB for first 10TB)

---

### Option 3: Vercel (Easiest)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = your deployed backend URL
4. Deploy

---

### Manual Build (Local/VPS)

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
