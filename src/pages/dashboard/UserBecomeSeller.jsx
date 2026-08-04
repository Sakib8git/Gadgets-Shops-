import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import useSellerStore from '../../store/sellerStore';

const STATUS_UI = {
  pending: {
    icon: '⏳',
    color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
    title: 'Request Pending',
    desc: 'Your seller request is under review. We\'ll notify you once it\'s processed.',
  },
  approved: {
    icon: '✅',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    title: 'You\'re an approved seller!',
    desc: 'Your seller account is active. Go to your Seller Dashboard to start uploading products.',
  },
  rejected: {
    icon: '❌',
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
    title: 'Request Rejected',
    desc: 'Your request was not approved. You can submit a new request with more details.',
  },
};

export default function UserBecomeSeller() {
  const { user, seller } = useAuth();
  const submitRequest  = useSellerStore((s) => s.submitRequest);
  const getRequestByUid = useSellerStore((s) => s.getRequestByUid);
  const rejectRequest  = useSellerStore((s) => s.rejectRequest);

  const existing = getRequestByUid(user?.uid);
  const [shopName, setShopName] = useState('');
  const [reason,   setReason]   = useState('');
  const [errors,   setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Allow re-apply after rejection
  const canApply = !existing || existing.status === 'rejected';

  const validate = () => {
    const e = {};
    if (!shopName.trim()) e.shopName = 'Shop name is required.';
    if (reason.trim().length < 30) e.reason = 'Please write at least 30 characters.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Clear old rejected request before submitting new
    if (existing?.status === 'rejected') {
      rejectRequest(existing.id); // keep it in history but allow new one
    }

    submitRequest({
      uid:      user.uid,
      email:    user.email,
      name:     user.displayName || user.email,
      shopName: shopName.trim(),
      reason:   reason.trim(),
    });
    setSubmitted(true);
  };

  const statusInfo = existing ? STATUS_UI[existing.status] : null;

  return (
    <DashboardLayout type="user">
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Become a Seller</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Apply to sell your products on MyShop. Your request will be reviewed by an admin.
          </p>
        </div>

        {/* Seller already — show link */}
        {seller && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 flex items-center gap-4 mb-6">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">You're already a seller!</p>
              <a href="/seller" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                Go to Seller Dashboard →
              </a>
            </div>
          </div>
        )}

        {/* Status banner */}
        {statusInfo && !submitted && (
          <div className={`border rounded-2xl p-5 flex items-start gap-4 mb-6 ${statusInfo.color}`}>
            <span className="text-2xl mt-0.5">{statusInfo.icon}</span>
            <div>
              <p className="font-semibold">{statusInfo.title}</p>
              <p className="text-sm mt-0.5 opacity-90">{statusInfo.desc}</p>
              {existing?.shopName && (
                <p className="text-xs mt-2 opacity-70">Shop: <strong>{existing.shopName}</strong></p>
              )}
            </div>
          </div>
        )}

        {/* Success after submit */}
        {submitted && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 flex items-start gap-4 mb-6">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">Request submitted!</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                We'll review your application and notify you soon.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {canApply && !submitted && !seller && (
          <form onSubmit={handleSubmit} noValidate
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Shop / Brand Name <span className="text-red-500">*</span>
              </label>
              <input value={shopName} onChange={(e) => { setShopName(e.target.value); setErrors((p) => ({ ...p, shopName: undefined })); }}
                placeholder="e.g. TechGadgets Store"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${errors.shopName ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Why do you want to sell on MyShop? <span className="text-red-500">*</span>
              </label>
              <textarea rows={5} value={reason} onChange={(e) => { setReason(e.target.value); setErrors((p) => ({ ...p, reason: undefined })); }}
                placeholder="Describe your products, experience, and why you'd be a good fit…"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 resize-none ${errors.reason ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
              <div className="flex justify-between mt-1">
                {errors.reason
                  ? <p className="text-red-500 text-xs">{errors.reason}</p>
                  : <span />}
                <span className={`text-xs ${reason.length < 30 ? 'text-gray-400' : 'text-green-500'}`}>
                  {reason.length} / 30 min
                </span>
              </div>
            </div>

            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              Submit Request
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
