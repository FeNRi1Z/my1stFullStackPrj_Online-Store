import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthProvider';
import config from '../config';

/**
 * Custom hook for managing user profile operations
 * @returns {Object} Profile management methods and state
 */

export const useProfile = () => {
    const { getAuthToken, logout, refreshUserData } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangeImg, setIsChangeImg] = useState(false);
    const [editForm, setEditForm] = useState({
        address: "",
        phone: "",
        profile: null,
    });

    const fetchProfileData = useCallback(async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`${config.apiPath}/user/info`, {
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
    }, [getAuthToken, logout]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const handleEdit = () => {
        setIsEditing(true);
        setIsChangeImg(false);
    };

    const handleCancel = () => {
        setEditForm({
            address: profileData.address || "",
            phone: profileData.phone || "",
            profile: profileData.profile || null,
        });
        setIsChangeImg(false);
        setIsEditing(false);
    };

      /**
     * Handles profile image upload to server
     * @param {File} file - Image file to be uploaded
     * @returns {Promise<string>} New image name or 'noIMGFile' if upload fails
     */

    const handleImageUpload = async (file) => {
        try {
            if (!file) return "noIMGFile";
            const formData = new FormData();
            formData.append("img", file);

            const token = getAuthToken();
            const result = await axios.post(`${config.apiPath}/user/uploadProfile`, formData, {
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

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const result = await handleImageUpload(file);
            setEditForm(prev => ({
                ...prev,
                profile: result
            }));
            setIsChangeImg(false);
            await refreshUserData();
            await fetchProfileData(); // Fetch updated data after image change
        }
    };

    const handleSave = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("No authentication token found");
            }
            /* Validate address and phone number format */
            if (!editForm.address) {
                message.error("Invalid address!");
                return;
            }
            if (!editForm.phone || editForm.phone.length !== 10 || editForm.phone[0] !== "0" || isNaN(editForm.phone)) {
                message.error("Invalid phone!");
                return;
            }

            const response = await fetch(`${config.apiPath}/user/clientUpdate`, {
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
                    profile: editForm.profile || profileData.profile,
                    deleteIMG: isChangeImg,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            setProfileData(data.result);
            await refreshUserData();
            await fetchProfileData(); // Fetch updated data after save

            setIsChangeImg(false);
            setIsEditing(false);
            message.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            message.error(error.message || "Failed to update profile");
        }
    };

    return {
        profileData,
        isEditing,
        editForm,
        loading,
        isChangeImg,
        setIsChangeImg,
        handleEdit,
        handleCancel,
        handleSave,
        handleImageChange,
        handleImageUpload,
        setEditForm,
        fetchProfileData,
    };
};