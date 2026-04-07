import axios from "axios";

// Configuration constants
const appkey = "base64:jhpGVQy5BV76gfyLGXee9kGj2o2fMnSq2XhviHX+gMI=";
const defaultContentType = "multipart/form-data";
import { deleteCookie } from "cookies-next";
import { notifySuccess } from "../toast";
import { clearPersistedData } from "@/store/store";

// Create Axios instance
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // timeout: 30000,
  headers: {
    "Content-Type": defaultContentType,
    appkey: appkey,
  },
});

// Function to set headers with token and CSRF token
// export const setHeadersWithToken = (token, csrfToken) => {
//   if (token) {
//     instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     instance.defaults.headers.common["access_token"] = token;
//     instance.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
//     instance.defaults.headers.common["sessiontoken"] = token;
//   }
// };

// Function to set only CSRF token
// export const setHeaders = (csrfToken) => {
//   instance.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
// };

// Set headers from local storage token on client side only
// if (typeof window !== "undefined") {
//   const token = localStorage.getItem("token");
//   const csrfToken = "your_csrf_token_here";
//   if (token) {
//     setHeadersWithToken(token, csrfToken);
//   }
// }

export const setHeadersToken = (token) => {
  if (token) {
    instance.defaults.headers.common["sessiontoken"] = token;
  }
};

// export const setHeadersAccessToken = (token) => {
//   if (token) {
//     instance.defaults.headers.common["sessiontoken"] = token;
//   }
// };

if (typeof window !== "undefined") {
  const token = localStorage.getItem("persist:root");
  if (token) {
    const objValue = JSON.parse(token).currentUserData;

    if (JSON.parse(objValue).value.accessToken) {
      setHeadersToken(JSON.parse(objValue).value.accessToken);
    }
  }
}

instance.interceptors.response.use(
  (response) => {
    if (response?.data?.msg === "Session Does not exist") {
      deleteCookie("userInfoAuthenticateDetective");
      window.location.href = "/login";
      notifySuccess("Successfully logged out");
      clearPersistedData();
    } else {
      return response;
    }
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        deleteCookie("userInfoAuthenticateDetective");
        window.location.href = "/login";
        notifySuccess("Successfully logged out");
        clearPersistedData();
      } else if (error.response.status === 500) {
        console.error("Server error - Please try again later");
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
