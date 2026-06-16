import { request } from "./apiClient";

export const getUserProfile = async ({ id, token } = {}) => {
  if (!id) throw new Error("User ID is required");
  return request(`/profile/user-profile/${id}`, {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return request("/general/upload-image", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const updateUserProfile = async ({
  name,
  about_me,
  country,
  phone,
  profile_picture_url,
  facebook,
  instagram,
  token,
} = {}) => {
  const social_links = [];
  if (facebook) social_links.push({ name: "facebook", link: facebook });
  if (instagram) social_links.push({ name: "instagram", link: instagram });

  return request("/profile/update-user-profile", {
    method: "PATCH",
    body: {
      name,
      ...(about_me && { about_me }),
      ...(country && { country }),
      ...(phone && { phone }),
      ...(profile_picture_url && { profile_picture_url }),
      ...(social_links.length > 0 && { social_links }),
    },
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

export const getUserCertificate = async ({ token } = {}) => {
  return request("/ad/get-user-certificate", {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const getUserQueries = async ({
  token,
  type,
  all = 1,
  order_by = "desc",
} = {}) => {
  const formData = new FormData();
  formData.append("all", String(all));
  formData.append("order_by", order_by);
  if (type !== undefined) formData.append("type", String(type));
  return request("/ad/get-user-queries", {
    method: "POST",
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
