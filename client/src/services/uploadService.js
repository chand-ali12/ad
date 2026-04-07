import { request } from './apiClient';

export const uploadImage = async ({
  image,
  storage_type = 'postMedia',
  brand_name,
  category,
  model,
  description,
  email,
  token,
} = {}) => {
  if (!image) {
    throw new Error('Image file is required');
  }

  const formData = new FormData();
  formData.append('image', image);
  formData.append('storage_type', storage_type);
  if (brand_name) formData.append('brand_name', brand_name);
  if (category) formData.append('category', category);
  if (model) formData.append('model', model);
  if (description) formData.append('description', description);
  if (email) formData.append('email', email);

  return request('/ad/upload-image', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const uploadImageAsBase64 = async ({
  image,
  storage_type = 'authenticatelmage',
  brand_name,
  category,
  model,
  description,
  email,
  token,
} = {}) => {
  if (!image) {
    throw new Error('Image is required');
  }

  let base64String =
    typeof image === 'string'
      ? image
      : await fileToBase64(image);

  // API expects raw base64 without data URL prefix
  if (base64String.includes(',')) {
    base64String = base64String.split(',')[1];
  }

  const formData = new FormData();
  formData.append('image', base64String);
  formData.append('storage_type', storage_type);
  if (brand_name) formData.append('brand_name', brand_name);
  if (category) formData.append('category', category);
  if (model) formData.append('model', model);
  if (description) formData.append('description', description);
  if (email) formData.append('email', email);

  return request('/ad/upload-image-as-base64', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const deleteImage = async ({ uuid, storage_type = 'postMedia', token } = {}) => {
  if (!uuid) {
    throw new Error('Image uuid is required');
  }

  const formData = new FormData();
  formData.append('uuid', uuid);
  formData.append('storage_type', storage_type);

  return request('/ad/delete-image', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
