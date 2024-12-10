/**
 * PasswordSection Component
 * Renders a section for password management settings with a button to trigger password change modal
 * 
 * @param {Object} props
 * @param {Object} props.passwordState - State object containing password-related state
 * @param {Function} props.passwordState.setIsChangePasswordModalOpen - Function to control password modal visibility
 * @param {Function} props.handlePasswordChange - Handler function for password change operations
 */

export const PasswordSection = ({ passwordState, handlePasswordChange }) => (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium mb-4 text-text-dark dark:text-text-light">
            Password Settings
        </h2>
        <button
            onClick={() => passwordState.setIsChangePasswordModalOpen(true)}
            className="px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary-hover active:bg-primary-active focus:outline-none"
        >
            Change Password
        </button>
    </div>
);
