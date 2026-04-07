import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Modal, Typography, Divider } from "@mui/material";
import { commonStyles } from "@/commonStyles";

const style = {
  position: "absolute",
  top: "7%",
  left: "50%",
  transform: "translateX(-50%)",
  width: {
    xs: "95%",
    sm: "90%",
    md: "85%",
    lg: "80%",
    xl: "70%",
  },
  maxWidth: "900px",
  maxHeight: "90vh",
  bgcolor: "#fff",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  borderRadius: "16px",
  fontFamily: "var(--font-montserrat)",
  overflow: "hidden",
};

const scrollableContentStyle = {
  maxHeight: "55vh",
  overflowY: "auto",
  px: { xs: 2, sm: 3, md: 4 },
  py: { xs: 2, sm: 3 },
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "4px",
    "&:hover": {
      background: "#a8a8a8",
    },
  },
};

const sectionHeaderStyle = {
  fontSize: { xs: "16px", sm: "18px", md: "20px" },
  fontWeight: "700",
  color: "#2c3e50",
  mb: 2,
  mt: { xs: 2, sm: 3 },
  "&:first-of-type": {
    mt: 0,
  },
};

const contentTextStyle = {
  fontSize: { xs: "13px", sm: "14px", md: "15px" },
  lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
  color: "#34495e",
  mb: 1.5,
};

const listItemStyle = {
  fontSize: { xs: "13px", sm: "14px", md: "15px" },
  lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
  color: "#34495e",
  mb: 1,
  pl: 2,
};

const highlightBoxStyle = {
  bgcolor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  p: { xs: 1.5, sm: 2 },
  mb: 2,
};

const AddOnModalPrivacyPolicy = ({
  open,
  handleCloseAddOnCheckBox,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef(null);

  // Reset scroll state when modal opens
  useEffect(() => {
    if (open) {
      setHasScrolledToBottom(false);
      // Reset scroll position to top when modal opens
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [open]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 20; // 20px threshold to account for rounding
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => handleCloseAddOnCheckBox(false)}
      aria-labelledby="insurance-policy-title"
      aria-describedby="insurance-policy-description"
    >
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 2.5 },
            textAlign: "center",
          }}
        >
          <Typography
            id="insurance-policy-title"
            sx={{
              fontSize: { xs: "20px", sm: "24px", md: "28px" },
              fontWeight: "bold",
              ...commonStyles.modalHeading,
            }}
          >
            Authentic Detective Insurance Policy
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              opacity: 0.9,
              mt: 0.5,
            }}
          >
            Complete Terms & Agreement
          </Typography>
        </Box>

        {/* Scrollable Content */}
        <Box ref={scrollContainerRef} sx={scrollableContentStyle} onScroll={handleScroll}>
          {/* Coverage Terms */}
          <Typography sx={sectionHeaderStyle}>1. Coverage Terms</Typography>
          <Box sx={highlightBoxStyle}>
            <Typography sx={{ ...listItemStyle, fontWeight: "600", mb: 1 }}>
              • Basic Brands: $10 cost per item
            </Typography>
            <Typography sx={{ ...listItemStyle, pl: 3, mb: 1 }}>
              {`Maximum payout of $400 based on the item's purchase cost`}
            </Typography>
            <Typography sx={{ ...listItemStyle, fontWeight: "600", mb: 1 }}>
              • Premium Brands (Chanel and Hermes): $20 cost per item
            </Typography>
            <Typography sx={{ ...listItemStyle, pl: 3 }}>
              {`Maximum payout of $1,000 based on the item's purchase cost`}
            </Typography>
          </Box>
          {/* Claim Review Process */}
          <Typography sx={sectionHeaderStyle}>
            2. Claim Review Process
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600" }}>
            Requirements:
          </Typography>
          <Typography sx={listItemStyle}>
            To qualify for a claim review, the Policyholder must obtain
            contradicting certificates from two (2) reputable companies
            confirming an authentication error.
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
            Admission of Mistake:
          </Typography>
          <Typography sx={listItemStyle}>
            Upon receipt of these certificates, the Authentication Company
            acknowledges the error in authentication.
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
            Timeframe for Claims:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography sx={listItemStyle}>
              • Claims must be filed within forty-five (45) calendar days of the
              original certificate being issued
            </Typography>
            <Typography sx={listItemStyle}>
              • Claims must also be filed within forty-eight (48) hours of
              receiving the contradicting certificates from the two reputable
              companies
            </Typography>
          </Box>
          {/* Basis of Payout and Valuation */}
          <Typography sx={sectionHeaderStyle}>
            3. Basis of Payout and Valuation
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600" }}>
            Purpose and Scope:
          </Typography>
          <Typography sx={contentTextStyle}>
            This Section establishes the basis upon which all payout amounts are determined, including the documentation required to support a claim and the limitations applicable to such payouts. All valuations and determinations made under this Section shall be conducted at the sole discretion of the Authentication Company (Authentic Detective) in accordance with these Terms and Conditions.
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
            Valuation Standard:
          </Typography>
          <Typography sx={contentTextStyle}>
            All payouts shall be calculated solely on the basis of the item's original purchase price as documented by the Policyholder, and not on the item's resale value, estimated market value, or any subsequent appreciation or depreciation.
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
            Required Documentation:
          </Typography>
          <Typography sx={contentTextStyle}>
            To qualify for a payout, the Policyholder must provide a detailed, itemized receipt or equivalent proof of purchase clearly indicating:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography sx={listItemStyle}>
              • Original purchase date; and
            </Typography>
            <Typography sx={listItemStyle}>
              • Date of sale (if applicable).
            </Typography>
          </Box>
          <Typography sx={contentTextStyle}>
            Even where proof of purchase is provided, Authentic Detective reserves the right, in its sole and reasonable discretion, to review the claimed purchase price and adjust the payout value downward if Authentic Detective determines that the documented price materially exceeds fair market value, was inflated, or is otherwise inconsistent with typical industry pricing. Such adjusted valuation shall be final and binding.
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
            Absence of Proof of Purchase:
          </Typography>
          <Typography sx={contentTextStyle}>
            In the absence of satisfactory proof of purchase, Authentic Detective reserves the exclusive right to assign a value to the item at its sole discretion. Such valuation may be substantially lower than the prevailing market value and shall be deemed final and binding.
          </Typography>
          <Typography sx={contentTextStyle}>
            Where adequate documentation or credible evidence of purchase cannot be provided, Authentic Detective further reserves the right to deny any payout in full. No appeal or reconsideration shall be available in such cases, and the Company shall bear no further liability to the Policyholder.
          </Typography>
          <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
            Limitation of Liability:
          </Typography>
          <Typography sx={contentTextStyle}>
            Notwithstanding any other provision contained herein, the total liability of Authentic Detective for any single claim—regardless of the nature, cause, or number of items involved—shall not exceed Four Hundred U.S. Dollars for basic brands (USD $400), and One Thousand Dollars for Chanel and Hermes (USD $1000) or the item's original purchase price, whichever is lower.
          </Typography>
          <Typography sx={contentTextStyle}>
            This limitation applies irrespective of any alleged consequential, incidental, indirect, or special damages, including but not limited to loss of profit, goodwill, or resale value. The Policyholder acknowledges and agrees that this payout limit constitutes the maximum aggregate liability of Authentic Detective under this Policy for each claim.
          </Typography>
          {/* Payout Review */}
          <Typography sx={sectionHeaderStyle}>4. Payout Review</Typography>
          <Box sx={highlightBoxStyle}>
            <Typography sx={{ ...contentTextStyle, fontWeight: "600" }}>
              Dispute Team Review:
            </Typography>
            <Typography sx={contentTextStyle}>
              {`All payout determinations are subject to review by the
              Authentication Company's dispute resolution team.`}
            </Typography>

            <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
              Suspicious Activity Challenges:
            </Typography>
            <Typography sx={contentTextStyle}>
              The dispute team may withhold, reduce, or deny payout if
              fraudulent or suspicious activity is suspected or identified.
            </Typography>

            <Typography sx={{ ...contentTextStyle, fontWeight: "600", mt: 2 }}>
              Right to Termination:
            </Typography>
            <Typography sx={contentTextStyle}>
              The Authentication Company may, at its sole discretion and without
              prior notice, suspend or permanently terminate this policy,
              including any active claims, if fraudulent, deceptive, or
              otherwise suspicious activity is determined or reasonably
              suspected. In such event, all premiums or fees already paid shall
              be deemed non-refundable.
            </Typography>
          </Box>
          {/* Limitation of Liability */}
          <Typography sx={sectionHeaderStyle}>
            5. Limitation of Liability
          </Typography>
          <Typography sx={contentTextStyle}>
            {`The Authentication Company's liability under this Agreement is
            strictly limited to the maximum payout amounts specified herein
            ($400 for basic brands and $1,000 for premium brands). Under no
            circumstances shall the Authentication Company be liable for
            indirect, incidental, consequential, or punitive damages, including
            but not limited to lost profits, diminution in value, or
            reputational harm.`}
          </Typography>
          {/* Arbitration Agreement */}
          <Typography sx={sectionHeaderStyle}>
            6. Arbitration Agreement
          </Typography>
          <Typography sx={contentTextStyle}>
            Any dispute, claim, or controversy arising out of or relating to
            this Agreement, including its formation, interpretation, breach, or
            termination, shall be resolved exclusively by binding arbitration
            administered by the American Arbitration Association (AAA) (or a
            similar neutral arbitration body if AAA is unavailable) in
            accordance with its Commercial Arbitration Rules.
          </Typography>
          <Typography sx={contentTextStyle}>
            The arbitration shall take place in [Insert Jurisdiction/State], and
            judgment on the award rendered by the arbitrator may be entered in
            any court having jurisdiction thereof.
          </Typography>
          <Typography sx={contentTextStyle}>
            The parties waive any right to bring or participate in a class,
            collective, or representative action against the other.
          </Typography>
          <Typography sx={contentTextStyle}>
            {`Each party shall bear its own costs and attorney's fees unless
            otherwise required by applicable law.`}
          </Typography>
          {/* Governing Law */}
          <Typography sx={sectionHeaderStyle}>7. Governing Law</Typography>
          <Typography sx={contentTextStyle}>
            This Agreement shall be governed by and construed in accordance with
            the laws of the state in which the Authentication Company is
            headquartered, without regard to its conflict of law provisions.
          </Typography>
          {/* Entire Agreement */}
          <Typography sx={sectionHeaderStyle}>8. Entire Agreement</Typography>
          <Typography sx={contentTextStyle}>
            This Agreement constitutes the entire understanding between the
            parties and supersedes all prior agreements, representations, or
            understandings relating to the subject matter herein.
          </Typography>
          {/* Amendments */}
          <Typography sx={sectionHeaderStyle}>9. Amendments</Typography>
          <Typography sx={contentTextStyle}>
            This Agreement may be amended only in writing and signed by both
            parties.
          </Typography>
        </Box>

        {/* Footer */}
        <Divider sx={{ borderColor: "#e9ecef" }} />

        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1.5, sm: 2 },
            textAlign: "center",
            bgcolor: "#f8f9fa",
          }}
        >
          {!hasScrolledToBottom && (
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "13px" },
                color: "#6c757d",
                mb: 1,
                fontStyle: "italic",
              }}
            >
              Please scroll to the bottom to continue
            </Typography>
          )}
          <Button
            onClick={() => handleCloseAddOnCheckBox(true)}
            variant="contained"
            disabled={!hasScrolledToBottom}
            sx={{
              //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              //   boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              //   textTransform: "none",
              //   "&:hover": {
              //     background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              //     boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              //     transform: "translateY(-1px)",
              //   },
              //   transition: "all 0.3s ease",
              ...commonStyles.buttonWithBlackColor,
              "&:hover": {
                ...commonStyles.commonHover,
              },
              "&:disabled": {
                backgroundColor: "#cccccc",
                color: "#666666",
                cursor: "not-allowed",
              },
            }}
          >
            Accept
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddOnModalPrivacyPolicy;
