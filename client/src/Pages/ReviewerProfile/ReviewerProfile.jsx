import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ProfileCard from "../../components/client/ProfileCard/ProfileCard";
import Reviews from "../../sections/ReviewScreen/Reviews/Reviews_BusinessScreen";
import { useAppSelector } from "../../store/hooks";
import { getUserProfile as getUserProfileApi } from "../../services/profileServices";
import { getBusinessProfileBySlug } from "../../services/businessServices";
import {
  getProfileCoverUrl,
  getProfileImageUrl,
  getReviewImageUrl,
} from "../../utils/imageUtils";
import Reviews_ReviewerScreen from "../../sections/ReviewScreen/Reviews/Reviews_ReviewerScreen";

const ReviewerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useAppSelector((s) => s.auth?.token);
  const businessId = new URLSearchParams(location.search).get("business_id");

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [givenReviews, setGivenReviews] = useState([]);

  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setStatus("loading");
    setError("");
    setUser(null);
    setGivenReviews([]);
    getUserProfileApi({ id, token })
      .then(async (res) => {
        if (cancelled) return;
        const incoming = res?.additional_data?.user ?? res?.user ?? null;
        const userReviews = res?.data ?? [];
        setUserReviews(userReviews);
        setUser(incoming);

        if (businessId) {
          try {
            const businessRes = await getBusinessProfileBySlug({
              slugOrId: businessId,
              page: 1,
              limit: 200,
            });
            if (cancelled) return;
            const businessReviews = Array.isArray(businessRes?.data)
              ? businessRes.data
              : (businessRes?.data?.data ?? []);
            const filtered = businessReviews.filter((r) => {
              const reviewer =
                r?.user?.id ?? r?.user_id ?? r?.reviewer_id ?? null;
              return String(reviewer ?? "") === String(id ?? "");
            });
            setGivenReviews(filtered);
          } catch (_e) {
            if (!cancelled) setGivenReviews([]);
          }
        }

        if (!cancelled) setStatus("succeeded");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || "Could not load profile.");
        setStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, [id, token, businessId]);

  const banner = getProfileCoverUrl(user?.cover_picture) || null;
  const avatar = getProfileImageUrl(user?.profile_picture) || null;

  const reviews = useMemo(() => {
    // Show selected reviewer's own reviews first (global/user-level).
    // If backend does not provide them, fallback to business-filtered reviews.
    const userLevelReviews = Array.isArray(user?.reviews) ? user.reviews : [];
    const list = userLevelReviews.length > 0 ? userLevelReviews : givenReviews;
    if (!Array.isArray(list)) return [];
    return list.map((r) => {
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

      const commentText = String(
        r.review ??
          r.comment ??
          r.description ??
          r.message ??
          r.review_text ??
          r.review_comment ??
          "",
      ).trim();

      return {
        id: r.id ?? r._id,
        profile_image:
          getProfileImageUrl(
            r?.user?.profile_picture ??
              r?.user?.profile_image ??
              r?.profile_image ??
              user?.profile_picture,
          ) || null,
        review_image:
          getReviewImageUrl(r.image_url ?? r.review_image ?? r.image) ||
          r.image_url ||
          r.review_image ||
          r.image ||
          null,
        reviewer_name: r?.user?.name || user?.name || "User",
        reviewer_id: r?.user?.id ?? r?.user_id ?? user?.id ?? id,
        rating: Number.isFinite(Number(r.rating)) ? Number(r.rating) : 0,
        comment: commentText,
        reply: replyObj,
        date:
          r.created_at || r.createdAt
            ? new Date(r.created_at || r.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )
            : "",
      };
    });
  }, [givenReviews, user, id]);

  const visibleReviewsCount = Array.isArray(reviews) ? reviews.length : 0;

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <main className="py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-primary bg-transparent border-0 p-0 hover:underline"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white border border-gray-300 rounded-[10px] sm:rounded-[12px] overflow-hidden">
            {status === "loading" && (
              <div className="p-10 text-center text-primary">Loading…</div>
            )}
            {status === "failed" && (
              <div className="p-10 text-center">
                <p className="text-red-600">{error || "Could not load."}</p>
              </div>
            )}
            {status === "succeeded" && user && (
              <>
                <ProfileCard
                  bannerImage={banner}
                  profileImage={avatar}
                  name={user?.name || "User"}
                  subtitle={user?.about_us || ""}
                  website={user?.website || user?.website_url || ""}
                  // reviewsCount={visibleReviewsCount}
                  showEditProfile={false}
                  showSkipToCertificates={false}
                  rating={user?.rating != null ? Number(user.rating) : null}
                  reviewsCount={userReviews.length}
                />
                <Reviews_ReviewerScreen
                  reviews={userReviews}
                  user={user}
                  className="!pt-2"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewerProfile;
