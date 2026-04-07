import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import HomeCover from "../components/home-components/homeCover";
import TheVault from "@/components/home-components/theVault";
import AuthentiCards from "@/components/home-components/cards";
import SellersCollective from "@/components/home-components/sellers";
import RecentSeller from "@/components/home-components/recentSeller";

import { Box } from "@mui/material";
import TermsOfService from "@/components/terms-of-service";
import Layout from "@/components/layout";

export default function TermsAndService() {
  return (
    <>
      {/* <Header /> */}
      <Layout>
        <Box
          sx={{
            pl: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
            pr: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
          }}
        >
          <TermsOfService />
        </Box>
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
