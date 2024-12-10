import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import { message } from "antd";
import config from "../config";

/**
 * Custom hook for managing user profile data
 * @returns {Object} Profile data state and operations
 * @returns {Object} profileData - The user's profile information
 * @returns {Function} setProfileData - Function to update profile data
 * @returns {boolean} loading - Loading state indicator
 * @returns {Function} fetchProfileData - Function to refresh profile data
 */
export const useProfileData = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getAuthToken, logout } = useAuth();

    const fetchProfileData = useCallback(async () => {
        try {
            const token = getAuthToken();
            // Exit early if no auth token is available
            if (!token) return;

            const response = await fetch(`${config.apiPath}/user/info`, {
                method: "GET",
                headers: {
                    Authorization: token.replace('Bearer ', ''),
                    "Content-Type": "application/json",
                },
            });

            // Handle auth and error
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
            return data.result;
        } catch (error) {
            console.error("Error fetching profile:", error);
            message.error(error.message || "Failed to load profile data");
        } finally {
            setLoading(false);
        }
    }, [getAuthToken, logout]);

    // Fetch profile data
    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    return { profileData, setProfileData, loading, fetchProfileData };
};