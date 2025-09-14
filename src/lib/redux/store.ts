import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import blogReducer from './slices/blogSlice';
import categoryReducer from './slices/categorySlice';
import testimonialReducer from './slices/testimonialSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    project: projectReducer,
    blog: blogReducer,
    category: categoryReducer,
    testimonial: testimonialReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
