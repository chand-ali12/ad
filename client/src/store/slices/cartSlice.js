import { createSlice } from '@reduxjs/toolkit';

const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  const cleaned = price.replace(/[^0-9.]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    const price = parsePrice(item.price);
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    total: Number(subtotal.toFixed(2)),
  };
};

const CART_STORAGE_KEY = 'ad_cart_items';

const loadPersistedItems = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistItems = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (_) {}
};

const initialItems = loadPersistedItems();
const totals = calculateTotals(initialItems);

const initialState = {
  items: initialItems,
  subtotal: totals.subtotal,
  total: totals.total,
  currency: 'USD',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload ?? [];
      const nextTotals = calculateTotals(state.items);
      state.subtotal = nextTotals.subtotal;
      state.total = nextTotals.total;
      persistItems(state.items);
    },
    addItem(state, action) {
      const incoming = action.payload;
      const existing = state.items.find((item) => item.id === incoming.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (incoming.quantity || 1);
      } else {
        state.items.push({ quantity: 1, ...incoming });
      }
      const nextTotals = calculateTotals(state.items);
      state.subtotal = nextTotals.subtotal;
      state.total = nextTotals.total;
      persistItems(state.items);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      const nextTotals = calculateTotals(state.items);
      state.subtotal = nextTotals.subtotal;
      state.total = nextTotals.total;
      persistItems(state.items);
    },
    updateItem(state, action) {
      const { id, ...updates } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (item) {
        Object.assign(item, updates);
      }
      const nextTotals = calculateTotals(state.items);
      state.subtotal = nextTotals.subtotal;
      state.total = nextTotals.total;
      persistItems(state.items);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const nextTotals = calculateTotals(state.items);
      state.subtotal = nextTotals.subtotal;
      state.total = nextTotals.total;
      persistItems(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      persistItems(state.items);
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  updateQuantity,
  updateItem,
  removeItem,
  clearCart,
  setCurrency,
} = cartSlice.actions;

export default cartSlice.reducer;
