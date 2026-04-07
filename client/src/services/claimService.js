import { request } from './apiClient';

export const claimBusiness = async ({
  id,
  website,
  country,
  business_phone,
  business_instagram,
  business_facebook,
  business_linkedin,
  business_twitter,
  hemlock_link,
  category,
  model,
  description,
  email,
  business_profile_picture,
  business_cover_picture,
  storage_type = 'reviewImage',
  business_name,
  about_business,
  token,
} = {}) => {
  if (!id) throw new Error('Business ID is required');
  if (!email) throw new Error('Email is required');

  const formData = new FormData();
  formData.append('id', String(id));
  formData.append('email', email);
  if (storage_type) formData.append('storage_type', storage_type);
  if (website) formData.append('website', website);
  if (country) formData.append('country', country);
  if (business_phone) formData.append('business_phone', business_phone);
  if (business_instagram) formData.append('business_instagram', business_instagram);
  if (business_facebook) formData.append('business_facebook', business_facebook);
  if (business_linkedin) formData.append('business_linkedin', business_linkedin);
  if (business_twitter) formData.append('business_twitter', business_twitter);
  if (hemlock_link) formData.append('hemlock_link', hemlock_link);
  if (category) formData.append('category', category);
  if (model) formData.append('model', model);
  if (description) formData.append('description', description);
  if (business_profile_picture) formData.append('business_profile_picture', business_profile_picture);
  if (business_cover_picture) formData.append('business_cover_picture', business_cover_picture);
  if (business_name) formData.append('business_name', business_name);
  if (about_business) formData.append('about_business', about_business);

  return request('/ad/claim-business', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
