import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProjectImage {
  public_id?: string;
  url: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  createdAt: string;
  image: ProjectImage;
  featured: boolean;
}

interface ProjectState {
  projects: Project[];
  project: Project | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: ProjectState = {
  projects: [],
  project: null,
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
export const getProjects = createAsyncThunk(
  'project/getProjects',
  async (
    { featured, page = 1, limit = 10 }: { featured?: boolean; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      let url = `/api/projects?page=${page}&limit=${limit}`;
      if (featured) {
        url += '&featured=true';
      }
      
      const { data } = await axios.get(url);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProject = createAsyncThunk(
  'project/getProject',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/projects/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/projects', projectData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async (
    { id, projectData }: { id: string; projectData: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`/api/projects/${id}`, projectData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProject: (state) => {
      state.project = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get projects
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get project
      .addCase(getProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = [...state.projects, action.payload];
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetProject } = projectSlice.actions;
export default projectSlice.reducer;
