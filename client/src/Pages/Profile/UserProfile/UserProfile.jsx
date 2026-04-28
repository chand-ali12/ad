import React, { useEffect, useState, useRef, useMemo } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import {
  getUserProfile,
  getUserCertificate,
  getUserQueries,
  updateCertificateNote,
} from "../../../store/slices/profileSlice";

import { getBusinessProfile } from "../../../store/slices/businessSlice";

import {
  submitReviewReply,
  deleteReview,
  deleteReviewReply,
  updateReviewReply,
} from "../../../store/slices/reviewsSlice";
import { uploadImage } from "../../../store/slices/uploadSlice";
import {
  changePaymentStatus,
  isSold,
} from "../../../store/slices/checkoutSlice";

import ProfileSection from "../../../sections/Profiles/UserProfile/ProfileSection/ProfileSection";

import CertificatesofAuthenticity, {
  getCertificatePdfUrl,
} from "../../../sections/Profiles/UserProfile/CertificatesofAuthenticity/CertificatesofAuthenticity";
import {
  getCoaPdf,
  getCertificatePdfByUuid,
} from "../../../services/forumService";
import {
  updateRequestMoreImagesCertificate,
  userUpdateQueryImages,
} from "../../../services/requestMoreImagesService";

const isCertificateSold = (cert) => {
  if (!cert) return false;
  const status = String(cert.status ?? "").toLowerCase();
  if (status === "sold") return true;
  if (status === "available") return false;
  const sold = cert.certificate?.is_sold ?? cert.is_sold ?? cert.issold;
  return sold === 1 || sold === "1" || sold === true;
};

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasScrolledToCertificatesRef = useRef(false);

  const dispatch = useAppDispatch();

  const { user: authUser, token: authToken } = useAppSelector(
    (state) => state.auth,
  );

  const {
    user,
    status,
    error,
    businessReviewCount,
    certificates,
    queries,
    queryCounts,
  } = useAppSelector((state) => state.profile);

  const {
    business,
    businessUserLogin,
    reviews: businessReviews,
    status: businessStatus,
  } = useAppSelector((state) => state.business);

  const { status: reviewStatus } = useAppSelector((state) => state.reviews);
  const { status: checkoutStatus } = useAppSelector((state) => state.checkout);

  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState(null);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const [showEditReplyModal, setShowEditReplyModal] = useState(false);
  const [replyToEdit, setReplyToEdit] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [isUpdatingReply, setIsUpdatingReply] = useState(false);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);
  const [showMarkStatusModal, setShowMarkStatusModal] = useState(false);
  const [certificateToToggleStatus, setCertificateToToggleStatus] =
    useState(null);
  const [markingSoldId, setMarkingSoldId] = useState(null);

  useEffect(() => {
    // Always refetch profile data when component mounts
    // This ensures we show the latest data after edits
    if (authUser?.id) {
      dispatch(getUserProfile({ id: authUser.id }));
      // Fetch completed certificates (old website uses get-user-queries with type=1)
      dispatch(getUserQueries({ type: 1 }));
      // Fetch user certificates from dedicated endpoint (may also return completed)
      dispatch(getUserCertificate());
      // Fetch pending queries (type=0) so backend returns data[]
      dispatch(getUserQueries({ type: 0 }));
    }
  }, [dispatch, authUser?.id]);

  // Scroll to certificates section when requested via query param (e.g. /profile?section=certificates)
  // Reset scroll flag when section query changes
  useEffect(() => {
    hasScrolledToCertificatesRef.current = false;
  }, [location.search]);

  // Scroll to certificates section when requested via query param (e.g. /profile?section=certificates)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section !== "certificates") return;
    if (hasScrolledToCertificatesRef.current) return;

    const timer = setTimeout(() => {
      const el = document.getElementById("certificates");
      if (el) {
        hasScrolledToCertificatesRef.current = true;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.search, certificates?.length, queries?.length]);

  // Fetch business profile if user has a business
  useEffect(() => {
    if (user && user.user_business && user.user_business.length > 0) {
      const businessId = user.user_business[0].id;

      dispatch(getBusinessProfile({ id: businessId }));
    }
  }, [dispatch, user]);

  const handleEditProfileClick = () => {
    navigate("/edit-profile");
  };

  const handleEditClick = (reviewId, replyId, currentText) => {
    setReplyToEdit({ reviewId, replyId });
    setEditReplyText(currentText || "");
    setShowEditReplyModal(true);
  };

  const handleConfirmEditReply = async () => {
    if (!replyToEdit || !editReplyText.trim()) return;

    setIsUpdatingReply(true);

    try {
      const result = await dispatch(
        updateReviewReply({
          id: replyToEdit.replyId,
          review_reply: editReplyText.trim(),
        }),
      ).unwrap();

      setToastMessage(result?.msg || "Reply updated successfully");
      setToastVariant("success");
      setShowToast(true);

      setShowEditReplyModal(false);
      setReplyToEdit(null);
      setEditReplyText("");

      if (authUser?.id) {
        await dispatch(getUserProfile({ id: authUser.id }));
      }
      if (business?.id) {
        await dispatch(getBusinessProfile({ id: business.id }));
      }

      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(error || "Failed to update reply");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsUpdatingReply(false);
    }
  };

  const handleCancelEditReply = () => {
    setShowEditReplyModal(false);
    setReplyToEdit(null);
    setEditReplyText("");
  };

  const handlePaymentStatusChange = async (queryId) => {
    try {
      const result = await dispatch(
        changePaymentStatus({ id: queryId }),
      ).unwrap();
      setToastMessage(result?.msg || "Payment status updated successfully");
      setToastVariant("success");
      setShowToast(true);
      if (authUser?.id) {
        await dispatch(getUserProfile({ id: authUser.id }));
      }
      dispatch(getUserCertificate());
      dispatch(getUserQueries({ type: 0 }));
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err || "Failed to change payment status");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleUpdateNote = async (certificateId, note) => {
    setIsUpdatingNote(true);
    try {
      await dispatch(
        updateCertificateNote({ query_id: certificateId, note }),
      ).unwrap();
      setToastMessage("Note saved.");
      setToastVariant("success");
      setShowToast(true);
      dispatch(getUserCertificate());
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err?.message || "Failed to save note");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsUpdatingNote(false);
    }
  };

  const handleViewCoaPdf = async (certificateId) => {
    if (!certificateId) return;
    try {
      const blob = await getCoaPdf({ id: certificateId, token: authToken });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      setToastMessage(err?.message || "Failed to open COA PDF");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleViewCertificatePdf = async (certificateUuid) => {
    if (!certificateUuid) return;
    try {
      const blob = await getCertificatePdfByUuid({
        uuid: certificateUuid,
        token: authToken,
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      setToastMessage(err?.message || "Failed to open certificate PDF");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getCoaPdfBlobForCertificate = async (certificate) => {
    const id = certificate?.id;
    const directUrl = getCertificatePdfUrl(certificate);
    if (id) return getCoaPdf({ id, token: authToken });
    if (directUrl) {
      const res = await fetch(directUrl);
      if (!res.ok) throw new Error("Could not load PDF");
      return res.blob();
    }
    throw new Error("No PDF available for this item");
  };

  const handleDownloadCoaPdf = async (certificate) => {
    try {
      const directUrl = getCertificatePdfUrl(certificate);
      if (directUrl) {
        const a = document.createElement("a");
        a.href = directUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      const blob = await getCoaPdfBlobForCertificate(certificate);
      const base =
        certificate?.order ??
        certificate?.certificate_id ??
        certificate?.coa_number ??
        certificate?.order_number ??
        "certificate";
      const filename = `COA-${String(base).replace(/[^a-zA-Z0-9._-]/g, "_")}.pdf`;
      const dl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = dl;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(dl), 3000);
    } catch (err) {
      setToastMessage(err?.message || "Failed to download PDF");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handlePrintCoaPdf = async (certificate) => {
    try {
      // Prefer direct PDF URL when available (avoids blank blob tabs on some browsers)
      const directUrl = getCertificatePdfUrl(certificate);
      if (directUrl) {
        const w = window.open(directUrl, "_blank", "noopener,noreferrer");
        if (w) {
          const tryPrint = () => {
            try {
              w.focus();
              w.print();
            } catch (_) {
              /* user may need to use browser print from the PDF tab */
            }
          };
          w.addEventListener("load", tryPrint, { once: true });
          setTimeout(tryPrint, 800);
        }
        return;
      }

      const blob = await getCoaPdfBlobForCertificate(certificate);
      const dl = URL.createObjectURL(blob);
      const w = window.open(dl, "_blank", "noopener,noreferrer");
      if (w) {
        const tryPrint = () => {
          try {
            w.focus();
            w.print();
          } catch (_) {
            /* user may need to use browser print from the PDF tab */
          }
        };
        w.addEventListener("load", tryPrint, { once: true });
        setTimeout(tryPrint, 800);
      }
      setTimeout(() => URL.revokeObjectURL(dl), 120000);
    } catch (err) {
      setToastMessage(err?.message || "Failed to open print dialog");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleShareCoaPdf = async (certificate) => {
    const title =
      `Certificate ${certificate?.order ?? certificate?.coa_number ?? ""}`.trim();
    const directUrl = getCertificatePdfUrl(certificate);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          const blob = await getCoaPdfBlobForCertificate(certificate);
          const file = new File(
            [blob],
            `COA-${certificate?.order ?? "certificate"}.pdf`,
            { type: "application/pdf" },
          );
          await navigator.share({
            title: title || "COA",
            text: title || "Certificate of Authenticity",
            files: [file],
          });
          return;
        } catch (e) {
          if (e && e.name === "AbortError") return;
        }
        if (directUrl) {
          await navigator.share({
            title: title || "COA",
            text: title || "Certificate of Authenticity",
            url: directUrl,
          });
          return;
        }
      }
      if (directUrl && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(directUrl);
        setToastMessage("PDF link copied to clipboard.");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
      setToastMessage("Sharing is not available on this device.");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err?.message || "Could not share");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleMarkAsSold = async (certificate) => {
    const candidateIds = [
      certificate?.certificate?.id,
      certificate?.certificate_id,
      certificate?.id,
    ]
      .filter((v) => v != null && String(v).trim() !== "")
      .map((v) => String(v).trim());
    const primaryId = candidateIds[0];
    if (!primaryId) return;

    setMarkingSoldId(primaryId);
    try {
      let result = null;
      let lastError = null;
      for (const id of candidateIds) {
        try {
          // Backend expects certificate row id (old site uses certificate.certificate.id)
          // Some environments return it as certificate_id or id.
          result = await dispatch(isSold({ certificate_id: id })).unwrap();
          lastError = null;
          break;
        } catch (e) {
          lastError = e;
        }
      }
      if (lastError) throw lastError;

      const wasSold = isCertificateSold(certificate);
      setToastMessage(
        wasSold
          ? "Your certificate has been moved to available"
          : "Your certificate has been moved to sold",
      );
      setToastVariant("success");
      setShowToast(true);

      await dispatch(getUserCertificate());
      if (authUser?.id) {
        await dispatch(getUserProfile({ id: authUser.id }));
      }
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err || "Could not mark as sold.");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setMarkingSoldId(null);
    }
  };

  const handleRequestMarkStatusChange = (certificate) => {
    if (!certificate) return;
    setCertificateToToggleStatus(certificate);
    setShowMarkStatusModal(true);
  };

  const handleCancelMarkStatusChange = () => {
    setShowMarkStatusModal(false);
    setCertificateToToggleStatus(null);
  };

  const handleConfirmMarkStatusChange = async () => {
    if (!certificateToToggleStatus) return;
    const cert = certificateToToggleStatus;
    setShowMarkStatusModal(false);
    setCertificateToToggleStatus(null);
    await handleMarkAsSold(cert);
  };

  const handleUploadImagesForModal = async (files) => {
    const paths = [];
    for (const file of files) {
      const result = await dispatch(
        uploadImage({ image: file, storage_type: "authenticateImage" }),
      ).unwrap();
      const path =
        result?.data != null
          ? typeof result.data === "string"
            ? result.data
            : (result.data?.path ??
              result.data?.url ??
              result.data?.file_name ??
              "")
          : "";
      if (path) paths.push(path);
    }
    return paths;
  };

  const handleRequestMoreImages = async (certificate, imagesStr) => {
    if (!certificate?.id || !imagesStr)
      throw new Error("Certificate and images are required");
    const isAdminRequested =
      certificate.request_more_images?.some(
        (item) => Number(item?.status) === 0,
      ) ?? false;
    try {
      if (isAdminRequested) {
        await updateRequestMoreImagesCertificate({
          authenticate_id: certificate.id,
          images: imagesStr,
          token: authToken,
        });
      } else {
        await userUpdateQueryImages({
          authenticate_id: certificate.id,
          images: imagesStr,
          token: authToken,
        });
      }
      setToastMessage("Images updated successfully.");
      setToastVariant("success");
      setShowToast(true);
      dispatch(getUserCertificate());
      dispatch(getUserQueries({ type: 0 }));
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const message = err?.message || "Failed to update images";
      setToastMessage(message);
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      throw err;
    }
  };

  const handleDeleteReplyClick = (reviewId, replyId) => {
    setReplyToDelete({ reviewId, replyId });
    setShowDeleteReplyModal(true);
  };

  const handleConfirmDeleteReply = async () => {
    if (!replyToDelete) return;

    setIsDeletingReply(true);

    try {
      const result = await dispatch(
        deleteReviewReply({
          id: replyToDelete.replyId,
          reviewId: replyToDelete.reviewId,
        }),
      ).unwrap();

      // Show success message
      setToastMessage(result?.msg || "Reply deleted successfully");
      setToastVariant("success");
      setShowToast(true);

      // Close modal
      setShowDeleteReplyModal(false);
      setReplyToDelete(null);

      // Refresh user and business profile to get updated reviews
      if (authUser?.id) {
        await dispatch(getUserProfile({ id: authUser.id }));
      }
      if (business?.id) {
        await dispatch(getBusinessProfile({ id: business.id }));
      }

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      // Show error message
      setToastMessage(error || "Failed to delete reply");
      setToastVariant("error");
      setShowToast(true);

      // Close modal
      setShowDeleteReplyModal(false);
      setReplyToDelete(null);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsDeletingReply(false);
    }
  };

  const handleCancelDeleteReply = () => {
    setShowDeleteReplyModal(false);
    setReplyToDelete(null);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    setIsDeletingReview(true);

    try {
      const result = await dispatch(
        deleteReview({
          id: reviewToDelete,
        }),
      ).unwrap();

      // Show success message
      setToastMessage(result?.msg || "Review deleted successfully");
      setToastVariant("success");
      setShowToast(true);

      // Close modal
      setShowDeleteModal(false);
      setReviewToDelete(null);

      // Refresh user and business profile to get updated reviews
      if (authUser?.id) {
        await dispatch(getUserProfile({ id: authUser.id }));
      }
      if (business?.id) {
        await dispatch(getBusinessProfile({ id: business.id }));
      }

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      // Show error message
      setToastMessage(error || "Failed to delete review");
      setToastVariant("error");
      setShowToast(true);

      // Close modal
      setShowDeleteModal(false);
      setReviewToDelete(null);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsDeletingReview(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    setIsSubmittingReply(true);

    try {
      const result = await dispatch(
        submitReviewReply({
          id: reviewId,
          review_reply: replyText,
        }),
      ).unwrap();

      // Show success message
      setToastMessage(result?.msg || "Reply submitted successfully");
      setToastVariant("success");
      setShowToast(true);

      // Refresh user and business profile to get updated reviews
      if (authUser?.id) {
        await dispatch(getUserProfile({ id: authUser.id }));
      }
      if (business?.id) {
        await dispatch(getBusinessProfile({ id: business.id }));
      }

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      // Show error message
      setToastMessage(error || "Failed to submit reply");
      setToastVariant("error");
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const hasBusinessAccount = Boolean(user?.user_business?.length);
  const hasBusinessData = Boolean(business && Object.keys(business).length > 0);
  const businessResolved =
    !hasBusinessAccount || hasBusinessData || businessStatus === "failed";
  const effectiveBusiness = hasBusinessData
    ? business
    : hasBusinessAccount
      ? user?.user_business?.[0]
      : null;
  const showProfileLoading =
    status === "loading" ||
    (status === "succeeded" && hasBusinessAccount && !businessResolved);

  if (showProfileLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <main className="flex-grow py-8 sm:py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-gray-300 rounded-[10px] sm:rounded-[12px] p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>

                <p className="text-primary">Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <main className="flex-grow py-8 sm:py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-gray-300 rounded-[10px] sm:rounded-[12px] p-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>

                <button
                  onClick={() => {
                    if (authUser?.id) {
                      dispatch(getUserProfile({ id: authUser.id }));
                      dispatch(getUserCertificate());
                    }
                  }}
                  className="bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <main className="flex-grow w-full">
        <div className="w-full">
          <div className="bg-white border-0 border-b border-gray-200 overflow-hidden">
            <ProfileSection
              user={user}
              business={effectiveBusiness}
              businessUserLogin={hasBusinessAccount || businessUserLogin}
              businessReviewCount={businessReviewCount}
              onEditProfileClick={handleEditProfileClick}
              onReviewsClick={() => navigate("/reviews")}
            />

            <CertificatesofAuthenticity
              id="certificates"
              certificates={certificates}
              queries={queries}
              queryCounts={queryCounts}
              onPaymentStatusChange={handlePaymentStatusChange}
              isChangingPaymentStatus={checkoutStatus === "loading"}
              onUpdateNote={handleUpdateNote}
              isUpdatingNote={isUpdatingNote}
              onViewCoaPdf={handleViewCoaPdf}
              onViewCertificatePdf={handleViewCertificatePdf}
              onRequestMoreImages={handleRequestMoreImages}
              onUploadImagesForModal={handleUploadImagesForModal}
              onMarkAsSold={handleRequestMarkStatusChange}
              markingSoldId={markingSoldId}
              onDownloadCoaPdf={handleDownloadCoaPdf}
              onPrintCoaPdf={handlePrintCoaPdf}
              onShareCoaPdf={handleShareCoaPdf}
            />

            {/* Delete account: in ad-old there is no Account block on profile page; link is in header dropdown. Commented out here.
                        <div className="border-t border-gray-200 px-4 sm:px-6 py-6 sm:py-8">
                            <h3 className="text-lg font-semibold text-primary mb-2">Account</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Link
                                to="/delete-profile"
                                className="inline-block px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete account
                            </Link>
                        </div>
                        */}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              toastVariant === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <p className="font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Delete Review
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={isDeletingReview}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#3C1F1B] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeletingReview}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeletingReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reply Modal */}
      {showEditReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Edit Reply
            </h3>
            <textarea
              value={editReplyText}
              onChange={(e) => setEditReplyText(e.target.value)}
              placeholder="Your reply..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-800 placeholder:text-gray-400 bg-white resize-none mb-4"
              disabled={isUpdatingReply}
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelEditReply}
                disabled={isUpdatingReply}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#3C1F1B] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEditReply}
                disabled={!editReplyText.trim() || isUpdatingReply}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdatingReply ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Reply Confirmation Modal */}
      {showDeleteReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Delete Reply
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this reply? This action cannot be
              undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancelDeleteReply}
                disabled={isDeletingReply}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#3C1F1B] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteReply}
                disabled={isDeletingReply}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeletingReply ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Sold/Available Confirmation Modal */}
      {showMarkStatusModal && certificateToToggleStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl text-center font-semibold text-primary mb-4">
              Confirm Status Change
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure to mark this certificate as{" "}
              <span className="font-semibold">
                {isCertificateSold(certificateToToggleStatus)
                  ? "available"
                  : "sold"}
              </span>
              ?
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={handleCancelMarkStatusChange}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#3C1F1B] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMarkStatusChange}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
