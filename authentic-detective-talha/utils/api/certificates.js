import axiosInstance from "./axios-client";
import {
  GET_CERTIFICATES,
  GET_VALUATIONS,
  UPDATE_CERTIFICATE_NOTE,
  MARK_CERTIFICATE_SOLD,
  UPDATE_REQUEST_MORE_IMAGES,
  USER_UPDATE_QUERY_IMAGES,
} from "./constants";
import { notifyError, notifySuccess } from "../toast";

/**
 * Get certificates list
 * @param {Object} params - Query parameters
 * @param {string} params.certificate_id - Search query
 * @param {string} params.brand - Brand filter
 * @param {string} params.order_by - "desc" | "asc"
 * @param {number} params.type - 1 for completed, 0 for pending
 * @param {number} params.issold - 0 for available, 1 for sold
 * @param {number} params.page - Page number
 * @param {number} params.all - 1 to bypass pagination
 */
export const getCertificates = async (params = {}) => {
  try {
    const formData = new FormData();
    
    // Set default values - all fields should be strings as per API
    formData.append("certificate_id", params.certificate_id || "");
    formData.append("brand", params.brand || "");
    formData.append("order_by", params.order_by || "desc");
    
    // Type: 1 for completed, 0 for pending
    if (params.type !== undefined) {
      formData.append("type", String(params.type));
    }
    
    // isSold: 0 for available, 1 for sold (only for completed certificates)
    if (params.issold !== undefined) {
      formData.append("issold", String(params.issold));
    }
    
    // Page number (not used when all=1)
    if (params.page !== undefined) {
      formData.append("page", String(params.page));
    }
    
    // All: 1 to bypass pagination
    formData.append("all", params.all !== undefined ? String(params.all) : "1");

    const response = await axiosInstance.post(GET_CERTIFICATES, formData);
    return response?.data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    notifyError(error?.response?.data?.msg || "Failed to fetch certificates");
    throw error;
  }
};

/**
 * Update certificate note
 * @param {string} certificateId - Certificate ID
 * @param {string} note - Note text (optional)
 */
export const updateCertificateNote = async (certificateId, note = null) => {
  try {
    const formData = new FormData();
    formData.append("id", certificateId);
    if (note !== null) {
      formData.append("note", note);
    }

    const response = await axiosInstance.post(UPDATE_CERTIFICATE_NOTE, formData);
    if (response?.data?.status_code === 200) {
      notifySuccess(response?.data?.msg || "Note updated successfully");
    }
    return response?.data;
  } catch (error) {
    console.error("Error updating certificate note:", error);
    notifyError(error?.response?.data?.msg || "Failed to update note");
    throw error;
  }
};

/**
 * Mark certificate as sold/unsold
 * @param {string} certificateId - Certificate ID
 */
export const markCertificateSold = async (certificateId) => {
  try {
    const formData = new FormData();
    formData.append("certificate_id", certificateId);

    const response = await axiosInstance.post(MARK_CERTIFICATE_SOLD, formData);
    if (response?.data?.status_code === 200) {
      notifySuccess(response?.data?.msg || "Certificate status updated");
    }
    return response?.data;
  } catch (error) {
    console.error("Error marking certificate as sold:", error);
    notifyError(error?.response?.data?.msg || "Failed to update certificate status");
    throw error;
  }
};

/**
 * Submit request more images (admin requested)
 * @param {string} authenticateId - Authenticate ID
 * @param {string} images - Comma-separated image URLs
 */
export const submitRequestMoreImages = async (authenticateId, images) => {
  try {
    const formData = new FormData();
    formData.append("authenticate_id", authenticateId);
    formData.append("images", images);

    const response = await axiosInstance.post(
      UPDATE_REQUEST_MORE_IMAGES,
      formData
    );
    if (response?.data?.status_code === 200) {
      notifySuccess(response?.data?.msg || "Images submitted successfully");
    }
    return response?.data;
  } catch (error) {
    console.error("Error submitting request more images:", error);
    notifyError(error?.response?.data?.msg || "Failed to submit images");
    throw error;
  }
};

/**
 * User update query images
 * @param {string} authenticateId - Authenticate ID
 * @param {string} images - Comma-separated image URLs
 */
export const userUpdateQueryImages = async (authenticateId, images) => {
  try {
    const formData = new FormData();
    formData.append("authenticate_id", authenticateId);
    formData.append("images", images);

    const response = await axiosInstance.post(
      USER_UPDATE_QUERY_IMAGES,
      formData
    );
    if (response?.data?.status_code === 200) {
      notifySuccess(response?.data?.msg || "Images updated successfully");
    }
    return response?.data;
  } catch (error) {
    console.error("Error updating query images:", error);
    notifyError(error?.response?.data?.msg || "Failed to update images");
    throw error;
  }
};

/**
 * Get valuations list
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Items per page
 * @param {number} params.page - Page number
 */
export const getValuations = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      `${GET_VALUATIONS}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching valuations:", error);
    notifyError(error?.response?.data?.msg || "Failed to fetch valuations");
    throw error;
  }
};

