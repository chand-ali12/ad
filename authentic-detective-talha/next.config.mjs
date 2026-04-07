/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  images: {
    domains: ["auth-detect.s3.amazonaws.com"],
  },
};

export default nextConfig;
