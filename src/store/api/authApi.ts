
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
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

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'users/1',
        method: 'GET',
      }),
      transformResponse: (response: any): LoginResponse => ({
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }),
    }),

    register: builder.mutation<LoginResponse, { name: string; email: string; password: string }>({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any): LoginResponse => ({
        user: {
          id: response.id || 1,
          name: response.name,
          email: response.email,
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'users/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
