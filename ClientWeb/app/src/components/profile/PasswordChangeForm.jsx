import React from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password Change Form Component
 * Provides a form interface for users to change their password with visibility toggle functionality
 * 
 * @param {Object} props
 * @param {Object} props.passwordState - State management object for password-related data
 * @param {Function} props.passwordState.setChangePasswordForm - Updates the password form state
 * @param {Function} props.passwordState.setPasswordVisibility - Updates password field visibility
 * @param {Function} props.passwordState.setIsChangePasswordModalOpen - Controls modal visibility
 * @param {Function} props.passwordState.resetPasswordState - Resets form to initial state
 * @param {Function} props.handlePasswordChange - Handler for password change submission
 */

export const PasswordChangeForm = ({ passwordState, handlePasswordChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        passwordState.setChangePasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleVisibility = (field) => {
        passwordState.setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <div className="space-y-4">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                    <div key={field} className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {field.split(/(?=[A-Z])/).map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                        </label>
                        <div className="relative">
                            <input
                                type={passwordState.passwordVisibility[field] ? "text" : "password"}
                                name={field}
                                value={passwordState.changePasswordForm[field]}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility(field)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                {passwordState.passwordVisibility[field] ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={() => {
                        passwordState.setIsChangePasswordModalOpen(false);
                        passwordState.resetPasswordState();
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
    );
};