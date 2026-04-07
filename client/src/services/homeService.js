import { request } from './apiClient';

/** GET /verified-business - all verified businesses (ad-old: GET_ALL_VERIFIED_BUSINESS). Optional: /verified-business/{searchText} for search. */
export const getVerifiedBusiness = async ({ searchText, token } = {}) => {
  const path =
    searchText != null && String(searchText).trim() !== ''
      ? `/verified-business/${encodeURIComponent(String(searchText).trim())}`
      : '/verified-business';
  return request(path, {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const getHomeData = async ({ token } = {}) => {
  return request('/ad/home', {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};

const SELLERS_PER_PAGE = 10;

/** Phase 1: uses /forum/verified-business-list (POST) instead of /ad/get-all-seller */
export const getAllSellers = async ({ page = 1, per_page = SELLERS_PER_PAGE, keyword, token } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', String(page));
  if (per_page) params.append('per_page', String(per_page));
  const query = params.toString();
  const body = new FormData();
  if (keyword) body.append('keyword', keyword);
  return request(`/forum/verified-business-list${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: body,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const getAllReviews = async ({ page = 1, token } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', String(page));
  const query = params.toString();
  return request(`/ad/get-all-reviews${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/** Phase 1: uses /forum/verified-business-list (POST) instead of /ad/get-verified-seller */
export const getVerifiedSellers = async ({ page = 1, keyword, token } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', String(page));
  const query = params.toString();
  const body = new FormData();
  if (keyword) body.append('keyword', keyword);
  return request(`/forum/verified-business-list${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: body,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const getBusinessCountries = async ({ page, token } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', String(page));
  const query = params.toString();
  return request(`/ad/get-business-countries${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const searchBusinesses = async ({ search, page = 1, per_page = SELLERS_PER_PAGE, brand, token } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (page) params.append('page', String(page));
  if (per_page) params.append('per_page', String(per_page));
  if (brand) params.append('brand', brand);
  const query = params.toString();
  return request(`/ad/search-filter${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};
