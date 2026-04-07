import React from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ReplySection = ({ 
    sellerName, 
    text, 
    onEditClick, 
    onDeleteClick,
    className = "",
    showActions = false,
    textBold = false
}) => {
    if (!sellerName && !text) {
        return null;
    }

    return (
        <div className={`pt-4 mt-4 border-t border-gray-200 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    {sellerName && (
                        <p className="text-sm text-primary mb-1">
                            Reply from {sellerName}
                        </p>
                    )}
                    {text && (
                        <p className={`text-sm sm:text-base text-primary ${textBold ? 'font-bold' : ''}`}>
                            {text}
                        </p>
                    )}
                </div>
                {/* Action Icons - Right side (only if showActions is true) */}
                {showActions && (onEditClick || onDeleteClick) && (
                    <div className="flex items-center gap-3 ml-4" onClick={(e) => e.stopPropagation()}>
                        {onEditClick && (
                            <button
                                onClick={onEditClick}
                                className="text-gray-600 hover:text-gray-800 transition-colors bg-transparent border-0 p-0"
                                aria-label="Edit reply"
                            >
                                <FiEdit3 className="w-4 h-4" />
                            </button>
                        )}
                        {onDeleteClick && (
                            <button
                                onClick={onDeleteClick}
                                className="text-gray-600 hover:text-red-500 transition-colors bg-transparent border-0 p-0"
                                aria-label="Delete reply"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

ReplySection.propTypes = {
    sellerName: PropTypes.string,
    text: PropTypes.string,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    className: PropTypes.string,
    showActions: PropTypes.bool,
    textBold: PropTypes.bool
};

export default ReplySection;
