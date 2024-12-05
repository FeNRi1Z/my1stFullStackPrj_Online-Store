import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { message } from "antd";
import { Loader2 } from 'lucide-react';
import axios from "axios"; 
import config from "../config";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfilePicture } from "../components/profile/ProfilePicture";
import { ProfileDetails } from "../components/profile/ProfileDetails";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, getAuthToken, refreshUserData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangeImg, setIsChangeImg] = useState(false);
  const [img, setImg] = useState(null);
  const [editForm, setEditForm] = useState({
    address: "",
    phone: "",
    profile: null,
  });

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

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImg(e.target.files[0]);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
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
      </div>
    </div>
  );
};

export default Profile;