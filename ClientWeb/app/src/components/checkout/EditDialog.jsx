import Dialog from '../layout/Dialog';

/**
 * CartSearch component is a custom reuse of Dialog Component
 */

export const EditDialog = ({ isOpen, onClose, title, children }) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
                {children}
            </div>
        </Dialog>
    );
};