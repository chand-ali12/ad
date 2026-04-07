import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBusinessProfile, updateBusinessProfile, setError, setMessage } from '../../store/slices/businessSlice';
import { getBusinessProfileImageUrl, getBusinessCoverImageUrl } from '../../utils/imageUtils';
import ProfileCard from '../../components/client/ProfileCard/ProfileCard';
import EditBusinessForm from '../../sections/EditBusiness/EditBusinessForm/EditBusinessForm';
import { FiEdit3 } from 'react-icons/fi';

const EditBusinessProfile = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { user: authUser } = useAppSelector((state) => state.auth);
    const { business, status, error, message } = useAppSelector((state) => state.business);
    
    const [bannerImage, setBannerImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    
    const bannerInputRef = useRef(null);
    const profileInputRef = useRef(null);

    // Fetch business profile on mount
    useEffect(() => {
        console.log('authUser:', authUser);
        console.log('authUser.user_business:', authUser?.user_business);
        
        if (authUser?.user_business && authUser.user_business.length > 0) {
            const businessId = authUser.user_business[0].id;
            console.log('Fetching business profile with ID:', businessId);
            dispatch(getBusinessProfile({ id: businessId }));
        } else {
            console.error('No business found for this user!');
        }
    }, [dispatch, authUser]);

    // Set images from business data
    useEffect(() => {
        if (business) {
            setBannerImage(getBusinessCoverImageUrl(business.business_cover_picture));
            setProfileImage(getBusinessProfileImageUrl(business.business_profile_picture));
        }
    }, [business]);

    // Log errors/success to console
    useEffect(() => {
        if (error) {
            console.error('Error:', error);
            dispatch(setError(null));
        }
        if (message) {
            console.log('Success:', message);
            dispatch(setMessage(null));
        }
    }, [error, message, dispatch]);

    const handleBannerEdit = () => {
        bannerInputRef.current?.click();
    };

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerImageFile(file);
            const blobUrl = URL.createObjectURL(file);
            setBannerImage(blobUrl);
        }
    };

    const handleProfileImageEdit = () => {
        profileInputRef.current?.click();
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
            const blobUrl = URL.createObjectURL(file);
            setProfileImage(blobUrl);
        }
    };

    const handleFormSubmit = async (data) => {
        if (!business?.id) {
            console.error('Error: Business ID not found');
            return;
        }

        console.log('Submitting business ID:', business.id);
        console.log('Submitting user ID:', business.user_id);
        console.log('Business data:', business);

        const result = await dispatch(updateBusinessProfile({
            id: business.user_id,
            business_id: business.id,
            business_name: data.businessName,
            business_country: data.country,
            business_phone: data.phoneNumber,
            business_address: data.companyAddress,
            about_business: data.aboutBusinessLong || data.aboutBusiness,
            business_brands: data.brands,
            website: data.companyWebsite,
            business_instagram: data.instagramLink,
            business_facebook: data.facebookLink,
            business_linkedin: data.linkedInLink,
            business_twitter: data.marketplaceLink,
            business_profile_picture: profileImageFile,
            business_cover_picture: bannerImageFile,
        }));

        if (result.type.endsWith('/fulfilled')) {
            // Refetch business profile to get updated image URLs from server
            if (authUser?.user_business?.[0]?.id) {
                await dispatch(getBusinessProfile({ id: authUser.user_business[0].id }));
            }
            setTimeout(() => navigate('/profile'), 1500);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
            <main className="flex-grow py-8 sm:py-12">
                <div className="px-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-300 rounded-[22px] overflow-hidden">
                        {/* First Section - Reusable Profile Card with Edit Icons */}
                        <div className="relative">
                            <ProfileCard
                                bannerImage={bannerImage}
                                profileImage={profileImage}
                                name=""
                                subtitle=""
                                reviewsCount={null}
                                showEditProfile={false}
                                showSkipToCertificates={false}
                            />
                            
                            {/* Hidden file inputs */}
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="hidden"
                                aria-label="Upload banner image"
                            />
                            <input
                                ref={profileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="hidden"
                                aria-label="Upload profile image"
                            />

                            {/* Banner Edit Icon - Positioned within banner section */}
                            <button
                                onClick={handleBannerEdit}
                                className="absolute top-[calc(12rem-3rem)] sm:top-[calc(14rem-3rem)] md:top-[calc(16rem-3rem)] lg:top-[calc(18rem-3rem)] right-4 w-8 h-8 min-w-0 p-0 m-0 bg-white rounded-full flex items-center justify-center shadow-md z-50 border-0 outline-none hover:bg-white"
                                style={{ aspectRatio: '1/1', width: '32px', height: '32px' }}
                                aria-label="Edit banner"
                            >
                                <FiEdit3 className="flex-shrink-0 w-4 h-4 text-primary" />
                            </button>

                            {/* Profile Image Edit Icon - Positioned on right border of profile image */}
                            <button
                                onClick={handleProfileImageEdit}
                                className="absolute left-4 sm:left-6 md:left-8 bottom-16 sm:bottom-18 md:bottom-20 translate-x-[70px] sm:translate-x-[80px] md:translate-x-[90px] lg:translate-x-[100px] w-8 h-8 min-w-0 p-0 m-0 bg-white rounded-full flex items-center justify-center shadow-md z-50 border-0 outline-none hover:bg-white"
                                style={{ aspectRatio: '1/1', width: '32px', height: '32px' }}
                                aria-label="Edit profile image"
                            >
                                <FiEdit3 className="flex-shrink-0 w-4 h-4 text-primary" />
                            </button>
                        </div>

                        {/* Second Section - Edit Business Form */}
                        {business && (
                            <EditBusinessForm
                                onSubmit={handleFormSubmit}
                                defaultValues={{
                                    businessName: business.business_name || '',
                                    email: business.user?.email || authUser?.email || '',
                                    aboutBusiness: business.about_business || '',
                                    companyAddress: business.business_address || '',
                                    companyWebsite: business.website || '',
                                    brands: business.business_brands || '',
                                    country: business.business_country || '',
                                    countryCode: '',
                                    phoneNumber: business.business_phone || '',
                                    aboutBusinessLong: business.about_business || '',
                                    facebookLink: business.business_facebook || '',
                                    instagramLink: business.business_instagram || '',
                                    linkedInLink: business.business_linkedin || '',
                                    marketplaceLink: business.business_twitter || ''
                                }}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditBusinessProfile;
