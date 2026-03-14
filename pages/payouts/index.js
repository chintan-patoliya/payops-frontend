import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatusBadge from '../../components/StatusBadge';
import Link from 'next/link';
import { getPayouts, getVendors } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

export default function PayoutsPage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', vendor_id: '' });

  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [filters]);

  const fetchVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data.data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    }
  };

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.vendor_id) params.vendor_id = filters.vendor_id;
      const res = await getPayouts(params);
      setPayouts(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          {user?.role === 'OPS' && (
            <Link
              href="/payouts/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Create Payout
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-44 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Vendor</label>
              <select
                name="vendor_id"
                value={filters.vendor_id}
                onChange={handleFilterChange}
                className="block w-44 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">All Vendors</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : payouts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No payouts found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.map((payout) => (
                  <tr key={payout._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payout.vendor_id?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                      ₹{payout.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.mode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={payout.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/payouts/${payout._id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
