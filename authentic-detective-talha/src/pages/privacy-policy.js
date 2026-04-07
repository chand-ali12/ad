import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import HomeCover from "../components/home-components/homeCover";
import TheVault from "@/components/home-components/theVault";
import AuthentiCards from "@/components/home-components/cards";
import SellersCollective from "@/components/home-components/sellers";
import RecentSeller from "@/components/home-components/recentSeller";

import { Box } from "@mui/material";
import TermsOfService from "@/components/terms-of-service";
import PrivacyPolicy from "@/components/privacy-policy";
import Layout from "@/components/layout";

export default function Privacy() {
  return (
    <>
      {/* <Header /> */}
      <Layout>
        <Box
          sx={{
            pl: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
            pr: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
          }}
        >
          <PrivacyPolicy />
        </Box>
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
