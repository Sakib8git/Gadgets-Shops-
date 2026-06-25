import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

// Shows the currently logged-in user as a placeholder.
// When the backend is live, replace this with a real API call.
export default function AdminUsers() {
  const { user } = useAuth();

  const mockUsers = [
    {
      id: user?.uid || '1',
      name: user?.displayName || 'You',
      email: user?.email || '—',
      role: 'Admin',
      joined: user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString()
        : '—',
      verified: user?.emailVerified ?? false,
    },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Customer', joined: '2026-06-10', verified: true },
    { id: '3', name: 'Marcus Lee',    email: 'marcus@example.com', role: 'Customer', joined: '2026-06-15', verified: true },
    { id: '4', name: 'Priya Patel',   email: 'priya@example.com',  role: 'Customer', joined: '2026-06-18', verified: false },
    { id: '5', name: 'James Carter',  email: 'james@example.com',  role: 'Customer', joined: '2026-06-20', verified: true },
  ];

  return (
    <DashboardLayout type="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {mockUsers.length} registered users
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">User</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {mockUsers.map((u) => {
                  const initials = u.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.role === 'Admin'
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{u.joined}</td>
                      <td className="px-5 py-3">
                        {u.verified
                          ? <span className="text-green-600 dark:text-green-400 text-xs font-medium">✓ Yes</span>
                          : <span className="text-gray-400 text-xs">✗ No</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
