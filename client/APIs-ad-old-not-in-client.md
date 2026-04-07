# APIs in ad-old Not Integrated in client

This document lists API endpoints that are **implemented and used in the ad-old codebase** but are **not integrated** in the **client** (current React/Vite frontend).

---

## 1. Auth & account

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/reset-password-submit` | Submit new password after reset link (RESET_PASSWORD) | Reset password page |
| `/forum/delete-account` | Delete user account | Delete account flow |

**Note:** Client uses `/change-password` with token for password reset; ad-old uses `/reset-password-submit`.  
**Note:** Client has no delete-account integration.

---

## 2. Profile & business

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/ad/get-business-profile-slug` | Get business profile by slug (public view) | Business profile by slug (e.g. reviews page) |
| `/verified-business` | Get all verified businesses (GET). Optional: `/verified-business/{searchText}` for search | Home – Sellers / seller collective |
| `/forum/verified-business-list` | Get list of verified businesses (POST with params e.g. page) | Seller collective / verified businesses list |

**Note:** Client has `/ad/get-business-profile?id=`, `/ad/get-user-profile?id=`, `/ad/get-all-seller`, and `/ad/get-verified-seller` but no slug-based public profile, no `/verified-business`, and no `/forum/verified-business-list`.

---

## 3. Verify certificate

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/forum/verify-certificate` | Verify a certificate (public) | Verify certificate page |

**Note:** Client has no verify-certificate API integration.

---

## 4. Payments & checkout (Braintree)

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/ad/checkout-braintree` | Checkout with Braintree (auth/orders) | Checkout page (auth flow) |
| `/forum/valuation-coa/valuation-coa-checkout-braintree` | Valuation payment via Braintree | Checkout page (valuation flow) |
| `/forum/authenticity-cards-orders/authenticity-cards-change-status` | Update authenticity-cards order status after Braintree payment | Checkout page (auth-cards flow) |

**Note:** Client uses `/forum/authenticity-cards-orders/authenticity-cards-submit` and `/forum/valuation-coa/valuation-coa-change-status` but has **no Braintree** flow and no authenticity-cards **change-status** for payment completion.

---

## 5. Bulk / authentication flow

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/ad/get-query-price` | Get price for bulk/multi query (GET_PRICE_BULK_CASE) | Cart / bulk pricing |
| `/ad/free-submit` | Submit free bulk form (SUBMIT_BULK_FORM_FREE) | Bulk auth flow |
| `/ad/bundle-query-form-submit` | Submit bundle/bulk authentication (SUBMIT_BULK_AUTHENTICATION) | Bulk auth flow |
| `/ad/process-paypal` | Single authentication PayPal processing (SUBMIT_SINGLE_AUTHENTICATION) | Single auth payment |

**Note:** Client has authenticate-now submit and related flows but not these exact bulk/pricing/PayPal endpoints.

---

## 6. Subscriptions

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/forum/get-all-plans` | Get subscription plans | Subscriptions page |
| `/forum/get-subscription` | Get current user subscription | Subscriptions page |
| `/forum/create-subscription` | Create subscription | Subscriptions page |
| `/forum/cancel-subscription` | Cancel subscription | Subscriptions page |
| `/ad/free-process-paypal` | Free subscription PayPal (SINGLE_FREE_SUBSCRIPTION) | Free plan flow |

**Note:** Client has no subscription API integration (subscription slice/UI may exist but no these forum/ad endpoints).

---

## 7. Certificates & COA

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/forum/show-coa-receipts` | Get COA receipts for user | Receipt / order history |
| `/ADCOA` | Get COA PDF by ID (GET_COA_PDF) | Certificate/COA PDF view |
| `/certificate` | Get certificate PDF by UUID (CERTIFICATE_UUID_TO_PDF) | Certificate PDF by UUID |
| `/forum/valuation-coa` | Get valuations list (GET, GET_VALUATIONS) | Valuations list |
| `/forum/certificate-note` | Update certificate note | Certificates/certificate detail |
| `/ad/update-request-more-images` | Submit more images (admin requested) | Request more images page |
| `/ad/user-update-query-images` | User update query images | Request more images / certificate flow |

**Note:** Client has get-user-queries, is-sold, and certificate-related UI but not show-coa-receipts, ADCOA, certificate UUID-to-PDF, valuations list GET, certificate-note, or request-more-images endpoints.

---

## 8. Request more images

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/request-more-images-submit` | Submit response to "request more images" (POST) | “request more images” | Request more images page |
| `GET /request-more-images/{id}` | Get request-more-images details by id (REQUEST_MORE_IMAGES_DETAILS) | Request more images page |

**Note:** Client has no request-more-images API integration.

---

## 9. Add business

| Endpoint (ad-old) | Purpose | Used in ad-old |
|-------------------|--------|----------------|
| `/ad/register-business` | Register/add a business (ADD_A_BUSINESS) | Add business page |

**Note:** Client Add Business page has no API call (only console.log / placeholder); ad-old uses POST `/ad/register-business` with JSON body.

---

## 10. Other (not in ad-old constants but requested)

| Endpoint | Purpose |
|----------|--------|
| `GET /public/requests/getViaEmail?email=...` | Get authentication requests by email (track request by email, no login). Not present in ad-old constants or client. |

---

## Three-phase integration plan

### Phase 1: UI exists but different APIs

**Goal:** Keep existing screens and wire them to the correct (missing) APIs.

**Phase 1 APIs (16):**

1. `/reset-password-submit`
2. `/verified-business`
3. `/forum/verified-business-list`
4. `/forum/verify-certificate`
5. `/ad/checkout-braintree`
6. `/forum/valuation-coa/valuation-coa-checkout-braintree`
7. `/forum/authenticity-cards-orders/authenticity-cards-change-status`
8. `/ad/get-query-price`
9. `/ad/free-submit`
10. `/ad/bundle-query-form-submit`
11. `/ad/process-paypal`
12. `/forum/get-all-plans`
13. `/forum/get-subscription`
14. `/forum/create-subscription`
15. `/forum/cancel-subscription`
16. `/ad/free-process-paypal`

| Existing UI (client) | Currently uses | Target API to integrate |
|----------------------|----------------|-------------------------|
| Reset Password page (`/reset-password`) | `/change-password` with token | `/reset-password-submit` |
| Home – Sellers / verified section | `/ad/get-all-seller`, `/ad/get-verified-seller` | `/verified-business`, `/forum/verified-business-list` |
| Verify page – "Verify Your Certificate" form | `console.log` only | `/forum/verify-certificate` |
| Checkout page | Direct submit (authenticity-cards-submit, etc.) | Braintree flow: `/ad/checkout-braintree`, `/forum/valuation-coa/valuation-coa-checkout-braintree`, `/forum/authenticity-cards-orders/authenticity-cards-change-status` |
| Cart / Authentication (bulk) flow | Different submit flow | `/ad/get-query-price`, `/ad/free-submit`, `/ad/bundle-query-form-submit`, `/ad/process-paypal` |
| Subscription page (`/subscription`) | Hardcoded plans, `changePaymentStatusBundle` only | `/forum/get-all-plans`, `/forum/get-subscription`, `/forum/create-subscription`, `/forum/cancel-subscription`, `/ad/free-process-paypal` |

---

### Phase 2: No UI but APIs exist

**Goal:** Build new UI and integrate these APIs (backend/ad-old APIs exist, client has no screens for them).

| Missing API | What to build |
|-------------|----------------|
| `/forum/delete-account` | Delete account flow (e.g. in profile/settings) |
| `/ad/get-business-profile-slug` | Public business profile page by slug (e.g. for reviews page) |
| `/forum/certificate-note` | Edit/update certificate note on certificate detail |
| `/ad/update-request-more-images`, `/ad/user-update-query-images` | "Request more images" – submit/update images when admin requested more |
| `/request-more-images-submit`, `GET /request-more-images/{id}` | Request-more-images page: view request details and submit images |
| `/forum/show-coa-receipts` | Receipts page (e.g. `/receipts`): list COA receipts (date range, etc.) |
| `/ADCOA`, `/certificate` (UUID) | View COA/certificate PDF (by ID or UUID) from profile/certificate card |
| `GET /forum/valuation-coa` | "My valuations" list page |
| `GET /public/requests/getViaEmail?email=...` | "Track your request" page: enter email, show requests (no login) |

---

### Phase 3: UI exists and no API

**Goal:** Existing screens have no API call; add the missing API integration.

| Existing UI (client) | Missing API to integrate |
|----------------------|---------------------------|
| Add Business page (`/add-business`) | POST `/ad/register-business` – form has `console.log` only; wire submit to this API |
| Verify page – certificate number form | Form exists; wire submit to `/forum/verify-certificate` (can also be done in Phase 1) |
| Header "Receipts" link (`/receipts`) | No route or page yet; add `/receipts` route + page and integrate `/forum/show-coa-receipts` (overlaps Phase 2) |

**Note:** Verify certificate appears in Phase 1 (wire correct API) and Phase 3 (UI exists, no API); pick one when implementing. Receipts: build page in Phase 2, then wire API when adding the route in Phase 3.

---

## Summary

- **Auth/account:** reset-password-submit, delete-account  
- **Profile/business:** get-business-profile-slug, verified-business, verified-business-list  
- **Verify:** verify-certificate  
- **Payments:** checkout-braintree, valuation-coa-checkout-braintree, authenticity-cards-change-status (Braintree completion)  
- **Bulk/auth:** get-query-price, free-submit, bundle-query-form-submit, process-paypal  
- **Subscriptions:** get-all-plans, get-subscription, create-subscription, cancel-subscription, free-process-paypal  
- **Certificates/COA:** show-coa-receipts, ADCOA, certificate (UUID), valuation-coa GET list, certificate-note, update-request-more-images, user-update-query-images  
- **Request more images:** request-more-images-submit, request-more-images (GET by id)  
- **Business:** register-business (client Add Business has no API)  
- **Public:** getViaEmail (requests by email) — not in ad-old codebase, not in client  

Path differences (e.g. ad-old `valuation-coa-submit-web` vs client `valuation-coa-submit`) are not listed as “missing” if they target the same backend behavior.

---

## Cross-check reference (ad-old constants)

All endpoints from `ad-old/utils/api/constants.js` were compared to `client/src/services/*`. Any endpoint not found in client (or with no equivalent path/usage) is listed above. Ad-old also uses `GET_ALL_PLANS` with query `?old_inclusive=web_yes_next` for plans; the base path is the same.

---

## Deep check: no API routes outside constants.js

A full pass over **ad-old** was done to find any backend API usage that does **not** come from `utils/api/constants.js`:

- **All backend API calls** in ad-old (axios/axiosInstance get/post) use paths that either are constants from `constants.js` or are variables that resolve to those constants (e.g. `endpoint`, `apiEndPoint`, `apiDataCall`, `__url_get_plans` = GET_ALL_PLANS + query).
- **No hardcoded backend path strings** were found (no literal `"/ad/..."` or `"/forum/..."` used directly in request calls). Paths are always from the constants file or from variables derived from it.
- **No other config file** defines backend API routes. Only the base URL is configured via env: `NEXT_PUBLIC_API_BASE_URL` in `utils/api/axios-client.js`.
- **getViaEmail** (`GET /public/requests/getViaEmail?email=...`) does **not** appear anywhere in ad-old; it is listed in Section 10 as a requested/public endpoint, not from ad-old.
- **External URLs only:** `https://api.ipify.org?format=json` (IP lookup in cart), `NEXT_PUBLIC_MEDIA_BASE_URL` (S3/media URLs for images/PDFs), and `blurDataUrl(url)` (arbitrary image URL for blur hash). None of these are backend API route paths.
- **Next.js API route** `ad-old/src/pages/api/hello.js` is a demo route (returns `{ name: "John Doe" }`), not a call to the Laravel/backend API.

**Conclusion:** The list of “APIs in ad-old not in client” is complete for the ad-old codebase: every backend API it calls is defined in `constants.js`, and the 26 entries not in the client (Sections 1–9) plus getViaEmail (Section 10) are the only ones to consider for integration.

---

## Verification: every ad-old constant (51 total)

| # | ad-old constant | Path | In client? |
|---|-----------------|------|------------|
| 1 | SIMPLE_USER_SIGNUP | /register-user | Yes |
| 2 | BUSINESS_USER_SIGNUP | /register-business-user | Yes |
| 3 | GET_ALL_VERIFIED_BUSINESS | /verified-business | **No** (Section 2) |
| 4 | GET_USER_PROFILE | /ad/get-user-profile | Yes |
| 5 | USER_UPDATE_PROFILE | /ad/update-user-profile | Yes |
| 6 | GET_BUSINESS_PROFILE | /ad/get-business-profile-new | Yes (client: get-business-profile) |
| 7 | GET_BUSINESS_PROFILE_SLUG | /ad/get-business-profile-slug | **No** (Section 2) |
| 8 | UPDATE_BUSINESS_PROFILE | /ad/update-business-profile | Yes |
| 9 | GET_ALL_VERIFIED_BUSINESS_LIST | /forum/verified-business-list | **No** (Section 2) |
| 10 | USER_LOGIN | /login-user | Yes |
| 11 | SUBMIT_REVIEW | /ad/review-submit | Yes |
| 12 | SUBMIT_REVIEW_REPLY | /ad/review-reply-submit | Yes |
| 13 | REVIEW_DELETE | /ad/review-delete | Yes |
| 14 | REVIEW_REPLY_DELETE | /ad/review-reply-delete | Yes |
| 15 | CHANGE_PASSWORD | /ad/change-password | Yes (client: /change-password) |
| 16 | FORGET_PASSWORD | /forget-password | Yes |
| 17 | AUTHENTICATE_NOW_SUBMIT | /ad/authenticate-now-submit | Yes |
| 18 | SUBMIT_SINGLE_AUTHENTICATION | /ad/process-paypal | **No** (Section 5) |
| 19 | DELETE_ACCOUNT | /forum/delete-account | **No** (Section 1) |
| 20 | CHECKOUT_BRAINTREE | /ad/checkout-braintree | **No** (Section 4) |
| 21 | SUBMIT_VALUATION_API | /forum/valuation-coa/valuation-coa-submit-web | Yes (client: valuation-coa-submit) |
| 22 | BRAINTREE_FOR_VALUATION | /forum/valuation-coa/valuation-coa-checkout-braintree | **No** (Section 4) |
| 23 | UPLOAD_MEDIA | /ad/upload-image | Yes |
| 24 | VERIFY_CERTIFICATE | /forum/verify-certificate | **No** (Section 3) |
| 25 | GET_BRANDS | /ad/get-brands | Yes |
| 26 | GET_ALL_BRANDS_WITH_CATEGORIES | /authenticate-now-view | Yes |
| 27 | AUTHENTICITY_CARDS_SUBMIT | /forum/authenticity-cards-submit-web | Yes (client: authenticity-cards-submit) |
| 28 | AUTHENTICITY_CARDS_PRICING | .../authenticity-card-pricing | Yes |
| 29 | AUTHENTICITY_CARDS_CHNAGE_STATUS | .../authenticity-cards-change-status | **No** (Section 4) |
| 30 | GET_PRICE_BULK_CASE | /ad/get-query-price | **No** (Section 5) |
| 31 | VERIFY_COUPON | /ad/verify-coupon | Yes |
| 32 | SUBMIT_BULK_FORM_FREE | /ad/free-submit | **No** (Section 5) |
| 33 | SUBMIT_BULK_AUTHENTICATION | /ad/bundle-query-form-submit | **No** (Section 5) |
| 34 | RESET_PASSWORD | /reset-password-submit | **No** (Section 1) |
| 35 | SHOW_COA_RECEIPTS | /forum/show-coa-receipts | **No** (Section 7) |
| 36 | GET_ALL_PLANS | /forum/get-all-plans | **No** (Section 6) |
| 37 | CREATE_SUBSCRIPTION | /forum/create-subscription | **No** (Section 6) |
| 38 | GET_SUBSCRIPTION | /forum/get-subscription | **No** (Section 6) |
| 39 | CANCEL_SUBSCRIPTION | /forum/cancel-subscription | **No** (Section 6) |
| 40 | SINGLE_FREE_SUBSCRIPTION | /ad/free-process-paypal | **No** (Section 6) |
| 41 | GET_COA_PDF | /ADCOA | **No** (Section 7) |
| 42 | CERTIFICATE_UUID_TO_PDF | /certificate | **No** (Section 7) |
| 43 | SUBMIT_REQUEST_MORE_IMAGES | /request-more-images-submit | **No** (Section 8) |
| 44 | REQUEST_MORE_IMAGES_DETAILS | /request-more-images | **No** (Section 8) |
| 45 | ADD_A_BUSINESS | /ad/register-business | **No** (Section 9) |
| 46 | GET_CERTIFICATES | /ad/get-user-queries | Yes |
| 47 | GET_VALUATIONS | /forum/valuation-coa (GET list) | **No** (Section 7) |
| 48 | UPDATE_CERTIFICATE_NOTE | /forum/certificate-note | **No** (Section 7) |
| 49 | MARK_CERTIFICATE_SOLD | /ad/is-sold | Yes |
| 50 | UPDATE_REQUEST_MORE_IMAGES | /ad/update-request-more-images | **No** (Section 7) |
| 51 | USER_UPDATE_QUERY_IMAGES | /ad/user-update-query-images | **No** (Section 7) |

**Count: 51 ad-old constants. 25 are in client (or equivalent path). 26 are not in client** and are covered in Sections 1–9 above. No ad-old API from `constants.js` is missing from this list.
