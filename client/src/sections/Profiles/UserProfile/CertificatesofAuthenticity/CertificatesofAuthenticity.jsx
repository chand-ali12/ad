import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiFileText,
  FiX,
  FiDownload,
  FiPrinter,
  FiShare2,
} from "react-icons/fi";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
  RedditShareButton,
  RedditIcon,
} from "react-share";
import { Tag, ImagePlus, MessageCircle } from "lucide-react";
import certificateImage from "../../../../assets/images/Image (Certificate of Authenticity).png";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getBrands } from "../../../../store/slices";
import RequestMoreImagesModal from "./RequestMoreImagesModal";
import { MEDIA_BASE_URL } from "../../../../config/env";
import PDFViewer_ProfileSection from "../../../../utils/PDFViewer_ProfileSection";
import {
  createRoom,
  roomExistsForOrder,
} from "../../../../services/expeditedChatService";
import { getUserProfile as getUserProfileApi } from "../../../../services/profileServices";

// Old website uses certificate.is_sold (0 = available, 1 = sold). Also support status string.
const isCertificateSold = (cert) => {
  if (!cert) return false;
  const s = String(cert.status ?? "").toLowerCase();
  if (s === "sold") return true;
  if (s === "available") return false;
  const isSold = cert.certificate?.is_sold ?? cert.is_sold ?? cert.issold;
  return isSold === 1 || isSold === "1" || isSold === true;
};

// Authentic / Not Authentic / Inconclusive from API (old site: certificate.certificate.result)
const getCertificateResult = (cert) => {
  if (!cert) return null;
  const result = cert.certificate?.result ?? cert.result;
  if (result && typeof result === "string") return result.trim();
  return null;
};

const getResultBadgeColor = (result) => {
  if (!result) return "#9e9e9e";
  const r = result.toLowerCase();
  if (r === "authentic") return "#4caf50";
  if (r === "not authentic") return "#f44336";
  if (r === "inconclusive") return "#ff9800";
  return "#9e9e9e";
};

// PDF URL for "View COA PDF" (open in new tab). Use MEDIA_BASE_URL so production uses S3 HTTPS (same as old site / Verify).
export const getCertificatePdfUrl = (cert) => {
  const pdf = cert?.certificate?.pdf ?? cert?.pdf;
  if (!pdf || typeof pdf !== "string") return null;
  const base = (MEDIA_BASE_URL || "").replace(/\/+$/, "");
  const resultStr = (cert?.certificate?.result ?? cert?.result ?? "")
    .toString()
    .toLowerCase();
  const isInconclusive = resultStr === "inconclusive";
  const folder = isInconclusive ? "pdfInconclusive" : "pdfCertificates";
  const filename = String(pdf).replace(/^\/+/, "");
  return `${base}/${folder}/${filename}`;
};

// Thumbnail PNG URL for card preview (same as old site / Verify: pdfThumbnail on S3 so it works in production).
const getCompletedThumbnailUrl = (cert) => {
  const pdf = cert?.certificate?.pdf ?? cert?.pdf;
  if (!pdf || typeof pdf !== "string") return null;
  const base = (MEDIA_BASE_URL || "").replace(/\/+$/, "");
  const resultStr = (cert?.certificate?.result ?? cert?.result ?? "")
    .toString()
    .toLowerCase();
  const isInconclusive = resultStr === "inconclusive";
  const folder = isInconclusive ? "pdfInconclusive/thumbnail" : "pdfThumbnail";
  const thumbnailFile = String(pdf)
    .replace(/\.pdf$/i, ".png")
    .replace(/^\/+/, "");
  return `${base}/${folder}/${thumbnailFile}`;
};

// First image from request_images, attribute_images, or images (like old site getPendingThumbnailUrl). Uses MEDIA_BASE_URL so you can set VITE_MEDIA_BASE_URL to S3 (e.g. https://auth-detect.s3.amazonaws.com) if images 404 from IMAGE_BASE_URL.
const getPendingImageUrl = (cert) => {
  const req =
    cert?.request_images ??
    cert?.authenticate_query?.request_images ??
    cert?.query_detail?.request_images;
  const attr =
    cert?.attribute_images ??
    cert?.authenticate_query?.attribute_images ??
    cert?.query_detail?.attribute_images;
  const imagesList = cert?.images;
  const firstFrom = (val) => {
    if (!val) return null;
    if (typeof val === "string") return val.split(",")[0]?.trim() || null;
    if (Array.isArray(val) && val.length)
      return typeof val[0] === "string" ? val[0].trim() : null;
    return null;
  };
  const firstReq = firstFrom(req);
  const firstAttr = firstFrom(attr);
  const firstImages = firstFrom(imagesList);
  const filename = firstReq || firstAttr || firstImages;
  const base = (MEDIA_BASE_URL || "").replace(/\/+$/, "");
  if (filename) {
    if (filename.startsWith("http://") || filename.startsWith("https://"))
      return filename;
    if (base)
      return `${base}/authenticateImage/${filename.replace(/^\/+/, "")}`;
  }
  const single =
    cert?.image ??
    cert?.thumbnail ??
    cert?.authenticate_query?.image ??
    cert?.query_detail?.image;
  if (single && typeof single === "string") {
    const s = single.trim();
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (base) return `${base}/authenticateImage/${s.replace(/^\/+/, "")}`;
  }
  return null;
};

// Admin requested more images (any request_more_images item has status === 0) — like old site
const isMorePhotosRequested = (cert) => {
  const list =
    cert?.request_more_images ??
    cert?.authenticate_query?.request_more_images ??
    [];
  return Array.isArray(list) && list.some((item) => Number(item?.status) === 0);
};

/** Backend /ad/is-sold expects certificate row id (nested certificate.id when present). */
const getMarkSoldCertificateId = (cert) => {
  if (!cert) return null;
  const nested = cert.certificate?.id;
  if (nested != null && nested !== "") return nested;
  // Some APIs return certificate id at top-level.
  if (cert.certificate_id != null && cert.certificate_id !== "")
    return cert.certificate_id;
  if (cert.id != null && cert.id !== "") return cert.id;
  return null;
};

// Normalize a "query" item (from get-user-queries) to the same shape as a certificate card
const mapQueryToCard = (q) => ({
  id: q.id ?? q.query_id ?? q.authenticate_id,
  brand: q.brand ?? q.brands?.brand ?? q.brand_name,
  brands: q.brands,
  status: q.status ?? "Pending",
  date: q.date ?? q.created_at ?? q.certificate?.date,
  created_at: q.created_at ?? q.date,
  order:
    q.order ??
    q.order_number ??
    q.coa_number ??
    q.certificate?.certificate_id ??
    q.order_id,
  order_id: q.order_id ?? q.order_number ?? q.order,
  order_number: q.order_number,
  coa_number: q.coa_number,
  certificate: q.certificate,
  image:
    q.image ??
    q.thumbnail ??
    q.authenticate_query?.image ??
    q.query_detail?.image ??
    q.certificate?.image,
  request_images:
    q.request_images ??
    q.authenticate_query?.request_images ??
    q.query_detail?.request_images,
  attribute_images:
    q.attribute_images ??
    q.authenticate_query?.attribute_images ??
    q.query_detail?.attribute_images,
  images: q.images ?? q.authenticate_query?.images ?? q.query_detail?.images,
  request_more_images:
    q.request_more_images ?? q.authenticate_query?.request_more_images,
  query_detail: q.query_detail ?? q.authenticate_query,
  authenticate_query: q.authenticate_query ?? q,
  uuid: q.uuid ?? q.certificate_uuid,
  certificate_uuid: q.certificate_uuid ?? q.uuid,
  result: q.certificate?.result ?? q.result,
  isFromQueries: true,
});

const CertificatesofAuthenticity = ({
  className = "",
  id = "certificates",
  certificates = [],
  queries = [],
  queryCounts = {},
  onPaymentStatusChange,
  isChangingPaymentStatus = false,
  onUpdateNote,
  isUpdatingNote = false,
  onViewCoaPdf,
  onViewCertificatePdf,
  onRequestMoreImages,
  onUploadImagesForModal,
  onMarkAsSold,
  markingSoldId = null,
  onDownloadCoaPdf,
  onPrintCoaPdf,
  onShareCoaPdf,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { brands: brandsList = [] } = useAppSelector((state) => state.brands);

  const [activeTab, setActiveTab] = useState("Completed"); // 'Completed' | 'Pending' | 'Sold' | 'Available'
  const [startingChatId, setStartingChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteModalCertificate, setNoteModalCertificate] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [requestImagesCertificate, setRequestImagesCertificate] =
    useState(null);
  const [pdfModalCert, setPdfModalCert] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Lock background scroll when PDF modal is open
  useEffect(() => {
    if (!pdfModalCert) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [pdfModalCert]);

  // Filter & Sort panel (like old website)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);
  const panelRef = useRef(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("desc"); // 'asc' | 'desc'
  const [brandSearch, setBrandSearch] = useState("");

  // Derive pendingQueries first so it can be used in useEffects below
  const pendingQueries = (queries || []).filter((q) => {
    if (Number(q.type) === 2) return false;
    const s = String(q.status ?? q.type ?? "").toLowerCase();
    return s === "pending" || s === "0" || q.type === 0;
  });

  const expeditedQueries = (queries || []).filter((q) => Number(q.type) === 2);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  // Slide-in: after panel mounts, trigger transition from right
  useEffect(() => {
    if (!isFilterOpen || isClosing) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelEntered(true));
    });
    return () => cancelAnimationFrame(t);
  }, [isFilterOpen, isClosing]);

  // Reset entered state when panel is fully closed
  useEffect(() => {
    if (!isFilterOpen && !isClosing) setPanelEntered(false);
  }, [isFilterOpen, isClosing]);

  // Prevent background/body scroll while filter panel is open (fixes "moveable" panel on mobile).
  useEffect(() => {
    const isOpen = isFilterOpen || isClosing;
    if (!isOpen) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.body.style.touchAction = prevBodyTouchAction;
    };
  }, [isFilterOpen, isClosing]);

  // Build searchable text from a cert/card so search works regardless of API shape
  const getSearchableText = (cert) => {
    const brand = (
      cert.brand ??
      cert.brands?.brand ??
      cert.brands?.[0]?.brand ??
      cert.brands?.[0]?.name ??
      cert.brand_name ??
      cert.authenticate_query?.brand ??
      ""
    )
      .toString()
      .trim();
    const order = (
      cert.order ??
      cert.order_id ??
      cert.order_number ??
      cert.coa_number ??
      cert.certificate_id ??
      cert.authenticate_query?.order_number ??
      ""
    )
      .toString()
      .trim();
    const result = (getCertificateResult(cert) ?? "").toString().trim();
    const date = (cert.date ?? cert.created_at ?? cert.certificate?.date ?? "")
      .toString()
      .trim();
    return [brand, order, result, date].filter(Boolean).join(" ").toLowerCase();
  };

  const searchLower = searchQuery.trim().toLowerCase();

  // Normalize brand for filtering/counts
  const getBrandName = (cert) =>
    (
      cert.brand ??
      cert.brands?.brand ??
      cert.brands?.[0]?.brand ??
      cert.brands?.[0]?.name ??
      cert.brand_name ??
      cert.authenticate_query?.brand ??
      ""
    )
      .toString()
      .trim();

  const matchesSearchAndBrand = (item) => {
    const matchesSearch =
      !searchLower || getSearchableText(item).includes(searchLower);
    if (!matchesSearch) return false;
    if (!selectedBrand) return true;
    const brand = getBrandName(item);
    return brand.toLowerCase() === selectedBrand.toLowerCase();
  };

  // Pre-map all pending queries once so we can reuse for counts and lists
  const allPendingCards = pendingQueries.map(mapQueryToCard);
  const allExpeditedCards = expeditedQueries.map(mapQueryToCard);

  // Filter certificates: based on activeTab using is_sold
  const filteredCertificates = certificates.filter((cert) => {
    const sold = isCertificateSold(cert);
    const matchesTab =
      activeTab === "Completed" ||
      (activeTab === "Sold" && sold) ||
      (activeTab === "Available" && !sold);
    const matchesSearchBrand = matchesSearchAndBrand(cert);
    return matchesTab && matchesSearchBrand;
  });

  // Pending: show items from queries (get-user-queries)
  const pendingCards =
    activeTab === "Pending"
      ? allPendingCards.filter((card) => matchesSearchAndBrand(card))
      : [];

  // Expedited: show items from queries where type === 2
  const expeditedCards =
    activeTab === "Expedited"
      ? allExpeditedCards.filter((card) => matchesSearchAndBrand(card))
      : [];

  const listToShow =
    activeTab === "Pending"
      ? pendingCards
      : activeTab === "Expedited"
        ? expeditedCards
        : filteredCertificates;

  // At this point search + brand are already applied in listToShow; just sort.
  const brandFiltered = listToShow;

  const getCertDate = (cert) => {
    const d = cert.date ?? cert.created_at;
    if (!d) return 0;
    return new Date(d).getTime();
  };
  const sortedList = [...brandFiltered].sort((a, b) => {
    const dateA = getCertDate(a);
    const dateB = getCertDate(b);
    return sortBy === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Counts for tabs that respect current search + brand filters
  const expeditedCount = allExpeditedCards.filter((card) =>
    matchesSearchAndBrand(card),
  ).length;
  const completedCount = certificates.filter((cert) =>
    matchesSearchAndBrand(cert),
  ).length;
  const soldCount = certificates.filter(
    (cert) => isCertificateSold(cert) && matchesSearchAndBrand(cert),
  ).length;
  const availableCount = certificates.filter(
    (cert) => !isCertificateSold(cert) && matchesSearchAndBrand(cert),
  ).length;
  const pendingCount =
    queryCounts.pendingCount != null && !searchLower && !selectedBrand
      ? queryCounts.pendingCount
      : allPendingCards.filter((card) => matchesSearchAndBrand(card)).length;

  // Top-level tabs: Completed | Pending | Sold items | Available items (single row, like old website)
  const mainTabs = [
    { label: "Expedited", count: expeditedCount, value: "Expedited" },
    { label: "Completed", count: completedCount, value: "Completed" },
    { label: "Pending", count: pendingCount, value: "Pending" },
    { label: "Sold items", count: soldCount, value: "Sold" },
    { label: "Available items", count: availableCount, value: "Available" },
  ];

  // Brands filtered by "Search brand..." in the panel, always shown in alphabetical order
  const brandsFilteredBySearch = (() => {
    const normalizeName = (b) => (b.brand ?? b.name ?? "").toString();
    const baseList = brandSearch.trim()
      ? brandsList.filter((b) => {
          const name = normalizeName(b).toLowerCase();
          return name.includes(brandSearch.trim().toLowerCase());
        })
      : brandsList;
    return [...baseList].sort((a, b) => {
      const nameA = normalizeName(a).toLowerCase();
      const nameB = normalizeName(b).toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  })();

  const openFilterPanel = () => {
    setIsClosing(false);
    setIsFilterOpen(true);
  };
  const finishClose = () => {
    setIsFilterOpen(false);
    setIsClosing(false);
    setPanelEntered(false);
  };
  const closeFilterPanel = () => {
    if (isClosing) return;
    setIsClosing(true);
  };
  const handleTransitionEnd = (e) => {
    if (e.target !== panelRef.current || e.propertyName !== "transform") return;
    if (isClosing) finishClose();
  };
  const handleApplyFilter = () => {
    closeFilterPanel();
  };
  const handleClearFilter = () => {
    setSelectedBrand("");
    setSortBy("desc");
    setBrandSearch("");
  };

  const openNoteModal = (cert) => {
    setNoteModalCertificate(cert);
    setNoteDraft(cert.note ?? "");
  };
  const closeNoteModal = () => {
    setNoteModalCertificate(null);
    setNoteDraft("");
  };
  const handleSaveNote = () => {
    if (noteModalCertificate && onUpdateNote) {
      onUpdateNote(noteModalCertificate.id, noteDraft);
      closeNoteModal();
    }
  };

  const openPdfForBestView = (url) => {
    if (!url || typeof window === "undefined") return;
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (isMobileViewport) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (url, filename) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resolveAuthenticatorInfo = async (card) => {
    const aq = card.authenticate_query ?? card.query_detail ?? {};
    const authenticatorUserId = aq.expedited_claimed_by ?? null;

    if (!authenticatorUserId) return null;

    try {
      const token = localStorage.getItem("authToken");
      const res = await getUserProfileApi({ id: authenticatorUserId, token });
      const user =
        res?.additional_data?.user ?? res?.data?.user ?? res?.user ?? null;
      if (user) {
        return {
          id: String(user.id),
          name: user.name || "Authenticator",
          image: user.profile_picture || "",
          email: user.email || "",
        };
      }
    } catch (err) {
      console.warn("Could not fetch authenticator profile:", err);
    }

    return {
      id: String(authenticatorUserId),
      name: aq.brand ?? card.brand ?? "Authenticator",
      image: "",
      email: "",
    };
  };

  const handleStartChat = async (card) => {
    const aq = card.authenticate_query ?? card.query_detail ?? {};
    const orderId = String(
      aq.order_number ??
        card.order_id ??
        card.order_number ??
        card.order ??
        card.coa_number ??
        card.id ??
        "",
    );
    if (!orderId || !authUser?.id) return;

    const cardId = card.id ?? orderId;
    setStartingChatId(cardId);

    try {
      let exists = false;
      try {
        exists = await roomExistsForOrder(orderId);
      } catch (checkErr) {
        console.warn(
          "Room existence check failed, will try creating:",
          checkErr,
        );
      }

      if (exists) {
        navigate(`/expedited-chat?room=exp_${orderId}`);
        return;
      }

      const authenticatorInfo = await resolveAuthenticatorInfo(card);
      if (!authenticatorInfo) {
        alert(
          "This expedited query hasn't been claimed by an authenticator yet. " +
            "Chat will be available once an authenticator is assigned.",
        );
        return;
      }

      const clientInfo = {
        id: String(authUser.id),
        name: authUser.name || authUser.first_name || "Client",
        image: authUser.profile_picture || authUser.image || "",
        email: authUser.email || "",
      };

      await createRoom(orderId, clientInfo, authenticatorInfo);
      navigate(`/expedited-chat?room=exp_${orderId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Failed to start chat: " + (err?.message || "Unknown error"));
    } finally {
      setStartingChatId(null);
    }
  };

  return (
    <section
      id={id}
      className={`w-full pt-10 sm:pt-24 md:pt-28 pb-6 sm:pb-12 ${className}`}
    >
      <div className="w-full px-5 sm:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-8 text-center">
          Certificates of Authenticity
        </h2>

        {/* Search and Filter Bar — filter icon inside the search field on the right */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <button
              type="button"
              onClick={openFilterPanel}
              className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-0 p-0 cursor-pointer"
              aria-label="Open filter and sort"
            >
              <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <input
              type="text"
              placeholder="Search by brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-[12px] border-2 border-[#D0D0D0] bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary"
              aria-label="Search certificates"
            />
          </div>
        </div>

        {/* Main Tabs: Completed | Pending | Sold items | Available items (single row, like old website) */}
        <div className="border-b border-gray-200 mb-4 pb-1">
          <div className="flex flex-wrap gap-1.5 sm:gap-4">
            {mainTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                }}
                style={{ border: "none", outline: "none", boxShadow: "none" }}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base md:text-lg font-semibold bg-transparent border-0 hover:bg-transparent hover:text-current focus:border-0 focus:outline-none focus:ring-0 ${
                  activeTab === tab.value
                    ? "text-primary underline decoration-primary decoration-2"
                    : "text-gray-600"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Cards Grid — Pending tab uses queries (get-user-queries); others use certificates (get-user-certificate) */}
        {sortedList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No certificates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedList.map((certificate) => {
              const result = getCertificateResult(certificate);
              const resultColor = getResultBadgeColor(result);
              const isPendingLike =
                activeTab === "Pending" || activeTab === "Expedited";
              const pdfUrl = !isPendingLike
                ? getCertificatePdfUrl(certificate)
                : null;
              const thumbnailUrl =
                activeTab === "Completed" &&
                getCompletedThumbnailUrl(certificate)
                  ? getCompletedThumbnailUrl(certificate)
                  : isPendingLike
                    ? (getPendingImageUrl(certificate) ??
                      certificate.image ??
                      certificate.thumbnail ??
                      null)
                    : (certificate.image ?? certificate.thumbnail ?? null);
              const imageSrc = isPendingLike
                ? thumbnailUrl || null
                : thumbnailUrl || certificateImage;
              // get-user-queries API: brand and order_number live under authenticate_query
              const aq = certificate.authenticate_query;
              const displayBrand =
                aq?.brand ??
                certificate.brands?.brand ??
                certificate.brands?.[0]?.brand ??
                certificate.brands?.[0]?.name ??
                certificate.brand ??
                certificate.brand_name ??
                null;
              const displayOrder =
                aq?.order_number ??
                certificate.certificate_id ??
                certificate.coa_number ??
                certificate.order_number ??
                certificate.order ??
                certificate.order_id ??
                null;
              const displayModel =
                certificate.authenticate_query?.model ??
                certificate.query_detail?.model ??
                certificate.certificate?.model ??
                certificate.model ??
                null;
              const showPendingStyle = isPendingLike;
              const cardClassName = showPendingStyle
                ? "bg-white border border-red-200 shadow-md hover:shadow-lg transition-shadow"
                : "bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow";
              const previewClassName = showPendingStyle
                ? "relative h-52 sm:h-64 flex items-center justify-center bg-red-50/30 overflow-hidden"
                : "relative h-[340px] sm:h-[420px] flex items-center justify-center bg-white overflow-hidden";
              const imageClassName = showPendingStyle
                ? "w-full h-full object-cover"
                : "max-w-full max-h-full w-auto h-auto object-contain";
              return (
                <div
                  key={
                    certificate.id ??
                    certificate.authenticate_id ??
                    certificate.certificate_id ??
                    certificate.order_number ??
                    Math.random()
                  }
                  className={`rounded-xl overflow-hidden ${cardClassName}`}
                >
                  {/* Preview: certificate thumbnail PNG (Completed) or real item image (Pending). Use thumbnail so production works (same as Verify page). */}
                  <div className={previewClassName}>
                    {isPendingLike && !imageSrc ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-sm">
                        <FiFileText className="w-6 h-6 mb-2 text-gray-400" />
                        No image
                      </div>
                    ) : (
                      <>
                        {pdfUrl ? (
                          <div className="relative w-full h-full">
                            <PDFViewer_ProfileSection pdfUrl={pdfUrl} />
                            {/* Transparent overlay sits on top of the <embed> to capture pointer events */}
                            <div
                              className="absolute inset-0 cursor-pointer group flex items-end justify-center pb-4 hover:bg-black/10 transition-colors"
                              onClick={() => setPdfModalCert(certificate)}
                            >
                              <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full transition-opacity select-none pointer-events-none">
                                Click to view
                              </span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={imageSrc}
                            alt={
                              isPendingLike
                                ? "Item photo"
                                : "Certificate of Authenticity"
                            }
                            className={imageClassName}
                            onError={(e) => {
                              e.target.onerror = null;
                              if (
                                typeof console !== "undefined" &&
                                console.warn
                              ) {
                                console.warn(
                                  "[Certificates] Image failed to load:",
                                  imageSrc?.substring?.(0, 120),
                                );
                              }
                              if (isPendingLike)
                                e.target.style.display = "none";
                              else e.target.src = certificateImage;
                            }}
                          />
                        )}
                      </>
                    )}
                    {/* Authentic / Not Authentic / Inconclusive badge from API (like old website) */}
                    {activeTab === "Completed" && result && (
                      <span
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-sm"
                        style={{ backgroundColor: resultColor }}
                      >
                        {result}
                      </span>
                    )}
                    {activeTab === "Expedited" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartChat(certificate);
                        }}
                        disabled={
                          startingChatId != null &&
                          String(startingChatId) ===
                            String(certificate.id ?? certificate.order_id)
                        }
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md border border-gray-200 z-10 transition-all hover:scale-110 disabled:opacity-50"
                        title="Chat with authenticator"
                        aria-label="Chat with authenticator"
                        style={{ color: "#3C1F1B" }}
                      >
                        {startingChatId != null &&
                        String(startingChatId) ===
                          String(certificate.id ?? certificate.order_id) ? (
                          <span className="block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MessageCircle className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    {isPendingLike && certificate.hasInconclusiveTag && (
                      <div className="absolute top-2 right-2 bg-[#FF9800] text-white px-2 py-1.5 rounded-full text-xs font-medium shadow-sm">
                        Inconclusive
                      </div>
                    )}
                    {/* Request More Images: show for Pending only when admin requested more images — opens modal */}
                    {isPendingLike &&
                      onRequestMoreImages &&
                      isMorePhotosRequested(certificate) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRequestImagesCertificate(certificate);
                          }}
                          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm border border-gray-200 text-red-500 hover:text-red-600 z-10"
                          title="Add more photos"
                          aria-label="Add more photos"
                        >
                          <ImagePlus className="w-5 h-5" />
                        </button>
                      )}
                    {!isPendingLike &&
                      onMarkAsSold &&
                      (() => {
                        const soldCertId =
                          getMarkSoldCertificateId(certificate);
                        const sold = isCertificateSold(certificate);
                        const busy =
                          markingSoldId != null &&
                          String(markingSoldId) === String(soldCertId);
                        return soldCertId ? (
                          <button
                            type="button"
                            title={sold ? "Mark as available" : "Mark as sold"}
                            aria-label={
                              sold ? "Mark as available" : "Mark as sold"
                            }
                            disabled={busy}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsSold(certificate);
                            }}
                            className={`absolute bottom-2 left-3 text-white p-2 rounded-[12.99px] z-10 shadow-sm hover:opacity-90 disabled:opacity-60 ${
                              sold ? "bg-green-600" : "bg-primary"
                            }`}
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                        ) : null;
                      })()}
                  </div>
                  {/* Certificate Details — brand and order from API. For Pending do not show Status. */}
                  <div
                    className={`p-3 sm:p-4 border-t border-gray-100 ${showPendingStyle ? "bg-red-50/20" : "bg-white"}`}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-1 sm:mb-1.5">
                      {displayBrand || "Unknown Brand"}
                    </h3>
                    <div
                      className={`text-sm sm:text-base text-primary ${showPendingStyle ? "space-y-1.5 sm:space-y-2" : "space-y-2 sm:space-y-2.5"}`}
                    >
                      {!isPendingLike && (
                        <p>
                          <span className="font-bold">Status:</span>
                          <span className="ml-3">
                            {certificate.status ??
                              (certificate.certificate?.is_sold === 1 ||
                              certificate.is_sold === 1
                                ? "Sold"
                                : "Available") ??
                              "N/A"}
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="font-bold">Model:</span>
                        <span className="ml-3">{displayModel ?? "N/A"}</span>
                      </p>
                      <p>
                        <span className="font-bold">Order:</span>
                        <span className="ml-3">{displayOrder ?? "N/A"}</span>
                      </p>
                      {showPendingStyle &&
                        isMorePhotosRequested(certificate) && (
                          <p className="text-red-600 text-sm italic">
                            * More photos required for proper authentication
                          </p>
                        )}
                      {certificate.isFromQueries && (
                        <p className="mt-2 text-sm sm:text-base text-gray-500">
                          COA PDF available after authentication is completed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {pdfModalCert &&
        (() => {
          const modalPdfUrl = getCertificatePdfUrl(pdfModalCert);
          const modalPngUrl = getCompletedThumbnailUrl(pdfModalCert);
          const aqModal = pdfModalCert.authenticate_query;
          const modalBrand =
            aqModal?.brand ??
            pdfModalCert.brands?.brand ??
            pdfModalCert.brands?.[0]?.brand ??
            pdfModalCert.brands?.[0]?.name ??
            pdfModalCert.brand ??
            pdfModalCert.brand_name ??
            "Certificate of Authenticity";
          const modalOrder =
            aqModal?.order_number ??
            pdfModalCert.certificate_id ??
            pdfModalCert.coa_number ??
            pdfModalCert.order_number ??
            pdfModalCert.order ??
            pdfModalCert.order_id ??
            null;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5"
              onClick={() => {
                setPdfModalCert(null);
                setShowShareOptions(false);
              }}
            >
              <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden"
                style={{ height: "calc(100vh - 40px)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-primary leading-tight">
                      {modalBrand}
                    </h3>
                    {modalOrder && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Order: {modalOrder}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfModalCert(null);
                      setShowShareOptions(false);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-4"
                    aria-label="Close"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* PDF Viewer — flex-1 fills all remaining height */}
                <div className="flex-1 min-h-0 bg-gray-100">
                  {modalPdfUrl ? (
                    <iframe
                      src={`${modalPdfUrl}#toolbar=1&navpanes=0`}
                      title="Certificate of Authenticity"
                      className="w-full h-full border-0 block"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      PDF not available
                    </div>
                  )}
                </div>

                {/* Share Options Panel */}
                {showShareOptions && modalPdfUrl && (
                  <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-primary">
                        Share Certificate
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowShareOptions(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close share options"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <FacebookShareButton
                          url={modalPdfUrl}
                          hashtag="#CertificateOfAuthenticity"
                        >
                          <FacebookIcon size={40} round />
                        </FacebookShareButton>
                        <span className="text-xs text-gray-500">Facebook</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <TwitterShareButton
                          url={modalPdfUrl}
                          title={`Certificate of Authenticity — ${modalBrand}`}
                          hashtags={["CertificateOfAuthenticity", "Authentic"]}
                        >
                          <XIcon size={40} round />
                        </TwitterShareButton>
                        <span className="text-xs text-gray-500">X</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <WhatsappShareButton
                          url={modalPdfUrl}
                          title={`Certificate of Authenticity — ${modalBrand}`}
                        >
                          <WhatsappIcon size={40} round />
                        </WhatsappShareButton>
                        <span className="text-xs text-gray-500">WhatsApp</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <TelegramShareButton
                          url={modalPdfUrl}
                          title={`Certificate of Authenticity — ${modalBrand}`}
                        >
                          <TelegramIcon size={40} round />
                        </TelegramShareButton>
                        <span className="text-xs text-gray-500">Telegram</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <LinkedinShareButton
                          url={modalPdfUrl}
                          title={`Certificate of Authenticity — ${modalBrand}`}
                          summary={modalOrder ? `Order: ${modalOrder}` : ""}
                          source="Auth-Detect"
                        >
                          <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                        <span className="text-xs text-gray-500">LinkedIn</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <RedditShareButton
                          url={modalPdfUrl}
                          title={`Certificate of Authenticity — ${modalBrand}`}
                        >
                          <RedditIcon size={40} round />
                        </RedditShareButton>
                        <span className="text-xs text-gray-500">Reddit</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <EmailShareButton
                          url={modalPdfUrl}
                          subject={`Certificate of Authenticity — ${modalBrand}`}
                          body={`Here is the Certificate of Authenticity for ${modalBrand}${modalOrder ? ` (Order: ${modalOrder})` : ""}:\n\n${modalPdfUrl}`}
                        >
                          <EmailIcon size={40} round />
                        </EmailShareButton>
                        <span className="text-xs text-gray-500">Email</span>
                      </div>
                      {typeof navigator !== "undefined" && navigator.share && (
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              navigator.share({
                                title: `Certificate of Authenticity — ${modalBrand}`,
                                text: `Certificate of Authenticity${modalOrder ? ` for Order ${modalOrder}` : ""}`,
                                url: modalPdfUrl,
                              })
                            }
                            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-900 text-white flex items-center justify-center transition-colors"
                            aria-label="More share options"
                          >
                            <FiShare2 className="w-5 h-5" />
                          </button>
                          <span className="text-xs text-gray-500">More</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Download Buttons */}
                <div className="px-5 py-3 border-t border-gray-200 flex flex-wrap items-center gap-3 justify-end flex-shrink-0">
                  <span className="text-sm text-gray-500 mr-auto">
                    Download as:
                  </span>
                  {modalPngUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(modalPngUrl, "certificate.png")
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      PNG
                    </button>
                  )}
                  {modalPdfUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(modalPdfUrl, "certificate.pdf")
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      PDF
                    </button>
                  )}
                  {modalPdfUrl && (
                    <button
                      type="button"
                      onClick={() => setShowShareOptions((prev) => !prev)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        showShareOptions
                          ? "bg-primary text-white border-primary"
                          : "text-primary border-gray-300 hover:bg-gray-50"
                      }`}
                      aria-label="Share certificate"
                    >
                      <FiShare2 className="w-4 h-4" />
                      Share
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      {/* Request More Images modal (like old site) */}
      <RequestMoreImagesModal
        open={!!requestImagesCertificate}
        onClose={() => setRequestImagesCertificate(null)}
        certificate={requestImagesCertificate}
        onSubmit={onRequestMoreImages}
        onUploadImages={onUploadImagesForModal}
        isAdminRequested={
          requestImagesCertificate
            ? isMorePhotosRequested(requestImagesCertificate)
            : false
        }
      />

      {/* Filter & Sort panel (slide in from right, slide out on close) */}
      {(isFilterOpen || isClosing) && (
        <>
          <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ease-out ${
              isFilterOpen && !isClosing
                ? "bg-black/30 opacity-100"
                : "bg-black/0 opacity-0 pointer-events-none"
            }`}
            aria-hidden
            onClick={closeFilterPanel}
          />
          <div
            ref={panelRef}
            onTransitionEnd={handleTransitionEnd}
            className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col overflow-hidden overscroll-contain transition-transform duration-300 ease-out ${
              isFilterOpen && !isClosing && panelEntered
                ? "translate-x-0"
                : "translate-x-full"
            }`}
            style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">
                Filter & Sort
              </h3>
              <button
                type="button"
                onClick={closeFilterPanel}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-5 md:p-6 overflow-hidden">
              <div className="flex flex-col flex-1 min-h-0 gap-4 sm:gap-6">
                {/* Brand */}
                <div className="flex flex-col flex-1 min-h-0">
                  <h4 className="text-sm sm:text-base font-bold text-primary mb-2 sm:mb-3 flex-shrink-0">
                    Brand
                  </h4>
                  <div className="relative mb-2 sm:mb-3 flex-shrink-0">
                    <FiSearch className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search brand..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    />
                  </div>
                  <div
                    className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain space-y-1.5 sm:space-y-2 pr-1 touch-pan-y"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      overscrollBehavior: "contain",
                    }}
                  >
                    {brandsFilteredBySearch.length === 0 ? (
                      <p className="text-sm sm:text-base text-gray-500">
                        No brands found
                      </p>
                    ) : (
                      brandsFilteredBySearch.map((b) => {
                        const brandName = (b.brand ?? b.name ?? "").toString();
                        const isSelected =
                          selectedBrand.toLowerCase() ===
                          brandName.toLowerCase();
                        return (
                          <label
                            key={b.id ?? brandName}
                            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-gray-50 rounded p-2 sm:p-2.5 -m-2 sm:-m-2.5"
                          >
                            <input
                              type="radio"
                              name="filter-brand"
                              checked={isSelected}
                              onChange={() => setSelectedBrand(brandName)}
                              className="w-4 h-4 sm:w-5 sm:h-5 accent-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="text-sm sm:text-base text-primary">
                              {brandName}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
                {/* Sort By */}
                <div className="flex-shrink-0 pt-1 border-t border-gray-100">
                  <h4 className="text-sm sm:text-base font-bold text-primary mb-2 sm:mb-3">
                    Sort By
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-gray-50 rounded p-2 sm:p-2.5 -m-2 sm:-m-2.5">
                      <input
                        type="radio"
                        name="filter-sort"
                        checked={sortBy === "asc"}
                        onChange={() => setSortBy("asc")}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm sm:text-base text-primary">
                        Ascending
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-gray-50 rounded p-2 sm:p-2.5 -m-2 sm:-m-2.5">
                      <input
                        type="radio"
                        name="filter-sort"
                        checked={sortBy === "desc"}
                        onChange={() => setSortBy("desc")}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm sm:text-base text-primary">
                        Descending
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleClearFilter}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium text-primary bg-white border border-gray-800 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApplyFilter}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium text-white bg-primary rounded-lg hover:opacity-90"
              >
                Filter
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

CertificatesofAuthenticity.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  certificates: PropTypes.array,
  queries: PropTypes.array,
  queryCounts: PropTypes.object,
  onPaymentStatusChange: PropTypes.func,
  isChangingPaymentStatus: PropTypes.bool,
  onUpdateNote: PropTypes.func,
  isUpdatingNote: PropTypes.bool,
  onViewCoaPdf: PropTypes.func,
  onViewCertificatePdf: PropTypes.func,
  onRequestMoreImages: PropTypes.func,
  onUploadImagesForModal: PropTypes.func,
  onMarkAsSold: PropTypes.func,
  markingSoldId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onDownloadCoaPdf: PropTypes.func,
  onPrintCoaPdf: PropTypes.func,
  onShareCoaPdf: PropTypes.func,
};

export default CertificatesofAuthenticity;
