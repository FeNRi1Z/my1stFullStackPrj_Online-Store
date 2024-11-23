import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Phone } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto bg-white dark:bg-background-secondary-dark rounded-lg shadow-lg p-8 transition-colors duration-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-dark dark:text-text-light transition-colors duration-200">
            Profile Information
          </h1>
          <div className="flex items-center gap-4">

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-white py-3 px-4 rounded-md 
                       hover:bg-primary-hover active:bg-primary-active 
                       focus:outline-none transition-colors rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
              <User className="w-16 h-16 text-gray-400 dark:text-gray-300" />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-center space-x-2 text-text-dark dark:text-text-light transition-colors duration-200">
              <User className="w-5 h-5" />
              <div>
                <p className="text-sm text-text-disabled">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-2 text-text-dark dark:text-text-light transition-colors duration-200">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm text-text-disabled">Address</p>
                <p className="font-medium whitespace-pre-line">
                  {user.address || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-2 text-text-dark dark:text-text-light transition-colors duration-200">
              <Phone className="w-5 h-5" />
              <div>
                <p className="text-sm text-text-disabled">Phone</p>
                <p className="font-medium">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Account Type */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-background-dark rounded-lg transition-colors duration-200">
              <p className="text-sm text-text-disabled mb-1">Account Type</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                ${user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                } transition-colors duration-200`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;