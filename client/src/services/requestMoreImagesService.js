import { request } from './apiClient';

/**
 * Phase 2: Get request-more-images details by id (ad-old: REQUEST_MORE_IMAGES_DETAILS)
 * GET /request-more-images/{id}
 */
export const getRequestMoreImagesDetails = async ({ id, token } = {}) => {
  if (!id) throw new Error('Request ID is required');
  return request(`/request-more-images/${encodeURIComponent(String(id))}`, {
    method: 'GET',
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * Phase 2: Submit request more images (ad-old: SUBMIT_REQUEST_MORE_IMAGES)
 * POST /request-more-images-submit
 * Body: { uploadedImages: string (comma-separated), queryId: string, request_id: string }
 */
export const submitRequestMoreImages = async ({
  uploadedImages,
  queryId,
  request_id,
  token,
} = {}) => {
  if (!queryId) throw new Error('Query ID is required');
  const body = {
    uploadedImages: Array.isArray(uploadedImages) ? uploadedImages.join(',') : String(uploadedImages ?? ''),
    queryId: String(queryId),
    request_id: request_id != null ? String(request_id) : '',
  };
  return request('/request-more-images-submit', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Submit/update more images when admin requested (ad-old: UPDATE_REQUEST_MORE_IMAGES)
 * POST /ad/update-request-more-images
 * Body: typically query_id, request_id, uploaded_images (comma-separated or array)
 */
export const updateRequestMoreImages = async ({
  query_id,
  request_id,
  uploaded_images,
  token,
} = {}) => {
  if (!query_id) throw new Error('Query ID is required');
  const body = {
    query_id: String(query_id),
    request_id: request_id != null ? String(request_id) : '',
    uploaded_images: Array.isArray(uploaded_images) ? uploaded_images.join(',') : String(uploaded_images ?? ''),
  };
  return request('/ad/update-request-more-images', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Submit requested images from certificate flow (ad-old: same endpoint with FormData)
 * POST /ad/update-request-more-images
 * FormData: authenticate_id, images - used when admin requested more images (certificate card)
 */
export const updateRequestMoreImagesCertificate = async ({
  authenticate_id,
  images,
  token,
} = {}) => {
  if (authenticate_id == null || authenticate_id === '') throw new Error('Authenticate ID is required');
  const imagesValue = Array.isArray(images) ? images.join(',') : String(images ?? '');
  const formData = new FormData();
  formData.append('authenticate_id', String(authenticate_id));
  formData.append('images', imagesValue);
  return request('/ad/update-request-more-images', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * User update query images (ad-old: USER_UPDATE_QUERY_IMAGES)
 * POST /ad/user-update-query-images
 * FormData: authenticate_id, images (comma-separated) - same as ad-old
 */
export const userUpdateQueryImages = async ({
  authenticate_id,
  query_id,
  images,
  uploaded_images,
  token,
} = {}) => {
  const id = authenticate_id ?? query_id;
  if (id == null || id === '') throw new Error('Authenticate/query ID is required');
  const imagesStr = images ?? uploaded_images;
  const imagesValue = Array.isArray(imagesStr) ? imagesStr.join(',') : String(imagesStr ?? '');
  const formData = new FormData();
  formData.append('authenticate_id', String(id));
  formData.append('images', imagesValue);
  return request('/ad/user-update-query-images', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
