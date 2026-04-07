/**
 * Check if certificate is pending (admin requested more images)
 * @param {Object} certificate - Certificate object
 * @returns {boolean} - True if pending
 */
export const isPendingCertificate = (certificate) => {
  const requestMoreImages = certificate.request_more_images || [];
  // Check if any request has status === 0 (admin requested more images)
  return requestMoreImages.some((item) => item.status === 0);
};

/**
 * Check if certificate is completed (has certificate_id)
 * @param {Object} certificate - Certificate object
 * @returns {boolean} - True if completed
 */
export const isCompletedCertificate = (certificate) => {
  // Certificate is completed if it has a certificate object with certificate_id
  return !!(certificate.certificate && certificate.certificate.certificate_id);
};

/**
 * Get certificate status text
 * @param {Object} certificate - Certificate object
 * @returns {string} - Status text
 */
export const getCertificateStatus = (certificate) => {
  // Check if certificate exists and has result
  if (!certificate.certificate) {
    return "Pending";
  }
  
  // If result is "Inconclusive", show "Unverified - Refunded"
  if (  certificate.certificate.certificate_id == "Inconclusive") {
    return "Unverified - Refunded";
  }
  
  return certificate.certificate.result || "Pending";
};

/**
 * Get certificate status badge color
 * @param {string} status - Status text
 * @returns {string} - Color code
 */
export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Authentic":
      return "#4caf50"; // Green
    case "Inconclusive":
      return "#ff9800"; // Orange
    case "Not Authentic":
      return "#f44336"; // Red
    case "Unverified - Refunded":
      return "#f44336"; // Red
    default:
      return "#9e9e9e"; // Grey
  }
};

/**
 * Get completed certificate thumbnail URL
 * @param {Object} certificate - Certificate object
 * @returns {string|null} - Thumbnail URL or null
 */
export const getCompletedThumbnailUrl = (certificate) => {
  if (!certificate.certificate?.pdf) return null;

  const storageType =
    certificate.certificate.certificate_id == "Inconclusive"
      ? "pdfInconclusive/thumbnail"
      : "pdfThumbnail";

  const pdfFile = certificate.certificate.pdf;
  const thumbnailPath = pdfFile.replace(".pdf", ".png");

  return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${storageType}/${thumbnailPath}`;
};

/**
 * Get pending certificate thumbnail URL (first image from all image types)
 * @param {Object} certificate - Certificate object
 * @returns {string|null} - Thumbnail URL or null
 */
export const getPendingThumbnailUrl = (certificate) => {
  // Combine request_images and attribute_images (comma-separated strings)
  const allImages = [];
  
  if (certificate.request_images) {
    const requestImages = certificate.request_images.split(",").map(img => img.trim()).filter(Boolean);
    allImages.push(...requestImages);
  }
  
  if (certificate.attribute_images) {
    const attributeImages = certificate.attribute_images.split(",").map(img => img.trim()).filter(Boolean);
    allImages.push(...attributeImages);
  }

  if (allImages.length === 0) return null;

  const firstImage = allImages[0];
  return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/authenticateImage/${firstImage}`;
};

/**
 * Get all images for pending certificate
 * @param {Object} certificate - Certificate object
 * @returns {Array} - Array of image URLs
 */
export const getAllPendingImages = (certificate) => {
  // Combine request_images and attribute_images (comma-separated strings)
  const allImages = [];
  
  if (certificate.request_images) {
    const requestImages = certificate.request_images.split(",").map(img => img.trim()).filter(Boolean);
    allImages.push(...requestImages);
  }
  
  if (certificate.attribute_images) {
    const attributeImages = certificate.attribute_images.split(",").map(img => img.trim()).filter(Boolean);
    allImages.push(...attributeImages);
  }

  return allImages.map(
    (image) =>
      `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/authenticateImage/${image}`
  );
};

/**
 * Get requested attributes for more images
 * @param {Object} certificate - Certificate object
 * @returns {Array} - Array of attribute strings
 */
export const getRequestedAttributes = (certificate) => {
  const requestMoreImages = certificate.request_more_images || [];
  const attributes = [];

  requestMoreImages.forEach((item) => {
    if (item.attributes) {
      try {
        const parsed = JSON.parse(item.attributes);
        if (Array.isArray(parsed)) {
          attributes.push(...parsed);
        } else if (typeof parsed === "string") {
          attributes.push(parsed);
        }
      } catch (e) {
        // If not JSON, treat as string
        if (typeof item.attributes === "string") {
          attributes.push(item.attributes);
        }
      }
    }
  });

  return [...new Set(attributes)]; // Remove duplicates
};

/**
 * Filter certificates based on filters
 * @param {Array} certificates - Array of certificates
 * @param {Object} filters - Filter object
 * @returns {Array} - Filtered certificates
 */
export const filterCertificates = (certificates, filters) => {
  let filtered = [...certificates];

  // Filter by type (completed/pending)
  if (filters.type === "completed") {
    filtered = filtered.filter((cert) => isCompletedCertificate(cert));
  } else if (filters.type === "pending") {
    filtered = filtered.filter((cert) => !isCompletedCertificate(cert));
  }

  // Filter by sold/available (completed only)
  if (filters.type === "completed" && filters.subTab) {
    if (filters.subTab === "sold") {
      filtered = filtered.filter((cert) => cert.is_sold === 1);
    } else if (filters.subTab === "available") {
      filtered = filtered.filter(
        (cert) => cert.is_sold === 0 || cert.is_sold === undefined
      );
    }
  }

  // Filter by brand
  if (filters.brand) {
    filtered = filtered.filter(
      (cert) => cert.brand?.toLowerCase() === filters.brand.toLowerCase()
    );
  }

  // Search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (cert) =>
        cert.order_number?.toLowerCase().includes(searchLower) ||
        cert.brand?.toLowerCase().includes(searchLower) ||
        cert.model?.toLowerCase().includes(searchLower) ||
        cert.certificate?.certificate_id?.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const dateA = new Date(a.date || a.created_at || 0);
    const dateB = new Date(b.date || b.created_at || 0);
    return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return filtered;
};

/**
 * Get PDF URL for certificate
 * @param {Object} certificate - Certificate object
 * @returns {string|null} - PDF URL or null
 */
export const getCertificatePdfUrl = (certificate) => {
  if (!certificate.certificate?.pdf) return null;

  const pdfFile = certificate.certificate.pdf;
  const storageType =
    certificate.certificate.result === "Inconclusive"
      ? "pdfInconclusive"
      : "pdfCertificates";

  return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${storageType}/${pdfFile}`;
};

