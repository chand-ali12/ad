import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CustomSelect } from '../../components';
import { claimBusiness, resetClaim } from '../../store/slices/claimSlice';
import { getBusinessCountries } from '../../store/slices/homeSlice';
import bgAddBusinessImage from '../../assets/images/bg-addbusiness.png';

const Claim = () => {
  const [searchParams] = useSearchParams();
  const businessIdFromUrl = searchParams.get('id');
  const dispatch = useAppDispatch();
  const { status, error, message } = useAppSelector((state) => state.claim);
  const { businessCountries = [] } = useAppSelector((state) => state.home);

  useEffect(() => {
    dispatch(getBusinessCountries());
  }, [dispatch]);

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    shouldFocusError: true,
    defaultValues: {
      id: businessIdFromUrl || '',
      business_name: '',
      about_business: '',
      website: '',
      country: '',
      business_phone: '',
      business_instagram: '',
      business_facebook: '',
      business_linkedin: '',
      business_twitter: '',
      hemlock_link: '',
      category: 'bag',
      model: '',
      description: '',
      email: '',
    },
  });

  useEffect(() => {
    if (businessIdFromUrl) {
      setValue('id', businessIdFromUrl);
    }
  }, [businessIdFromUrl, setValue]);

  useEffect(() => {
    return () => {
      dispatch(resetClaim());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const profileFile = data.business_profile_picture?.[0];
    const coverFile = data.business_cover_picture?.[0];

    await dispatch(
      claimBusiness({
        id: data.id,
        business_name: data.business_name,
        about_business: data.about_business,
        website: data.website,
        country: data.country,
        business_phone: data.business_phone,
        business_instagram: data.business_instagram,
        business_facebook: data.business_facebook,
        business_linkedin: data.business_linkedin,
        business_twitter: data.business_twitter,
        hemlock_link: data.hemlock_link,
        category: data.category,
        model: data.model,
        description: data.description,
        email: data.email,
        business_profile_picture: profileFile || undefined,
        business_cover_picture: coverFile || undefined,
        storage_type: 'reviewImage',
      })
    );
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-[12px] border ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`;

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-center py-8 sm:py-12 md:py-16"
      style={{
        backgroundImage: `url(${bgAddBusinessImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div
          className="bg-white shadow-lg p-6 sm:p-8 md:p-10"
          style={{ borderRadius: '38px', border: '1px solid #ADADAD' }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Claim a Business</h1>
            <p className="text-primary/70 mt-1 text-sm">Submit your claim to verify business ownership</p>
          </div>

          {message && status === 'succeeded' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Business ID *</label>
              <input
                type="text"
                placeholder="Business ID (e.g. 14)"
                {...register('id', { required: 'Business ID is required' })}
                className={inputClass(errors.id)}
              />
              {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Business Name</label>
              <input
                type="text"
                placeholder="Business Name"
                {...register('business_name')}
                className={inputClass(errors.business_name)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">About Business</label>
              <textarea
                placeholder="About your business"
                rows={3}
                {...register('about_business')}
                className={inputClass(errors.about_business)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email *</label>
              <input
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email',
                  },
                })}
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Website</label>
              <input
                type="url"
                placeholder="https://www.example.com"
                {...register('website')}
                className={inputClass(errors.website)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Country</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    options={[{ value: '', label: 'Country' }, ...businessCountries.map((c) => ({ value: c.business_country, label: c.business_country }))]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Country"
                    triggerClassName={errors.country ? 'border-red-500 bg-gray-100' : 'bg-gray-100'}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Business Phone</label>
              <input
                type="text"
                placeholder="Business Phone"
                {...register('business_phone')}
                className={inputClass(errors.business_phone)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Instagram</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  {...register('business_instagram')}
                  className={inputClass(errors.business_instagram)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Facebook</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  {...register('business_facebook')}
                  className={inputClass(errors.business_facebook)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">LinkedIn</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/..."
                  {...register('business_linkedin')}
                  className={inputClass(errors.business_linkedin)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Twitter</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  {...register('business_twitter')}
                  className={inputClass(errors.business_twitter)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Hemlock Link</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('hemlock_link')}
                className={inputClass(errors.hemlock_link)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Category</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      options={[{ value: 'bag', label: 'Bag' }, { value: 'shoes', label: 'Shoes' }, { value: 'jewelry', label: 'Jewelry' }, { value: 'watch', label: 'Watch' }, { value: 'accessories', label: 'Accessories' }]}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Category"
                      triggerClassName="bg-gray-100"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Model</label>
                <input
                  type="text"
                  placeholder="Enter model name or identifier"
                  {...register('model')}
                  className={inputClass(errors.model)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Description</label>
              <textarea
                placeholder="Description"
                rows={2}
                {...register('description')}
                className={inputClass(errors.description)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Business Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                {...register('business_profile_picture')}
                className="w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-secondary file:font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Business Cover Picture</label>
              <input
                type="file"
                accept="image/*"
                {...register('business_cover_picture')}
                className="w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-secondary file:font-medium"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Claim;
