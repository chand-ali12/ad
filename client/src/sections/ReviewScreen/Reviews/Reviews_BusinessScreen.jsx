import React from "react";
import ReviewItem from "../../../components/client/ReviewItem/ReviewItem";
import PropTypes from "prop-types";
import { PROFILE_IMAGE_BASE_URL } from "../../../config/env";
import { useAppSelector } from "../../../store/hooks";

const Reviews_BusinessScreen = ({
  className = "",
  reviews = [],
  onReviewerProfileClick,
  onReviewDelete,
  // user,
}) => {
  const reviewsToDisplay = Array.isArray(reviews) ? reviews : [];
  const { user: authUser } = useAppSelector((state) => state.auth);
  console.log("Auth user is :- ", authUser);

  console.log("Reviews are :- ", reviewsToDisplay);

  if (reviewsToDisplay.length === 0) {
    return (
      <section className={`w-full py-8 sm:py-12 ${className}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F5F5F0] rounded-[22px] border border-[#BDBDBD] shadow-sm p-8 text-center">
            <p className="text-gray-500">No reviews yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-8 sm:py-12 ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-2 sm:pb-4">
        <div className="bg-[#F5F5F0] rounded-[22px] border border-[#BDBDBD] shadow-sm px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
          <div className="space-y-0">
            {reviewsToDisplay.map((review, index) => (
              <ReviewItem
                // {...(review.created_at && {
                //   date: new Date(review.created_at).toLocaleDateString(
                //     "en-GB",
                //     {
                //       day: "2-digit",
                //       month: "short",
                //       year: "numeric",
                //     },
                //   ),
                // })}
                profileImage={review.profile_image}
                comment={review?.comment || review?.review || review?.text}
                rating={review.rating}
                key={review.id || index}
                reviewerName={review?.reviewer_name || "Anonymous"}
                reviewerId={
                  review.reviewer_id ??
                  review.user_id ??
                  review.user?.id ??
                  null
                }
                reviewId={review?.id}
                reviewImage={
                  review.review_image ||
                  review.image ||
                  review.image_url ||
                  null
                }
                showReviewDelete={review?.reviewer_id == authUser?.id}
                reply={review.reply || null}
                showDivider={index < reviewsToDisplay.length - 1}
                onReviewerProfileClick={onReviewerProfileClick}
                onReviewDelete={onReviewDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Reviews_BusinessScreen.propTypes = {
  className: PropTypes.string,
  onReviewerProfileClick: PropTypes.func,
  onReviewDelete: PropTypes.func,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      reviewerInitials: PropTypes.string,
      date: PropTypes.string,
      rating: PropTypes.number,
      comment: PropTypes.string,
      reply: PropTypes.shape({
        sellerName: PropTypes.string,
        text: PropTypes.string,
      }),
    }),
  ),
};

export default Reviews_BusinessScreen;
