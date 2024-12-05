import {useState , useEffect, useCallback} from 'react'

export const useCartModal = ({
    isOpen,
    onClose,
    cartItems = []
}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    const filteredItems = cartItems?.filter((item) =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.author?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return {
        windowWidth,
        searchQuery,
        setSearchQuery,
        isAnimating,
        handleClose,
        filteredItems
    };
};