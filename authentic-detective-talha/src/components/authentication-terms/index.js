import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { commonStyles } from "@/commonStyles";

const sectionHeaderStyle = (isDark) => ({
  fontSize: { xs: "20px", sm: "22px", md: "24px" },
  fontWeight: 700,
  color: isDark ? "#f1f1f1" : "#2c3e50",
  mb: 2,
  mt: 5,
});

const contentTextStyle = (isDark) => ({
  fontSize: { xs: "14px", sm: "15px", md: "16px" },
  lineHeight: 1.7,
  color: isDark ? "#ccc" : "#34495e",
  mb: 2,
});

const listItemStyle = (isDark) => ({
  ...contentTextStyle(isDark),
  pl: 2,
});

const highlightBoxStyle = (isDark) => ({
  bgcolor: isDark ? "#1e1e1e" : "#f9f9f9",
  border: "1px solid",
  borderColor: isDark ? "#333" : "#e1e1e1",
  borderRadius: "10px",
  p: { xs: 2, sm: 3 },
  my: 3,
});

const sections = [
  {
    title: "1. Coverage Terms",
    highlight: [
      { text: "• Basic Brands: $10 cost per item", bold: true },
      {
        text: "Maximum payout of $400 based on the item's purchase cost",
        indent: true,
      },
      {
        text: "• Premium Brands (Chanel and Hermes): $20 cost per item",
        bold: true,
        mt: 2,
      },
      {
        text: "Maximum payout of $1,000 based on the item's purchase cost",
        indent: true,
      },
    ],
  },
  {
    title: "2. Claim Review Process",
    items: [
      {
        heading: "Requirements:",
        list: [
          "To qualify for a claim review, the Policyholder must obtain contradicting certificates from two (2) reputable companies confirming an authentication error.",
        ],
      },
      {
        heading: "Admission of Mistake:",
        list: [
          "Upon receipt of these certificates, the Authentication Company acknowledges the error in authentication.",
        ],
      },
      {
        heading: "Timeframe for Claims:",
        list: [
          "• Claims must be filed within forty-five (45) calendar days of the original certificate being issued.",
          "• Claims must also be filed within forty-eight (48) hours of receiving the contradicting certificates.",
        ],
        indent: true,
      },
    ],
  },
  {
    title: "3. Basis of Payout and Valuation",
    items: [
      {
        heading: "Purpose and Scope:",
        list: [
          "This Section establishes the basis upon which all payout amounts are determined, including the documentation required to support a claim and the limitations applicable to such payouts. All valuations and determinations made under this Section shall be conducted at the sole discretion of the Authentication Company (Authentic Detective) in accordance with these Terms and Conditions.",
        ],
      },
      {
        heading: "Valuation Standard:",
        list: [
          "All payouts shall be calculated solely on the basis of the item's original purchase price as documented by the Policyholder, and not on the item's resale value, estimated market value, or any subsequent appreciation or depreciation.",
        ],
      },
      {
        heading: "Required Documentation:",
        list: [
          "To qualify for a payout, the Policyholder must provide a detailed, itemized receipt or equivalent proof of purchase clearly indicating:",
          "• Original purchase date; and",
          "• Date of sale (if applicable).",
        ],
        indentSecond: true,
      },
      {
        list: [
          "Even where proof of purchase is provided, Authentic Detective reserves the right, in its sole and reasonable discretion, to review the claimed purchase price and adjust the payout value downward if Authentic Detective determines that the documented price materially exceeds fair market value, was inflated, or is otherwise inconsistent with typical industry pricing. Such adjusted valuation shall be final and binding.",
        ],
      },
      {
        heading: "Absence of Proof of Purchase:",
        list: [
          "In the absence of satisfactory proof of purchase, Authentic Detective reserves the exclusive right to assign a value to the item at its sole discretion. Such valuation may be substantially lower than the prevailing market value and shall be deemed final and binding.",
          "Where adequate documentation or credible evidence of purchase cannot be provided, Authentic Detective further reserves the right to deny any payout in full. No appeal or reconsideration shall be available in such cases, and the Company shall bear no further liability to the Policyholder.",
        ],
      },
      {
        heading: "Limitation of Liability:",
        list: [
          "Notwithstanding any other provision contained herein, the total liability of Authentic Detective for any single claim—regardless of the nature, cause, or number of items involved—shall not exceed Four Hundred U.S. Dollars for basic brands (USD $400), and One Thousand Dollars for Chanel and Hermes (USD $1000) or the item's original purchase price, whichever is lower.",
          "This limitation applies irrespective of any alleged consequential, incidental, indirect, or special damages, including but not limited to loss of profit, goodwill, or resale value. The Policyholder acknowledges and agrees that this payout limit constitutes the maximum aggregate liability of Authentic Detective under this Policy for each claim.",
        ],
      },
    ],
  },
  {
    title: "4. Payout Review",
    highlight: [
      {
        heading: "Dispute Team Review:",
        text: "All payout determinations are subject to review by the Authentication Company's dispute resolution team.",
      },
      {
        heading: "Suspicious Activity Challenges:",
        text: "The dispute team may withhold, reduce, or deny payout if fraudulent or suspicious activity is suspected.",
      },
      {
        heading: "Right to Termination:",
        text: "The Authentication Company may terminate this policy if fraudulent or deceptive behavior is found. Fees are non-refundable.",
      },
    ],
  },
  {
    title: "5. Limitation of Liability",
    text: "The Authentication Company's liability is limited to $400 for basic brands and $1,000 for premium brands. The company is not liable for indirect, incidental, or punitive damages.",
  },
  {
    title: "6. Arbitration Agreement",
    text: "Any disputes must be resolved through binding arbitration under the AAA rules in [Insert Jurisdiction/State]. Class action suits are not permitted. Each party covers its legal costs unless law states otherwise.",
  },
  {
    title: "7. Governing Law",
    text: "This agreement is governed by the laws of the state where the company is headquartered.",
  },
  {
    title: "8. Entire Agreement",
    text: "This document supersedes all previous agreements and represents the full understanding between parties.",
  },
  {
    title: "9. Amendments",
    text: "Any changes must be made in writing and signed by both parties.",
  },
];

const AuthenticationTerms = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const { platform } = router.query;
  const isDark = platform === "app"; // dark mode only if ?platform=true



  return (
    <Box
      sx={{
        py: 6,
        bgcolor: isDark ? "#121212" : "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: isDark ? "#1c1c1c" : "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 3, sm: 5 },
          }}
        >
          {/* Page Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "24px", sm: "28px", md: "32px" },
                color: isDark ? "#fff" : "#2c3e50",
                ...commonStyles.modalHeading,
              }}
            >
              Authentication Company Insurance Policy
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: isDark ? "#aaa" : "#555",
                fontSize: { xs: "14px", sm: "16px" },
              }}
            >
              Complete Terms & Agreement
            </Typography>
          </Box>

          {/* Sections Render */}
          {sections.map((section, idx) => (
            <Box key={idx}>
              <Typography sx={sectionHeaderStyle(isDark)}>
                {section.title}
              </Typography>

              {section.text && (
                <Typography sx={contentTextStyle(isDark)}>
                  {section.text}
                </Typography>
              )}

              {section.items &&
                section.items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{ mt: i > 0 ? 2 : 0, pl: item.indent ? 2 : 0 }}
                  >
                    <Typography
                      sx={{ ...contentTextStyle(isDark), fontWeight: "600" }}
                    >
                      {item.heading}
                    </Typography>
                    {item.list.map((line, j) => (
                      <Typography
                        key={j}
                        sx={{
                          ...listItemStyle(isDark),
                          pl:
                            item.indentSecond && j > 0
                              ? 4
                              : listItemStyle(isDark).pl,
                        }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </Box>
                ))}

              {section.highlight && (
                <Box sx={highlightBoxStyle(isDark)}>
                  {section.highlight.map((hl, hidx) => (
                    <Box key={hidx} sx={{ mt: hl.mt || 0 }}>
                      {hl.heading && (
                        <Typography
                          sx={{
                            ...contentTextStyle(isDark),
                            fontWeight: "600",
                          }}
                        >
                          {hl.heading}
                        </Typography>
                      )}
                      <Typography
                        sx={{
                          ...(hl.bold ? { fontWeight: "600" } : {}),
                          ...listItemStyle(isDark),
                          pl: hl.indent ? 3 : listItemStyle(isDark).pl,
                        }}
                      >
                        {hl.text || hl}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default AuthenticationTerms;
