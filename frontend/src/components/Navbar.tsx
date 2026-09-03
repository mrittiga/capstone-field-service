import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card mx-4 mt-4 px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        FieldSync
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Dashboard
          </Link>
          <Link to="/work-orders" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Work Orders
          </Link>
          <Link to="/customers" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Customers
          </Link>
          <Link to="/sites" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Sites
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium hidden sm:block">
            <span className="text-blue-500">{user?.name}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="glass-button flex items-center gap-2 text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
