import { request } from './apiClient';

export const changePaymentStatus = async ({ id, token } = {}) => {
  if (!id) {
    throw new Error('ID is required');
  }

  return request(`/ad/change-payment-status?id=${id}`, {
    method: 'POST',
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const changePaymentStatusBundle = async ({ id, bundle_id, token } = {}) => {
  if (!bundle_id) {
    throw new Error('bundle_id is required');
  }

  const formData = new FormData();
  formData.append('bundle_id', bundle_id);

  return request(`/ad/change-payment-status-bundle${id ? `?id=${id}` : ''}`, {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const isSold = async ({ certificate_id, token } = {}) => {
  if (!certificate_id) {
    throw new Error('certificate_id is required');
  }

  const formData = new FormData();
  formData.append('certificate_id', certificate_id);

  return request('/ad/is-sold', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
