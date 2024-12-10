import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks window width dimension
 * @returns {Object} windowWidth - Current window width in pixels
 */

export const useWindowDimensions = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { windowWidth };
};