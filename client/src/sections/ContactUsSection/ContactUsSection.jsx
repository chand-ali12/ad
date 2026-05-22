import React from "react";
import contactUsBg from "../../assets/images/support_image.png";
import PropTypes from "prop-types";

const ContactUsSection = ({ className = "" }) => {
  return (
    <section
      className={`relative w-full min-h-[700px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={contactUsBg}
          alt="Contact Us Background"
          className="w-full h-full object-cover object-[61%_80%] md:object-[center_80%]"
        />
      </div>

      {/* Centered text only - no form, white background for readability */}
      <div className="relative z-10 bg-white px-6 py-5 sm:px-8 sm:py-6 rounded-xl shadow-lg text-center">
        <p
          className="text-primary text-base sm:text-lg md:text-xl font-normal"
          style={{
            fontFamily:
              "Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif",
          }}
        >
          Questions? Contact us at{" "}
          <a
            href="mailto:support@authenticdetective.com"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            support@authenticdetective.com
          </a>
        </p>
      </div>
    </section>
  );
};

ContactUsSection.propTypes = {
  className: PropTypes.string,
};

export default ContactUsSection;
