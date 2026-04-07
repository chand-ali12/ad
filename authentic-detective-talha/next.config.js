// next.config.js
module.exports = {
  images: {
    domains: ["auth-detect.s3.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  scrollRestoration: false,
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value:
  //             "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' chrome-extension://8b8d2959-9c67-463e-bc58-fcaf6352aa2e;",
  //         },
  //       ],
  //     },
  //   ];
  // },
};
