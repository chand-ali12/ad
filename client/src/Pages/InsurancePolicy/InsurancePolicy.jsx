import React from 'react';
import InsurancePolicyDocument from '../../components/InsurancePolicy/InsurancePolicyDocument';

/**
 * Informational page only (no actions). Opened in a new tab from Authentication (?) link.
 */
const InsurancePolicy = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-[22px] border border-primary/15 bg-white shadow-lg">
          <div className="bg-primary px-4 py-8 text-center text-secondary sm:px-6 sm:py-10">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-[1.75rem]">
              Authentication Company Insurance Policy
            </h1>
            <p className="mx-auto mt-2 text-sm text-secondary/95 sm:text-base">
              Complete Terms & Agreement
            </p>
          </div>
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <InsurancePolicyDocument className="text-[15px] leading-relaxed sm:text-base" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePolicy;
