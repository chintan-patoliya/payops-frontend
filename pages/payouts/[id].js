import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatusBadge from '../../components/StatusBadge';
import { getPayoutById, submitPayout, approvePayout, rejectPayout } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

export default function PayoutDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [payout, setPayout] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    if (id) fetchPayout();
  }, [id]);

  const fetchPayout = async () => {
    try {
      setLoading(true);
      const res = await getPayoutById(id);
      setPayout(res.data.data.payout);
      setAudits(res.data.data.audits);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payout details');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      let res;
      switch (action) {
        case 'submit':
          res = await submitPayout(id);
          setSuccess('Payout submitted successfully');
          break;
        case 'approve':
          res = await approvePayout(id);
          setSuccess('Payout approved successfully');
          break;
        case 'reject':
          if (!rejectReason.trim()) {
            setError('Rejection reason is required');
            setActionLoading(false);
            return;
          }
          res = await rejectPayout(id, rejectReason);
          setSuccess('Payout rejected');
          setShowRejectInput(false);
          setRejectReason('');
          break;
        default:
          break;
      }
      await fetchPayout();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} payout`);
    } finally {
      setActionLoading(false);
    }
  };

  const canSubmit = user?.role === 'OPS' && payout?.status === 'Draft';
  const canApprove = user?.role === 'FINANCE' && payout?.status === 'Submitted';
  const canReject = user?.role === 'FINANCE' && payout?.status === 'Submitted';

  const auditActionColors = {
    CREATED: 'bg-blue-100 text-blue-800',
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Loader />
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!payout) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center py-12">
            <p className="text-gray-500">Payout not found</p>
            <button onClick={() => router.push('/payouts')} className="mt-4 text-indigo-600 hover:underline">
              Back to Payouts
            </button>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => router.push('/payouts')}
                className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
              >
                ← Back to Payouts
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Payout Details</h1>
            </div>
            <StatusBadge status={payout.status} />
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          {/* Payout Details Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Vendor</p>
                <p className="text-sm text-gray-900 mt-1">{payout.vendor_id?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Amount</p>
                <p className="text-sm text-gray-900 mt-1 font-mono">₹{payout.amount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Payment Mode</p>
                <p className="text-sm text-gray-900 mt-1">{payout.mode}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <div className="mt-1"><StatusBadge status={payout.status} /></div>
              </div>
              {payout.note && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Note</p>
                  <p className="text-sm text-gray-900 mt-1">{payout.note}</p>
                </div>
              )}
              {payout.decision_reason && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Rejection Reason</p>
                  <p className="text-sm text-red-700 mt-1">{payout.decision_reason}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Created At</p>
                <p className="text-sm text-gray-900 mt-1">{new Date(payout.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Updated At</p>
                <p className="text-sm text-gray-900 mt-1">{new Date(payout.updated_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Vendor Payment Details */}
            {payout.vendor_id && (payout.vendor_id.upi_id || payout.vendor_id.bank_account) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Vendor Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {payout.vendor_id.upi_id && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">UPI ID</p>
                      <p className="text-sm text-gray-900 mt-1">{payout.vendor_id.upi_id}</p>
                    </div>
                  )}
                  {payout.vendor_id.bank_account && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Bank Account</p>
                      <p className="text-sm text-gray-900 mt-1">{payout.vendor_id.bank_account}</p>
                    </div>
                  )}
                  {payout.vendor_id.ifsc && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">IFSC</p>
                      <p className="text-sm text-gray-900 mt-1">{payout.vendor_id.ifsc}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {(canSubmit || canApprove || canReject) && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                {canSubmit && (
                  <button
                    onClick={() => handleAction('submit')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ? 'Processing...' : 'Submit for Approval'}
                  </button>
                )}
                {canApprove && (
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                )}
                {canReject && !showRejectInput && (
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>

              {/* Reject Reason Input */}
              {showRejectInput && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="Enter reason for rejection"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                    </button>
                    <button
                      onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audit Trail */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h2>
            {audits.length === 0 ? (
              <p className="text-sm text-gray-500">No audit records found.</p>
            ) : (
              <div className="space-y-4">
                {audits.map((audit, index) => (
                  <div key={audit._id || index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        audit.action === 'CREATED' ? 'bg-blue-500' :
                        audit.action === 'SUBMITTED' ? 'bg-yellow-500' :
                        audit.action === 'APPROVED' ? 'bg-green-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          auditActionColors[audit.action] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {audit.action}
                        </span>
                        <span className="text-sm text-gray-600">
                          by <strong>{audit.performed_by_user_id?.email || 'Unknown'}</strong>
                          {audit.performed_by_user_id?.role && (
                            <span className="text-gray-400"> ({audit.performed_by_user_id.role})</span>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(audit.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
