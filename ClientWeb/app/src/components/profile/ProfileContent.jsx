import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { LogOut, User, MapPin, Phone, Loader2, Save, X, Edit2, Eye, EyeOff } from "lucide-react";
import { message, Image } from "antd";
import config from "../../config";
import axios from "axios";
import Dialog from '../layout/Dialog';

const ProfileContent = ({ onBack }) => {
    const { user, logout, getAuthToken, refreshUserData } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangeImg, setIsChangeImg] = useState(false);
    const [img, setImg] = useState(null);
    const refImg = useRef();
    const [editForm, setEditForm] = useState({
        address: "",
        phone: "",
        profile: null,
    });

    // Password change state
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [changePasswordForm, setChangePasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    // Existing useEffect and handlers...
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = getAuthToken();
                if (!token) return;

                const response = await fetch(config.apiPath + "/user/info", {
                    method: "GET",
                    headers: {
                        Authorization: token.replace('Bearer ', ''),
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        message.error("Session expired. Please sign in again.");
                        logout();
                        return;
                    }
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfileData(data.result);
                setEditForm({
                    address: data.result.address || "",
                    phone: data.result.phone || "",
                    profile: data.result.profile || null,
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                message.error(error.message || "Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [getAuthToken, logout]);

    // Password change handlers
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setChangePasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
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

            // Verify current password
            if (changePasswordForm.currentPassword !== profileData.password) {
                message.error("Current password is incorrect");
                return;
            }

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

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = getAuthToken();
                if (!token) return;

                const response = await fetch(config.apiPath + "/user/info", {
                    method: "GET",
                    headers: {
                        Authorization: token.replace('Bearer ', ''),
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        message.error("Session expired. Please sign in again.");
                        logout();
                        return;
                    }
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfileData(data.result);
                setEditForm({
                    address: data.result.address || "",
                    phone: data.result.phone || "",
                    profile: data.result.profile || null,
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                message.error(error.message || "Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [getAuthToken, logout]);

    const handleEdit = () => {
        setIsEditing(true);
        setImg(null);
        if (refImg.current) {
            refImg.current.value = "";
        }
    };

    const handleCancel = () => {
        setEditForm({
            address: profileData.address || "",
            phone: profileData.phone || "",
        });
        setIsChangeImg(false);
        setIsEditing(false);
    };

    const selectedFile = (inputFile) => {
        if (inputFile && inputFile.length > 0) {
            setImg(inputFile[0]);
        }
    };

    const handleImgUpload = async () => {
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

    const handleSave = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

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
                newProfileImage = await handleImgUpload();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
                    <p className="text-text-dark dark:text-text-light">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-background-secondary-dark rounded-lg shadow-lg transition-colors duration-200">
            <div className="p-6">
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex justify-center">
                        {!isChangeImg ? (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                                {profileData.profile && profileData.profile !== "noIMGFile" ? (
                                    <div className={isEditing ? 'containerIMG' : ''} onClick={() => { if (isEditing) setIsChangeImg(true) }}>
                                        <Image
                                            src={`${config.apiPath}/uploads/user_img/${profileData.profile}`}
                                            className="img-circle elevation-2"
                                            preview={false}
                                        />
                                        {isEditing && (
                                            <div className="middle textIMG rounded-full w-fit h-fit">
                                                <i className="fas fa-trash-alt"></i>
                                                <div>Click to Change</div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={isEditing ? 'containerIMG' : ''} onClick={() => { if (isEditing) setIsChangeImg(true) }}>
                                        <User className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 dark:text-gray-300" />
                                        {isEditing && (
                                            <div className="middle textIMG rounded-full w-fit h-fit">
                                                <i className="fas fa-trash-alt"></i>
                                                <div>Click to Change</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-300">
                                    Select profile image
                                </label>
                                <input
                                    type="file"
                                    ref={refImg}
                                    className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                                    onChange={(e) => selectedFile(e.target.files)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md 
                    hover:bg-blue-700 active:bg-blue-800 
                    focus:outline-none transition-colors text-sm"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-md 
                    hover:bg-gray-600 active:bg-gray-700 
                    focus:outline-none transition-colors text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md 
                  hover:bg-blue-700 active:bg-blue-800 
                  focus:outline-none transition-colors text-sm"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-dark dark:text-text-light" />
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-text-dark dark:text-text-light">
                                    {profileData?.name || "Not provided"}
                                </p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-dark dark:text-text-light" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Address</p>
                                {isEditing ? (
                                    <textarea
                                        value={editForm.address}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600
                      dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100
                      text-sm"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="font-medium text-text-dark dark:text-text-light">
                                        <p>{profileData?.address || "Not provided"}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-dark dark:text-text-light" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Phone</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        maxLength={10}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600
                      dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100
                      text-sm"
                                    />
                                ) : (
                                    <p className="font-medium text-text-dark dark:text-text-light">
                                        {profileData?.phone || "Not provided"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Account Type */}
                        <div className="p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">Account Type</p>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                  ${profileData?.role === "admin"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                                    } transition-colors duration-200`}
                            >
                                {profileData?.role
                                    ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)
                                    : "Unknown"}
                            </span>
                        </div>

                        {/* Cart Information */}
                        {profileData?.cartQty !== undefined && (
                            <div className="p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Items in Cart</p>
                                        <p className="font-medium text-text-dark dark:text-text-light">
                                            {profileData.cartQty}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Cart Total</p>
                                        <p className="font-medium text-text-dark dark:text-text-light">
                                            ${profileData.cartTotal?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password Change Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-medium mb-4 text-text-dark dark:text-text-light">Password Settings</h2>
                        <button
                            onClick={() => setIsChangePasswordModalOpen(true)}
                            className="px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary-hover active:bg-primary-active focus:outline-none"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

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

export default ProfileContent;