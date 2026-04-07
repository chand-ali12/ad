import { Box } from "@mui/material";
import TermsOfService from "@/components/terms-of-service";
import Layout from "@/components/layout";

export default function TermsAndService() {
  return (
    <>
      <Layout>
        <Box
          sx={{
            pl: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
            pr: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
          }}
        >
          <TermsOfService />
        </Box>
      </Layout>
    </>
  );
}
