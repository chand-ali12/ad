import { IMAGE_BASE_URL, BASE_URL_OLD_IMAGE_URL } from '../config/env';

const getReviewsImageBase = () => (BASE_URL_OLD_IMAGE_URL && BASE_URL_OLD_IMAGE_URL.trim() ? BASE_URL_OLD_IMAGE_URL.replace(/\/+$/, '') : IMAGE_BASE_URL.replace(/\/+$/, ''));

/**
 * Converts an image filename/path from API to a full URL
 * @param {string|null} imagePath - Image filename or path from API
 * @returns {string|null} - Full image URL or null
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmed = imagePath.trim();
  if (!trimmed) return null;
  // Reject invalid/malformed paths from API
  if (trimmed.toLowerCase().startsWith('undefined')) return null;

  // If already a full URL, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a blob URL (local preview), return as-is
  if (trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Construct full URL from filename
  const baseUrl = IMAGE_BASE_URL.replace(/\/+$/, '');
  const filename = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/${filename}`;
};

/**
 * ad-old: User profile picture URL - uses VITE_BASE_URL_OLD_IMAGE_URL when set (reviews images)
 */
export const getProfileImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith('undefined')) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
  const baseUrl = getReviewsImageBase();
  const filename = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/usersProfile/${filename}`;
};

/**
 * ad-old: Review attachment image URL - uses VITE_BASE_URL_OLD_IMAGE_URL when set (reviews images)
 */
export const getReviewImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith('undefined')) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
  const baseUrl = getReviewsImageBase();
  const filename = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/reviewImage/${filename}`;
};

/**
 * ad-old: User cover/banner - MEDIA_BASE_URL/usersCover/{filename}; uses VITE_BASE_URL_OLD_IMAGE_URL when set
 */
export const getProfileCoverUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith('undefined')) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
  const baseUrl = getReviewsImageBase();
  const filename = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/usersCover/${filename}`;
};

/**
 * ad-old: Business profile picture - uses VITE_BASE_URL_OLD_IMAGE_URL when set (business profile images)
 */
export const getBusinessProfileImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith('undefined')) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
  const baseUrl = getReviewsImageBase();
  const filename = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/businessProfile/${filename}`;
};

/**
 * ad-old: Business cover/banner - uses VITE_BASE_URL_OLD_IMAGE_URL when set (business profile images)
 */
export const getBusinessCoverImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith('undefined')) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
  const baseUrl = getReviewsImageBase();
  const filename = trimmed.replace(/^\/+/, '');
  return `${baseUrl}/businessCover/${filename}`;
};
