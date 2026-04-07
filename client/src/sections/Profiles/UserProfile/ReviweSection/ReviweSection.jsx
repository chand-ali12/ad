import React from "react";
import ReviewItem from "../../../../components/client/ReviewItem/ReviewItem";
import PropTypes from "prop-types";

const ReviweSection = ({
  className = "",
  reviews = [],
  onEditClick,
  onDeleteClick,
  onReplySubmit,
  showReplyInput = false,
  isSubmittingReply = false,
  onReviewDelete,
  showReviewDelete = false,
  onReplyEditClick,
  onReplyDeleteClick,
  onReviewerProfileClick,
  showReplyActions = true,
  replyTextBold = true,
}) => {
  if (!reviews || reviews.length === 0) {
    return (
      <section className={`w-full py-8 sm:py-12 ${className}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[22px] border border-[#BDBDBD] shadow-sm p-8 text-center">
            <p className="text-gray-500">No reviews yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-8 sm:py-12 ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={review.id || index}
              className="bg-white rounded-[22px] border border-[#BDBDBD] shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <ReviewItem
                profileImage={review.profile_image || null}
                reviewerName={review.reviewer_name || "Anonymous"}
                reviewerId={review.reviewer_id ?? review.user_id ?? review.user?.id ?? null}
                date={review.date || ""}
                rating={review.rating || 0}
                comment={review.comment || ""}
                reply={review.reply || null}
                showDivider={false}
                onEditClick={onReplyEditClick}
                onDeleteClick={onReplyDeleteClick}
                showReplyActions={showReplyActions}
                replyTextBold={replyTextBold}
                reviewId={review.id}
                replyId={review.reply?.id}
                onReplySubmit={onReplySubmit}
                showReplyInput={showReplyInput}
                isSubmittingReply={isSubmittingReply}
                onReviewDelete={onReviewDelete}
                showReviewDelete={showReviewDelete}
                onReviewerProfileClick={onReviewerProfileClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

ReviweSection.propTypes = {
  className: PropTypes.string,
  reviews: PropTypes.array,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onReplySubmit: PropTypes.func,
  showReplyInput: PropTypes.bool,
  isSubmittingReply: PropTypes.bool,
  onReviewDelete: PropTypes.func,
  showReviewDelete: PropTypes.bool,
  onReplyEditClick: PropTypes.func,
  onReplyDeleteClick: PropTypes.func,
  onReviewerProfileClick: PropTypes.func,
  showReplyActions: PropTypes.bool,
  replyTextBold: PropTypes.bool,
};

export default ReviweSection;
