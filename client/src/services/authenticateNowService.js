import { request } from './apiClient';

export const getAuthenticateNowView = async () => {
  return request('/authenticate-now-view', { method: 'GET' });
};

export const submitAuthenticateNow = async ({
  brand_id,
  brand_name,
  category_id,
  category,
  model,
  description,
  email,
  image,
  reCaptchaToken,
  type = 'single',
  valuation = 0,
  token,
} = {}) => {
  if (brand_name == null && brand_id == null) throw new Error('Brand is required');
  if (!email) throw new Error('Email is required');
  if (!image) throw new Error('At least one image is required');

  const formData = new FormData();
  if (brand_id != null) formData.append('brand_id', String(brand_id));
  formData.append('brand_name', String(brand_name ?? ''));
  if (category_id != null) formData.append('category_id', String(category_id));
  formData.append('category', String(category ?? ''));
  formData.append('model', model || '');
  formData.append('description', description || '');
  formData.append('email', email);
  formData.append('image', Array.isArray(image) ? image.join(',') : String(image));
  if (reCaptchaToken) formData.append('reCaptchaToken', String(reCaptchaToken));
  formData.append('type', type);
  formData.append('valuation', String(valuation));

  return request('/ad/authenticate-now-submit', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const submitAuthenticateNowBulk = async ({ queries, token } = {}) => {
  if (!queries?.length) throw new Error('At least one query is required');

  return request('/ad/authenticate-now-submit-bulk', {
    method: 'POST',
    body: JSON.stringify({ queries }),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/** Phase 1: Get price for bulk/multi query - POST /ad/get-query-price
 * Core: { category_id, valuation }. Optional context (brand_id, model, query) for
 * backend logging or future pricing rules — ignored by older APIs safely.
 */
export const getQueryPrice = async ({
  category_id,
  valuation,
  brand_id,
  model,
  query,
  token,
} = {}) => {
  const body = {};
  if (category_id != null) body.category_id = String(category_id);
  if (valuation != null) body.valuation = Number(valuation);
  if (brand_id != null && String(brand_id).trim() !== '') {
    body.brand_id = String(brand_id);
  }
  if (model != null && String(model).trim() !== '') {
    body.model = String(model).trim();
  }
  if (query != null && String(query).trim() !== '') {
    body.query = String(query).trim();
  }

  return request('/ad/get-query-price', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/** Phase 1: Submit free bulk form - POST /ad/free-submit */
export const freeSubmit = async (
  { user_email, total_price, queries_count, total_queries_count, queries, coupon_code, token } = {}
) => {
  const body = {
    user_email: user_email ?? '',
    total_price: Number(total_price) ?? 0,
    queries_count: Number(queries_count) ?? 0,
    total_queries_count: Number(total_queries_count) ?? 0,
    queries: typeof queries === 'string' ? queries : JSON.stringify(queries ?? []),
    ...(coupon_code && { coupon_code }),
  };
  return request('/ad/free-submit', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/** Phase 1: Submit paid bulk authentication - POST /ad/bundle-query-form-submit */
export const bundleQueryFormSubmit = async (
  { user_email, total_price, queries_count, total_queries_count, queries, coupon_code, token } = {}
) => {
  const body = {
    user_email: user_email ?? '',
    total_price: Number(total_price) ?? 0,
    queries_count: Number(queries_count) ?? 0,
    total_queries_count: Number(total_queries_count) ?? 0,
    queries: typeof queries === 'string' ? queries : JSON.stringify(queries ?? []),
    ...(coupon_code && { coupon_code }),
  };
  return request('/ad/bundle-query-form-submit', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/** Phase 1: Single authentication PayPal - POST /ad/process-paypal */
export const processPaypal = async (formData, { token } = {}) => {
  const body = formData && typeof formData === 'object' ? formData : {};
  return request('/ad/process-paypal', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};
