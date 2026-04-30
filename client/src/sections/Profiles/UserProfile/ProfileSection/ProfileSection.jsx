import React from 'react';
import ProfileCard from '../../../../components/client/ProfileCard/ProfileCard';
import { getProfileImageUrl, getProfileCoverUrl, getBusinessProfileImageUrl, getBusinessCoverImageUrl } from '../../../../utils/imageUtils';
import PropTypes from 'prop-types';

const ProfileSection = ({ 
    className = "", 
    user = null,
    business = null,
    businessUserLogin = false,
    businessReviewCount = 0,
    onEditProfileClick,
    onReviewsClick
}) => {
    if (!user) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>No profile data available</p>
            </div>
        );
    }

    // Parent passes true when linked business exists and full business profile is loaded (no separate API toggle).
    const isBusinessUser = businessUserLogin === true;

    // Business vs personal fields for the card
    const displayName = isBusinessUser && business?.business_name 
        ? business.business_name 
        : user.name || 'Anonymous User';
    const displaySubtitle = isBusinessUser && business?.about_business 
        ? business.about_business 
        : user.about_us || '';
    const displayBannerImage = isBusinessUser
        ? (business?.business_cover_picture ?? null)
        : user.cover_picture;
    const displayProfileImage = isBusinessUser
        ? (business?.business_profile_picture ?? null)
        : user.profile_picture;
    const displayReviewsCount = isBusinessUser && business?.reviews_count 
        ? business.reviews_count 
        : businessReviewCount;
    const displayRating = isBusinessUser && business?.business_rating != null
        ? Number(business.business_rating)
        : (user?.rating != null ? Number(user.rating) : 0);
    const displayWebsite = isBusinessUser && business?.website
        ? business.website
        : (user?.website || user?.website_url || '');

    const bannerImageUrl = isBusinessUser
        ? getBusinessCoverImageUrl(displayBannerImage)
        : getProfileCoverUrl(displayBannerImage);
    const profileImageUrl = isBusinessUser
        ? getBusinessProfileImageUrl(displayProfileImage)
        : getProfileImageUrl(displayProfileImage);

    return (
        <ProfileCard
            className={className}
            bannerImage={bannerImageUrl}
            profileImage={profileImageUrl}
            name={displayName}
            subtitle={displaySubtitle}
            website={displayWebsite}
            reviewsCount={displayReviewsCount}
            onReviewsClick={onReviewsClick}
            // showEditProfile={!isBusinessUser}
            showEditProfile={false}
            onEditProfileClick={onEditProfileClick}
            verifiedBadgeImage={user.is_vip ? null : null}
            rating={displayRating}
        />
    );
};

ProfileSection.propTypes = {
    className: PropTypes.string,
    user: PropTypes.object,
    business: PropTypes.object,
    businessUserLogin: PropTypes.bool,
    businessReviewCount: PropTypes.number,
    onEditProfileClick: PropTypes.func,
    onReviewsClick: PropTypes.func
};

export default ProfileSection;
