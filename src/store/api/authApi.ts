import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Types for authentication
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// RTK Query API for authentication
export const authApi = createApi({
  reducerPath: 'authApi',
  
  // Base query with automatic token injection
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/', // Mock API
    
    // Automatically add auth token to requests
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  
  // Tags for cache invalidation
  tagTypes: ['User', 'Profile'],
  
  endpoints: (builder) => ({
    // Login mutation with error handling
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'users/1', // Mock endpoint
        method: 'GET', // Mock as GET since jsonplaceholder doesn't support POST
      }),
      
      // Transform the response to match our interface
      transformResponse: (response: any): LoginResponse => ({
        user: {
          id: response.id,
          email: response.email,
          name: response.name,
          role: 'user',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }),
      
      // Invalidate cache on successful login
      invalidatesTags: ['User', 'Profile'],
    }),
    
    // Register mutation
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any): LoginResponse => ({
        user: {
          id: response.id || Date.now(),
          email: response.email,
          name: response.name,
          role: 'user',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }),
      invalidatesTags: ['User'],
    }),
    
    // Get current user profile
    getProfile: builder.query<User, void>({
      query: () => 'users/1',
      transformResponse: (response: any): User => ({
        id: response.id,
        email: response.email,
        name: response.name,
        role: 'user',
        createdAt: new Date().toISOString(),
      }),
      providesTags: ['Profile'],
      
      // Keep data fresh for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    // Update profile
    updateProfile: builder.mutation<User, Partial<User> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      
      // Optimistic updates
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          authApi.util.updateQueryData('getProfile', undefined, (draft) => {
            Object.assign(draft, patch);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      
      invalidatesTags: ['Profile'],
    }),
    
    // Logout (client-side only for this demo)
    logout: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['User', 'Profile'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;
