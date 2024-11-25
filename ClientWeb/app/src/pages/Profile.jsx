import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import { useTheme } from "../components/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { LogOut, User, MapPin, Phone, Loader2, Save, X, Edit2, ArrowLeft } from "lucide-react";
import { message, Image } from "antd";
import config from "../config";
import axios from "axios";

import "../styles/HoverProductIMG.css";

const Profile = () => {
	const { user, logout } = useAuth();
	const { theme } = useTheme();
	const navigate = useNavigate();
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

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(config.apiPath + "/user/info", {
        method: "GET",
        headers: {
          Authorization: token,
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

	useEffect(() => {
		fetchProfileData();
	}, [navigate, logout]);

	const handleBack = () => {
		navigate(-1); // Goes back to previous page
	};

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

	const handleSave = async () => {
		try {
			const token = localStorage.getItem("token");
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

      if (isChangeImg) {
        editForm.profile = await handleImgUpload();
        editForm.deleteIMG = true;
      } else {
        editForm.profile = profileData.profile;
        editForm.deleteIMG = false;
      }

			const response = await fetch(config.apiPath + "/user/clientUpdate", {
				method: "PUT",
				headers: {
					Authorization: token,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: profileData.id,
					name: profileData.name,
					address: editForm.address,
					phone: editForm.phone,
          profile: editForm.profile,
          deleteIMG: editForm.deleteIMG,
				}),
        
			});

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}

			const data = await response.json();
			setProfileData(data.result);
      setIsChangeImg(false);
			setIsEditing(false);
      fetchProfileData();
			message.success("Profile updated successfully");
		} catch (error) {
			console.error("Error updating profile:", error);
			message.error(error.message || "Failed to update profile");
		}
	};

	const selectedFile = (inputFile) => {
		if (inputFile !== undefined && inputFile.length > 0) {
			setImg(inputFile[0]);
		}
	};

  const handleImgUpload = async () => {
		try {
			if (!img) return "noIMGFile";
			const formData = new FormData();
			formData.append("img", img);

      console.log([...formData.entries()]);

			const result = await axios.post(config.apiPath + "/user/uploadProfile", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: localStorage.getItem("token"),
				},
			});

			if (result.data.newName !== undefined) {
				return result.data.newName;
			}
		} catch (e) {
			console.error("Error uploading profile image:", e);
			message.error(e.message || "Failed to upload profile image");
			return "noIMGFile";
		}
	};

	if (!user) {
		navigate("/signin");
		return null;
	}

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
		<div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-200">
			<div className="w-full max-w-lg mx-auto bg-white dark:bg-background-secondary-dark rounded-lg shadow-lg transition-colors duration-200">
				{/* Header Section */}
				<div className="p-6 border-b border-gray-200 dark:border-none">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							{/* Title */}
							<div className="order-last sm:order-first">
								<h1 className="text-xl font-bold text-text-dark dark:text-text-light text-center sm:text-left">Profile Information</h1>
							</div>

							{/* Grouped Buttons */}
							<div className="flex items-center justify-end gap-2 order-first sm:order-last">
								{/* Back Button */}
								<button
									onClick={handleBack}
									className="flex items-center gap-2 px-3 py-1.5 bg-gray-400 text-white rounded-md 
                         hover:bg-gray-500 active:bg-gray-600 
                         focus:outline-none transition-colors text-sm">
									<ArrowLeft className="w-4 h-4" />
									Back
								</button>

								{/* Edit/Save Buttons */}
								{isEditing ? (
									<>
										<button
											onClick={handleSave}
											className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md 
                             hover:bg-blue-700 active:bg-blue-800 
                             focus:outline-none transition-colors text-sm">
											<Save className="w-4 h-4" />
											Save
										</button>
										<button
											onClick={handleCancel}
											className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-md 
                             hover:bg-gray-600 active:bg-gray-700 
                             focus:outline-none transition-colors text-sm">
											<X className="w-4 h-4" />
											Cancel
										</button>
									</>
								) : (
									<>
										<button
											onClick={handleEdit}
											className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md 
                             hover:bg-blue-700 active:bg-blue-800 
                             focus:outline-none transition-colors text-sm">
											<Edit2 className="w-4 h-4" />
											Edit
										</button>
										<button
											onClick={logout}
											className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-white rounded-md 
                             hover:bg-primary-hover active:bg-primary-active 
                             focus:outline-none transition-colors text-sm">
											<LogOut className="w-4 h-4" />
											Sign Out
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Profile Content */}
				<div className="p-6">
					<div className="space-y-6">
						{/* Profile Picture */}
						<div className="flex justify-center">
							{!isChangeImg ? (
								<div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
									{profileData.profile && profileData.profile !== "noIMGFile" ? (
                    <div class={isEditing ? 'containerIMG items-center justify-center' : ''} onClick={() => {if(isEditing) setIsChangeImg(true)}}>
											<Image width={112} height={112} src={config.apiPath + "/uploads/user_img/" + profileData.profile} className="rounded-full" preview={false}/>
											{isEditing && <div class="middle textIMG rounded-full w-fit h-fit">
												<i className="fas fa-trash-alt"></i>
												<div>Click to Change</div>
											</div>}
										</div>
									) : (
										<div class={isEditing ? 'containerIMG' : ''} onClick={() => {if(isEditing) setIsChangeImg(true)}}>
											<User className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 dark:text-gray-300" />
											{isEditing && <div class="middle textIMG rounded-full w-fit h-fit">
												<i className="fas fa-trash-alt"></i>
												<div>Click to Change</div>
											</div>}
										</div>
									)}
								</div>
							) : (
								<div>
									<label class="block text-sm text-gray-500 dark:text-gray-300">
										Select profile image
									</label>
									<input
										type="file"
                    ref={refImg}
										class="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
                    onChange={(e) => {selectedFile(e.target.files);}}
									/>
                  <div className="flex justify-center mt-2">
                  </div>
								</div>
							)}
						</div>

						{/* Profile Details */}
						<div className="space-y-4">
							{/* Name */}
							<div className="flex items-start gap-3">
								<User className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-dark dark:text-text-light" />
								<div>
									<p className="text-sm text-gray-500">Name</p>
									<p className="font-medium text-text-dark dark:text-text-light">{profileData?.name || "Not provided"}</p>
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
										<p className="font-medium text-text-dark dark:text-text-light">{profileData?.phone || "Not provided"}</p>
									)}
								</div>
							</div>
              <button className="btn btn-block"></button>
							{/* Account Type */}
							<div className="p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
								<p className="text-sm text-gray-500 mb-2">Account Type</p>
								<span
									className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                  ${
						profileData?.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
					} transition-colors duration-200`}>
									{profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : "Unknown"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
