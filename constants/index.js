// Payout Statuses
export const PAYOUT_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// Payment Modes
export const PAYMENT_MODES = {
  UPI: 'UPI',
  IMPS: 'IMPS',
  NEFT: 'NEFT',
};

// User Roles
export const USER_ROLES = {
  OPS: 'OPS',
  FINANCE: 'FINANCE',
};

// Audit Actions
export const AUDIT_ACTIONS = {
  CREATED: 'CREATED',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Status Badge Colors
export const STATUS_COLORS = {
  Draft: 'bg-gray-100 text-gray-800',
  Submitted: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

// Audit Action Colors
export const AUDIT_ACTION_COLORS = {
  CREATED: 'bg-blue-100 text-blue-800',
  SUBMITTED: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

// API Endpoints (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  
  // Vendors
  VENDORS: '/vendors',
  VENDOR_BY_ID: (id) => `/vendors/${id}`,
  
  // Payouts
  PAYOUTS: '/payouts',
  PAYOUT_BY_ID: (id) => `/payouts/${id}`,
  PAYOUT_SUBMIT: (id) => `/payouts/${id}/submit`,
  PAYOUT_APPROVE: (id) => `/payouts/${id}/approve`,
  PAYOUT_REJECT: (id) => `/payouts/${id}/reject`,
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  VENDORS: '/vendors',
  VENDORS_CREATE: '/vendors/create',
  PAYOUTS: '/payouts',
  PAYOUTS_CREATE: '/payouts/create',
  PAYOUT_DETAIL: (id) => `/payouts/${id}`,
};
