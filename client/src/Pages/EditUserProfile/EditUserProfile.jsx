import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUserProfile, setError, setMessage } from '../../store/slices/profileSlice';
import { getProfileImageUrl, getProfileCoverUrl } from '../../utils/imageUtils';
import ProfileCard from '../../components/client/ProfileCard/ProfileCard';
import EditProfileForm from '../../sections/EditProfile/EditProfileForm/EditProfileForm';
import { FiEdit3 } from 'react-icons/fi';

const EditUserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.profile);
    const { status, error, message } = useAppSelector((state) => state.profile);
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileFile, setProfileFile] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('error');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (user) {
            setBannerImage(getProfileCoverUrl(user.cover_picture));
            setProfileImage(getProfileImageUrl(user.profile_picture));
        }
    }, [user]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            if (bannerImage && bannerImage.startsWith('blob:')) {
                URL.revokeObjectURL(bannerImage);
            }
            if (profileImage && profileImage.startsWith('blob:')) {
                URL.revokeObjectURL(profileImage);
            }
        };
    }, [bannerImage, profileImage]);

    useEffect(() => {
        if (error) {
            setToastMessage(error);
            setToastVariant('error');
            setShowToast(true);
        } else if (message) {
            setToastMessage(message);
            setToastVariant('success');
            setShowToast(true);
        } else {
            return;
        }

        const timer = setTimeout(() => {
            setShowToast(false);
            dispatch(setError(null));
            dispatch(setMessage(null));
        }, 5000);

        return () => clearTimeout(timer);
    }, [error, message, dispatch]);

    const handleBannerEdit = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Revoke previous preview URL if exists
                if (bannerImage && bannerImage.startsWith('blob:')) {
                    URL.revokeObjectURL(bannerImage);
                }
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setBannerImage(previewUrl);
                setBannerFile(file);
            }
        };
        input.click();
    };

    const handleProfileImageEdit = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Revoke previous preview URL if exists
                if (profileImage && profileImage.startsWith('blob:')) {
                    URL.revokeObjectURL(profileImage);
                }
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setProfileImage(previewUrl);
                setProfileFile(file);
            }
        };
        input.click();
    };

    const handleFormSubmit = (data) => {
        if (!user?.id) {
            setToastMessage('User ID not found');
            setToastVariant('error');
            setShowToast(true);
            return;
        }

        dispatch(
            updateUserProfile({
                id: user.id,
                name: data.name,
                about_us: data.about,
                country: data.country,
                phone: data.phoneNumber,
                profile_picture: profileFile || undefined,
                cover_picture: bannerFile || undefined,
                facebook: data.facebook,
                instagram: data.instagram,
                twitter: data.twitter,
                marketplace: data.marketplace,
            }),
        ).then((result) => {
            if (result.type.endsWith('/fulfilled')) {
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            }
        });
    };

    const handleSkipToCertificatesClick = () => {
        navigate('/profile');
    };

    const toastStyles =
        toastVariant === 'success'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700';

    return (
        <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
            {showToast && (
                <div
                    className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${toastStyles}`}
                    role="alert"
                >
                    {toastMessage}
                </div>
            )}
            <main className="flex-grow py-8 sm:py-12">
                <div className="px-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-300 rounded-[22px] overflow-hidden">
                        {/* First Section - Reusable Profile Card with Edit Icons */}
                        <div className="relative">
                            <ProfileCard
                                bannerImage={bannerImage}
                                profileImage={profileImage}
                                name={user?.name || ''}
                                subtitle={user?.about_us || ''}
                                reviewsCount={null}
                                showEditProfile={false}
                                showSkipToCertificates={false}
                            />
                            
                            {/* Banner Edit Icon - Positioned within banner section */}
                            <button
                                onClick={handleBannerEdit}
                                className="absolute top-[calc(12rem-3rem)] sm:top-[calc(14rem-3rem)] md:top-[calc(16rem-3rem)] lg:top-[calc(18rem-3rem)] right-4 w-8 h-8 min-w-0 p-0 m-0 bg-white rounded-full flex items-center justify-center shadow-md z-10 border-0 outline-none hover:bg-white"
                                style={{ aspectRatio: '1/1', width: '32px', height: '32px' }}
                                aria-label="Edit banner"
                            >
                                <FiEdit3 className="flex-shrink-0 w-4 h-4 text-primary" />
                            </button>

                            {/* Profile Image Edit Icon - Positioned on profile circle bottom-right */}
                            <button
                                onClick={handleProfileImageEdit}
                                className="absolute left-4 sm:left-6 md:left-8 bottom-16 sm:bottom-18 md:bottom-20 translate-x-[70px] sm:translate-x-[80px] md:translate-x-[90px] lg:translate-x-[100px] w-8 h-8 min-w-0 p-0 m-0 bg-white rounded-full flex items-center justify-center shadow-md z-50 border-0 outline-none hover:bg-white"
                                style={{ aspectRatio: '1/1', width: '32px', height: '32px' }}
                                aria-label="Edit profile image"
                            >
                                <FiEdit3 className="flex-shrink-0 w-4 h-4 text-primary" />
                            </button>
                        </div>

                        {/* Second Section - Edit Profile Form */}
                        <EditProfileForm
                            onSubmit={handleFormSubmit}
                            isLoading={status === 'loading'}
                            defaultValues={{
                                name: user?.name || '',
                                email: user?.email || '',
                                country: user?.country || '',
                                countryCode: '',
                                phoneNumber: user?.phone || '',
                                about: user?.about_us || '',
                                facebook: user?.facebook || '',
                                instagram: user?.instagram || '',
                                twitter: user?.twitter || '',
                                marketplace: user?.marketplace || ''
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditUserProfile;
