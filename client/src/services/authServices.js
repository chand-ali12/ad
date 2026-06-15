import { request } from "./apiClient";

export const registerUser = async ({ name, email, password } = {}) => {
  return request("/auth/register-user", {
    method: "POST",
    body: { name, email, password },
    headers: { "Content-Type": "application/json" },
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
  return request("/auth/register-business-user", {
    method: "POST",
    body: { name, email, password, business_name, website, country, business_brands },
    headers: { "Content-Type": "application/json" },
  });
};

export const loginUser = async ({ email, password } = {}) => {
  return request("/auth/login-user", {
    method: "POST",
    body: { email, password, fcm_token: "", device_type: "web" },
    headers: { "Content-Type": "application/json" },
  });
};

export const logoutUser = async (token) =>
  request("/auth/logout", {
    method: "POST",
    headers: token ? { sessiontoken: token } : undefined,
  });

export const forgetPassword = async ({ email } = {}) => {
  return request("/auth/forget-password", {
    method: "POST",
    body: { email },
    headers: { "Content-Type": "application/json" },
  });
};

/** Change password for a logged-in user (type: change, requires old_password). */
export const changePassword = async ({
  newPassword,
  old_password,
  authToken,
} = {}) => {
  return request("/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { sessiontoken: authToken } : {}),
    },
    body: {
      type: "change",
      new_password: newPassword,
      old_password: old_password ?? null,
    },
  });
};

/** Reset password via forgot-password email link. Token from URL goes in sessiontoken header. */
export const resetPasswordSubmit = async ({ newPassword, token } = {}) => {
  return request("/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
    body: {
      type: "forget",
      new_password: newPassword,
    },
  });
};
