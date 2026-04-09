import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";
import { FiImage, FiX } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  submitReview,
  submitReviewReply,
} from "../../store/slices/reviewsSlice";
import { getBusinessProfileBySlug } from "../../services/businessServices";
import {
  getBusinessProfileImageUrl,
  getBusinessCoverImageUrl,
  getProfileImageUrl,
  getReviewImageUrl,
} from "../../utils/imageUtils";
import Reviews from "../../sections/ReviewScreen/Reviews/Reviews_BusinessScreen";
import ReviweSection from "../../sections/Profiles/UserProfile/ReviweSection/ReviweSection";
import RatingInput from "../../components/client/RatingInput/RatingInput";
import defaultCover from "../../assets/images/whiteshoes.jpg";
import defaultProfile from "../../assets/images/UserProfile.png";
import Reviews_BusinessScreen from "../../sections/ReviewScreen/Reviews/Reviews_BusinessScreen";

const mapApiReviewsToUI = (reviews) => {
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

    const profileImageRaw =
      r.user?.profile_picture ||
      r.user?.profile_image ||
      r.user?.profile_picture_url ||
      r.user?.image_url ||
      r.profile_image ||
      r.profile_picture ||
      r.image_url ||
      null;
    const reviewImageRaw =
      r.image_url || r.review_image || r.image || r.attachment || null;

    return {
      id: r.id ?? r._id,
      profile_image: profileImageRaw,
      reviewer_name: r.user?.name || "Anonymous",
      reviewer_id: r.user?.id ?? r.user_id ?? r.reviewer_id ?? null,
      rating: Number.isFinite(Number(r.rating)) ? Number(r.rating) : 0,
      comment: r.review ?? r.comment ?? "",
      review_image: reviewImageRaw,
      reply: replyObj,
    };
  });
};

const BusinessProfile = () => {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: authUser, token } = useAppSelector((state) => state.auth);
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starError, setStarError] = useState("");
  const [textError, setTextError] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const ratingInputRef = useRef(null);
  const reviewTextareaRef = useRef(null);
  const reviewImageInputRef = useRef(null);

  useEffect(() => {
    if (!reviewImageFile) {
      setReviewImagePreview("");
      return undefined;
    }
    const nextPreview = URL.createObjectURL(reviewImageFile);
    setReviewImagePreview(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [reviewImageFile]);

  const focusInvalidField = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() => el.focus({ preventScroll: true }));
  };

  const fetchProfile = useCallback(() => {
    if (!slugOrId) return;
    return getBusinessProfileBySlug({ slugOrId }).then((res) => {
      const biz =
        res?.additional_data?.business ??
        res?.business_data?.business ??
        res?.business ??
        null;
      const reviewsData = Array.isArray(res?.data)
        ? res.data
        : (res?.data?.data ?? []);
      setBusiness(biz);
      setReviews(mapApiReviewsToUI(reviewsData));
    });
  }, [slugOrId]);

  useEffect(() => {
    if (!slugOrId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProfile()
      .catch((err) => {
        if (!cancelled)
          setError(err?.message ?? "Failed to load business profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  if (!slugOrId) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">
            Business Not Found
          </h1>
          <p className="text-primary/80 mt-2">
            Missing business identifier in URL.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-primary font-semibold underline"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-primary mt-4">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-primary">
            Unable to find the business
          </h1>
          <p className="text-primary/80 mt-2">
            {error || "Business not found."}
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-primary font-semibold underline"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const coverSrc =
    getBusinessCoverImageUrl(business.business_cover_picture) || defaultCover;
  const profileSrc =
    getBusinessProfileImageUrl(business.business_profile_picture) ||
    defaultProfile;
  const websiteUrl = business.website
    ? business.website.startsWith("http")
      ? business.website
      : `https://${business.website}`
    : null;
  const rating = Number(business.business_rating) || 0;
  const isOwner =
    authUser?.user_business?.some(
      (ub) => String(ub.id) === String(business.id),
    ) || false;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (isSubmittingReview || !business?.id) return;

    let hasError = false;

    if (!reviewRating) {
      setStarError("Please select a rating");
      focusInvalidField(ratingInputRef.current);
      hasError = true;
    } else {
      setStarError("");
    }

    if (!reviewText.trim()) {
      setTextError("Please enter a review comment");
      focusInvalidField(reviewTextareaRef.current);
      hasError = true;
    } else {
      setTextError("");
    }

    if (hasError) {
      return;
    }
    setIsSubmittingReview(true);
    setToastMessage("");
    try {
      await dispatch(
        submitReview({
          id: business.id,
          review: reviewText.trim(),
          rating: reviewRating,
          image: reviewImageFile || undefined,
        }),
      ).unwrap();
      setToastMessage("Review submitted successfully.");
      setToastVariant("success");
      setReviewText("");
      setReviewRating(0);
      setReviewImageFile(null);
      if (reviewImageInputRef.current) {
        reviewImageInputRef.current.value = "";
      }
      await fetchProfile();
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setToastMessage(err?.message ?? "Failed to submit review.");
      setToastVariant("error");
      setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    if (!replyText?.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    setToastMessage("");
    try {
      await dispatch(
        submitReviewReply({ id: reviewId, review_reply: replyText.trim() }),
      ).unwrap();
      setToastMessage("Reply submitted successfully.");
      setToastVariant("success");
      await fetchProfile();
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setToastMessage(err?.message ?? "Failed to submit reply.");
      setToastVariant("error");
      setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const reviewsWithImageUrls = reviews.map((r) => ({
    ...r,
    profile_image: getProfileImageUrl(r.profile_image) || r.profile_image,
    review_image: getReviewImageUrl(r.review_image) || r.review_image,
  }));

  // console.log("reviews with url", reviewsWithImageUrls);
  // console.log("Reviews are :- ", reviews);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <main className="flex-grow">
        {/* Cover */}
        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-gray-200 overflow-hidden">
          <img
            src={coverSrc}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultCover;
            }}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
          <div className="bg-white rounded-[10px] sm:rounded-[12px] border border-gray-300 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
              <div className="flex-shrink-0 flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={profileSrc}
                    alt={business.business_name || "Business"}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow"
                    onError={(e) => {
                      e.target.src = defaultProfile;
                    }}
                  />
                  {business.is_featured === 1 && (
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
                  {business.business_name || "Business"}
                </h1>
                {business.business_address && (
                  <p className="text-primary/80 text-sm sm:text-base mb-1">
                    {business.business_address}
                  </p>
                )}
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 text-sm sm:text-base block truncate hover:underline"
                  >
                    {business.website}
                  </a>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                  <span className="text-primary font-semibold">{rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-lg ${i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {business.about_business && (
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 text-center sm:text-left">
                <p className="text-primary/90 text-sm sm:text-base font-medium">
                  {business.about_business}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 mx-4 sm:mx-6 md:mx-8" />

            {!token ? (
              <div className="py-6 text-center">
                <p className="text-primary/80">
                  <Link
                    to="/signin"
                    className="font-semibold text-primary underline hover:no-underline"
                  >
                    Log in
                  </Link>{" "}
                  to leave a review!
                </p>
              </div>
            ) : (
              !isOwner && (
                <div className="py-6 px-4 sm:px-6 md:px-8">
                  {toastMessage && (
                    <div
                      className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-lg text-sm shadow-lg ${toastVariant === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}
                    >
                      {toastMessage}
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmitReview}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm max-w-2xl mx-auto"
                  >
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Share your experience...
                    </label>
                    <div className="relative mb-4">
                      <textarea
                        ref={reviewTextareaRef}
                        value={reviewText}
                        onChange={(e) => {
                          setReviewText(e.target.value);
                          if (textError) setTextError("");
                        }}
                        placeholder="Share your experience..."
                        rows={5}
                        maxLength={200}
                        className="w-full px-4 py-3 pr-12 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50 resize-none"
                      />
                      <input
                        ref={reviewImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setReviewImageFile(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => reviewImageInputRef.current?.click()}
                        className="absolute right-3 bottom-3 inline-flex items-center justify-center rounded-md p-1.5 text-primary/80 hover:text-primary hover:bg-white/80"
                        aria-label="Upload image"
                        title="Upload image"
                      >
                        <FiImage className="h-4 w-4" />
                      </button>
                    </div>
                    {reviewImagePreview && (
                      <div className="mb-4 flex flex-col items-start gap-1.5">
                        <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
                          <img
                            src={reviewImagePreview}
                            alt="Selected review attachment"
                            className="block h-20 w-20 sm:h-24 sm:w-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setReviewImageFile(null);
                              if (reviewImageInputRef.current) {
                                reviewImageInputRef.current.value = "";
                              }
                            }}
                            className="absolute top-1 right-1 z-10 p-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] hover:text-red-200 focus:outline-none"
                            aria-label="Remove selected image"
                            title="Remove image"
                          >
                            <FiX className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        </div>
                        {reviewImageFile?.name ? (
                          <p
                            className="max-w-[240px] truncate text-xs text-primary/70"
                            title={reviewImageFile.name}
                          >
                            {reviewImageFile.name}
                          </p>
                        ) : null}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-primary font-medium">
                            {reviewRating}
                          </span>
                          <RatingInput
                            ref={ratingInputRef}
                            value={reviewRating}
                            onChange={(rating) => {
                              setReviewRating(rating);
                              if (starError) setStarError("");
                            }}
                            starSize="w-5 h-5 sm:w-6 sm:h-6"
                            showValue={false}
                          />
                        </div>
                      </div>
                      {(textError || starError) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-red-600 text-sm">
                            {textError || starError}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="px-4 py-2 bg-primary text-secondary text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSubmittingReview ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent" />
                              Submitting...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )
            )}

            {isOwner ? (
              <>
                {toastMessage && (
                  <div
                    className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-lg text-sm shadow-lg ${toastVariant === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}
                  >
                    {toastMessage}
                  </div>
                )}
                <ReviweSection
                  reviews={reviewsWithImageUrls}
                  onReplySubmit={handleReplySubmit}
                  showReplyInput={true}
                  isSubmittingReply={isSubmittingReply}
                  onReviewerProfileClick={(reviewerId) => {
                    if (!reviewerId) return;
                    const query = business?.id
                      ? `?business_id=${encodeURIComponent(String(business.id))}`
                      : "";
                    navigate(
                      `/reviewer/${encodeURIComponent(String(reviewerId))}${query}`,
                    );
                  }}
                />
              </>
            ) : (
              <Reviews_BusinessScreen
                reviews={reviewsWithImageUrls}
                className="!pt-2"
                onReviewerProfileClick={(reviewerId) => {
                  if (!reviewerId) return;
                  const query = business?.id
                    ? `?business_id=${encodeURIComponent(String(business.id))}`
                    : "";
                  navigate(
                    `/reviewer/${encodeURIComponent(String(reviewerId))}${query}`,
                  );
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessProfile;
