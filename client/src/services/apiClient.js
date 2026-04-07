import axios from 'axios';
import { APP_KEY, BASE_URL } from '../config/env';

const buildUrl = (path) => {
  if (!path) return BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = (BASE_URL || '').replace(/\/+$/, '');
  const nextPath = path.replace(/^\/+/, '');
  return `${base}/${nextPath}`;
};

const normalizeAppKey = (key) => {
  if (!key) return '';
  return key.startsWith('base64:') ? key : `base64:${key}`;
};

const normalizeResponseData = (data, statusText) => {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    const looksLikeHtml =
      trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html');
    if (!trimmed) return null;
    return { message: looksLikeHtml ? statusText : trimmed };
  }

  return data ?? null;
};

export const request = async (
  path,
  { method = 'GET', headers = {}, body, isFormData = false } = {},
) => {
  const finalHeaders = { ...headers };
  // Track whether this request is using an authenticated session
  // NOTE: Unlike ad-old, we do NOT auto-attach tokens from localStorage.
  // Only calls that explicitly pass a sessiontoken header are treated
  // as authenticated and may trigger a redirect on 401.
  let hadSessionToken = false;

  if (APP_KEY) {
    finalHeaders.appkey = normalizeAppKey(APP_KEY);
  }

  // Mark when this request is explicitly using a session token
  if (finalHeaders.sessiontoken) {
    hadSessionToken = true;
  }

  let finalBody = body;
  if (
    !isFormData &&
    body &&
    typeof body === 'object' &&
    !(body instanceof FormData)
  ) {
    finalHeaders['Content-Type'] =
      finalHeaders['Content-Type'] || 'application/json';
    finalBody = body;
  }

  try {
    const response = await axios.request({
      url: buildUrl(path),
      method,
      headers: finalHeaders,
      data: finalBody,
    });

    const data = normalizeResponseData(response.data, response.statusText);

    // Handle session expiry (matches ad-old's response interceptor)
    // Only redirect if there was an existing session token; anonymous users
    // visiting public pages should not be forced to sign in.
    if (data?.msg === 'Session Does not exist' && hadSessionToken) {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } catch (_) { }
      window.location.href = '/signin';
      return;
    }

    if (data && data.status === false) {
      const message =
        data.additionalMsg ||
        data.additional_message ||
        data.msg ||
        data.message ||
        data.error ||
        'Request failed';
      const error = new Error(message);
      error.data = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    const status = error?.response?.status;
    const data = normalizeResponseData(
      error?.response?.data,
      error?.response?.statusText || error?.message,
    );

    // Handle 401 session expiry (matches ad-old's error interceptor)
    // Do NOT redirect on "No Record Found!" — that's a normal API response
    // (e.g. user has no subscription), not a session expiry.
    const sessionExpiredMsg = data?.msg === 'Session Does not exist' || data?.msg === 'Unauthenticated';
    const isRealSessionExpiry = sessionExpiredMsg || (status === 401 && !/no record found|record not found/i.test(data?.msg || ''));
    // Only redirect on 401 when there was a session token; for anonymous users,
    // treat 401 as a normal error so public pages keep working.
    if (hadSessionToken && isRealSessionExpiry && status === 401) {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } catch (_) { }
      window.location.href = '/signin';
      return;
    }

    const message =
      (data &&
        (data.additionalMsg ||
          data.additional_message ||
          data.msg ||
          data.message ||
          data.error)) ||
      error?.message ||
      'Request failed';
    const normalizedError = new Error(message);
    normalizedError.data = data;
    normalizedError.status = status;
    throw normalizedError;
  }
};
