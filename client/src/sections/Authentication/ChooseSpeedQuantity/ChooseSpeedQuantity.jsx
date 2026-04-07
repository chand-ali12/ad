import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiHelpCircle } from 'react-icons/fi';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M11.5 3.5L5.5 9.5L2.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LightningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M8 1L3 8H7L6 13L11 6H7L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
  </svg>
);

/**
 * Choose Speed and Choose Quantity section for the Authentication page.
 * Renders two rows: speed options (Standard / Expedited) and quantity options (Single / Bulk).
 */
const ChooseSpeedQuantity = ({
  speed = 'standard',
  quantity = 'single',
  onSpeedChange,
  onQuantityChange,
  className = '',
}) => {
  const [showBulkAuthInfoAlert, setShowBulkAuthInfoAlert] = useState(false);

  const handleQuantitySelect = (value) => {
    if (value === 'single' || value === 'bulk') {
      onQuantityChange?.(value === 'bulk');
    }
  };

  return (
    <section className={`w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-[#F5F5F0]/50 ${className}`}>
      <div className="max-w-[900px] mx-auto">
        {/* Choose Speed */}
        <div className="mb-10">
          <h3 className="text-center text-primary font-bold text-lg sm:text-xl mb-5">
            Choose Speed
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            {/* Standard - selected */}
            <button
              type="button"
              onClick={() => onSpeedChange?.('standard')}
              className="relative flex flex-col items-center text-center p-5 rounded-2xl bg-white border-2 border-[#D4AF37]/40 shadow-sm hover:border-[#D4AF37]/70 transition-colors w-full"
            >
              <span className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                <CheckIcon />
              </span>
              <div className="min-h-[88px] flex flex-col items-center">
                <span className="font-bold text-primary text-base mt-1">Standard</span>
                <span className="text-sm text-gray-500 mt-0.5">12-24 hours</span>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-[#E8DCC8] text-primary text-xs font-medium w-fit">
                  <CheckIcon />
                  Most Popular
                </span>
              </div>
              <hr className="w-full my-3 border-gray-200 flex-shrink-0" />
              <span className="text-primary font-semibold text-sm">From $12</span>
            </button>

            {/* Expedited - coming soon */}
            <div className="relative flex flex-col items-center text-center p-5 rounded-2xl bg-primary text-white/95 border-2 border-primary cursor-not-allowed opacity-90 w-full">
              <div className="min-h-[88px] flex flex-col items-center">
                <span className="font-bold text-base mt-1">Expedited</span>
                <span className="text-sm text-white/80 mt-0.5">Under 60 minutes</span>
                <span className="text-sm text-white/90 mt-2">Coming Soon</span>
              </div>
              <hr className="w-full my-3 border-white/30 flex-shrink-0" />
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/80 text-white text-xs font-medium w-fit">
                <span className="text-yellow-400">
                  <LightningIcon />
                </span>
                Fastest Option
              </span>
            </div>
          </div>
        </div>

        {/* Choose Quantity */}
        <div className="pt-6">
          <hr className="border-gray-300 mb-5" />
          <div className="flex items-center gap-4 mb-5">
            <hr className="flex-1 border-gray-300" />
            <h3 className="text-primary font-bold text-lg sm:text-xl whitespace-nowrap">
              Choose Quantity
            </h3>
            <hr className="flex-1 border-gray-300" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleQuantitySelect('single')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border-2 transition-colors ${
                quantity === 'single'
                  ? 'bg-white border-[#D4AF37]/40 shadow-sm'
                  : 'bg-white/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              {quantity === 'single' && (
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <CheckIcon />
                </span>
              )}
              <span className="font-semibold text-primary text-base">Single Authentication</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuantitySelect('bulk')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border-2 transition-colors ${
                quantity === 'bulk'
                  ? 'bg-white border-[#D4AF37]/40 shadow-sm'
                  : 'bg-white/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              {quantity === 'bulk' && (
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <CheckIcon />
                </span>
              )}
              <span className="font-semibold text-primary text-base">Bulk Authentication</span>

              {/* Info icon - stop propagation so it doesn't toggle selection */}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBulkAuthInfoAlert(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBulkAuthInfoAlert(true);
                  }
                }}
                className="icon-button ml-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-0"
                aria-label="Bulk authentication information"
              >
                <FiHelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Authentication info alert popup */}
      {showBulkAuthInfoAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden p-6 sm:p-8 text-center">
            <h3 className="text-primary font-bold text-xl sm:text-2xl mb-4">Bulk Authentication</h3>
            <p className="text-primary text-sm sm:text-base font-normal leading-relaxed mb-6 px-1">
              Bulk authentication allows you to submit up to 10 items at once for a faster, more streamlined checkout. Pricing remains the same - this feature is built for convenience.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowBulkAuthInfoAlert(false)}
                className="bg-primary text-secondary font-semibold text-sm sm:text-base px-8 py-3 rounded-xl w-full max-w-xs hover:bg-primary-hover transition-colors shadow-sm"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

ChooseSpeedQuantity.propTypes = {
  speed: PropTypes.oneOf(['standard', 'expedited']),
  quantity: PropTypes.oneOf(['single', 'bulk']),
  onSpeedChange: PropTypes.func,
  onQuantityChange: PropTypes.func,
  className: PropTypes.string,
};

export default ChooseSpeedQuantity;
