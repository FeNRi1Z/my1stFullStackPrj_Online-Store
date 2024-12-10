import { message } from "antd";

/**
 * Validates password change form data
 * @param {Object} form - The password form object
 * @param {string} form.currentPassword - User's current password
 * @param {string} form.newPassword - Desired new password
 * @param {string} form.confirmPassword - Confirmation of new password
 * @returns {Object} Object containing validation errors
 */
export const validatePasswordForm = (form) => {
    const errors = {};

    // Basic presence checks
    if (!form.currentPassword) {
        errors.currentPassword = "Current password is required";
    }

    // New password validation with length requirement
    if (!form.newPassword) {
        errors.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters";
    }

    // Ensure passwords match
    if (!form.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
    } else if (form.newPassword !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

/**
 * Validates user profile form data
 * @param {Object} form - The profile form object
 * @param {string} form.address - User's address
 * @param {string} form.phone - User's phone number
 * @returns {boolean} True if validation passes, false otherwise
 */
export const validateForm = (form) => {
    // Check for address presence
    if (!form.address) {
        message.error("Invalid address!");
        return false;
    }

    /* 
     * Phone number validation rules:
     * - Must be exactly 10 digits
     * - Must start with '0'
     * - Must contain only numbers
     */
    if (!form.phone || form.phone.length !== 10 || form.phone[0] !== "0" || isNaN(form.phone)) {
        message.error("Invalid phone!");
        return false;
    }

    return true;
};