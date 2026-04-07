import React from 'react';
import PropTypes from 'prop-types';
import { INSURANCE_POLICY_SECTIONS } from '../../sections/Authentication/Form/insurancePolicyContent';

/**
 * Renders the Authentication Company Insurance Policy sections (same copy as legacy site / modal).
 */
const InsurancePolicyDocument = ({ className = '' }) => (
  <div className={`text-primary leading-relaxed space-y-8 ${className}`}>
    {INSURANCE_POLICY_SECTIONS.map((section, idx) => (
      <div key={idx}>
        <h3 className="mb-3 font-bold text-base text-primary sm:text-lg">
          {section.title}
        </h3>
        <div className="space-y-2.5">
          {section.content.map((item, i) => {
            if (item.type === 'para') {
              return (
                <p key={i} className="text-gray-700">
                  {item.text}
                </p>
              );
            }
            if (item.type === 'bullet') {
              return (
                <p key={i} className={`flex gap-2 ${item.bold ? 'font-bold' : ''}`}>
                  <span className="shrink-0">•</span>
                  <span className="text-gray-700">{item.text}</span>
                </p>
              );
            }
            if (item.type === 'sub') {
              return (
                <p key={i} className="mt-2 font-semibold text-primary">
                  {item.text}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    ))}
  </div>
);

InsurancePolicyDocument.propTypes = {
  className: PropTypes.string,
};

export default InsurancePolicyDocument;
