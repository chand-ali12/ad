import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const DateRange = ({ className = "" }) => {
    const location = useLocation();
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        shouldFocusError: true,
        defaultValues: {
            startDate: '',
            endDate: ''
        }
    });

    // Reset form when component mounts or when returning to the page
    useEffect(() => {
        reset({
            startDate: '',
            endDate: ''
        });
    }, [location.pathname, reset]);

    const onSubmit = (data) => {
        console.log('Date Range data:', data);
        // Add date range logic here
    };

    return (
        <section className={`w-full pb-12 bg-[#F5F5F0] flex items-start justify-center pt-8 md:pt-12 ${className}`}>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Date Fields Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Start Date Field */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Start date"
                                        {...register('startDate', {
                                            required: 'Start date is required'
                                        })}
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.startDate ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                                    )}
                                </div>

                                {/* End Date Field */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="End Date"
                                        {...register('endDate', {
                                            required: 'End date is required'
                                        })}
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.endDate ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-medium text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

DateRange.propTypes = {
    className: PropTypes.string
};

export default DateRange;
