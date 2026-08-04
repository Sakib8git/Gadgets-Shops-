import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useSellerStore from '../../store/sellerStore';

const statusBadge = {
  pending:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

export default function AdminSellerRequests() {
  const requests       = useSellerStore((s) => s.requests);
  const approveRequest = useSellerStore((s) => s.approveRequest);
  const rejectRequest  = useSellerStore((s) => s.rejectRequest);
  const [filter, setFilter] = useState('all');
  const [toast,  setToast]  = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter);

  const handleApprove = (id) => {
    approveRequest(id);
    showToast('✅ Seller approved!');
  };

  const handleReject = (id) => {
    rejectRequest(id);
    showToast('❌ Request rejected.');
  };

  const counts = {
    all:      requests.length,
    pending:  requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <DashboardLayout type="admin">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage seller applications.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all',      label: 'Total',    color: 'bg-indigo-50 dark:bg-indigo-900/30' },
            { key: 'pending',  label: 'Pending',  color: 'bg-yellow-50 dark:bg-yellow-900/30' },
            { key: 'approved', label: 'Approved', color: 'bg-green-50 dark:bg-green-900/30'  },
            { key: 'rejected', label: 'Rejected', color: 'bg-red-50 dark:bg-red-900/30'      },
          ].map((s) => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`${s.color} rounded-2xl p-4 text-center border-2 transition-all ${filter === s.key ? 'border-indigo-400' : 'border-transparent'}`}>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts[s.key]}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Requests list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">No {filter === 'all' ? '' : filter} requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {r.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{r.name}</p>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{r.email}</p>
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                        🏪 {r.shopName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Applied {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {r.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleApprove(r.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        ✓ Approve
                      </button>
                      <button onClick={() => handleReject(r.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        ✗ Reject
                      </button>
                    </div>
                  )}
                  {r.status === 'approved' && (
                    <button onClick={() => handleReject(r.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Revoke
                    </button>
                  )}
                </div>

                {/* Reason */}
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Reason
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
