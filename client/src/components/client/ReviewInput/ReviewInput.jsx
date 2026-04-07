import React, { useState, forwardRef } from 'react';
import { FiCamera, FiSend } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ReviewInput = forwardRef(({
    value = '',
    onChange,
    placeholder = 'Your Review...',
    onMediaClick,
    onSubmit,
    className = '',
    textareaClassName = '',
    actionsClassName = '',
    rows = 6
}, ref) => {
    const [reviewText, setReviewText] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setReviewText(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleSubmit = () => {
        if (onSubmit && reviewText.trim()) {
            onSubmit(reviewText);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <textarea
                ref={ref}
                value={reviewText}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 pr-20 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50 resize-none ${textareaClassName}`}
            />
            <div className={`absolute bottom-3 right-3 flex items-center gap-2 ${actionsClassName}`}>
                {onMediaClick && (
                    <button
                        type="button"
                        onClick={onMediaClick}
                        className="text-gray-500 hover:text-primary transition-colors p-1 bg-transparent border-0 outline-none focus:outline-none"
                        style={{ backgroundColor: 'transparent' }}
                        aria-label="Add media"
                    >
                        <FiCamera className="w-5 h-5" />
                    </button>
                )}
                {onSubmit && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-gray-600 hover:text-primary transition-colors p-1 bg-transparent border-0 outline-none focus:outline-none"
                        style={{ backgroundColor: 'transparent' }}
                        aria-label="Submit review"
                    >
                        <FiSend className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
});

ReviewInput.displayName = 'ReviewInput';

ReviewInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    onMediaClick: PropTypes.func,
    onSubmit: PropTypes.func,
    className: PropTypes.string,
    textareaClassName: PropTypes.string,
    actionsClassName: PropTypes.string,
    rows: PropTypes.number
};

export default ReviewInput;
