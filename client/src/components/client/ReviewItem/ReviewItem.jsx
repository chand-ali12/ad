import React, { useState, useRef } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiSend, FiTrash2 } from "react-icons/fi";
import ReplySection from "../ReplySection/ReplySection";
import PropTypes from "prop-types";

const ReviewItem = ({
  profileImage,
  reviewerInitials,
  reviewerName,
  reviewerId,
  reviewImage,
  date,
  rating = 5,
  comment,
  reply,
  showDivider = false,
  onEditClick,
  onDeleteClick,
  showReplyActions = false,
  replyTextBold = false,
  className = "",
  reviewId,
  replyId,
  onReplySubmit,
  showReplyInput = false,
  isSubmittingReply = false,
  onReviewDelete,
  showReviewDelete = false,
  onReviewerProfileClick,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyTextareaRef = useRef(null);

  const handleReplySubmit = () => {
    if (!onReplySubmit || !reviewId) return;
    if (!replyText.trim()) {
      const el = replyTextareaRef.current;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        requestAnimationFrame(() => el.focus({ preventScroll: true }));
      }
      return;
    }
    onReplySubmit(reviewId, replyText.trim());
    setReplyText("");
    setShowReplyBox(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleReplySubmit();
    }
  };

  const numericRating = Number.isFinite(Number(rating))
    ? Math.max(0, Math.min(5, Number(rating)))
    : 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.5;
  const filledCount = Math.min(5, fullStars + (hasHalfStar ? 1 : 0));

  return (
    <div className={className}>
      <div className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left Side - Profile Picture */}
          <div className="flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Reviewer Profile"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  {reviewerInitials || "U"}
                </span>
              </div>
            )}
          </div>

          {/* Right Side - Name/Date and Rating aligned with profile image */}
          <div className="flex-1 min-w-0 pt-1 sm:pt-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg text-primary mb-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!onReviewerProfileClick) return;
                      onReviewerProfileClick(reviewerId);
                    }}
                    disabled={!onReviewerProfileClick}
                    className={`text-blue-700 bg-transparent border-0 p-0 ${onReviewerProfileClick ? "cursor-pointer hover:underline" : "cursor-default"}`}
                  >
                    {reviewerName || "Anonymous"}
                  </button>
                  {date ? (
                    <span className="text-gray-500 font-normal text-sm sm:text-base ml-2">
                      {date}
                    </span>
                  ) : null}
                </h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const starIndex = i + 1;
                    if (starIndex <= fullStars) {
                      return (
                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                      );
                    }
                    if (hasHalfStar && starIndex === filledCount) {
                      return (
                        <FaStarHalfAlt
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                        />
                      );
                    }
                    return (
                      <FaRegStar key={i} className="w-4 h-4 text-gray-300" />
                    );
                  })}
                </div>
              </div>
              {/* Delete Review Button */}
              {showReviewDelete && onReviewDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewDelete(reviewId);
                  }}
                  className="text-gray-600 hover:text-red-500 transition-colors bg-transparent border-0 p-1"
                  aria-label="Delete review"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Text - Under the profile image */}
        {comment && (
          <div className="mt-2">
            <p className="text-sm sm:text-base text-primary">{comment}</p>
          </div>
        )}
        {reviewImage && (
          <div className="mt-3">
            <img
              src={reviewImage}
              alt="Review attachment"
              className="max-h-48 w-auto rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}

        {/* Reply Section */}
        {reply && (
          <ReplySection
            sellerName={reply.sellerName}
            text={reply.text}
            onEditClick={
              onEditClick
                ? () => onEditClick(reviewId, replyId, reply?.text)
                : undefined
            }
            onDeleteClick={
              onDeleteClick ? () => onDeleteClick(reviewId, replyId) : undefined
            }
            showActions={showReplyActions}
            textBold={replyTextBold}
          />
        )}

        {/* Add Reply Button or Reply Input */}
        {!reply && showReplyInput && (
          <div
            className="pt-4 mt-4 border-t border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {!showReplyBox ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplyBox(true);
                }}
                className="inline-flex items-center justify-center border border-[#3C1F1B] bg-[#3C1F1B] text-white hover:opacity-95 transition-colors whitespace-nowrap rounded-md px-4 py-2 text-sm"
              >
                Reply
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  ref={replyTextareaRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write your reply..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50 resize-none"
                  disabled={isSubmittingReply}
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyText("");
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isSubmittingReply}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReplySubmit}
                    disabled={isSubmittingReply}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isSubmittingReply ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      {showDivider && (
        <div className="border-b border-gray-300 mb-4 sm:mb-6"></div>
      )}
    </div>
  );
};

ReviewItem.propTypes = {
  profileImage: PropTypes.string,
  reviewerInitials: PropTypes.string,
  reviewerName: PropTypes.string,
  reviewerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reviewImage: PropTypes.string,
  date: PropTypes.string,
  rating: PropTypes.number,
  comment: PropTypes.string,
  reply: PropTypes.shape({
    sellerName: PropTypes.string,
    text: PropTypes.string,
  }),
  showDivider: PropTypes.bool,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  showReplyActions: PropTypes.bool,
  replyTextBold: PropTypes.bool,
  className: PropTypes.string,
  reviewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  replyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReplySubmit: PropTypes.func,
  showReplyInput: PropTypes.bool,
  isSubmittingReply: PropTypes.bool,
  onReviewDelete: PropTypes.func,
  showReviewDelete: PropTypes.bool,
  onReviewerProfileClick: PropTypes.func,
};

export default ReviewItem;
