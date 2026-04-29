// import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import {
//   fetchAllPlans,
//   fetchSubscription,
//   createSubscription,
//   cancelSubscription,
//   freeProcessPaypalSubscription,
// } from '../../store/slices/subscriptionSlice';
// import { SectionHeader } from '../../components';
// import AlertCard from '../../components/client/AlertCard/AlertCard';
// import { FiInfo, FiArrowLeft, FiCheck } from 'react-icons/fi';

// const SubscriptionCard = lazy(() =>
//   import('../../components/client/SubscriptionCard/SubscriptionCard'),
// );

// const Subscription = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { user: authUser, token } = useAppSelector((state) => state.auth);
//   const {
//     plansFromApi,
//     currentSubscription,
//     createStatus,
//     error: subscriptionError,
//   } = useAppSelector((state) => state.subscription);
//   const [toastMessage, setToastMessage] = useState('');
//   const [showToast, setShowToast] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showSubscribeModal, setShowSubscribeModal] = useState(false);
//   const [showUpgradePlans, setShowUpgradePlans] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
//   const [isSubmittingModal, setIsSubmittingModal] = useState(false);
//   const [hasLoadedSubscription, setHasLoadedSubscription] = useState(false);
//   const [hasLoadedPlans, setHasLoadedPlans] = useState(false);
//   const plansSectionRef = useRef(null);
//   const [plansInView, setPlansInView] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllPlans()).finally(() => {
//       setHasLoadedPlans(true);
//     });
//     if (token) {
//       dispatch(fetchSubscription())
//         .finally(() => {
//           setHasLoadedSubscription(true);
//         });
//     } else {
//       setHasLoadedSubscription(true);
//     }
//   }, [dispatch, token]);

//   useEffect(() => {
//     const el = plansSectionRef.current;
//     if (!el || plansInView) return undefined;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry?.isIntersecting) {
//           setPlansInView(true);
//         }
//       },
//       { root: null, rootMargin: '120px 0px', threshold: 0.05 },
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [
//     plansInView,
//     hasLoadedPlans,
//     hasLoadedSubscription,
//     currentSubscription,
//     showUpgradePlans,
//   ]);

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const [year, month, day] = dateString.split('-').map(Number);
//     const formattedDate = new Date(year, (month || 1) - 1, day || 1);
//     return formattedDate.toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//     });
//   };

//   const formatMonthYear = (dateString) => {
//     if (!dateString) return '';
//     const [year, month] = dateString.split('-').map(Number);
//     const formattedDate = new Date(year, (month || 1) - 1, 1);
//     return formattedDate.toLocaleDateString('en-GB', {
//       month: 'long',
//       year: 'numeric',
//     });
//   };

//   const isFreePlan = (p) => {
//     const price = p?.price;
//     if (price === 0 || price === '0' || price === '$0') return true;
//     if (typeof price === 'string' && (price === '' || price.toLowerCase() === 'free')) return true;
//     return !!p?.is_free;
//   };

//   const showToastMsg = (msg, duration = 3000) => {
//     setToastMessage(msg);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), duration);
//   };

//   const openSubscribeModal = (plan) => {
//     const planId = plan?.plan_id ?? plan?.bundleId;
//     if (planId == null) {
//       showToastMsg('Invalid plan');
//       return;
//     }
//     setSelectedPlan(plan);
//     setIsCheckboxChecked(false);
//     setShowSubscribeModal(true);
//   };

//   const closeSubscribeModal = () => {
//     setShowSubscribeModal(false);
//     setSelectedPlan(null);
//     setIsCheckboxChecked(false);
//   };

//   const handleContinueSubscribe = async () => {
//     if (!selectedPlan || !isCheckboxChecked) return;
//     if (!authUser?.id || !token) {
//       showToastMsg('Please sign in to subscribe');
//       closeSubscribeModal();
//       navigate('/signin');
//       return;
//     }
//     const planId = selectedPlan.plan_id ?? selectedPlan.bundleId;
//     if (planId == null) {
//       showToastMsg('Invalid plan');
//       return;
//     }
//     setIsSubmittingModal(true);
//     if (isFreePlan(selectedPlan)) {
//       try {
//         const result = await dispatch(freeProcessPaypalSubscription({ plan_id: planId })).unwrap();
//         const url = result?.data?.data?.url ?? result?.data?.url ?? result?.url ?? result?.data?.redirect_url ?? result?.redirect_url;
//         if (url && typeof url === 'string') {
//           if (result?.msg) showToastMsg(result.msg, 2000);
//           window.location.href = url;
//           return;
//         }
//         showToastMsg(result?.msg || result?.message || 'Free subscription initiated');
//         dispatch(fetchSubscription());
//       } catch (err) {
//         const data = err?.data;
//         const url = data?.data?.url ?? data?.url ?? data?.data?.redirect_url;
//         if (url && typeof url === 'string') {
//           if (data?.msg) showToastMsg(data.msg, 2000);
//           window.location.href = url;
//           return;
//         }
//         const msg = err?.message || data?.msg || 'Failed to create subscription';
//         showToastMsg(msg === 'No Record Found!' ? 'This plan may not be available. Please try again or contact support.' : msg);
//       }
//       setIsSubmittingModal(false);
//       closeSubscribeModal();
//       return;
//     }
//     try {
//       const result = await dispatch(createSubscription(planId)).unwrap();
//       const url = result?.data?.data?.url ?? result?.data?.url ?? result?.url ?? result?.data?.redirect_url;
//       if (url && typeof url === 'string') {
//         if (result?.msg) showToastMsg(result.msg, 2000);
//         window.location.href = url;
//         return;
//       }
//       if (result?.status === false || result?.status_code === 401) {
//         showToastMsg(result?.msg === 'No Record Found!' ? 'This plan may not be available. Please try again or contact support.' : (result?.msg || 'Subscription request failed'));
//       } else {
//         showToastMsg(result?.msg || 'Subscription initiated');
//       }
//     } catch (err) {
//       const data = err?.data;
//       const url = data?.data?.url ?? data?.url ?? data?.data?.redirect_url;
//       if (url && typeof url === 'string') {
//         if (data?.msg) showToastMsg(data.msg, 2000);
//         window.location.href = url;
//         return;
//       }
//       const msg = err?.message || data?.msg || 'Failed to create subscription';
//       showToastMsg(msg === 'No Record Found!' ? 'This plan may not be available. Please try again or contact support.' : msg);
//     }
//     setIsSubmittingModal(false);
//     closeSubscribeModal();
//   };

//   const handleCancelSubscription = async () => {
//     try {
//       await dispatch(cancelSubscription()).unwrap();
//       setToastMessage('Subscription cancelled');
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       setShowCancelModal(false);
//       dispatch(fetchSubscription());
//     } catch (err) {
//       setToastMessage(err?.message || err || 'Failed to cancel');
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//     }
//   };

//   const fallbackPlans = [
//     { title: 'Bronze', plan_id: 1, bundleId: 1, price: '$190', features: ['20 requests/month', '5% off Authentications'], additionalNote: 'Additional requests can be added at $9.5/request', headerBgColor: '#CD7F32', headerTextColor: 'white' },
//     { title: 'Silver', plan_id: 2, bundleId: 2, price: '$450', features: ['50 requests/month', '10% off Authentications'], additionalNote: 'Additional requests can be added at $9/request', headerBgColor: '#C0C0C0', headerTextColor: '#333333' },
//     { title: 'Gold', plan_id: 3, bundleId: 3, price: '$850', features: ['100 requests/month', '15% off Authentications'], additionalNote: 'Additional requests can be added at $8.5/request', headerBgColor: '#FFD700', headerTextColor: '#333333' },
//     // { title: 'Platinum', plan_id: 4, bundleId: 4, price: '$850', features: ['300 requests/month', '15% off Authentications', 'Account Manager'], additionalNote: 'Additional requests can be added at $8.5/request', headerBgColor: '#E5E4E2', headerTextColor: '#333333' },
//   ];

//   const apiPlans =
//     Array.isArray(plansFromApi) && plansFromApi.length > 0
//       ? plansFromApi
//           .filter((p) => p.show !== false)
//           .map((p) => ({
//             plan_id: p.plan_id ?? p.id,
//             bundleId: p.plan_id ?? p.id,
//             title: p.name ?? p.title,
//             price: typeof p.price === 'number' ? `$${p.price}` : (p.price || ''),
//             features: Array.isArray(p.additional_features)
//               ? p.additional_features.map((f) => f?.title ?? f).filter(Boolean)
//               : [],
//             additionalNote: p.description ?? '',
//             headerBgColor: p.color_code || '#8B4513',
//             headerTextColor: p.headerTextColor || 'white',
//           }))
//       : [];
//   // Prefer API-driven plans whenever available; fall back to static plans only
//   // when the backend returns none. The old site uses whatever the API returns,
//   // so using fallback IDs here can cause "No Record Found" from create-subscription.
//   const displayPlans = apiPlans.length > 0 ? apiPlans : (hasLoadedPlans ? fallbackPlans : []);

//   const subscriptionPlans = displayPlans;

//   const normalizeId = (value) => {
//     if (value === null || value === undefined) return null;
//     const num = Number(value);
//     return Number.isNaN(num) ? value : num;
//   };

//   // Align with old site: sometimes the API returns { subscription, package },
//   // sometimes just the subscription object. Normalize to these two helpers.
//   const subscriptionData = currentSubscription ?? null;
//   const subscriptionDetails =
//     subscriptionData?.subscription ?? subscriptionData ?? null;

//   const activePlanIdRaw =
//     subscriptionData?.subscription?.plan_id ??
//     subscriptionData?.package?.plan_id ??
//     subscriptionData?.package?.id ??
//     subscriptionData?.bundleId ??
//     subscriptionDetails?.plan_id ??
//     null;
//   const activePlanId = normalizeId(activePlanIdRaw);

//   const activePlan =
//     activePlanId != null
//       ? subscriptionPlans.find((p) => {
//           const planIdNorm = normalizeId(p.plan_id);
//           const bundleIdNorm = normalizeId(p.bundleId);
//           return planIdNorm === activePlanId || bundleIdNorm === activePlanId;
//         })
//       : null;

//     const importantDetails = [
//         "Any leftover credits do not roll over. Please choose the lower tier if you are between two tiers.",
//         "You will be able to purchase additional requests at a discounted price if you run out of credits.",
//         "If you plan to upgrade your subscription, ensure all credits in your old subscription are used. Credits do not transfer."
//     ];

//     return (
//         <div className="w-full min-h-screen bg-[#F5F5F0] py-8 sm:py-12 md:py-16">
//             <div className="w-full max-w-full mx-auto px-0">
//                 {/* Header Section */}
//                 <div className="text-center mb-6 sm:mb-8 md:mb-10">
//                     <SectionHeader
//                         heading={
//                             <>
//                                 <span className="font-bold">Unlock exclusive</span>
//                                 <br />
//                                 <span className="font-normal italic text-lg md:text-2xl">savings of up to 15%</span>
//                             </>
//                         }
//                         subHeading="Our subscription plans do not include premium brands, valuations, or jewelry. Choose the plan that fits your authentication needs."
//                         headingColor="primary"
//                         subHeadingColor="primary"
//                         className="items-center gap-1"
//                         headingClassName="text-center"
//                         subHeadingClassName="text-center max-w-3xl mx-auto"
//                     />
//                 </div>

//                 {/* Back button when viewing upgrade plans */}
//                 {subscriptionDetails && showUpgradePlans && (
//                   <button
//                     type="button"
//                     onClick={() => setShowUpgradePlans(false)}
//                     className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
//                   >
//                     <FiArrowLeft className="w-4 h-4" />
//                     <span>Back to my subscription</span>
//                   </button>
//                 )}

//                 {/* Active subscription card (when user already subscribed and not in upgrade mode) */}
//                 {subscriptionDetails && !showUpgradePlans && activePlan && (
//                   <div className="flex justify-center mb-10">
//                     <div className="bg-white rounded-none shadow-lg border border-gray-200/80 max-w-sm w-full overflow-hidden flex flex-col">
//                       {/* Header with ACTIVE badge */}
//                       <div
//                         className="px-4 py-3.5 sm:px-6 sm:py-4 relative rounded-t-[22px]"
//                         style={{
//                           backgroundColor: activePlan.headerBgColor || '#8B4513',
//                           color: activePlan.headerTextColor || 'white',
//                         }}
//                       >
//                         <div className="absolute top-3 right-3">
//                           <span className="px-2.5 py-1 rounded-full bg-primary text-secondary text-[10px] sm:text-xs font-semibold tracking-wide shadow-sm">
//                             ACTIVE
//                           </span>
//                         </div>
//                         <h3 className="text-lg sm:text-xl font-bold text-center" style={{ color: activePlan.headerTextColor === 'white' ? '#fff' : '#1f2937' }}>
//                           {activePlan.title}
//                         </h3>
//                       </div>

//                       <div className="px-6 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7 flex flex-col">
//                         {/* Features */}
//                         {Array.isArray(activePlan.features) && activePlan.features.length > 0 && (
//                           <ul className="space-y-2.5 mb-4">
//                             {activePlan.features.map((feature, index) => (
//                               <li key={index} className="flex items-start gap-2.5 text-sm text-gray-800">
//                                 <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
//                                   <FiCheck className="h-3 w-3 text-primary" />
//                                 </span>
//                                 <span>{feature}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         )}

//                         {/* Next payment & remaining requests */}
//                         <div className="space-y-1.5 text-sm text-gray-700 mb-4">
//                           <p>
//                             <span className="font-medium text-gray-600">Next Payment:</span>{' '}
//                             <span className="font-semibold text-gray-900">
//                               {formatDate(
//                                 subscriptionDetails?.ending_date ??
//                                   subscriptionData?.subscription?.ending_date,
//                               )}
//                             </span>
//                           </p>
//                           <p>
//                             <span className="font-medium text-gray-600">Remaining Requests:</span>{' '}
//                             <span className="font-semibold text-gray-900">
//                               {subscriptionDetails?.remaining_certificates ??
//                                 subscriptionData?.subscription
//                                   ?.remaining_certificates ??
//                                 0}
//                             </span>
//                           </p>
//                         </div>

//                         {/* Member since ribbon - touches left edge, compact */}
//                         <div className="mt-1 -ml-6 sm:-ml-7 w-[calc(100%+1.5rem)] sm:w-[calc(100%+1.75rem)] bg-primary text-secondary py-1.5 pl-6 sm:pl-7 pr-3 rounded-r-xl text-xs sm:text-sm font-medium">
//                           Member since{' '}
//                           {formatMonthYear(
//                             subscriptionDetails?.starting_date ??
//                               subscriptionData?.subscription?.starting_date,
//                           )}
//                         </div>

//                         {/* Divider above actions */}
//                         <div className="mt-5 pt-4 border-t border-gray-100" />

//                         {/* Actions - match site buttons (SubscriptionCard, Cart, HeroCard) */}
//                         <div className="flex gap-3 mt-4">
//                           <button
//                             type="button"
//                             onClick={() => setShowCancelModal(true)}
//                             className="flex-1 py-2.5 sm:py-3 rounded-[12px] border-2 border-red-600 text-red-700 bg-white font-semibold text-sm sm:text-base hover:bg-red-50 transition-colors shadow-sm active:scale-[0.98]"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setShowUpgradePlans(true)}
//                             className="flex-1 bg-primary text-secondary py-2.5 sm:py-3 rounded-[12px] font-semibold text-sm sm:text-base hover:bg-primary-hover transition-colors shadow-md active:scale-[0.98]"
//                           >
//                             Upgrade
//                           </button>
//                         </div>

//                         {/* Additional note */}
//                         {activePlan.additionalNote && (
//                           <p className="mt-4 text-center text-gray-500 text-xs sm:text-sm" style={{ color: '#4A4A4A' }}>
//                             {activePlan.additionalNote}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Pricing Cards Grid - Bronze, Silver, Gold (or API plans)
//                     Only show after we've checked for an existing subscription so
//                     subscribed users don't briefly see these cards on reload. */}
//                 {hasLoadedSubscription && (
//                   (!subscriptionDetails ||
//                     showUpgradePlans ||
//                     (subscriptionDetails && hasLoadedPlans && !activePlan)) && (
//                     <div
//                       ref={plansSectionRef}
//                       className="flex justify-center mb-8 sm:mb-12 md:mb-16 min-h-[200px]"
//                     >
//                       {!hasLoadedPlans || !plansInView ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl lg:max-w-6xl w-full">
//                           {[0, 1, 2].map((i) => (
//                             <div
//                               key={i}
//                               className="min-h-[380px] rounded-[22px] border border-gray-200 bg-white/60 animate-pulse"
//                               aria-hidden
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <Suspense
//                           fallback={
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl lg:max-w-6xl w-full">
//                               {[0, 1, 2].map((i) => (
//                                 <div
//                                   key={i}
//                                   className="min-h-[380px] rounded-[22px] border border-gray-200 bg-white/60 animate-pulse"
//                                   aria-hidden
//                                 />
//                               ))}
//                             </div>
//                           }
//                         >
//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl lg:max-w-6xl">
//                             {subscriptionPlans.map((plan, index) => (
//                               <SubscriptionCard
//                                 key={plan.plan_id ?? plan.bundleId ?? index}
//                                 title={plan.title}
//                                 price={plan.price}
//                                 features={plan.features ?? []}
//                                 additionalNote={plan.additionalNote}
//                                 headerBgColor={plan.headerBgColor}
//                                 headerTextColor={plan.headerTextColor}
//                                 onButtonClick={() => openSubscribeModal(plan)}
//                                 buttonText={currentSubscription?.subscription ? 'Upgrade to this plan' : 'Get started'}
//                               />
//                             ))}
//                           </div>
//                         </Suspense>
//                       )}
//                     </div>
//                   )
//                 )}

//                 {/* Alert Card */}
//                 <div className="w-full px-6 sm:px-8 md:px-10 lg:px-12">
//                     <AlertCard
//                         icon={FiInfo}
//                         title="Important Details"
//                         details={importantDetails}
//                         iconColor="black"
//                         cardRadius="22px"
//                     />
//                 </div>

//                 {/* Subscribe confirmation modal (ad-old flow: Important Information + checkbox + Continue) */}
//                 {showSubscribeModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" aria-modal="true" role="dialog" aria-labelledby="subscribe-modal-title">
//                         <div className="bg-white rounded-[22px] shadow-xl p-6 max-w-lg w-full mx-4">
//                             <h3 id="subscribe-modal-title" className="text-lg font-bold text-center mb-4 text-primary">Important Information</h3>
//                             <p className="text-sm text-gray-700 mb-4 text-left">
//                                 Our subscription plans do not include premium brands (Chanel, Hermes, Tiffany & Co), valuations, or jewelry. Any leftover credits do not roll over. Please choose the lower tier if you are in between two tiers, as you may add additional requests at the discounted price.
//                             </p>
//                             <label className="flex items-start gap-2 mb-6 cursor-pointer text-left">
//                                 <input
//                                     type="checkbox"
//                                     checked={isCheckboxChecked}
//                                     onChange={(e) => setIsCheckboxChecked(e.target.checked)}
//                                     className="mt-1 rounded border-gray-300"
//                                 />
//                                 <span className="text-sm text-gray-700">
//                                     I acknowledge the{' '}
//                                     <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
//                                     {' '}and{' '}
//                                     <Link to="/terms" className="text-primary underline hover:no-underline">Terms of Service</Link>
//                                     {' '}of the subscription plans.
//                                 </span>
//                             </label>
//                             <div className="flex justify-center gap-3">
//                                 <button
//                                     type="button"
//                                     onClick={closeSubscribeModal}
//                                     className="px-5 py-2.5 rounded-[12px] border border-gray-300 hover:bg-gray-50 font-semibold text-gray-700"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleContinueSubscribe}
//                                     disabled={!isCheckboxChecked || isSubmittingModal}
//                                     className="px-5 py-2.5 rounded-[12px] bg-primary text-secondary font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
//                                 >
//                                     {isSubmittingModal ? 'Loading…' : 'Continue'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Cancel subscription modal */}
//                 {showCancelModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" aria-modal="true">
//                         <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
//                             <p className="font-semibold text-lg mb-2 text-center">Cancel subscription?</p>
//                             <p className="text-sm text-gray-600 mb-4 text-center">Are you sure you want to cancel your subscription?</p>
//                             <div className="flex gap-3 justify-center">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowCancelModal(false)}
//                                     className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
//                                 >
//                                     No
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleCancelSubscription}
//                                     className="px-4 py-2 rounded-lg bg-primary text-secondary hover:opacity-90"
//                                 >
//                                     Yes
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Toast */}
//                 {showToast && (
//                     <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg bg-primary text-secondary">
//                         <p className="font-medium">{toastMessage}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Subscription;



import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllPlans,
  fetchSubscription,
  createSubscription,
  cancelSubscription,
  freeProcessPaypalSubscription,
} from '../../store/slices/subscriptionSlice';
import { SectionHeader } from '../../components';
import AlertCard from '../../components/client/AlertCard/AlertCard';
import { FiInfo, FiArrowLeft, FiCheck } from 'react-icons/fi';

const SubscriptionCard = lazy(() =>
  import('../../components/client/SubscriptionCard/SubscriptionCard'),
);

const Subscription = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: authUser, token } = useAppSelector((state) => state.auth);
  const {
    plansFromApi,
    currentSubscription,
    createStatus,
    error: subscriptionError,
  } = useAppSelector((state) => state.subscription);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showUpgradePlans, setShowUpgradePlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [hasLoadedSubscription, setHasLoadedSubscription] = useState(false);
  const plansSectionRef = useRef(null);
  const [plansInView, setPlansInView] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPlans());
    if (token) {
      dispatch(fetchSubscription())
        .finally(() => {
          setHasLoadedSubscription(true);
        });
    } else {
      setHasLoadedSubscription(true);
    }
  }, [dispatch, token]);

  useEffect(() => {
    const el = plansSectionRef.current;
    if (!el || plansInView) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlansInView(true);
        }
      },
      { root: null, rootMargin: '120px 0px', threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [plansInView, hasLoadedSubscription, currentSubscription, showUpgradePlans]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const formattedDate = new Date(year, (month || 1) - 1, day || 1);
    return formattedDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-').map(Number);
    const formattedDate = new Date(year, (month || 1) - 1, 1);
    return formattedDate.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  };

  const isFreePlan = (p) => {
    const price = p?.price;
    if (price === 0 || price === '0' || price === '$0') return true;
    if (typeof price === 'string' && (price === '' || price.toLowerCase() === 'free')) return true;
    return !!p?.is_free;
  };

  const showToastMsg = (msg, duration = 3000) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

  const openSubscribeModal = (plan) => {
    const planId = plan?.plan_id ?? plan?.bundleId;
    if (planId == null) {
      showToastMsg('Invalid plan');
      return;
    }
    setSelectedPlan(plan);
    setIsCheckboxChecked(false);
    setShowSubscribeModal(true);
  };

  const closeSubscribeModal = () => {
    setShowSubscribeModal(false);
    setSelectedPlan(null);
    setIsCheckboxChecked(false);
  };

  const handleContinueSubscribe = async () => {
    if (!selectedPlan || !isCheckboxChecked) return;
    if (!authUser?.id || !token) {
      showToastMsg('Please sign in to subscribe');
      closeSubscribeModal();
      navigate('/signin');
      return;
    }
    const planId = selectedPlan.plan_id ?? selectedPlan.bundleId;
    if (planId == null) {
      showToastMsg('Invalid plan');
      return;
    }
    setIsSubmittingModal(true);
    if (isFreePlan(selectedPlan)) {
      try {
        const result = await dispatch(freeProcessPaypalSubscription({ plan_id: planId })).unwrap();
        const url = result?.data?.data?.url ?? result?.data?.url ?? result?.url ?? result?.data?.redirect_url ?? result?.redirect_url;
        if (url && typeof url === 'string') {
          if (result?.msg) showToastMsg(result.msg, 2000);
          window.location.href = url;
          return;
        }
        showToastMsg(result?.msg || result?.message || 'Free subscription initiated');
        dispatch(fetchSubscription());
      } catch (err) {
        const data = err?.data;
        const url = data?.data?.url ?? data?.url ?? data?.data?.redirect_url;
        if (url && typeof url === 'string') {
          if (data?.msg) showToastMsg(data.msg, 2000);
          window.location.href = url;
          return;
        }
        const msg = err?.message || data?.msg || 'Failed to create subscription';
        showToastMsg(msg === 'No Record Found!' ? 'This plan may not be available. Please try again or contact support.' : msg);
      }
      setIsSubmittingModal(false);
      closeSubscribeModal();
      return;
    }
    try {
      const result = await dispatch(createSubscription(planId)).unwrap();
      const url = result?.data?.data?.url ?? result?.data?.url ?? result?.url ?? result?.data?.redirect_url;
      if (url && typeof url === 'string') {
        if (result?.msg) showToastMsg(result.msg, 2000);
        window.location.href = url;
        return;
      }
      if (result?.status === false || result?.status_code === 401) {
        showToastMsg(result?.msg === 'No Record Found!' ? 'This plan may not be available. Please try again or contact support.' : (result?.msg || 'Subscription request failed'));
      } else {
        showToastMsg(result?.msg || 'Subscription initiated');
      }
    } catch (err) {
      const data = err?.data;
      const url = data?.data?.url ?? data?.url ?? data?.data?.redirect_url;
      if (url && typeof url === 'string') {
        if (data?.msg) showToastMsg(data.msg, 2000);
        window.location.href = url;
        return;
      }
      const msg = err?.message || data?.msg || 'Failed to create subscription';
      showToastMsg(msg === 'No Record Found!' ? 'This plan may not be available. Please try again or contact support.' : msg);
    }
    setIsSubmittingModal(false);
    closeSubscribeModal();
  };

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelSubscription()).unwrap();
      setToastMessage('Subscription cancelled');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowCancelModal(false);
      dispatch(fetchSubscription());
    } catch (err) {
      setToastMessage(err?.message || err || 'Failed to cancel');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const fallbackPlans = [
    { title: 'Bronze', plan_id: 1, bundleId: 1, price: '$190', features: ['20 requests/month', '5% off Authentications'], additionalNote: 'Additional requests can be added at $9.5/request', headerBgColor: '#CD7F32', headerTextColor: 'white' },
    { title: 'Silver', plan_id: 2, bundleId: 2, price: '$450', features: ['50 requests/month', '10% off Authentications'], additionalNote: 'Additional requests can be added at $9/request', headerBgColor: '#C0C0C0', headerTextColor: '#333333' },
    { title: 'Gold', plan_id: 3, bundleId: 3, price: '$850', features: ['100 requests/month', '15% off Authentications'], additionalNote: 'Additional requests can be added at $8.5/request', headerBgColor: '#FFD700', headerTextColor: '#333333' },
    // { title: 'Platinum', plan_id: 4, bundleId: 4, price: '$850', features: ['300 requests/month', '15% off Authentications', 'Account Manager'], additionalNote: 'Additional requests can be added at $8.5/request', headerBgColor: '#E5E4E2', headerTextColor: '#333333' },
  ];

  const apiPlans =
    Array.isArray(plansFromApi) && plansFromApi.length > 0
      ? plansFromApi
          .filter((p) => p.show !== false)
          .map((p) => ({
            plan_id: p.plan_id ?? p.id,
            bundleId: p.plan_id ?? p.id,
            title: p.name ?? p.title,
            price: typeof p.price === 'number' ? `$${p.price}` : (p.price || ''),
            features: Array.isArray(p.additional_features)
              ? p.additional_features.map((f) => f?.title ?? f).filter(Boolean)
              : [],
            additionalNote: p.description ?? '',
            headerBgColor: p.color_code || '#8B4513',
            headerTextColor: p.headerTextColor || 'white',
          }))
      : [];
  // Prefer API-driven plans whenever available; fall back to static plans only
  // when the backend returns none. The old site uses whatever the API returns,
  // so using fallback IDs here can cause "No Record Found" from create-subscription.
  const displayPlans = apiPlans.length > 0 ? apiPlans : fallbackPlans;

  const subscriptionPlans = displayPlans;

  const normalizeId = (value) => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isNaN(num) ? value : num;
  };

  // Align with old site: sometimes the API returns { subscription, package },
  // sometimes just the subscription object. Normalize to these two helpers.
  const subscriptionData = currentSubscription ?? null;
  const subscriptionDetails =
    subscriptionData?.subscription ?? subscriptionData ?? null;

  const activePlanIdRaw =
    subscriptionData?.subscription?.plan_id ??
    subscriptionData?.package?.plan_id ??
    subscriptionData?.package?.id ??
    subscriptionData?.bundleId ??
    subscriptionDetails?.plan_id ??
    null;
  const activePlanId = normalizeId(activePlanIdRaw);

  const activePlan =
    activePlanId != null
      ? subscriptionPlans.find((p) => {
          const planIdNorm = normalizeId(p.plan_id);
          const bundleIdNorm = normalizeId(p.bundleId);
          return planIdNorm === activePlanId || bundleIdNorm === activePlanId;
        })
      : null;

    const importantDetails = [
        "Any leftover credits do not roll over. Please choose the lower tier if you are between two tiers.",
        "You will be able to purchase additional requests at a discounted price if you run out of credits.",
        "If you plan to upgrade your subscription, ensure all credits in your old subscription are used. Credits do not transfer."
    ];

    return (
        <div className="w-full min-h-screen bg-[#F5F5F0] py-8 sm:py-12 md:py-16">
            <div className="w-full max-w-full mx-auto px-0">
                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
                    <SectionHeader
                        heading={
                            <>
                                <span className="font-bold">Unlock exclusive</span>
                                <br />
                                <span className="font-normal italic text-lg md:text-2xl">savings of up to 15%</span>
                            </>
                        }
                        subHeading="Our subscription plans do not include premium brands, valuations, or jewelry. Choose the plan that fits your authentication needs."
                        headingColor="primary"
                        subHeadingColor="primary"
                        className="items-center gap-1"
                        headingClassName="text-center"
                        subHeadingClassName="text-center max-w-3xl mx-auto"
                    />
                </div>

                {/* Back button when viewing upgrade plans */}
                {subscriptionDetails && showUpgradePlans && (
                  <button
                    type="button"
                    onClick={() => setShowUpgradePlans(false)}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to my subscription</span>
                  </button>
                )}

                {/* Active subscription card (when user already subscribed and not in upgrade mode) */}
                {subscriptionDetails && !showUpgradePlans && activePlan && (
                  <div className="flex justify-center mb-10">
                    <div className="bg-white rounded-none shadow-lg border border-gray-200/80 max-w-sm w-full overflow-hidden flex flex-col">
                      {/* Header with ACTIVE badge */}
                      <div
                        className="px-4 py-3.5 sm:px-6 sm:py-4 relative rounded-t-[22px]"
                        style={{
                          backgroundColor: activePlan.headerBgColor || '#8B4513',
                          color: activePlan.headerTextColor || 'white',
                        }}
                      >
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full bg-primary text-secondary text-[10px] sm:text-xs font-semibold tracking-wide shadow-sm">
                            ACTIVE
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-center" style={{ color: activePlan.headerTextColor === 'white' ? '#fff' : '#1f2937' }}>
                          {activePlan.title}
                        </h3>
                      </div>

                      <div className="px-6 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7 flex flex-col">
                        {/* Features */}
                        {Array.isArray(activePlan.features) && activePlan.features.length > 0 && (
                          <ul className="space-y-2.5 mb-4">
                            {activePlan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2.5 text-sm text-gray-800">
                                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <FiCheck className="h-3 w-3 text-primary" />
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Next payment & remaining requests */}
                        <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                          <p>
                            <span className="font-medium text-gray-600">Next Payment:</span>{' '}
                            <span className="font-semibold text-gray-900">
                              {formatDate(
                                subscriptionDetails?.ending_date ??
                                  subscriptionData?.subscription?.ending_date,
                              )}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-600">Remaining Requests:</span>{' '}
                            <span className="font-semibold text-gray-900">
                              {subscriptionDetails?.remaining_certificates ??
                                subscriptionData?.subscription
                                  ?.remaining_certificates ??
                                0}
                            </span>
                          </p>
                        </div>

                        {/* Member since ribbon - touches left edge, compact */}
                        <div className="mt-1 -ml-6 sm:-ml-7 w-[calc(100%+1.5rem)] sm:w-[calc(100%+1.75rem)] bg-primary text-secondary py-1.5 pl-6 sm:pl-7 pr-3 rounded-r-xl text-xs sm:text-sm font-medium">
                          Member since{' '}
                          {formatMonthYear(
                            subscriptionDetails?.starting_date ??
                              subscriptionData?.subscription?.starting_date,
                          )}
                        </div>

                        {/* Divider above actions */}
                        <div className="mt-5 pt-4 border-t border-gray-100" />

                        {/* Actions - match site buttons (SubscriptionCard, Cart, HeroCard) */}
                        <div className="flex gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => setShowCancelModal(true)}
                            className="flex-1 py-2.5 sm:py-3 rounded-[12px] border-2 border-red-600 text-red-700 bg-white font-semibold text-sm sm:text-base hover:bg-red-50 transition-colors shadow-sm active:scale-[0.98]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUpgradePlans(true)}
                            className="flex-1 bg-primary text-secondary py-2.5 sm:py-3 rounded-[12px] font-semibold text-sm sm:text-base hover:bg-primary-hover transition-colors shadow-md active:scale-[0.98]"
                          >
                            Upgrade
                          </button>
                        </div>

                        {/* Additional note */}
                        {activePlan.additionalNote && (
                          <p className="mt-4 text-center text-gray-500 text-xs sm:text-sm" style={{ color: '#4A4A4A' }}>
                            {activePlan.additionalNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Cards Grid - Bronze, Silver, Gold (or API plans)
                    Only show after we've checked for an existing subscription so
                    subscribed users don't briefly see these cards on reload. */}
                {hasLoadedSubscription && (
                  (!subscriptionDetails ||
                    showUpgradePlans ||
                    (subscriptionDetails && !activePlan)) && (
                    <div
                      ref={plansSectionRef}
                      className="flex justify-center mb-8 sm:mb-12 md:mb-16 min-h-[200px]"
                    >
                      {!plansInView ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl lg:max-w-6xl w-full">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="min-h-[380px] rounded-[22px] border border-gray-200 bg-white/60 animate-pulse"
                              aria-hidden
                            />
                          ))}
                        </div>
                      ) : (
                        <Suspense
                          fallback={
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl lg:max-w-6xl w-full">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className="min-h-[380px] rounded-[22px] border border-gray-200 bg-white/60 animate-pulse"
                                  aria-hidden
                                />
                              ))}
                            </div>
                          }
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl lg:max-w-6xl">
                            {subscriptionPlans.map((plan, index) => (
                              <SubscriptionCard
                                key={plan.plan_id ?? plan.bundleId ?? index}
                                title={plan.title}
                                price={plan.price}
                                features={plan.features ?? []}
                                additionalNote={plan.additionalNote}
                                headerBgColor={plan.headerBgColor}
                                headerTextColor={plan.headerTextColor}
                                onButtonClick={() => openSubscribeModal(plan)}
                                buttonText={currentSubscription?.subscription ? 'Upgrade to this plan' : 'Get started'}
                              />
                            ))}
                          </div>
                        </Suspense>
                      )}
                    </div>
                  )
                )}

                {/* Alert Card */}
                <div className="w-full px-6 sm:px-8 md:px-10 lg:px-12">
                    <AlertCard
                        icon={FiInfo}
                        title="Important Details"
                        details={importantDetails}
                        iconColor="black"
                        cardRadius="22px"
                    />
                </div>

                {/* Subscribe confirmation modal (ad-old flow: Important Information + checkbox + Continue) */}
                {showSubscribeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" aria-modal="true" role="dialog" aria-labelledby="subscribe-modal-title">
                        <div className="bg-white rounded-[22px] shadow-xl p-6 max-w-lg w-full mx-4">
                            <h3 id="subscribe-modal-title" className="text-lg font-bold text-center mb-4 text-primary">Important Information</h3>
                            <p className="text-sm text-gray-700 mb-4 text-left">
                                Our subscription plans do not include premium brands (Chanel, Hermes, Tiffany & Co), valuations, or jewelry. Any leftover credits do not roll over. Please choose the lower tier if you are in between two tiers, as you may add additional requests at the discounted price.
                            </p>
                            <label className="flex items-start gap-2 mb-6 cursor-pointer text-left">
                                <input
                                    type="checkbox"
                                    checked={isCheckboxChecked}
                                    onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                                    className="mt-1 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">
                                    I acknowledge the{' '}
                                    <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
                                    {' '}and{' '}
                                    <Link to="/terms" className="text-primary underline hover:no-underline">Terms of Service</Link>
                                    {' '}of the subscription plans.
                                </span>
                            </label>
                            <div className="flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={closeSubscribeModal}
                                    className="px-5 py-2.5 rounded-[12px] border border-gray-300 hover:bg-gray-50 font-semibold text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleContinueSubscribe}
                                    disabled={!isCheckboxChecked || isSubmittingModal}
                                    className="px-5 py-2.5 rounded-[12px] bg-primary text-secondary font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                                >
                                    {isSubmittingModal ? 'Loading???' : 'Continue'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel subscription modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" aria-modal="true">
                        <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
                            <p className="font-semibold text-lg mb-2">Cancel subscription?</p>
                            <p className="text-sm text-gray-600 mb-4">Are you sure you want to cancel your subscription?</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                >
                                    No
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelSubscription}
                                    className="px-4 py-2 rounded-lg bg-primary text-secondary hover:opacity-90"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast */}
                {showToast && (
                    <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg bg-primary text-secondary">
                        <p className="font-medium">{toastMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscription;
