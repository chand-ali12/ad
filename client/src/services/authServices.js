import { request } from "./apiClient";

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, value);
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const registerUser = async ({
  name,
  email,
  password,
  business_name,
  website,
} = {}) => {
  const formData = new FormData();
  appendIfPresent(formData, "name", name);
  appendIfPresent(formData, "email", email);
  appendIfPresent(formData, "password", password);
  appendIfPresent(formData, "business_name", business_name);
  appendIfPresent(formData, "website", website);

  return request("/register-user", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const registerBusinessUser = async ({
  name,
  email,
  password,
  business_name,
  website,
  business_brands,
  country,
} = {}) => {
  const formData = new FormData();
  appendIfPresent(formData, "name", name);
  appendIfPresent(formData, "email", email);
  appendIfPresent(formData, "password", password);
  appendIfPresent(formData, "business_name", business_name);
  appendIfPresent(formData, "website", website);
  appendIfPresent(formData, "business_brands", business_brands);
  appendIfPresent(formData, "country", country);

  return request("/register-business-user", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

/** Login: same as ad-old - POST /login-user with JSON body { email, password } so backend creates session forum/subscription expects */
export const loginUser = async ({
  email,
  password,
  name,
  business_name,
  website,
  userType,
} = {}) => {
  const body = { email, password };
  if (name != null) body.name = name;
  if (business_name != null) body.business_name = business_name;
  if (website != null) body.website = website;
  if (userType != null) body.userType = userType;

  return request("/login-user", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
};

export const logoutUser = async (token) =>
  request("/logout", {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export const forgetPassword = async ({ email } = {}) => {
  const formData = new FormData();
  appendIfPresent(formData, "email", email);
  const clientResetUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : "";
  // Send common redirect keys so backend can generate reset link for this website.
  appendIfPresent(formData, "reset_url", clientResetUrl);
  appendIfPresent(formData, "redirect_url", clientResetUrl);
  appendIfPresent(formData, "web_url", clientResetUrl);
  appendIfPresent(formData, "frontend_url", clientResetUrl);
  appendIfPresent(formData, "redirect_to", clientResetUrl);
  appendIfPresent(formData, "reset_link", clientResetUrl);

  return request("/forget-password", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const changePassword = async ({
  // password,
  // password_confirmation,
  newPassword,
  // confirmPassword,
  // token,
  // email,
  authToken,
} = {}) => {
  // const finalPassword = password ?? newPassword;
  // const finalConfirmation = password_confirmation ?? confirmPassword;
  // const effectiveToken = token ?? authToken;

  // const query = buildQueryString({
  //   password: finalPassword,
  //   password_confirmation: finalConfirmation,
  //   token: effectiveToken,
  //   email,
  // });

  const password = newPassword;

  return request(`/ad/change-password`, {
    method: "POST",
    // headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    headers: authToken ? { sessiontoken: authToken } : undefined,
    body: {
      password,
      // token: authToken,
    },
  });
};

/** Phase 1: Reset password after forgot-password link (ad-old uses this endpoint) */
export const resetPasswordSubmit = async ({
  password,
  password_confirmation,
  newPassword,
  confirmPassword,
  token,
  email,
} = {}) => {
  const finalPassword = password ?? newPassword;
  const finalConfirmation = password_confirmation ?? confirmPassword;
  const body = {
    password: finalPassword,
    password_confirmation: finalConfirmation,
    token: token || undefined,
    ...(email && { email }),
  };
  return request("/reset-password-submit", {
    method: "POST",
    body,
  });
};
