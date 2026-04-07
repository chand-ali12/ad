import { createSlice } from "@reduxjs/toolkit";

export const userInformation = createSlice({
  name: "auth",
  initialState: {
    value: {},
  },
  reducers: {
    persistUserData: (state, action) => {
      state.value = action.payload;
    },

    deleteUserData: (state) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { persistUserData, deleteUserData } = userInformation.actions;

// Selector to access the state in your components
export const currentUserInformation = (state) => state?.currentUserData?.value;

export default userInformation.reducer;
