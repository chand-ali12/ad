import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { store, persistor } from "../store/store";
import NextNProgress from "nextjs-progressbar";

import { Inter, Montserrat } from "next/font/google";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ScrollUp from "../../utils/scrollUp";
import { DefaultSeo } from "next-seo";
import config from "../../utils/next-seo.config";
export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",

  weight: ["200", "300", "400", "500", "600", "700"],
});
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",

  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    document.body.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [router]);

  useEffect(() => {
    document.body.scrollTo(0, 0);
  });

  // Google Analytics - Track page views on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (
        typeof window !== "undefined" &&
        process.env.NODE_ENV === "production" &&
        window.gtag
      ) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        });
      }
    };

    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router]);

  return (
    <>
      <DefaultSeo {...config} />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <NextNProgress
              color="#29D"
              startPosition={0.3}
              height={3}
              showOnShallow={true}
            />
            <div className={`${montserrat.variable} `}>
              <Component {...pageProps} />
            </div>
            <ToastContainer />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
