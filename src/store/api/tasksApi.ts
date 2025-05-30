
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => 'posts?_limit=10',
      transformResponse: (response: any[]): Task[] =>
        response.map(post => ({
          id: post.id,
          title: post.title,
          description: post.body,
          completed: Math.random() > 0.5,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Task['priority'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
    }),

    getTaskStats: builder.query<TaskStats, void>({
      query: () => 'posts?_limit=100',
      transformResponse: (response: any[]): TaskStats => {
        const total = response.length;
        const completed = Math.floor(total * 0.6);
        const pending = Math.floor(total * 0.3);
        const overdue = total - completed - pending;
        
        return {
          total,
          completed,
          pending,
          overdue,
        };
      },
    }),
  }),
});

export const { useGetTasksQuery, useGetTaskStatsQuery } = tasksApi;
