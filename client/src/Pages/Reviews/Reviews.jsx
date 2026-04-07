import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUserProfile } from "../../store/slices/profileSlice";
import { getBusinessProfile } from "../../store/slices/businessSlice";
import {
  submitReviewReply,
  deleteReviewReply,
  updateReviewReply,
} from "../../store/slices/reviewsSlice";
import {
  getProfileImageUrl,
  getReviewImageUrl,
  getProfileCoverUrl,
  getBusinessProfileImageUrl,
  getBusinessCoverImageUrl,
} from "../../utils/imageUtils";
import ReviweSection from "../../sections/Profiles/UserProfile/ReviweSection/ReviweSection";
import defaultCover from "../../assets/images/whiteshoes.jpg";
import defaultProfile from "../../assets/images/UserProfile.png";

const mapBusinessReviewsToUI = (reviews) => {
  if (!Array.isArray(reviews)) return [];
  return reviews.map((r) => {
    const repliesArr = r.replies ?? r.review_replies ?? [];
    const replySource =
      r.reply ??
      (Array.isArray(repliesArr) && repliesArr.length > 0
        ? repliesArr[0]
        : null);
    const replyText =
      typeof replySource === "string"
        ? replySource
        : (replySource?.reply ??
          replySource?.review_reply ??
          replySource?.text ??
          replySource?.message ??
          "");
    const replyObj =
      replySource && String(replyText).trim()
        ? {
            id: replySource?.id,
            sellerName:
              typeof replySource === "object" && replySource
                ? (replySource.user?.name ??
                  replySource.business_name ??
                  replySource.name ??
                  "Business")
                : "Business",
            text: String(replyText).trim(),
          }
        : null;
    const createdAt = r.created_at || r.createdAt || r?.created || null;
    const date =
      createdAt != null
        ? new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
    return {
      id: r.id,
      profile_image: r.user?.profile_picture || null,
      review_image: r.image_url || r.review_image || r.image || null,
      reviewer_name: r.user?.name || "Anonymous",
      reviewer_id: r.user?.id ?? r.user_id ?? r.reviewer_id ?? null,
      rating: Number.isFinite(Number(r.rating)) ? Number(r.rating) : 0,
      comment: r.review || "",
      reply: replyObj,
      date,
    };
  });
};

const ReviewsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { user, status } = useAppSelector((state) => state.profile);
  const {
    business,
    businessUserLogin,
    reviews: businessReviews,
  } = useAppSelector((state) => state.business);
  const { status: reviewStatus } = useAppSelector((state) => state.reviews);

  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState(null);
  const [isDeletingReply, setIsDeletingReply] = useState(false);

  const [showEditReplyModal, setShowEditReplyModal] = useState(false);
  const [replyToEdit, setReplyToEdit] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [isUpdatingReply, setIsUpdatingReply] = useState(false);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(getUserProfile({ id: authUser.id }));
    }
  }, [dispatch, authUser?.id]);

  useEffect(() => {
    if (user?.user_business?.length > 0) {
      const businessId = user.user_business[0].id;
      dispatch(getBusinessProfile({ id: businessId }));
    }
  }, [dispatch, user]);

  const hasBusiness = !!business;
  const displayName =
    businessUserLogin && business?.business_name
      ? business.business_name
      : user?.name || "Anonymous";
  const displaySubtitle =
    businessUserLogin && business?.about_business
      ? business.about_business
      : user?.about_us || "";
  const displayBanner =
    businessUserLogin && business?.business_cover_picture
      ? business.business_cover_picture
      : user?.cover_picture;
  const displayProfileImage =
    businessUserLogin && business?.business_profile_picture
      ? business.business_profile_picture
      : user?.profile_picture;
  const displayReviewsCount =
    businessUserLogin && business?.reviews_count != null
      ? business.reviews_count
      : 0;
  const displayRating =
    businessUserLogin && business?.business_rating != null
      ? business.business_rating
      : null;

  const bannerImageUrl = businessUserLogin
    ? getBusinessCoverImageUrl(displayBanner)
    : getProfileCoverUrl(displayBanner);
  const profileImageUrl = businessUserLogin
    ? getBusinessProfileImageUrl(displayProfileImage)
    : getProfileImageUrl(displayProfileImage);

  const reviewsToShow = useMemo(() => {
    const raw = hasBusiness
      ? mapBusinessReviewsToUI(businessReviews)
      : user?.reviews || [];
    if (!Array.isArray(raw)) return raw;
    return raw.map((r) => ({
      ...r,
      profile_image: getProfileImageUrl(r.profile_image) || r.profile_image,
      review_image: getReviewImageUrl(r.review_image) || r.review_image,
    }));
  }, [hasBusiness, businessReviews, user?.reviews]);

  const refreshProfiles = async () => {
    if (authUser?.id) {
      await dispatch(getUserProfile({ id: authUser.id }));
    }
    if (business?.id) {
      await dispatch(getBusinessProfile({ id: business.id }));
    }
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    setIsSubmittingReply(true);
    try {
      const result = await dispatch(
        submitReviewReply({ id: reviewId, review_reply: replyText }),
      ).unwrap();
      setToastMessage(result?.msg || "Reply submitted successfully");
      setToastVariant("success");
      setShowToast(true);
      await refreshProfiles();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err || "Failed to submit reply");
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmittingReply(false);
    }
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
      await refreshProfiles();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err || "Failed to update reply");
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
      setToastMessage(result?.msg || "Reply deleted successfully");
      setToastVariant("success");
      setShowToast(true);
      setShowDeleteReplyModal(false);
      setReplyToDelete(null);
      await refreshProfiles();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMessage(err || "Failed to delete reply");
      setToastVariant("error");
      setShowToast(true);
      setShowDeleteReplyModal(false);
      setReplyToDelete(null);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsDeletingReply(false);
    }
  };

  const handleCancelDeleteReply = () => {
    setShowDeleteReplyModal(false);
    setReplyToDelete(null);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <main className="flex-grow py-8 sm:py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-gray-300 rounded-[10px] p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-primary mt-4">Loading reviews...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <main className="flex-grow">
        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-gray-200 overflow-hidden">
          <img
            src={bannerImageUrl || defaultCover}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultCover;
            }}
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 pb-10">
          <div className="bg-white border border-gray-300 rounded-[10px] sm:rounded-[12px] overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
              <div className="flex-shrink-0 flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={profileImageUrl || defaultProfile}
                    alt={displayName}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow"
                    onError={(e) => {
                      e.target.src = defaultProfile;
                    }}
                  />
                  {business?.is_featured === 1 && (
                    <span
                      className="absolute -bottom-1 -right-1 bg-primary text-secondary p-1 rounded-full flex items-center justify-center"
                      title="Verified"
                    >
                      <BsPatchCheckFill className="w-4 h-4 text-green-600" />
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
                  {displayName}
                </h1>
                {!!displaySubtitle && (
                  <p className="text-primary/80 text-sm sm:text-base mb-1">
                    {displaySubtitle}
                  </p>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-primary/80">
                  <span className="text-sm sm:text-base">
                    {displayReviewsCount || 0} reviews
                  </span>
                  {displayRating != null && (
                    <>
                      <span className="text-primary font-semibold">
                        {Number(displayRating) || 0}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`text-lg ${i <= Math.floor(Number(displayRating) || 0) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ReviweSection
              reviews={reviewsToShow}
              onReplySubmit={handleReplySubmit}
              showReplyInput={Boolean(hasBusiness)}
              isSubmittingReply={
                isSubmittingReply || reviewStatus === "loading"
              }
              onReplyEditClick={handleEditClick}
              onReplyDeleteClick={handleDeleteReplyClick}
              onReviewerProfileClick={(reviewerId) => {
                if (!reviewerId) return;
                const query = business?.id
                  ? `?business_id=${encodeURIComponent(String(business.id))}`
                  : "";
                navigate(`/reviewer/${encodeURIComponent(String(reviewerId))}${query}`);
              }}
            />
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
              placeholder="Update your reply..."
              rows={4}
              className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50 resize-none mb-4"
              disabled={isUpdatingReply}
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancelEditReply}
                disabled={isUpdatingReply}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#3C1F1B] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEditReply}
                disabled={isUpdatingReply || !editReplyText.trim()}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
    </div>
  );
};

export default ReviewsPage;
