import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
        FieldSync
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm font-medium">
          Welcome, <span className="text-blue-500">{user?.name}</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={handleLogout}
          className="glass-button flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};
