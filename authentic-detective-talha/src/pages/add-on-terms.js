import Layout from "@/components/layout";
import AuthenticationTerms from "../components/authentication-terms";
import { useEffect, useState } from "react";
export default function AuthenticationTermsPage() {
  const [isAppPlatform, setIsAppPlatform] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsAppPlatform(params.get("platform") === "app");
    }
  }, []);

  return (
    <>
      {isAppPlatform ? (
        <AuthenticationTerms />
      ) : (
        <Layout>
          <AuthenticationTerms />
        </Layout>
      )}
    </>
  );
}
