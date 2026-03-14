// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  LOGIN_FAILED: 'Login failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  UNAUTHORIZED: 'You are not authorized to access this page.',
  
  // Validation
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 3 characters',
  
  // Vendor
  VENDOR_NAME_REQUIRED: 'Vendor name is required',
  VENDOR_IFSC_INVALID: 'Invalid IFSC code format (e.g., SBIN0001234)',
  VENDOR_CREATE_FAILED: 'Failed to create vendor',
  VENDOR_LOAD_FAILED: 'Failed to load vendors',
  
  // Payout
  PAYOUT_VENDOR_REQUIRED: 'Please select a vendor',
  PAYOUT_AMOUNT_REQUIRED: 'Amount is required',
  PAYOUT_AMOUNT_INVALID: 'Amount must be greater than 0',
  PAYOUT_CREATE_FAILED: 'Failed to create payout',
  PAYOUT_LOAD_FAILED: 'Failed to fetch payouts',
  PAYOUT_SUBMIT_FAILED: 'Failed to submit payout',
  PAYOUT_APPROVE_FAILED: 'Failed to approve payout',
  PAYOUT_REJECT_FAILED: 'Failed to reject payout',
  
  // General
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  
  // Vendor
  VENDOR_CREATED: 'Vendor created successfully',
  
  // Payout
  PAYOUT_CREATED: 'Payout created successfully',
  PAYOUT_SUBMITTED: 'Payout submitted',
  PAYOUT_APPROVED: 'Payout approved',
  PAYOUT_REJECTED: 'Payout rejected',
};

// UI Text
export const UI_TEXT = {
  // Login
  LOGIN_TITLE: 'PayOps',
  LOGIN_SUBTITLE: 'Payout Operations Management',
  LOGIN_BUTTON: 'Sign In',
  LOGIN_SIGNING_IN: 'Signing in...',
  
  // Navigation
  NAV_VENDORS: 'Vendors',
  NAV_PAYOUTS: 'Payouts',
  NAV_LOGOUT: 'Logout',
  
  // Buttons
  BTN_CREATE: 'Create',
  BTN_CANCEL: 'Cancel',
  BTN_SUBMIT: 'Submit',
  BTN_APPROVE: 'Approve',
  BTN_REJECT: 'Reject',
  BTN_SAVE: 'Save',
  
  // Loading
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  CREATING: 'Creating...',
  
  // Empty States
  NO_VENDORS: 'No vendors found.',
  NO_PAYOUTS: 'No payouts found.',
  
  // Tooltips
  TOOLTIP_EMAIL: 'Enter your email address',
  TOOLTIP_PASSWORD: 'Enter your password (minimum 3 characters)',
  TOOLTIP_VENDOR_NAME: "Enter the vendor's full name",
  TOOLTIP_UPI_ID: 'Enter UPI ID (optional)',
  TOOLTIP_BANK_ACCOUNT: 'Enter bank account number (optional)',
  TOOLTIP_IFSC: 'Enter IFSC code (optional, format: SBIN0001234)',
  TOOLTIP_PAYOUT_VENDOR: 'Select the vendor for this payout',
  TOOLTIP_PAYOUT_AMOUNT: 'Enter payout amount (must be greater than 0)',
  TOOLTIP_PAYOUT_MODE: 'Select payment mode',
  TOOLTIP_PAYOUT_NOTE: 'Add any additional notes (optional)',
  TOOLTIP_SIGN_IN: 'Click to sign in',
  TOOLTIP_CREATE_VENDOR: 'Click to create vendor',
  TOOLTIP_CREATE_PAYOUT: 'Click to create payout',
};

// Demo Credentials
export const DEMO_CREDENTIALS = {
  OPS: {
    email: 'ops@demo.com',
    password: 'ops123',
    role: 'OPS',
  },
  FINANCE: {
    email: 'finance@demo.com',
    password: 'fin123',
    role: 'FINANCE',
  },
};
