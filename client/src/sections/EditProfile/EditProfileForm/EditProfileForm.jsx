import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { CustomSelect } from '../../../components';
import { getBusinessCountries } from '../../../store/slices/homeSlice';
import PropTypes from 'prop-types';

const EditProfileForm = ({ className = "", onSubmit, defaultValues = {} }) => {
    const dispatch = useAppDispatch();
    const { businessCountries } = useAppSelector((state) => state.home);

    useEffect(() => {
        dispatch(getBusinessCountries());
    }, [dispatch]);

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        shouldFocusError: true,
        defaultValues: {
            name: defaultValues.name || '',
            email: defaultValues.email || '',
            country: defaultValues.country || '',
            countryCode: defaultValues.countryCode || '',
            phoneNumber: defaultValues.phoneNumber || '',
            about: defaultValues.about || ''
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
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            {...register('name', {
                                required: 'Name is required'
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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

                {/* Country, Country Code, and Phone Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    options={[{ value: '', label: 'Country Code' }, { value: '+1', label: '+1' }, { value: '+44', label: '+44' }, { value: '+91', label: '+91' }, { value: '+376', label: '+376' }]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Country Code"
                                />
                            )}
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

                {/* About Textarea */}
                <div>
                    <textarea
                        placeholder="About"
                        rows={4}
                        {...register('about')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 resize-none"
                    />
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-primary text-secondary py-2.5 sm:py-3 md:py-4 rounded-[16px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

EditProfileForm.propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    defaultValues: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        country: PropTypes.string,
        countryCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        about: PropTypes.string
    })
};

export default EditProfileForm;
