import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  submitReview,
  setError,
  setMessage,
  clearError,
  clearMessage,
} from "../../store/slices/reviewsSlice";
import ProfileCard from "../../components/client/ProfileCard/ProfileCard";
import SectionHeader from "../../components/client/SectionHeader/SectionHeader";
import RatingInput from "../../components/client/RatingInput/RatingInput";
import ReviewInput from "../../components/client/ReviewInput/ReviewInput";
import ReviweSection from "../../sections/Profiles/UserProfile/ReviweSection/ReviweSection";
import { FiX } from "react-icons/fi";
import TakeitEasyImage from "../../assets/images/TakeitEasy.png";
import styleCorrectSvg from "../../assets/images/stylecorect.svg";
import { getUserProfile as getUserProfileApi } from "../../services/profileServices";
import {
  getProfileCoverUrl,
  getProfileImageUrl,
  getReviewImageUrl,
} from "../../utils/imageUtils";

const ReviewFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { status, error, message } = useAppSelector((state) => state.reviews);
  const { business } = useAppSelector((state) => state.business);
  const authToken = useAppSelector((state) => state.auth?.token);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("error");
  const [showToast, setShowToast] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [reviewerUser, setReviewerUser] = useState(null);
  const imageInputRef = useRef(null);
  const ratingInputRef = useRef(null);
  const reviewTextareaRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const searchParams = new URLSearchParams(location.search);
  const reviewerId = searchParams.get("reviewer_id");

  // Get business_id from URL params, location state, or business state
  const businessId =
    searchParams.get("business_id") ||
    location.state?.business_id ||
    business?.id ||
    null;

  useEffect(() => {
    if (!reviewerId) return;
    let cancelled = false;
    getUserProfileApi({ id: reviewerId, token: authToken })
      .then((res) => {
        if (cancelled) return;
        setReviewerUser(res?.additional_data?.user ?? res?.user ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setReviewerUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [reviewerId, authToken]);

  const { handleSubmit } = useForm({ shouldFocusError: true });

  // Handle error and success messages
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastVariant("error");
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    } else if (message) {
      setToastMessage(message);
      setToastVariant("success");
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        dispatch(clearMessage());
        // Redirect to reviews page after successful submission
        setTimeout(() => {
          navigate("/reviews");
        }, 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch, navigate]);

  const focusInvalidField = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => el.focus({ preventScroll: true }));
  };

  const onSubmit = async (data) => {
    if (!businessId) {
      setToastMessage("Business ID is required");
      setToastVariant("error");
      setShowToast(true);
      return;
    }

    if (rating === 0) {
      focusInvalidField(ratingInputRef.current);
      setToastMessage("Please select a rating");
      setToastVariant("error");
      setShowToast(true);
      return;
    }

    if (!reviewText.trim()) {
      focusInvalidField(reviewTextareaRef.current);
      setToastMessage("Please enter a review");
      setToastVariant("error");
      setShowToast(true);
      return;
    }

    try {
      await dispatch(
        submitReview({
          id: businessId.toString(),
          review: reviewText.trim(),
          rating: rating,
          image: imageFile,
        }),
      ).unwrap();
    } catch (err) {
      // Error is handled by useEffect above
      console.error("Review submission failed:", err);
    }
  };

  const handleMediaClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
    // Allow selecting the same file again on next click
    e.target.value = "";
  };

  const handleRemoveReviewImage = () => {
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleReviewSubmit = (text) => {
    if (rating > 0 && text.trim()) {
      onSubmit({ rating, review: text });
    }
  };

  const mapUserReviewsToUI = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((r, idx) => {
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
                (replySource?.user?.name ??
                  replySource?.business_name ??
                  replySource?.name ??
                  reviewerUser?.name ??
                  "Business") ||
                "Business",
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
        id: r.id ?? r._id ?? `${idx}`,
        profile_image:
          getProfileImageUrl(reviewerUser?.profile_picture) || null,
        review_image:
          getReviewImageUrl(r.image_url ?? r.review_image ?? r.image) ||
          r.image_url ||
          r.review_image ||
          r.image ||
          null,
        reviewer_name: reviewerUser?.name || "User",
        reviewer_id: reviewerUser?.id ?? reviewerId ?? null,
        rating: Number.isFinite(Number(r.rating)) ? Number(r.rating) : 0,
        comment: r.review ?? r.comment ?? "",
        reply: replyObj,
        date,
      };
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <main className="flex-grow py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-300 rounded-[22px] sm:rounded-[38px] overflow-hidden">
            {/* Profile Section */}
            <ProfileCard
              bannerImage={
                getProfileCoverUrl(reviewerUser?.cover_picture) ||
                TakeitEasyImage
              }
              profileImage={
                getProfileImageUrl(reviewerUser?.profile_picture) || null
              }
              name={reviewerUser?.name || "Instant Finds"}
              subtitle={reviewerUser?.about_us || "www.instantfindsstore.co.uk"}
              website={reviewerUser?.website || reviewerUser?.website_url || ""}
              reviewsCount={
                Array.isArray(reviewerUser?.reviews)
                  ? reviewerUser.reviews.length
                  : null
              }
              showEditProfile={false}
              verifiedBadgeImage={styleCorrectSvg}
              rating={
                reviewerUser?.rating != null ? Number(reviewerUser.rating) : 4.5
              }
            />

            {/* Share Your Experience — separate boxed card (like screenshot) */}
            <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
              <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-[#1B1F24] p-4 sm:p-6 shadow-sm">
                <SectionHeader
                  heading="Share your experience..."
                  subHeading="How would you rate your experience?"
                  headingColor="secondary"
                  subHeadingColor="secondary"
                  className="items-center text-center mb-4"
                  headingClassName="text-lg sm:text-xl"
                  subHeadingClassName="text-xs sm:text-sm text-secondary/80"
                />
                <div className="flex justify-center mb-4">
                  <RatingInput
                    ref={ratingInputRef}
                    value={rating}
                    onChange={setRating}
                    maxRating={5}
                    starSize="w-7 h-7 sm:w-8 sm:h-8"
                  />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <ReviewInput
                    ref={reviewTextareaRef}
                    value={reviewText}
                    onChange={setReviewText}
                    placeholder="Share your experience..."
                    onMediaClick={handleMediaClick}
                    onSubmit={handleReviewSubmit}
                    rows={5}
                    className=""
                    textareaClassName="bg-[#0F1419] border-white/10 text-secondary placeholder:text-secondary/50 focus:ring-secondary/40"
                    actionsClassName=""
                  />
                  {imagePreviewUrl && (
                    <div className="mt-3 flex flex-col items-start gap-1.5">
                      <div className="relative inline-block overflow-hidden rounded-lg border border-white/15 bg-black/20">
                        <img
                          src={imagePreviewUrl}
                          alt="Selected review attachment"
                          className="block h-20 w-20 sm:h-24 sm:w-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveReviewImage}
                          className="absolute top-1 right-1 z-10 p-1 bg-white rounded-full text-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] hover:text-red-200 focus:outline-none"
                          aria-label="Remove image"
                        >
                          <FiX
                            className="h-6 w-6 text-black "
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                      {imageFile?.name ? (
                        <p
                          className="max-w-[240px] truncate text-xs text-secondary/80"
                          title={imageFile.name}
                        >
                          {imageFile.name}
                        </p>
                      ) : null}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-4 w-full bg-primary text-secondary py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews list (supports multiple reviews + reply style) */}
            {Array.isArray(reviewerUser?.reviews) &&
              reviewerUser.reviews.length > 0 && (
                <ReviweSection
                  className="!pt-0"
                  reviews={mapUserReviewsToUI(reviewerUser.reviews)}
                  showReplyInput={false}
                  showReplyActions={false}
                  replyTextBold={false}
                />
              )}
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
    </div>
  );
};

export default ReviewFlow;
