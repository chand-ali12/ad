import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <Html lang="en">
      <Head>
        {/* Google Site Verification */}
        {isProduction && (
          <meta name="google-site-verification" content={googleSiteVerification} />
        )}
        
        {/* Google tag (gtag.js) */}
        {isProduction && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}

   
        <script
          async
          src="https://kaido.sandboxdevenv.com/plugin/ai-stylist-chat-widget.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
