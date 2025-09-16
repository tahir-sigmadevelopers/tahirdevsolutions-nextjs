import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Testimonial {
  _id: string;
  name?: string;
  description: string;
  company?: string;
  role?: string;
  imageUrl?: string;
  user?: {
    _id: string;
    name: string;
    image?: {
      url?: string;
    };
  };
  approved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TestimonialState {
  testimonials: Testimonial[];
  testimonial: Testimonial | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  testimonial: null,
  loading: false,
  error: null,
};

// Async thunks
export const getTestimonials = createAsyncThunk(
  'testimonial/getTestimonials',
  async ({ approved }: { approved?: boolean } = {}, { rejectWithValue }) => {
    try {
      let url = '/api/testimonials';
      if (approved !== undefined) {
        url += `?approved=${approved}`;
      }
      
      const { data } = await axios.get(url);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTestimonial = createAsyncThunk(
  'testimonial/getTestimonial',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/testimonials/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTestimonial = createAsyncThunk(
  'testimonial/createTestimonial',
  async (testimonialData: { 
    name?: string; 
    content: string; 
    company?: string; 
    role?: string; 
    imageUrl?: string 
  }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/testimonials', testimonialData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'testimonial/updateTestimonial',
  async (
    { id, testimonialData }: { 
      id: string; 
      testimonialData: { 
        name?: string;
        description?: string; 
        company?: string;
        role?: string;
        imageUrl?: string;
        approved?: boolean 
      } 
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`/api/testimonials/${id}`, testimonialData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'testimonial/deleteTestimonial',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/testimonials/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTestimonial: (state) => {
      state.testimonial = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get testimonials
      .addCase(getTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(getTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get testimonial
      .addCase(getTestimonial.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonial = action.payload;
      })
      .addCase(getTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create testimonial
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = [...state.testimonials, action.payload];
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonial = action.payload;
        state.testimonials = state.testimonials.map((testimonial) =>
          testimonial._id === action.payload._id ? action.payload : testimonial
        );
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = state.testimonials.filter(
          (testimonial) => testimonial._id !== action.payload
        );
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetTestimonial } = testimonialSlice.actions;
export default testimonialSlice.reducer;