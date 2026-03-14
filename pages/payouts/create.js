import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { createPayout, getVendors } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CreatePayoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ vendor_id: '', amount: '', mode: 'UPI', note: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Redirect FINANCE users - only OPS can create payouts
  useEffect(() => {
    if (user && user.role !== 'OPS') {
      router.push('/payouts');
    }
  }, [user, router]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data.data);
    } catch (err) {
      setError('Failed to load vendors');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateField = (name, value) => {
    if (name === 'vendor_id' && !value) {
      return 'Please select a vendor';
    }
    if (name === 'amount') {
      if (!value) {
        return 'Amount is required';
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Amount must be greater than 0';
      }
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};
    errors.vendor_id = validateField('vendor_id', form.vendor_id);
    errors.amount = validateField('amount', form.amount);
    
    const hasErrors = Object.values(errors).some(err => err !== '');
    setFieldErrors(errors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await createPayout({
        ...form,
        amount: parseFloat(form.amount),
      });
      router.push('/payouts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Payout</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor_id"
                value={form.vendor_id}
                onChange={handleChange}
                onBlur={(e) => setFieldErrors({ ...fieldErrors, vendor_id: validateField('vendor_id', e.target.value) })}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  fieldErrors.vendor_id
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                title="Select the vendor for this payout"
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
              {fieldErrors.vendor_id && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.vendor_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                onBlur={(e) => setFieldErrors({ ...fieldErrors, amount: validateField('amount', e.target.value) })}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  fieldErrors.amount
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="0.00"
                title="Enter payout amount (must be greater than 0)"
              />
              {fieldErrors.amount && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                title="Select payment mode"
              >
                <option value="UPI">UPI</option>
                <option value="IMPS">IMPS</option>
                <option value="NEFT">NEFT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Optional note"
                title="Add any additional notes (optional)"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Click to create payout"
              >
                {submitting ? 'Creating...' : 'Create Payout'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/payouts')}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
