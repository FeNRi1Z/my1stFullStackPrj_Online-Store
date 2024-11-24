import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Phone, Loader2 } from 'lucide-react';
import { message } from 'antd';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await fetch('http://localhost:3002/user/info', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            message.error('Session expired. Please sign in again.');
            logout();
            return;
          }
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data.result);
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error(error.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, logout]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  console.log(profileData)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
          <p className="text-text-dark dark:text-text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto bg-white dark:bg-background-secondary-dark rounded-lg shadow-lg p-8 transition-colors duration-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-dark dark:text-text-light transition-colors duration-200">
            Profile Information
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-white rounded-md 
                       hover:bg-primary-hover active:bg-primary-active 
                       focus:outline-none transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
              <User className="w-16 h-16 text-gray-400 dark:text-gray-300" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-text-dark dark:text-text-light transition-colors duration-200">
              <User className="w-5 h-5" />
              <div>
                <p className="text-sm text-text-disabled">Name</p>
                <p className="font-medium">{profileData?.name || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-text-dark dark:text-text-light transition-colors duration-200">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm text-text-disabled">Address</p>
                <p className="font-medium whitespace-pre-line">
                  {profileData?.address || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-text-dark dark:text-text-light transition-colors duration-200">
              <Phone className="w-5 h-5" />
              <div>
                <p className="text-sm text-text-disabled">Phone</p>
                <p className="font-medium">{profileData?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-background-dark rounded-lg transition-colors duration-200">
              <p className="text-sm text-text-disabled mb-1">Account Type</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                ${profileData?.role === 'admin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                } transition-colors duration-200`}
              >
                {profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;