
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TeamUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive';
  lastSeen: string;
  tasksCount: number;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: (builder) => ({
    getTeamUsers: builder.query<TeamUser[], void>({
      query: () => 'users',
      transformResponse: (response: any[]): TeamUser[] =>
        response.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.id === 1 ? 'admin' : 'member',
          status: Math.random() > 0.3 ? 'active' : 'inactive',
          lastSeen: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          tasksCount: Math.floor(Math.random() * 20),
        })),
    }),
  }),
});

export const { useGetTeamUsersQuery } = usersApi;
