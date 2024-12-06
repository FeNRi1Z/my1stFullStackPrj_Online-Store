import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { message } from "antd";
import { Loader2, Eye, EyeOff } from 'lucide-react';
import axios from "axios";
import config from "../config";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfilePicture } from "../components/profile/ProfilePicture";
import { ProfileDetails } from "../components/profile/ProfileDetails";
import Dialog from '../components/layout/Dialog';
import NavBar from '../components/layout/Navbar';
import CartModal from '../components/cart/CartModal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, getAuthToken, refreshUserData } = useAuth();

  // Add new state for cart modal
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Existing state management
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangeImg, setIsChangeImg] = useState(false);
  const [img, setImg] = useState(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState({
    address: "",
    phone: "",
    profile: null,
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch Profile Data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(config.apiPath + "/user/info", {
        headers: {
          Authorization: token.replace('Bearer ', ''),
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      console.log("Fetched Profile Data:", data.result); // Debug log

      if (!data.result.username) {
        console.warn("Username missing from profile data"); // Debug log
      }
      setProfileData(data.result);
      setEditForm({
        address: data.result.address || "",
        phone: data.result.phone || "",
        profile: data.result.profile || null,
      });
    } catch (error) {
      message.error(error.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Profile Image Handling
  const handleImageUpload = async () => {
    try {
      if (!img) return "noIMGFile";
      const formData = new FormData();
      formData.append("img", img);

      const token = getAuthToken();
      const result = await axios.post(config.apiPath + "/user/uploadProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token.replace('Bearer ', ''),
        },
      });

      if (result.data.newName !== undefined) {
        return result.data.newName;
      }
      return "noIMGFile";
    } catch (e) {
      console.error("Error uploading profile image:", e);
      message.error(e.message || "Failed to upload profile image");
      return "noIMGFile";
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImg(e.target.files[0]);
    }
  };

  // Profile Edit Handling
  const handleEdit = () => {
    setIsEditing(true);
    setImg(null);
  };

  const handleCancel = () => {
    setEditForm({
      address: profileData.address || "",
      phone: profileData.phone || "",
    });
    setIsChangeImg(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Validate form data
      if (!editForm.address) {
        message.error("Invalid address!");
        return;
      }
      if (!editForm.phone || editForm.phone.length !== 10 || editForm.phone[0] !== "0" || isNaN(editForm.phone)) {
        message.error("Invalid phone!");
        return;
      }

      let newProfileImage = profileData.profile;
      if (isChangeImg) {
        newProfileImage = await handleImageUpload();
      }

      const response = await fetch(config.apiPath + "/user/clientUpdate", {
        method: "PUT",
        headers: {
          Authorization: token.replace('Bearer ', ''),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: profileData.id,
          name: profileData.name,
          address: editForm.address,
          phone: editForm.phone,
          profile: newProfileImage,
          deleteIMG: isChangeImg,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfileData(data.result);
      await refreshUserData();

      setIsChangeImg(false);
      setIsEditing(false);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.message || "Failed to update profile");
    }
  };

  // Password Change Handling
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!changePasswordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!changePasswordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (changePasswordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!changePasswordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = async () => {
    try {
      const errors = validatePasswordForm();
      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach(error => {
          message.error(error);
        });
        return;
      }

      if (!profileData?.id) {
        message.error("User ID not found. Please try refreshing the page.");
        return;
      }

      // Verify current password by comparing with profile data
      if (changePasswordForm.currentPassword !== profileData.password) {
        message.error("Current password is incorrect");
        return;
      }

      // If verification successful, proceed with password update
      const updateResponse = await fetch(`${config.apiPath}/user/clientUpdate`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthToken().replace('Bearer ', ''),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: profileData.id,
          name: profileData.name,
          address: profileData.address || "",
          phone: profileData.phone || "",
          profile: profileData.profile || null,
          password: changePasswordForm.newPassword
        })
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update password");
      }

      await updateResponse.json();

      setChangePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsChangePasswordModalOpen(false);
      message.success("Password changed successfully");

    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Failed to change password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <NavBar onCartOpen={() => setIsCartOpen(true)} />
      </div>

      {/* Main Content - Adjusted with top padding for fixed navbar */}
      <div className="pt-16 min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-background-secondary-dark rounded-lg shadow-lg">
          <ProfileHeader
            isEditing={isEditing}
            handleBack={() => navigate(-1)}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancel={handleCancel}
            logout={logout}
          />

          <div className="p-6">
            <ProfilePicture
              profile={profileData?.profile}
              isEditing={isEditing}
              isChangeImg={isChangeImg}
              setIsChangeImg={setIsChangeImg}
              handleImageChange={handleImageChange}
            />

            <ProfileDetails
              isEditing={isEditing}
              profileData={profileData}
              editForm={editForm}
              setEditForm={setEditForm}
            />
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">Password Settings</h2>
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary-hover active:bg-primary-active focus:outline-none"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Password Change Dialog */}
      <Dialog
        isOpen={isChangePasswordModalOpen}
        onClose={() => {
          setIsChangePasswordModalOpen(false);
          setChangePasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
          setPasswordVisibility({
            currentPassword: false,
            newPassword: false,
            confirmPassword: false
          });
        }}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={passwordVisibility.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={changePasswordForm.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                {passwordVisibility.currentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={passwordVisibility.newPassword ? "text" : "password"}
                name="newPassword"
                value={changePasswordForm.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                {passwordVisibility.newPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={changePasswordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                {passwordVisibility.confirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setIsChangePasswordModalOpen(false);
                setChangePasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                });
                setPasswordVisibility({
                  currentPassword: false,
                  newPassword: false,
                  confirmPassword: false
                });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary-hover active:bg-primary-active focus:outline-none"
            >
              Change Password
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;