import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobileMenuOpen: false,
  isProfileMenuOpen: false,
  isBrandsMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    toggleProfileMenu(state) {
      state.isProfileMenuOpen = !state.isProfileMenuOpen;
    },
    toggleBrandsMenu(state) {
      state.isBrandsMenuOpen = !state.isBrandsMenuOpen;
    },
    setMobileMenuOpen(state, action) {
      state.isMobileMenuOpen = action.payload;
    },
    setProfileMenuOpen(state, action) {
      state.isProfileMenuOpen = action.payload;
    },
    setBrandsMenuOpen(state, action) {
      state.isBrandsMenuOpen = action.payload;
    },
    closeAllMenus(state) {
      state.isMobileMenuOpen = false;
      state.isProfileMenuOpen = false;
      state.isBrandsMenuOpen = false;
    },
  },
});

export const {
  toggleMobileMenu,
  toggleProfileMenu,
  toggleBrandsMenu,
  setMobileMenuOpen,
  setProfileMenuOpen,
  setBrandsMenuOpen,
  closeAllMenus,
} = uiSlice.actions;

export default uiSlice.reducer;
