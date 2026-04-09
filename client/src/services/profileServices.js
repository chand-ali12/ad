import { request } from "./apiClient";

export const getUserProfile = async ({ id, token } = {}) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  return request(`/ad/get-user-profile?id=${id}`, {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const updateUserProfile = async ({
  id,
  name,
  about_us,
  country,
  phone,
  profile_picture,
  cover_picture,
  currentProfilePicture,
  currentCoverPicture,
  facebook,
  instagram,
  twitter,
  marketplace,
  storage_type = "usersProfile",
  token,
} = {}) => {
  const formData = new FormData();

  if (storage_type) formData.append("storage_type", storage_type);
  if (id) formData.append("id", id);
  if (name) formData.append("name", name);
  if (about_us) formData.append("about_us", about_us);
  if (country) formData.append("country", country);
  if (phone) formData.append("phone", phone);
  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  } else if (currentProfilePicture) {
    formData.append("profile_picture", currentProfilePicture);
  }
  if (cover_picture) {
    formData.append("cover_picture", cover_picture);
  } else if (currentCoverPicture) {
    formData.append("cover_picture", currentCoverPicture);
  }

  // if (cover_picture && profile_picture) {
  //   formData.append("profile_picture", profile_picture);
  //   formData.append("cover_picture", cover_picture);
  // } else if (profile_picture) {
  //   formData.append("profile_picture", profile_picture);
  //   formData.append("cover_picture", coverPicture);
  // } else if (cover_picture) {
  //   formData.append("cover_picture", cover_picture);
  //   formData.append("profile_picture", profilePicture);
  // }

  if (facebook) formData.append("facebook", facebook);
  if (instagram) formData.append("instagram", instagram);
  if (twitter) formData.append("twitter", twitter);
  if (marketplace) formData.append("marketplace", marketplace);

  return request("/ad/update-user-profile", {
    method: "POST",
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const getUserCertificate = async ({ token } = {}) => {
  return request("/ad/get-user-certificate", {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * Get user queries/certificates list.
 * Backend returns data[] only when type is sent (like authentic-detective-talha).
 * @param {Object} opts
 * @param {string} opts.token - Auth token
 * @param {number} opts.type - 0 = pending, 1 = completed (optional; if omitted, backend may return only counts and empty data)
 * @param {number} opts.all - 1 to get all records (default 1)
 * @param {string} opts.order_by - 'desc' | 'asc' (default 'desc')
 */
export const getUserQueries = async ({
  token,
  type,
  all = 1,
  order_by = "desc",
} = {}) => {
  const formData = new FormData();
  formData.append("all", String(all));
  formData.append("order_by", order_by);
  if (type !== undefined) {
    formData.append("type", String(type));
  }
  return request("/ad/get-user-queries", {
    method: "POST",
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
