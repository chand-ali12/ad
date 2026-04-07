import { commonStyles } from "@/commonStyles";
export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "80px",
    height: "auto",
    objectFit: "cover",
    borderRadius: "8px",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0px 10px",
    flex: "1",
    marginLeft: {
      md: "4px",
      lg: "25px",
    },
  },
  brand: {
    ...commonStyles.commonCartTextStyles,
    marginBottom: "2px",
  },

  model: {
    ...commonStyles.commonCartTextStyles,
    marginBottom: "2px",
  },
  price: {
    ...commonStyles.commonCartTextStyles,

    marginBottom: "2px",
  },
  valuation: {
    ...commonStyles.commonCartTextStyles,
  },
  deleteIcon: {
    color: "#555",
    fontSize: "30px", // Adjusted icon size
  },
};
