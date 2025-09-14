import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface BlogImage {
  public_id?: string;
  url: string;
}

interface Blog {
  _id: string;
  title: string;
  author: string;
  shortDescription: string;
  category: any;
  content: string;
  createdAt: string;
  image: BlogImage;
  comments: string[];
  tags: string[];
  shareCount: number;
}

interface BlogState {
  blogs: Blog[];
  blog: Blog | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: BlogState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

// Async thunks
export const getBlogs = createAsyncThunk(
  'blog/getBlogs',
  async (
    { category, page = 1, limit = 10 }: { category?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      let url = `/api/blogs?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }
      
      const { data } = await axios.get(url);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getBlog = createAsyncThunk(
  'blog/getBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData: Partial<Blog>, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/blogs', blogData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async (
    { id, blogData }: { id: string; blogData: Partial<Blog> },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`/api/blogs/${id}`, blogData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetBlog: (state) => {
      state.blog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get blogs
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get blog
      .addCase(getBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = [...state.blogs, action.payload];
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.payload
        );
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetBlog } = blogSlice.actions;
export default blogSlice.reducer;
