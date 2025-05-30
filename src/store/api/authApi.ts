
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
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: () => ({
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
  }),
});

export const { useLoginMutation } = authApi;
