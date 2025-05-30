import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Task-related types
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: number;
  tags?: string[];
}

export interface TasksFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// RTK Query API for tasks with advanced features
export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  
  tagTypes: ['Task', 'TaskStats'],
  
  endpoints: (builder) => ({
    // Get tasks with filtering and pagination
    getTasks: builder.query<{ tasks: Task[]; total: number }, TasksFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('_page', filters.page.toString());
        if (filters.limit) params.append('_limit', filters.limit.toString());
        
        return `todos?${params.toString()}`;
      },
      
      transformResponse: (response: any[]): { tasks: Task[]; total: number } => ({
        tasks: response.map(item => ({
          id: item.id,
          title: item.title,
          description: `Task description for ${item.title}`,
          completed: item.completed,
          priority: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['general'],
          assignedTo: item.userId,
        })),
        total: 200, // Mock total
      }),
      
      providesTags: (result) =>
        result
          ? [
              ...result.tasks.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
      
      // Keep data for 5 minutes
      keepUnusedDataFor: 300,
      
      // Refetch on window focus
      refetchOnFocus: true,
      
      // Refetch on network reconnection
      refetchOnReconnect: true,
    }),
    
    // Get single task
    getTask: builder.query<Task, number>({
      query: (id) => `todos/${id}`,
      transformResponse: (response: any): Task => ({
        id: response.id,
        title: response.title,
        description: `Detailed description for ${response.title}`,
        completed: response.completed,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['general'],
        assignedTo: response.userId,
      }),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    
    // Create task with optimistic updates
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (newTask) => ({
        url: 'todos',
        method: 'POST',
        body: newTask,
      }),
      
      transformResponse: (response: any, meta, arg): Task => ({
        id: response.id || Date.now(),
        title: arg.title,
        description: arg.description,
        completed: false,
        priority: arg.priority,
        dueDate: arg.dueDate,
        assignedTo: arg.assignedTo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: arg.tags || [],
      }),
      
      // Optimistic updates
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
            const optimisticTask: Task = {
              id: Date.now(), // Temporary ID
              title: arg.title,
              description: arg.description,
              completed: false,
              priority: arg.priority,
              dueDate: arg.dueDate,
              assignedTo: arg.assignedTo,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: arg.tags || [],
            };
            draft.tasks.unshift(optimisticTask);
            draft.total += 1;
          })
        );
        
        try {
          const { data: newTask } = await queryFulfilled;
          // Replace optimistic update with real data
          dispatch(
            tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
              const index = draft.tasks.findIndex(task => task.id === Date.now());
              if (index !== -1) {
                draft.tasks[index] = newTask;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      
      invalidatesTags: [{ type: 'Task', id: 'LIST' }, 'TaskStats'],
    }),
    
    // Update task
    updateTask: builder.mutation<Task, UpdateTaskRequest>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      
      // Optimistic updates
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Update in the list
        const patchResult1 = dispatch(
          tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
            const task = draft.tasks.find(task => task.id === id);
            if (task) {
              Object.assign(task, patch, { updatedAt: new Date().toISOString() });
            }
          })
        );
        
        // Update individual task query if it exists
        const patchResult2 = dispatch(
          tasksApi.util.updateQueryData('getTask', id, (draft) => {
            Object.assign(draft, patch, { updatedAt: new Date().toISOString() });
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult1.undo();
          patchResult2.undo();
        }
      },
      
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        'TaskStats',
      ],
    }),
    
    // Delete task
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      
      // Optimistic updates
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', {}, (draft) => {
            const index = draft.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
              draft.tasks.splice(index, 1);
              draft.total -= 1;
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
        'TaskStats',
      ],
    }),
    
    // Get task statistics
    getTaskStats: builder.query<{
      total: number;
      completed: number;
      pending: number;
      overdue: number;
    }, void>({
      queryFn: async () => {
        // Mock statistics calculation
        return {
          data: {
            total: 25,
            completed: 15,
            pending: 8,
            overdue: 2,
          },
        };
      },
      providesTags: ['TaskStats'],
      
      // Polling every 30 seconds
      pollingInterval: 30000,
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskStatsQuery,
  useLazyGetTasksQuery,
  usePrefetch,
} = tasksApi;
