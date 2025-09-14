import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Comment {
  _id: string;
  blog: string;
  user?: {
    _id: string;
    name: string;
    image?: {
      url?: string;
    };
  };
  name: string;
  email: string;
  comment: string;
  parentComment?: string;
  likes: string[];
  createdAt: string;
}

interface CommentState {
  comments: Comment[];
  comment: Comment | null;
  replies: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  comment: null,
  replies: [],
  loading: false,
  error: null,
};

// Async thunks
export const getComments = createAsyncThunk(
  'comment/getComments',
  async (blogId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/comments?blog=${blogId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getComment = createAsyncThunk(
  'comment/getComment',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/comments/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (commentData: Partial<Comment>, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/comments', commentData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async (
    { id, commentText }: { id: string; commentText: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`/api/comments/${id}`, { commentText });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetComment: (state) => {
      state.comment = null;
      state.replies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get comment with replies
      .addCase(getComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comment = action.payload.comment;
        state.replies = action.payload.replies;
      })
      .addCase(getComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        
        // If it's a reply, add to replies
        if (action.payload.parentComment) {
          if (state.comment && state.comment._id === action.payload.parentComment) {
            state.replies = [...state.replies, action.payload];
          }
        } else {
          // Otherwise add to main comments
          state.comments = [...state.comments, action.payload];
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.comment && state.comment._id === action.payload._id) {
          state.comment = action.payload;
        }
        
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        );
        
        state.replies = state.replies.map((reply) =>
          reply._id === action.payload._id ? action.payload : reply
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
        state.replies = state.replies.filter(
          (reply) => reply._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetComment } = commentSlice.actions;
export default commentSlice.reducer;
