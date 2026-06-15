import { request } from './apiClient';

export const getBrands = async () => {
  return request('/general/get-all-brands', {
    method: 'GET',
  });
};
