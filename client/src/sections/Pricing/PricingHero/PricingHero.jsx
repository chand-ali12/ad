import React from "react";
import PropTypes from "prop-types";
import handcardImage from "../../../assets/images/handcard.png";
import { FiArrowRight } from "react-icons/fi";

const PricingHero = ({ className = "", onBuyNowClick }) => {
  return (
    <section
      className={`w-full pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-12 md:pb-16 lg:pb-20 xl:pb-24 relative overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(to right, #3C1F1B, rgba(162, 84, 73, 0.5))",
      }}
    >
      <div className="w-full relative z-10 pt-4 md:pt-6 lg:pt-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-0 xl:pl-12">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-4 sm:mb-5 md:mb-6 leading-tight">
              Authenticity Cards
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-secondary mb-6 sm:mb-7 md:mb-8 leading-relaxed max-w-2xl">
              Verify your luxury items instantly with a simple phone
              <br className="hidden sm:block" />
              tap or QR scan. These sleek NFC cards link to your digital
              <br className="hidden sm:block" />
              certificate, replacing bulky paperwork with easy, on-the
              <br className="hidden sm:block" />
              go proof.
            </p>

            {/* Buttons */}
            <div className="flex flex-col  sm:flex-row gap-4 w-auto mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10 border-black">
              <button
                onClick={onBuyNowClick}
                className="bg-primary text-secondary px-10 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-lg active:scale-95"
              >
                Buy Now <FiArrowRight className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image - Positioned at bottom and right border */}
      <div className="hidden lg:flex absolute bottom-0 right-0 w-full lg:w-1/2 justify-end items-end pointer-events-none pt-8 md:pt-12 lg:pt-16">
        <div className="relative w-full max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
          <img
            src={handcardImage}
            alt="Authenticity Card"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

PricingHero.propTypes = {
  className: PropTypes.string,
  onBuyNowClick: PropTypes.func,
};

export default PricingHero;
