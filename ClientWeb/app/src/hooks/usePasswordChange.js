import { useState } from "react";

/**
 * Custom hook for managing password change functionality
 * @returns {Object} Password change state and handlers
 * @returns {boolean} .isChangePasswordModalOpen - Controls visibility of password change modal
 * @returns {Object} .changePasswordForm - Contains password form field values
 * @returns {Object} .passwordVisibility - Tracks visibility state of password fields
 * @returns {Function} .resetPasswordState - Resets form and visibility states
 */

export const usePasswordChange = () => {
  // Controls the password change modal visibility
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  // Manages form input values for password change
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Tracks show/hide state for each password field
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  /**
   * Resets both form values and visibility states to initial state
   * Typically called after form submission or modal close
   */
  const resetPasswordState = () => {
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
  };

  return {
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    changePasswordForm,
    setChangePasswordForm,
    passwordVisibility,
    setPasswordVisibility,
    resetPasswordState
  };
};