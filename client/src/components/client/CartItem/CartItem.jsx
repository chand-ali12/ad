import React from 'react';
import PropTypes from 'prop-types';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItem = ({
    image,
    brand,
    model,
    price,
    quantity = 1,
    onDelete,
    onQuantityChange,
    valuation,
    onToggleValuation,
    className = ""
}) => {
    const priceDisplay = typeof price === 'number' ? `$${Number(price).toFixed(2)}` : (price ?? '$0.00');

    return (
        <div className={`flex items-start gap-4 py-4 ${className}`}>
            {/* Product Image */}
            <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} alt={`${brand} ${model}`} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg" />
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-grow flex flex-col justify-between min-h-[80px] sm:min-h-[96px]">
                <div className="flex-grow">
                    <div className="mb-1">
                        <span className="text-xs sm:text-sm text-gray-500">Brand</span>
                        <div className="text-sm sm:text-base font-semibold text-black">{brand || '—'}</div>
                    </div>
                    <div>
                        <span className="text-xs sm:text-sm text-gray-500">Model</span>
                        <div className="text-sm sm:text-base font-semibold text-black">{model || '—'}</div>
                    </div>
                    {typeof valuation !== 'undefined' && onToggleValuation && (
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-500">Valuation</span>
                            <input
                                type="checkbox"
                                checked={!!valuation}
                                onChange={(e) => onToggleValuation(e.target.checked)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                        </div>
                    )}
                </div>
                {/* Quantity controls */}
                {onQuantityChange && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Qty</span>
                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                            <button
                                type="button"
                                onClick={() => onQuantityChange(Math.max(1, (quantity || 1) - 1))}
                                className="p-1.5 text-primary hover:bg-gray-100 rounded-l-md transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-medium text-primary">{quantity || 1}</span>
                            <button
                                type="button"
                                onClick={() => onQuantityChange((quantity || 1) + 1)}
                                className="p-1.5 text-primary hover:bg-gray-100 rounded-r-md transition-colors"
                                aria-label="Increase quantity"
                            >
                                <FiPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Price and delete */}
            <div className="flex flex-col items-end justify-between min-h-[80px] sm:min-h-[96px]">
                <div className="text-base sm:text-lg font-semibold text-black">
                    {priceDisplay}
                    {quantity > 1 && (
                        <span className="block text-xs text-gray-500 font-normal">
                            {priceDisplay} × {quantity}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onDelete}
                        className="text-primary hover:text-primary-hover transition-colors p-1 bg-transparent border-0 outline-none"
                        style={{ backgroundColor: 'transparent' }}
                        aria-label="Delete item"
                    >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </button>
                </div>
            </div>
        </div>
    );
};

CartItem.propTypes = {
    image: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    quantity: PropTypes.number,
    onDelete: PropTypes.func,
    onQuantityChange: PropTypes.func,
    valuation: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onToggleValuation: PropTypes.func,
    className: PropTypes.string
};

export default CartItem;
