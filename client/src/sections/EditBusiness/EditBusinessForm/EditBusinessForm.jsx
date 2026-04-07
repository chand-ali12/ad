import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { CustomSelect } from '../../../components';
import { getBrands } from '../../../store/slices/brandsSlice';
import { getBusinessCountries } from '../../../store/slices/homeSlice';
import PropTypes from 'prop-types';

const EditBusinessForm = ({ className = "", onSubmit, defaultValues = {} }) => {
    const dispatch = useAppDispatch();
    const { brands: brandsList } = useAppSelector((state) => state.brands);
    const { businessCountries } = useAppSelector((state) => state.home);

    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getBusinessCountries());
    }, [dispatch]);
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        shouldFocusError: true,
        defaultValues: {
            businessName: defaultValues.businessName || '',
            email: defaultValues.email || '',
            aboutBusiness: defaultValues.aboutBusiness || '',
            companyAddress: defaultValues.companyAddress || '',
            companyWebsite: defaultValues.companyWebsite || '',
            brands: defaultValues.brands || '',
            country: defaultValues.country || '',
            countryCode: defaultValues.countryCode || '',
            phoneNumber: defaultValues.phoneNumber || '',
            aboutBusinessLong: defaultValues.aboutBusinessLong || '',
            facebookLink: defaultValues.facebookLink || '',
            instagramLink: defaultValues.instagramLink || '',
            linkedInLink: defaultValues.linkedInLink || '',
            marketplaceLink: defaultValues.marketplaceLink || ''
        }
    });

    const handleFormSubmit = (data) => {
        if (onSubmit) {
            onSubmit(data);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6 sm:p-8 pt-16 sm:pt-20 md:pt-24">
                {/* Business name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Business name"
                            {...register('businessName', {
                                required: 'Business name is required'
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.businessName ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                        />
                        {errors.businessName && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                {/* About Your Business and Company Address Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="About Your Business"
                            {...register('aboutBusiness')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Company Address"
                            {...register('companyAddress')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Company Website and Brands Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="url"
                            placeholder="Company Website"
                            {...register('companyWebsite')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <Controller
                            name="brands"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    ref={field.ref}
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    options={[{ value: '', label: 'Select Brands' }, ...brandsList.map((b) => ({ value: b.brand, label: b.brand }))]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select Brands"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Country and Country Code Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: 'Country is required' }}
                            render={({ field }) => (
                                <CustomSelect
                                    ref={field.ref}
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    options={[{ value: '', label: 'Country' }, ...businessCountries.map((c) => ({ value: c.business_country, label: c.business_country }))]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Country"
                                    triggerClassName={errors.country ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.country && (
                            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                        )}
                    </div>
                    <div>
                        <Controller
                            name="countryCode"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    ref={field.ref}
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    options={[{ value: '', label: 'Country code' }, { value: '+1', label: '+1' }, { value: '+44', label: '+44' }, { value: '+91', label: '+91' }]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Country code"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* About Your Business (textarea) and Phone Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <textarea
                            placeholder="About Your Business"
                            rows={4}
                            {...register('aboutBusinessLong')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 resize-none"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            {...register('phoneNumber')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Social Media Links Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <input
                            type="url"
                            placeholder="Facebook link"
                            {...register('facebookLink')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            placeholder="Instagram link"
                            {...register('instagramLink')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            placeholder="LinkedIn link"
                            {...register('linkedInLink')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            placeholder="Marketplace link"
                            {...register('marketplaceLink')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-primary text-secondary py-2.5 sm:py-3 md:py-4 rounded-[22px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

EditBusinessForm.propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    defaultValues: PropTypes.shape({
        businessName: PropTypes.string,
        email: PropTypes.string,
        aboutBusiness: PropTypes.string,
        companyAddress: PropTypes.string,
        companyWebsite: PropTypes.string,
        brands: PropTypes.string,
        country: PropTypes.string,
        countryCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        aboutBusinessLong: PropTypes.string,
        facebookLink: PropTypes.string,
        instagramLink: PropTypes.string,
        linkedInLink: PropTypes.string,
        marketplaceLink: PropTypes.string
    })
};

export default EditBusinessForm;
