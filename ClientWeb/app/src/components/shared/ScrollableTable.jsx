import React from 'react';
/**
 * ScrollableTable Component
 * A container component that adds custom scrollbar styling with dark mode support
 *
 * @component
 * @param {Object} props
 * @param {ReactNode} props.children - Content to be rendered inside scrollable container
 * @param {string} [props.maxHeight="300px"] - Maximum height of scrollable area
 */
const ScrollableTable = ({ children, maxHeight = '300px' }) => {
    return (
        <div className="custom-scrollbar relative rounded-lg overflow-hidden">
            <div 
                className={`
                    overflow-y-auto
                    [&::-webkit-scrollbar]:w-[6px]
                    [&::-webkit-scrollbar]:h-[6px]
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-slate-300
                    [&::-webkit-scrollbar-thumb]:rounded-[3px]
                    [&::-webkit-scrollbar-thumb]:transition-all
                    hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
                    dark:[&::-webkit-scrollbar-thumb]:bg-slate-600
                    dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-500
                    scrollbar-thin
                    dark:scrollbar-thumb-slate-600
                    scrollbar-thumb-slate-300
                `}
                style={{ maxHeight }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScrollableTable;