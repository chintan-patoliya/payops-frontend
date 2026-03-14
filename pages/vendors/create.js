import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { createVendor } from '../../services/api';

export default function CreateVendorPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', upi_id: '', bank_account: '', ifsc: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateField = (name, value) => {
    if (name === 'name' && !value.trim()) {
      return 'Vendor name is required';
    }
    if (name === 'ifsc' && value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
      return 'Invalid IFSC code format (e.g., SBIN0001234)';
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};
    errors.name = validateField('name', form.name);
    errors.ifsc = validateField('ifsc', form.ifsc);
    
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
      await createVendor(form);
      router.push('/vendors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create vendor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Vendor</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={(e) => setFieldErrors({ ...fieldErrors, name: validateField('name', e.target.value) })}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  fieldErrors.name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Enter vendor name"
                title="Enter the vendor's full name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                name="upi_id"
                value={form.upi_id}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="vendor@upi"
                title="Enter UPI ID (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
              <input
                type="text"
                name="bank_account"
                value={form.bank_account}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Account number"
                title="Enter bank account number (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                name="ifsc"
                value={form.ifsc}
                onChange={handleChange}
                onBlur={(e) => setFieldErrors({ ...fieldErrors, ifsc: validateField('ifsc', e.target.value) })}
                className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  fieldErrors.ifsc
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="SBIN0001234"
                title="Enter IFSC code (optional, format: SBIN0001234)"
              />
              {fieldErrors.ifsc && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.ifsc}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Click to create vendor"
              >
                {submitting ? 'Creating...' : 'Create Vendor'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/vendors')}
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
