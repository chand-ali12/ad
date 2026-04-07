//simple user endpoints
export const SIMPLE_USER_SIGNUP = "/register-user";

//business user endpoints
export const BUSINESS_USER_SIGNUP = "/register-business-user";
export const GET_ALL_VERIFIED_BUSINESS = "/verified-business";

export const GET_USER_PROFILE = "/ad/get-user-profile";
export const USER_UPDATE_PROFILE = "/ad/update-user-profile";
export const GET_BUSINESS_PROFILE = "/ad/get-business-profile-new";
export const GET_BUSINESS_PROFILE_SLUG = "/ad/get-business-profile-slug";
export const UPDATE_BUSINESS_PROFILE = "/ad/update-business-profile";

export const GET_ALL_VERIFIED_BUSINESS_LIST = "/forum/verified-business-list";

//common endpoints
export const USER_LOGIN = "/login-user";
export const SUBMIT_REVIEW = "/ad/review-submit";
export const SUBMIT_REVIEW_REPLY = "/ad/review-reply-submit";
export const REVIEW_DELETE = "/ad/review-delete";
export const REVIEW_REPLY_DELETE = "/ad/review-reply-delete";
export const CHANGE_PASSWORD = "/ad/change-password";
export const FORGET_PASSWORD = "/forget-password";
export const AUTHENTICATE_NOW_SUBMIT = "/ad//authenticate-now-submit";
export const SUBMIT_SINGLE_AUTHENTICATION = "/ad/process-paypal";
export const DELETE_ACCOUNT = "/forum/delete-account";
export const CHECKOUT_BRAINTREE = "/ad/checkout-braintree";

export const SUBMIT_VALUATION_API =
  "/forum/valuation-coa/valuation-coa-submit-web";

export const BRAINTREE_FOR_VALUATION =
  "/forum/valuation-coa/valuation-coa-checkout-braintree";

//general API Calls endpoints
export const UPLOAD_MEDIA = "/ad/upload-image";
export const VERIFY_CERTIFICATE = "/forum/verify-certificate";

export const GET_BRANDS = "/ad/get-brands";
export const GET_ALL_BRANDS_WITH_CATEGORIES = "/authenticate-now-view";

export const AUTHENTICITY_CARDS_SUBMIT = "/forum/authenticity-cards-submit-web";
export const AUTHENTICITY_CARDS_PRICING =
  "/forum/authenticity-cards-orders/authenticity-card-pricing";

export const AUTHENTICITY_CARDS_CHNAGE_STATUS =
  "/forum/authenticity-cards-orders/authenticity-cards-change-status";

export const GET_PRICE_BULK_CASE = "/ad/get-query-price";
export const VERIFY_COUPON = "/ad/verify-coupon";
export const SUBMIT_BULK_FORM_FREE = "/ad/free-submit";
export const SUBMIT_BULK_AUTHENTICATION = "/ad/bundle-query-form-submit";
export const RESET_PASSWORD = "/reset-password-submit";

export const SHOW_COA_RECEIPTS = "/forum/show-coa-receipts";

export const GET_ALL_PLANS = "/forum/get-all-plans";
export const CREATE_SUBSCRIPTION = "/forum/create-subscription";
export const GET_SUBSCRIPTION = "/forum/get-subscription";
export const CANCEL_SUBSCRIPTION = "/forum/cancel-subscription";
export const SINGLE_FREE_SUBSCRIPTION = "/ad/free-process-paypal";

export const GET_COA_PDF = "/ADCOA";
export const CERTIFICATE_UUID_TO_PDF = "/certificate";
export const SUBMIT_REQUEST_MORE_IMAGES = "/request-more-images-submit";
export const REQUEST_MORE_IMAGES_DETAILS = "/request-more-images";

export const ADD_A_BUSINESS = "/ad/register-business";

//certificates endpoints
export const GET_CERTIFICATES = "/ad/get-user-queries";
export const GET_VALUATIONS = "/forum/valuation-coa";
export const UPDATE_CERTIFICATE_NOTE = "/forum/certificate-note";
export const MARK_CERTIFICATE_SOLD = "/ad/is-sold";
export const UPDATE_REQUEST_MORE_IMAGES = "/ad/update-request-more-images";
export const USER_UPDATE_QUERY_IMAGES = "/ad/user-update-query-images";
