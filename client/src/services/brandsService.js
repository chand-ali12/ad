import { request } from './apiClient';

export const getBrands = async ({ token } = {}) => {
  return request('/ad/get-brands', {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};
