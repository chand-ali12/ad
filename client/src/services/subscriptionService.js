import { request } from './apiClient';

/** GET /forum/get-all-plans - list subscription plans (ad-old: GET_ALL_PLANS). On "No Record Found!" return empty so UI can show fallback. */
export const getAllPlans = async ({ old_inclusive = 'web_yes_next', token } = {}) => {
  const query = old_inclusive ? `?old_inclusive=${old_inclusive}` : '';
  try {
    return await request(`/forum/get-all-plans${query}`, {
      method: 'GET',
      headers: token ? { sessiontoken: token } : undefined,
    });
  } catch (e) {
    const data = e?.data;
    const msg = (e?.message || data?.msg || data?.message || '').toString();
    const code = data?.status_code ?? e?.status;
    if (msg === 'No Record Found!' || (code === 401 && /record|found/i.test(msg))) {
      return { data: [], status: true };
    }
    throw e;
  }
};

/** GET /forum/get-subscription - current user subscription (ad-old: GET_SUBSCRIPTION). ad-old: no subscription = no data, do not throw. */
export const getSubscription = async ({ token } = {}) => {
  try {
    return await request('/forum/get-subscription', {
      method: 'GET',
      headers: token ? { sessiontoken: token } : undefined,
    });
  } catch (e) {
    const data = e?.data;
    const msg = (e?.message || data?.msg || data?.message || '').toString();
    const code = data?.status_code ?? e?.status;
    const noData = data && (data.data == null || data.data === undefined);
    const isNoRecord =
      msg === 'No Record Found!' ||
      (code === 401 && (noData || /record|found/i.test(msg))) ||
      (noData && (code === 401 || /no record found/i.test(msg)));
    if (isNoRecord) {
      return { data: null, status: true };
    }
    throw e;
  }
};

/** POST /forum/create-subscription - create subscription, returns redirect URL (ad-old: CREATE_SUBSCRIPTION). ad-old never throws; always reads response.data.data.url. */
export const createSubscription = async ({ plan_id, token } = {}) => {
  if (plan_id == null) throw new Error('plan_id is required');
  try {
    return await request('/forum/create-subscription', {
      method: 'POST',
      body: { plan_id },
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { sessiontoken: token } : {}),
      },
    });
  } catch (e) {
    const data = e?.data;
    const url = data?.data?.url ?? data?.url ?? data?.data?.redirect_url;
    const msg = (e?.message || data?.msg || data?.message || '').toString();
    if (url && typeof url === 'string') {
      return data ?? { data: { url }, msg: data?.msg };
    }
    if (msg === 'No Record Found!' || (data?.status_code === 401 && /record|found/i.test(msg))) {
      return { status: false, status_code: 401, data: null, msg: msg || 'No Record Found!' };
    }
    throw e;
  }
};

/** POST /forum/cancel-subscription - cancel current subscription (ad-old: CANCEL_SUBSCRIPTION) */
export const cancelSubscription = async ({ token } = {}) => {
  return request('/forum/cancel-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/** POST /ad/free-process-paypal - free subscription PayPal (ad-old: SINGLE_FREE_SUBSCRIPTION). Same as create-subscription: do not throw when response has url. */
export const freeProcessPaypal = async (payload, { token } = {}) => {
  const body = payload && typeof payload === 'object' ? payload : {};
  try {
    return await request('/ad/free-process-paypal', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { sessiontoken: token } : {}),
      },
    });
  } catch (e) {
    const data = e?.data;
    const url = data?.data?.url ?? data?.url ?? data?.data?.redirect_url;
    const msg = (e?.message || data?.msg || data?.message || '').toString();
    if (url && typeof url === 'string') {
      return data ?? { data: { url }, msg: data?.msg };
    }
    if (msg === 'No Record Found!' || (data?.status_code === 401 && /record|found/i.test(msg))) {
      return { status: false, status_code: 401, data: null, msg: msg || 'No Record Found!' };
    }
    throw e;
  }
};
