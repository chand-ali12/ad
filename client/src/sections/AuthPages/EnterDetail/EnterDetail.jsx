import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomSelect } from '../../../components';
import PropTypes from 'prop-types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getAuthenticityCardPricing, submitAuthenticityCardsOrder } from '../../../store/slices/checkoutSlice';

const EnterDetail = ({ className = "" }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cardPricing = [], cardPricingStatus, status: submitStatus, error: submitError } = useAppSelector((state) => state.checkout || {});
    const [amount, setAmount] = useState(0);

    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
        shouldFocusError: true,
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            street1: '',
            street2: '',
            country: 'USA',
            city: '',
            state: '',
            postalCode: '',
            coaCount: ''
        }
    });

    const coaCountValue = watch('coaCount');
    const coaCountNum = coaCountValue ? Math.max(0, parseInt(coaCountValue, 10) || 0) : 0;

    // Load pricing once (used to derive amount similar to ad-old)
    useEffect(() => {
        if (cardPricingStatus === 'idle') {
            dispatch(getAuthenticityCardPricing());
        }
    }, [cardPricingStatus, dispatch]);

    // Derive amount whenever COA count or pricing changes (match old-site behavior)
    // - Prefer USA pricing tiers (type === 1) when present
    // - If user selects a count above the max tier, fall back to count * lastTierPrice (ad-old logic)
    useEffect(() => {
        if (!Array.isArray(cardPricing) || !coaCountNum) {
            setAmount(0);
            return;
        }

        const asNum = (v) => {
            const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.]+/g, ''));
            return Number.isFinite(n) ? n : 0;
        };

        const normalize = (t) => ({
            qty: asNum(t?.qty),
            type: asNum(t?.type),
            amount: asNum(t?.amount),
        });

        const tiers = cardPricing.map(normalize);
        const usaTiers = tiers.filter((t) => t.type === 1);
        const fallbackTiers = tiers.filter((t) => t.qty > 0);
        const activeTiers = usaTiers.length ? usaTiers : fallbackTiers;

        const maxQty = activeTiers.length ? Math.max(...activeTiers.map((t) => t.qty)) : 0;
        const lastTierPrice = maxQty ? (activeTiers.find((t) => t.qty === maxQty)?.amount || 0) : 0;

        if (maxQty && coaCountNum >= maxQty && lastTierPrice) {
            setAmount(coaCountNum * lastTierPrice);
            return;
        }

        const exactTier = activeTiers.find((t) => t.qty === coaCountNum);
        setAmount(exactTier?.amount || 0);
    }, [cardPricing, coaCountNum]);

    // Optional: pre-fill COA count from navigation state (e.g. Pricing → Buy Now with quantity)
    useEffect(() => {
        const quantityFromNav = location.state?.quantity ?? location.state?.coaCount;
        if (quantityFromNav != null && quantityFromNav !== '') {
            const q = Number(quantityFromNav);
            if (q >= 1) {
                setValue('coaCount', String(Math.min(q, 20)));
            }
        }
    }, [location.state?.quantity, location.state?.coaCount, setValue]);

    // Reset form when component mounts or when returning to the page
    useEffect(() => {
        reset({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            street1: '',
            street2: '',
            country: 'USA',
            city: '',
            state: '',
            postalCode: '',
            coaCount: ''
        });
    }, [location.pathname, reset]);

    const isSubmitting = submitStatus === 'loading';

    const onSubmit = async (data) => {
        const count = data.coaCount ? Math.max(0, parseInt(data.coaCount, 10) || 0) : 0;
        const coaNumbers = [];
        for (let i = 0; i < count; i++) {
            coaNumbers.push((data[`coa_number_${i + 1}`] ?? '').toString().trim());
        }
        const certificateNumbers = coaNumbers.filter(Boolean);
        const coa_number = certificateNumbers.join(',');

        try {
            const result = await dispatch(submitAuthenticityCardsOrder({
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone,
                street_1: data.street1,
                street_2: data.street2,
                country: 'USA',
                city: data.city,
                state: data.state,
                postal_code: data.postalCode,
                coa_count: count,
                amount,
                coa_number,
            })).unwrap();

            const payload = result?.data ?? result;
            if (payload) {
                const encoded = encodeURIComponent(JSON.stringify(payload));
                navigate(`/checkout?data=${encoded}&page=auth-cards`, {
                    state: {
                        braintreePayload: payload,
                        page: 'auth-cards',
                        checkoutType: 'auth',
                    },
                });
            }
        } catch (err) {
            console.error('EnterDetail submit failed:', err);
        }
    };

    return (
        <section className={`w-full pb-12 bg-[#F5F5F0] flex items-start justify-center pt-8 md:pt-12 ${className}`}>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* overflow-visible so CustomSelect dropdown isn’t clipped at the card bottom */}
                <div className="bg-white shadow-lg border border-gray-200 overflow-visible" style={{ borderRadius: '38px' }}>
                    <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                        {/* Form Title */}
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Enter Detail</h1>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                            {/* Row 1: First Name and Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        {...register('firstName', { required: 'First name is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        {...register('lastName', { required: 'Last name is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Email and Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        {...register('phone', { required: 'Phone is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Street #1 and Street #2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Street #1"
                                        {...register('street1', { required: 'Street #1 is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.street1 ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.street1 && (
                                        <p className="text-red-500 text-sm mt-1">{errors.street1.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Street #2"
                                        {...register('street2')}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.street2 ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.street2 && (
                                        <p className="text-red-500 text-sm mt-1">{errors.street2.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Country (fixed USA) and City */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        value="USA"
                                        readOnly
                                        className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:outline-none text-primary bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        {...register('city', { required: 'City is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.city ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 5: State and Postal Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        {...register('state', { required: 'State is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.state ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.state && (
                                        <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        {...register('postalCode', { required: 'Postal code is required' })}
                                        className={`w-full px-4 py-3 rounded-[12px] border ${
                                            errors.postalCode ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 6: Select COA Count (number of authenticity cards) and Amount */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Controller
                                        name="coaCount"
                                        control={control}
                                        rules={{ required: 'COA Count is required' }}
                                        render={({ field }) => (
                                            <CustomSelect
                                                ref={field.ref}
                                                name={field.name}
                                                onBlur={field.onBlur}
                                                options={[{ value: '', label: 'Select COA Count' }, ...Array.from({ length: 20 }, (_, i) => i + 1).map((n) => ({ value: String(n), label: String(n) }))]}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select COA Count"
                                                triggerClassName={`bg-gray-100 ${errors.coaCount ? 'border-red-500' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.coaCount && (
                                        <p className="text-red-500 text-sm mt-1">{errors.coaCount.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Amount"
                                        value={coaCountNum > 0 ? amount.toFixed(2) : ''}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:outline-none text-primary bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Certificate numbers: one field per COA count (authenticity cards) */}
                            {coaCountNum > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-primary">Certificate numbers</h3>
                                    {Array.from({ length: coaCountNum }).map((_, index) => (
                                        <div key={index}>
                                            <input
                                                type="text"
                                                placeholder={`Enter COA / Certificate number ${index + 1}`}
                                                {...register(`coa_number_${index + 1}`, {
                                                    required: 'Certificate number is required',
                                                    validate: (value) =>
                                                        String(value ?? '').trim().length > 0 || 'Certificate number is required',
                                                })}
                                                className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100"
                                            />
                                            {errors[`coa_number_${index + 1}`] && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors[`coa_number_${index + 1}`]?.message}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                                    style={{ borderRadius: '7px' }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

EnterDetail.propTypes = {
    className: PropTypes.string
};

export default EnterDetail;
