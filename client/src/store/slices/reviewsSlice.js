import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submitReview as submitReviewApi, submitReviewReply as submitReviewReplyApi, deleteReview as deleteReviewApi, deleteReviewReply as deleteReviewReplyApi, updateReviewReply as updateReviewReplyApi } from '../../services/reviewsService';

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await submitReviewApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit review');
    }
  }
);

export const submitReviewReply = createAsyncThunk(
  'reviews/submitReviewReply',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await submitReviewReplyApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit reply');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      const response = await deleteReviewApi({ ...payload, token });
      return { ...response, reviewId: payload.id };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete review');
    }
  }
);

export const updateReviewReply = createAsyncThunk(
  'reviews/updateReviewReply',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await updateReviewReplyApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update reply');
    }
  }
);

export const deleteReviewReply = createAsyncThunk(
  'reviews/deleteReviewReply',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      const response = await deleteReviewReplyApi({ ...payload, token });
      return { ...response, replyId: payload.id, reviewId: payload.reviewId };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete reply');
    }
  }
);

const initialState = {
  list: [],
  draft: {
    rating: 0,
    text: '',
  },
  status: 'idle',
  error: null,
  message: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setDraftRating(state, action) {
      state.draft.rating = action.payload;
    },
    setDraftText(state, action) {
      state.draft.text = action.payload;
    },
    clearDraft(state) {
      state.draft = { rating: 0, text: '' };
    },
    addReview(state, action) {
      const nextId =
        state.list.length > 0
          ? Math.max(...state.list.map((review) => review.id)) + 1
          : 1;
      state.list.push({ id: nextId, reply: null, ...action.payload });
    },
    addReply(state, action) {
      const { id, sellerName, text } = action.payload;
      const review = state.list.find((entry) => entry.id === id);
      if (review) {
        review.reply = { sellerName, text };
      }
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Review
      .addCase(submitReview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || 'Review submitted successfully';
        // Clear draft after successful submission
        state.draft = { rating: 0, text: '' };
        // Optionally add the new review to the list
        if (action.payload?.data) {
          const reviewData = action.payload.data;
          state.list.unshift({
            id: reviewData.id,
            reviewerInitials: 'YOU',
            date: new Date(reviewData.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            rating: parseInt(reviewData.rating),
            comment: reviewData.review,
            reply: null,
          });
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit review';
      })
      // Submit Review Reply
      .addCase(submitReviewReply.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(submitReviewReply.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || 'Reply submitted successfully';
        // Update the review with the new reply
        if (action.payload?.data) {
          const replyData = action.payload.data;
          const reviewId = parseInt(replyData.review_id);
          const review = state.list.find((r) => r.id === reviewId);
          if (review) {
            review.reply = {
              sellerName: 'You', // Or get from user profile
              text: replyData.reply,
            };
          }
        }
      })
      .addCase(submitReviewReply.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit reply';
      })
      // Update Review Reply
      .addCase(updateReviewReply.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(updateReviewReply.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || 'Reply updated successfully';
      })
      .addCase(updateReviewReply.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update reply';
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || 'Review deleted successfully';
        // Remove the review from the list
        if (action.payload?.reviewId) {
          const reviewId = parseInt(action.payload.reviewId);
          state.list = state.list.filter((r) => r.id !== reviewId);
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete review';
      })
      // Delete Review Reply
      .addCase(deleteReviewReply.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(deleteReviewReply.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || 'Reply deleted successfully';
        // Remove the reply from the review
        if (action.payload?.reviewId) {
          const reviewId = parseInt(action.payload.reviewId);
          const review = state.list.find((r) => r.id === reviewId);
          if (review) {
            review.reply = null;
          }
        }
      })
      .addCase(deleteReviewReply.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete reply';
      });
  },
});

export const {
  setDraftRating,
  setDraftText,
  clearDraft,
  addReview,
  addReply,
  setError,
  setMessage,
  clearError,
  clearMessage,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
