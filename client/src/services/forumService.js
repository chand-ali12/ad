import axios from "axios";
import { request } from "./apiClient";
import { APP_KEY, BASE_URL } from "../config/env";

const buildUrl = (path) => {
  if (!path) return BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (BASE_URL || "").replace(/\/+$/, "");
  const nextPath = path.replace(/^\/+/, "");
  return `${base}/${nextPath}`;
};

/**
 * Get COA PDF by ID (ad-old: GET_COA_PDF)
 * GET /ADCOA?id={id}
 * Returns a Blob (PDF). Use in UI: create object URL and open in new tab.
 */
export const getCoaPdf = async ({ id, token } = {}) => {
  if (!id) throw new Error("COA id is required");
  const url = buildUrl(`/ADCOA?id=${encodeURIComponent(String(id))}`);
  const headers = {};
  if (token) headers.sessiontoken = token;
  if (APP_KEY)
    headers.appkey = APP_KEY.startsWith("base64:")
      ? APP_KEY
      : `base64:${APP_KEY}`;
  const response = await axios.get(url, { headers, responseType: "blob" });
  return response.data;
};

/**
 * Get certificate PDF by UUID (ad-old: CERTIFICATE_UUID_TO_PDF)
 * GET /certificate?uuid={uuid} (or /certificate/{uuid} depending on backend)
 * Returns a Blob (PDF).
 */
export const getCertificatePdfByUuid = async ({ uuid, token } = {}) => {
  if (!uuid) throw new Error("Certificate UUID is required");
  const url = buildUrl(`/certificate?uuid=${encodeURIComponent(String(uuid))}`);
  const headers = {};
  if (token) headers.sessiontoken = token;
  if (APP_KEY)
    headers.appkey = APP_KEY.startsWith("base64:")
      ? APP_KEY
      : `base64:${APP_KEY}`;
  const response = await axios.get(url, { headers, responseType: "blob" });
  return response.data;
};

/**
 * Get authenticity card pricing tiers
 * POST /forum/authenticity-cards-orders/authenticity-card-pricing
 */
export const getAuthenticityCardPricing = async ({ token } = {}) => {
  return request("/forum/authenticity-cards-orders/authenticity-card-pricing", {
    method: "POST",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * Submit authenticity cards order (checkout)
 * Legacy ad-old endpoint:
 * POST /forum/authenticity-cards-submit-web
 * Body: form-data with first_name, last_name, email, phone, street_1, street_2,
 *       country, city, state, postal_code, coa_count, amount, coa_number
 * Returns payload including Braintree token/amount used on /checkout.
 */
export const submitAuthenticityCardsOrder = async ({
  first_name,
  last_name,
  email,
  phone,
  street_1,
  street_2,
  country,
  city,
  state,
  postal_code,
  coa_count,
  amount,
  coa_number,
  token,
} = {}) => {
  if (!coa_number) throw new Error("Certificate number(s) are required");

  const formData = new FormData();
  formData.append("first_name", first_name || "");
  formData.append("last_name", last_name || "");
  formData.append("email", email || "");
  formData.append("phone", phone || "");
  formData.append("street_1", street_1 || "");
  formData.append("street_2", street_2 || "");
  formData.append("country", country || "");
  formData.append("city", city || "");
  formData.append("state", state || "");
  formData.append("postal_code", postal_code || "");
  formData.append("coa_count", String(coa_count ?? 0));
  formData.append("amount", String(amount ?? 0));
  formData.append(
    "coa_number",
    Array.isArray(coa_number) ? coa_number.join(",") : String(coa_number),
  );

  return request("/forum/authenticity-cards-submit-web", {
    method: "POST",
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * Submit valuation COA request (ad-old: POST .../valuation-coa-submit-web, JSON body).
 * Returns envelope that may nest Braintree fields under `data` or `data.data`.
 */
export const submitValuationCoa = async ({
  name,
  email,
  coa_number,
  description,
  brand,
  token,
} = {}) => {
  if (!name) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");
  if (!coa_number) throw new Error("COA number is required");

  const body = {
    name: String(name),
    email: String(email),
    coa_number: String(coa_number).trim(),
  };
  const desc = description != null ? String(description).trim() : "";
  if (desc) body.description = desc;
  if (brand != null && String(brand).trim() !== "") {
    const n = Number(brand);
    body.brand = Number.isNaN(n) ? brand : n;
  }

  return request("/forum/valuation-coa/valuation-coa-submit-web", {
    method: "POST",
    body,
    headers: token ? { sessiontoken: token } : {},
  });
};

/** Normalize valuation submit response → Braintree checkout payload (token + order metadata). */
export const pickValuationBraintreePayload = (res) => {
  if (!res || typeof res !== "object") return null;
  let p = res.data;
  if (!p || typeof p !== "object") {
    p = res;
  }
  if (p && typeof p === "object" && p.data && typeof p.data === "object") {
    const inner = p.data;
    if (inner.token || inner.client_token || inner.clientToken) {
      p = inner;
    }
  }
  if (!p || typeof p !== "object") return null;
  const token = p.client_token ?? p.clientToken ?? p.token ?? p._token;
  if (!token || (typeof token !== "string" && typeof token !== "number"))
    return null;
  const tokenStr = String(token);
  if (!tokenStr.trim()) return null;
  const parsedAmount =
    p.amount != null
      ? Number(p.amount)
      : p.payed_amount != null
        ? Number(p.payed_amount)
        : undefined;

  return {
    ...p,
    token: tokenStr,
    id: p.id,
    order_number: p.order_number ?? p.orderNumber,
    amount: Number.isNaN(parsedAmount) ? undefined : parsedAmount,
    payed_amount:
      p.payed_amount != null && !Number.isNaN(Number(p.payed_amount))
        ? Number(p.payed_amount)
        : p.payed_amount,
    queries_count: p.queries_count,
    query_type: p.query_type ?? "valuation",
    encrypt_amount:
      p.encrypt_amount ??
      p.encryptedAmount ??
      p.encrypted_amount ??
      p.encrypted_order,
    email: p.email,
    coupon_code: p.coupon_code,
    first_name: p.first_name,
    last_name: p.last_name,
  };
};

/**
 * Get valuations list (ad-old: GET_VALUATIONS)
 * GET /forum/valuation-coa
 */
export const getValuationsList = async ({ token } = {}) => {
  return request("/forum/valuation-coa", {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * Prepare auth checkout: get Braintree token (ad-old flow).
 * POST /ad/checkout-braintree with order/customer data (no payment_method_nonce).
 * Returns { data: { client_token, id, order_number, amount, ... } } for Braintree drop-in.
 */
export const prepareAuthCheckoutBraintree = async (
  {
    first_name,
    last_name,
    email,
    phone,
    street_1,
    street_2,
    country,
    city,
    state,
    postal_code,
    query_ids,
    amount,
    coa_count,
    coupon_code,
  },
  { token } = {},
) => {
  const body = {
    first_name: first_name || "",
    last_name: last_name || "",
    email: email || "",
    phone: phone || "",
    street_1: street_1 || "",
    street_2: street_2 || "",
    country: country || "",
    city: city || "",
    state: state || "",
    postal_code: postal_code || "",
    amount: Number(amount) || 0,
    coa_count: Number(coa_count) || 0,
  };
  const raw = Array.isArray(query_ids)
    ? query_ids
    : query_ids != null && query_ids !== ""
      ? String(query_ids)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const ids = raw
    .map((item) => {
      if (item == null) return "";
      if (typeof item === "object")
        return String(
          item.id ??
            item.query_id ??
            item.certificate_id ??
            item.coa_number ??
            "",
        );
      return String(item);
    })
    .filter(Boolean);
  if (ids.length) body.query_ids = ids.join(",");
  if (coupon_code) body.coupon_code = coupon_code;
  return request("/ad/checkout-braintree", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Complete checkout with Braintree (auth/orders) – submit payment with nonce.
 * POST /ad/checkout-braintree
 * Body: JSON with _token, first_name, last_name, id, query_type, payment_method_nonce, amount, order_number, queries_count, user_id?, encrypt_amount, coupon_code?
 */
export const checkoutBraintree = async (body, { token } = {}) => {
  return request("/ad/checkout-braintree", {
    method: "POST",
    body: body && typeof body === "object" ? body : {},
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Phase 1: Valuation payment via Braintree
 * POST /forum/valuation-coa/valuation-coa-checkout-braintree
 */
export const valuationCoaCheckoutBraintree = async (body, { token } = {}) => {
  return request("/forum/valuation-coa/valuation-coa-checkout-braintree", {
    method: "POST",
    body: body && typeof body === "object" ? body : {},
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Phase 1: Update authenticity-cards order status after Braintree payment
 * POST /forum/authenticity-cards-orders/authenticity-cards-change-status
 */
export const authenticityCardsChangeStatus = async (body, { token } = {}) => {
  return request(
    "/forum/authenticity-cards-orders/authenticity-cards-change-status",
    {
      method: "POST",
      body: body && typeof body === "object" ? body : {},
      headers: {
        "Content-Type": "application/json",
        ...(token ? { sessiontoken: token } : {}),
      },
    },
  );
};

/**
 * Phase 1: Verify certificate by number (public)
 * POST /forum/verify-certificate
 * Body: { number: certificateNumber }
 */
export const verifyCertificate = async ({ number: certificateNumber } = {}) => {
  if (!certificateNumber || !String(certificateNumber).trim()) {
    throw new Error("Certificate number is required");
  }
  return request("/forum/verify-certificate", {
    method: "POST",
    body: { number: String(certificateNumber).trim() },
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Phase 2: Delete user account
 * POST /forum/delete-account (ad-old: DELETE_ACCOUNT)
 * Body: {} with sessiontoken header
 */
export const deleteAccount = async ({ token } = {}) => {
  return request("/forum/delete-account", {
    method: "POST",
    body: {},
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Phase 2: Update certificate note (ad-old: UPDATE_CERTIFICATE_NOTE)
 * POST /forum/certificate-note
 * Body: { query_id, note } (backend may use query_id for the certificate/query record)
 */
export const updateCertificateNote = async ({
  certificate_id,
  query_id,
  note,
  token,
} = {}) => {
  const id = certificate_id ?? query_id;
  if (id == null || id === "") {
    throw new Error("Certificate/query ID is required");
  }
  return request("/forum/certificate-note", {
    method: "POST",
    body: {
      query_id: Number(id),
      note: note != null ? String(note) : "",
    },
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Phase 3: Get COA receipts for date range
 * POST /forum/show-coa-receipts
 * Body: { starting_date: 'YYYY-MM-DD', ending_date: 'YYYY-MM-DD' }
 */
export const showCoaReceipts = async ({
  starting_date,
  ending_date,
  token,
} = {}) => {
  const body = {
    starting_date: starting_date || "",
    ending_date: ending_date || "",
  };
  return request("/forum/show-coa-receipts", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Valuation COA change status
 * POST /forum/valuation-coa/valuation-coa-change-status
 * Body: form-data with order_number, transaction_id
 */
export const valuationCoaChangeStatus = async ({
  order_number,
  transaction_id,
  token,
} = {}) => {
  if (!order_number) throw new Error("Order number is required");
  if (!transaction_id) throw new Error("Transaction ID is required");

  const formData = new FormData();
  formData.append("order_number", String(order_number));
  formData.append("transaction_id", String(transaction_id));

  return request("/forum/valuation-coa/valuation-coa-change-status", {
    method: "POST",
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
