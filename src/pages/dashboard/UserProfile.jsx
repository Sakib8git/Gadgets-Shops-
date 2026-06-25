import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

export default function UserProfile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <DashboardLayout type="user">
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold flex items-center justify-center shrink-0">
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              : initials
            }
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">
              {user?.displayName || 'No name set'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {user?.emailVerified ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">

          {error && (
            <div role="alert" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {saved && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-xl">
              ✓ Profile updated successfully
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Account Created
            </label>
            <input
              type="text"
              value={user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : '—'}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
            />
          </div>

          <button type="submit" disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
