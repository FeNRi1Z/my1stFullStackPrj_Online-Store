export const AccountTypeSection = ({ role }) => (
    <div className="p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Account Type</p>
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm
        ${role === "admin"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                } transition-colors duration-200`}
        >
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown"}
        </span>
    </div>
);