import { request } from './apiClient';

export const verifyCoupon = async ({ coupon_code, amount, token } = {}) => {
  if (!coupon_code) {
    throw new Error('Coupon code is required');
  }
  if (amount == null || amount === '') {
    throw new Error('Amount is required');
  }

  const formData = new FormData();
  formData.append('coupon_code', coupon_code);
  formData.append('amount', String(amount));

  return request('/ad/verify-coupon', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
