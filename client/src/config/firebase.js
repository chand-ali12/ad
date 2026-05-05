import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { FIREBASE_CONFIG } from "./env";

const app = initializeApp(FIREBASE_CONFIG);

export const db = getFirestore(app);

/** Google Analytics (web only); omitted when `VITE_FIREBASE_MEASUREMENT_ID` is unset. */
export const analytics =
  typeof window !== "undefined" && FIREBASE_CONFIG.measurementId
    ? getAnalytics(app)
    : null;

export default app;
