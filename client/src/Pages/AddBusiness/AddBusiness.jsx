import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CustomSelect } from '../../components';
import { getBusinessCountries } from '../../store/slices/homeSlice';
import { getBrands } from '../../store/slices/brandsSlice';
import { updateUserAfterAddBusiness } from '../../store/slices/authSlice';
import { registerBusiness } from '../../services/businessServices';
import bgAddBusinessImage from '../../assets/images/bg-addbusiness.png';

const AddBusiness = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { businessCountries } = useAppSelector((state) => state.home);
    const { brands: apiBrands = [] } = useAppSelector((state) => state.brands);
    const token = useAppSelector((state) => state.auth?.token);
    const authUser = useAppSelector((state) => state.auth?.user);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getBusinessCountries());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);
    
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        shouldFocusError: true,
        defaultValues: {
            businessName: '',
            brands: '',
            website: '',
            country: ''
        }
    });

    useEffect(() => {
        reset({
            businessName: '',
            brands: '',
            website: '',
            country: ''
        });
    }, [location.pathname, reset]);

    const onSubmit = async (data) => {
        setSubmitError('');
        setIsSubmitting(true);
        try {
            const res = await registerBusiness({
                business_name: data.businessName,
                website: data.website,
                country: data.country,
                business_brands: data.brands,
                token,
            });
            let updatedUser = res?.data?.user ?? res?.user ?? res?.data;
            if (updatedUser != null && typeof updatedUser === 'object') {
                dispatch(updateUserAfterAddBusiness(updatedUser));
            } else if (authUser && res?.data != null && typeof res.data === 'object') {
                const existingBusinesses = Array.isArray(authUser.user_business) ? authUser.user_business : [];
                updatedUser = { ...authUser, user_business: [...existingBusinesses, res.data] };
                dispatch(updateUserAfterAddBusiness(updatedUser));
            }
            reset();
            navigate('/', { replace: true });
        } catch (err) {
            setSubmitError(err?.message || 'Failed to add business');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="w-full min-h-screen relative flex items-center justify-center py-8 sm:py-12 md:py-16"
            style={{
                backgroundImage: `url(${bgAddBusinessImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Optional overlay for better form visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
            
            {/* Form Container */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
                <div className="bg-white shadow-lg p-6 sm:p-8 md:p-10" style={{ borderRadius: '38px', border: '1px solid #ADADAD' }}>
                    {/* Form Title */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Add a Business</h1>
                    </div>

                    {submitError && (
                        <p className="mb-4 text-red-500 text-sm">{submitError}</p>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                        {/* Business Name */}
                        <div>
                            <input
                                type="text"
                                placeholder="Business Name"
                                {...register('businessName', { required: 'Business name is required' })}
                                className={`w-full px-4 py-3 rounded-[12px] border ${
                                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                            />
                            {errors.businessName && (
                                <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                            )}
                        </div>

                        {/* Brands */}
                        <div>
                            <Controller
                                name="brands"
                                control={control}
                                rules={{ required: 'Brand is required' }}
                                render={({ field }) => {
                                    const sortedBrands = [...(apiBrands || [])].sort((a, b) => {
                                        const nameA = (a.brand || a.name || '').toString().toLowerCase();
                                        const nameB = (b.brand || b.name || '').toString().toLowerCase();
                                        return nameA.localeCompare(nameB);
                                    });
                                    const brandOptions = sortedBrands.map((b) => {
                                        const val = b.brand ?? b.name ?? b.id;
                                        const str = val != null ? String(val) : '';
                                        return { value: str, label: str || 'Unknown' };
                                    }).filter((o) => o.value !== '');
                                    const options = brandOptions;
                                    const currentValue = field.value;
                                    const normalizedValue = currentValue !== undefined && currentValue !== null && currentValue !== ''
                                        ? String(currentValue)
                                        : '';
                                    return (
                                        <CustomSelect
                                            ref={field.ref}
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            options={options}
                                            value={normalizedValue}
                                            onChange={(val) => field.onChange(val !== undefined && val !== null ? String(val) : '')}
                                            placeholder="Select Brand"
                                            searchable
                                            searchPlaceholder="Search brands..."
                                            triggerClassName={`bg-gray-100 ${errors.brands ? 'border-red-500' : ''}`}
                                        />
                                    );
                                }}
                            />
                            {errors.brands && (
                                <p className="text-red-500 text-sm mt-1">{errors.brands.message}</p>
                            )}
                        </div>

                        {/* Website */}
                        <div>
                            <input
                                type="text"
                                placeholder="Website"
                                {...register('website', { 
                                    required: 'Website is required',
                                    pattern: {
                                        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                        message: 'Invalid website URL'
                                    }
                                })}
                                className={`w-full px-4 py-3 rounded-[12px] border ${
                                    errors.website ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                            />
                            {errors.website && (
                                <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                            )}
                        </div>

                        {/* Country */}
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
                                        options={[...(businessCountries || []).map((c) => ({ value: c.business_country, label: c.business_country }))]}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Country"
                                        triggerClassName={`bg-gray-100 ${errors.country ? 'border-red-500' : ''}`}
                                    />
                                )}
                            />
                            {errors.country && (
                                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-70"
                                style={{ borderRadius: '7px' }}
                            >
                                {isSubmitting ? 'Submitting…' : 'Add a business'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBusiness;
