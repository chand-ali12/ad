const env = import.meta.env;

export const APP_KEY = env.VITE_APP_KEY || "";
// Use HTTPS live URL in production (e.g. Vercel) to avoid mixed-content blocking; use dev URL otherwise
export const BASE_URL =
  import.meta.env.PROD && (env.VITE_BASE_URL_LIVE || "").trim()
    ? (env.VITE_BASE_URL_LIVE || "").replace(/\/+$/, "")
    : (env.VITE_BASE_URL || env.VITE_BASE_URL_LIVE || "").replace(/\/+$/, "");
export const BASE_URL_LIVE = env.VITE_BASE_URL_LIVE || "";
// In production (e.g. Vercel), prefer HTTPS base so PDFs/images load (no mixed-content). Set VITE_IMAGE_BASE_URL_LIVE on deploy.
export const IMAGE_BASE_URL = (
  import.meta.env.PROD && (env.VITE_IMAGE_BASE_URL_LIVE || "").trim()
    ? env.VITE_IMAGE_BASE_URL_LIVE
    : env.VITE_IMAGE_BASE_URL || "http://54.225.112.100/master/storage"
).replace(/\/+$/, "");
/** ad-old S3 base for review/profile images (user avatar, review image). Use when set. */
export const BASE_URL_OLD_IMAGE_URL = env.VITE_BASE_URL_OLD_IMAGE_URL || "";
/** Base URL for authenticateImage (pending cert thumbnails). Old site uses S3. Prefer VITE_MEDIA_BASE_URL, else use S3 (BASE_URL_OLD_IMAGE_URL) if set, else IMAGE_BASE_URL. */
export const MEDIA_BASE_URL =
  env.VITE_MEDIA_BASE_URL ||
  (env.VITE_BASE_URL_OLD_IMAGE_URL && env.VITE_BASE_URL_OLD_IMAGE_URL.trim()
    ? env.VITE_BASE_URL_OLD_IMAGE_URL.replace(/\/+$/, "")
    : null) ||
  IMAGE_BASE_URL;
export const AUTHENTIC_DETECTIVE = env.VITE_AUTHENTIC_DETECTIVE || "";
export const FORUM = env.VITE_FORUM || "";

export const PROFILE_IMAGE_BASE_URL = 'https://auth-detect.s3.amazonaws.com/usersProfile/';

export const FIREBASE_CONFIG = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};