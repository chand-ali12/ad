import { createSlice } from '@reduxjs/toolkit';

// Top-level: Completed | Pending. Under Completed: Available Items | Sold Items (see CertificatesofAuthenticity)
const initialTabs = [
  { label: 'Completed', count: 0, value: 'Completed' },
  { label: 'Pending', count: 0, value: 'Pending' },
];

const initialItems = [
  {
    id: 1,
    brand: 'Adidas',
    status: 'Testing',
    date: '1/3/2026',
    order: 'Mav3Lm',
    hasInconclusiveTag: true,
  },
  {
    id: 2,
    brand: 'Adidas',
    status: 'Testing',
    date: '1/3/2026',
    order: 'Mav3Lm',
    hasInconclusiveTag: false,
  },
  {
    id: 3,
    brand: 'Adidas',
    status: 'Testing',
    date: '1/3/2026',
    order: 'Mav3Lm',
    hasInconclusiveTag: false,
  },
];

const initialState = {
  activeTab: 'Completed',
  activeSubTab: 'available', // when activeTab === 'Completed': 'available' | 'sold'
  searchQuery: '',
  tabs: initialTabs,
  items: initialItems,
};

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setTabs(state, action) {
      state.tabs = action.payload;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    addCertificate(state, action) {
      const nextId =
        state.items.length > 0
          ? Math.max(...state.items.map((item) => item.id)) + 1
          : 1;
      state.items.push({ id: nextId, ...action.payload });
    },
    updateCertificate(state, action) {
      const { id, changes } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (item) {
        Object.assign(item, changes);
      }
    },
    removeCertificate(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setActiveTab,
  setSearchQuery,
  setTabs,
  setItems,
  addCertificate,
  updateCertificate,
  removeCertificate,
} = certificatesSlice.actions;

export default certificatesSlice.reducer;
