import { request } from './apiClient';

export const submitReview = async ({
  id, // business_id
  review,
  rating,
  description,
  email,
  image,
  token,
} = {}) => {
  if (!id) {
    throw new Error('Business ID is required');
  }
  if (!review) {
    throw new Error('Review text is required');
  }
  if (!rating) {
    throw new Error('Rating is required');
  }

  const formData = new FormData();
  formData.append('id', id);
  formData.append('review', review);
  formData.append('rating', rating.toString());
  
  if (description) formData.append('description', description);
  if (email) formData.append('email', email);
  if (image) formData.append('image', image);

  return request('/ad/review-submit', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const submitReviewReply = async ({
  id, // review_id
  review_reply,
  token,
} = {}) => {
  if (!id) {
    throw new Error('Review ID is required');
  }
  if (!review_reply || !review_reply.trim()) {
    throw new Error('Reply text is required');
  }

  const formData = new FormData();
  formData.append('id', id.toString());
  formData.append('review_reply', review_reply.trim());

  return request('/ad/review-reply-submit', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const deleteReview = async ({
  id, // review_id
  token,
} = {}) => {
  if (!id) {
    throw new Error('Review ID is required');
  }

  const formData = new FormData();
  formData.append('id', id.toString());

  return request('/ad/review-delete', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const updateReviewReply = async ({
  id, // review_reply_id (for edit - same endpoint as submit)
  review_reply,
  token,
} = {}) => {
  if (!id) {
    throw new Error('Review Reply ID is required');
  }
  if (!review_reply || !review_reply.trim()) {
    throw new Error('Reply text is required');
  }

  const formData = new FormData();
  formData.append('id', id.toString());
  formData.append('review_reply', review_reply.trim());

  // Uses same endpoint as submit - backend treats id as reply_id for update
  return request('/ad/review-reply-submit', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const deleteReviewReply = async ({
  id, // review_reply_id
  token,
} = {}) => {
  if (!id) {
    throw new Error('Review Reply ID is required');
  }

  const formData = new FormData();
  formData.append('id', id.toString());

  return request('/ad/review-reply-delete', {
    method: 'POST',
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
