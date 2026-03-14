import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Define all navigation links with role requirements
  const allNavLinks = [
    { href: '/payouts', label: 'Payouts', roles: ['OPS', 'FINANCE'] },
    { href: '/payouts/create', label: 'Create Payout', roles: ['OPS'] },
    { href: '/vendors', label: 'Vendors', roles: ['OPS', 'FINANCE'] },
    { href: '/vendors/create', label: 'Add Vendor', roles: ['OPS'] },
  ];

  // Filter navigation links based on user role
  const navLinks = allNavLinks.filter(link => 
    !user || link.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link href="/payouts" className="text-xl font-bold text-indigo-600">
                PayOps
              </Link>
              <div className="hidden md:flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      router.pathname === link.href
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user?.email}{' '}
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  user?.role === 'OPS' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role}
                </span>
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
