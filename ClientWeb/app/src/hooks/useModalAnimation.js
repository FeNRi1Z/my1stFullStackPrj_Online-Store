import { useState, useEffect } from 'react';

/**
 * Custom hook to handle modal animation states and transitions
 * @param {boolean} isOpen - Controls modal visibility state
 * @param {Function} onClose - Callback function to handle modal closing
 * @returns {Object} Animation state and close handler
 * @returns {boolean} isAnimating - Current animation state
 * @returns {Function} handleClose - Handler to trigger close animation
 */
export const useModalAnimation = (isOpen, onClose) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);
    
    const handleClose = () => {
        setIsAnimating(false);
        // Delay actual close to complete exit animation
        setTimeout(onClose, 300);
    };

    return { isAnimating, handleClose };
};