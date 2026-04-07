import { createSlice } from "@reduxjs/toolkit";

export const bulkFormDataSlice = createSlice({
  name: "bulkFormData",
  initialState: {
    value: [], // Correct initial state
  },
  reducers: {
    persistBulkData: (state, action) => {
      // Ensure payload is valid and defined
      if (action.payload) {
        state.value = action.payload;
        localStorage.setItem(
          "bulkFormDataLocal",
          JSON.stringify(action.payload)
        );
      } else {
        console.error("Persist data action payload is undefined");
      }
    },
    deleteBulkFormData: (state) => {
      state.value = [];
      // localStorage.removeItem("bulkFormDataLocal");
    },
  },
});

// Action creators
export const { persistBulkData, deleteBulkFormData } =
  bulkFormDataSlice.actions;

// Selector to access the state in your components
export const selectBulkFormData = (state) => state.bulkFormData?.value || [];

export default bulkFormDataSlice.reducer;
