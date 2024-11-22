import React from 'react';

const ScrollableTable = ({ children, maxHeight = '400px' }) => {
    return (
        <div className="custom-scrollbar relative rounded-lg overflow-hidden">
            <style jsx>{`
            .custom-scrollbar {
                scrollbar-width: thin;
            }   
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgb(203 213 225);
                border-radius: 3px;
                transition: all 0.2s ease-in-out;
            }
            .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                background: rgb(148 163 184);
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgb(71 85 105);
            }
            .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                background: rgb(100 116 139);
            }
            .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgb(203 213 225) transparent;
            }
            .dark .custom-scrollbar {
                scrollbar-color: rgb(71 85 105) transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                opacity: 0;
            }
            .custom-scrollbar:hover::-webkit-scrollbar-thumb,
            .custom-scrollbar:focus::-webkit-scrollbar-thumb,
            .custom-scrollbar:focus-within::-webkit-scrollbar-thumb {
                opacity: 1;
            }
        `}</style>
            <div className="overflow-y-auto" style={{ maxHeight }}>
                {children}
            </div>
        </div>
    );
};

export default ScrollableTable;