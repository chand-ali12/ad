// dynamicBlurDataUrl.js
import axiosInstance from "../../utils/api/axios-client";
import axios from "axios";
export async function dynamicBlurDataUrl(url) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "Access-Control-Allow-Origin": "*", // Adjust the value to match the allowed origin(s) if needed
                "Access-Control-Allow-Methods": "GET, OPTIONS", // Include any methods your request uses
                "Access-Control-Allow-Headers": "Content-Type, Authorization", // Add other headers if needed
                "Content-Type": "application/json", // Adjust content type if necessary
            }
        });
        
        const base64str = Buffer.from(response.data).toString("base64");
        const blurSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
          <filter id='b' color-interpolation-filters='sRGB'>
            <feGaussianBlur stdDeviation='1' />
          </filter>
          <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' 
          href='data:image/jpeg;base64,${base64str}' />
        </svg>
      `;

        const toBase64 = (str) =>
            typeof window === 'undefined'
                ? Buffer.from(str).toString('base64')
                : window.btoa(str);

        return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
    } catch (error) {
        console.error("Error generating blurDataURL:", error);
        return null;
    }
}
