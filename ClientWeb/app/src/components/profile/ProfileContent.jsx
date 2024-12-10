import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { message } from "antd";
import Dialog from '../layout/Dialog';
import config from "../../config";
import { ProfilePicture } from './ProfilePicture';
import { ProfileDetails } from './ProfileDetails';
import { ProfileHeader } from './ProfileHeader';
import { AccountTypeSection } from "../profile/AccountTypeSection";
import { CartInfoSection } from "../profile/CartInfoSection";
import { PasswordSection } from "../profile/PasswordSection";
import { PasswordChangeForm } from "../profile/PasswordChangeForm";
import { usePasswordChange } from "../../hooks/usePasswordChange";
import { useProfileData } from "../../hooks/useProfileData";
import { validatePasswordForm , validateForm } from '../../hooks/validateFormUtilities'
import { Loader2 } from "lucide-react";
import axios from "axios";

/**
 * ProfileContent Component
 * Manages user profile data, editing capabilities, and password changes
 * Includes profile picture management, personal details, account type,
 * cart information, and password modification functionality
 */

const ProfileContent = () => {
    const { logout, getAuthToken, refreshUserData } = useAuth();
    const { profileData, loading, fetchProfileData } = useProfileData();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangeImg, setIsChangeImg] = useState(false);
    const [img, setImg] = useState(null);
    const [editForm, setEditForm] = useState({
        address: "",
        phone: "",
        profile: null,
    });
    const navigate = useNavigate();
    const location = useLocation();
    const passwordState = usePasswordChange();

    useEffect(() => {
        if (profileData) {
            setEditForm({
                address: profileData.address || "",
                phone: profileData.phone || "",
                profile: profileData.profile || null,
            });
        }
    }, [profileData]);

    const handlePasswordChange = async () => {
        try {
            const errors = validatePasswordForm(passwordState.changePasswordForm);
            if (Object.keys(errors).length > 0) {
                Object.values(errors).forEach(error => message.error(error));
                return;
            }

            if (!profileData?.id) {
                message.error("User ID not found. Please try refreshing the page.");
                return;
            }

            const response = await fetch(`${config.apiPath}/user/clientUpdate`, {
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
                    password: passwordState.changePasswordForm.newPassword
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update password");
            }

            passwordState.resetPasswordState();
            passwordState.setIsChangePasswordModalOpen(false);
            message.success("Password changed successfully");

        } catch (error) {
            console.error("Error changing password:", error);
            message.error("Failed to change password. Please try again.");
        }
    };

    const handleBack = () => {
        // If we came from another page, go back to it
        if (location.state?.from) {
            navigate(location.state.from);
        } else if (location.state?.previousView) {
            // If we have a previous view to return to
            navigate(`/orders`, { state: { initialView: location.state.previousView } });
        } else {
            // Default to homepage if no specific return path
            navigate('/');
        }
    };

    const handleSave = async () => {
        try {
            if (!validateForm(editForm)) return;

            let newProfileImage = profileData.profile;
            if (isChangeImg && img) {
                const formData = new FormData();
                formData.append("img", img);

                try {
                    const result = await axios.post(
                        `${config.apiPath}/user/uploadProfile`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: getAuthToken().replace('Bearer ', ''),
                            },
                        }
                    );
                    newProfileImage = result.data.newName || "noIMGFile";
                } catch (error) {
                    console.error("Error uploading profile image:", error);
                    message.error("Failed to upload profile image");
                    return;
                }
            }

            const response = await fetch(`${config.apiPath}/user/clientUpdate`, {
                method: "PUT",
                headers: {
                    Authorization: getAuthToken().replace('Bearer ', ''),
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

            await fetchProfileData();
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
            <ProfileHeader
                isEditing={isEditing}
                handleBack={handleBack}
                handleEdit={() => setIsEditing(true)}
                handleSave={handleSave}
                handleCancel={() => {
                    setEditForm({
                        address: profileData.address || "",
                        phone: profileData.phone || "",
                    });
                    setIsChangeImg(false);
                    setIsEditing(false);
                }}
                logout={logout}
            />

            <div className="p-6">
                <div className="space-y-6">
                    <ProfilePicture
                        profile={profileData.profile}
                        isEditing={isEditing}
                        isChangeImg={isChangeImg}
                        setIsChangeImg={setIsChangeImg}
                        handleImageChange={(e) => setImg(e.target.files[0])}
                    />

                    <ProfileDetails
                        isEditing={isEditing}
                        profileData={profileData}
                        editForm={editForm}
                        setEditForm={setEditForm}
                    />

                    <AccountTypeSection role={profileData?.role} />

                    {profileData?.cartQty !== undefined && (
                        <CartInfoSection
                            cartQty={profileData.cartQty}
                            cartTotal={profileData.cartTotal}
                        />
                    )}

                    <PasswordSection
                        passwordState={passwordState}
                        handlePasswordChange={handlePasswordChange}
                    />
                </div>
            </div>

            <Dialog
                isOpen={passwordState.isChangePasswordModalOpen}
                onClose={() => {
                    passwordState.setIsChangePasswordModalOpen(false);
                    passwordState.resetPasswordState();
                }}
            >
                <PasswordChangeForm
                    passwordState={passwordState}
                    handlePasswordChange={handlePasswordChange}
                />
            </Dialog>
        </div>
    );
};

export default ProfileContent;