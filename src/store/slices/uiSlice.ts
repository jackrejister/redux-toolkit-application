
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: number;
}

interface UIState {
  sidebarOpen: boolean;
  notifications: NotificationState[];
  loading: {
    [key: string]: boolean;
  };
  modals: {
    createTask: boolean;
    editTask: boolean;
    deleteConfirmation: boolean;
    userProfile: boolean;
  };
  theme: 'light' | 'dark';
  currentView: 'dashboard' | 'tasks' | 'team' | 'profile';
  tasksView: 'list' | 'grid' | 'kanban';
  filters: {
    tasks: {
      status: 'all' | 'completed' | 'pending';
      priority: 'all' | 'low' | 'medium' | 'high';
      assignee: 'all' | number;
      search: string;
    };
  };
  pagination: {
    tasks: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  notifications: [],
  loading: {},
  modals: {
    createTask: false,
    editTask: false,
    deleteConfirmation: false,
    userProfile: false,
  },
  theme: 'dark',
  currentView: 'dashboard',
  tasksView: 'list',
  filters: {
    tasks: {
      status: 'all',
      priority: 'all',
      assignee: 'all',
      search: '',
    },
  },
  pagination: {
    tasks: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id' | 'timestamp'>>) => {
      const notification: NotificationState = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // View actions
    setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
      state.currentView = action.payload;
    },
    
    setTasksView: (state, action: PayloadAction<UIState['tasksView']>) => {
      state.tasksView = action.payload;
    },
    
    // Filter actions
    setTasksFilter: (state, action: PayloadAction<Partial<UIState['filters']['tasks']>>) => {
      state.filters.tasks = { ...state.filters.tasks, ...action.payload };
      // Reset pagination when filters change
      state.pagination.tasks.page = 1;
    },
    
    clearTasksFilters: (state) => {
      state.filters.tasks = {
        status: 'all',
        priority: 'all',
        assignee: 'all',
        search: '',
      };
      state.pagination.tasks.page = 1;
    },
    
    // Pagination actions
    setTasksPagination: (state, action: PayloadAction<Partial<UIState['pagination']['tasks']>>) => {
      state.pagination.tasks = { ...state.pagination.tasks, ...action.payload };
    },
    
    nextTasksPage: (state) => {
      const maxPage = Math.ceil(state.pagination.tasks.total / state.pagination.tasks.limit);
      if (state.pagination.tasks.page < maxPage) {
        state.pagination.tasks.page += 1;
      }
    },
    
    previousTasksPage: (state) => {
      if (state.pagination.tasks.page > 1) {
        state.pagination.tasks.page -= 1;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setLoading,
  clearLoading,
  openModal,
  closeModal,
  closeAllModals,
  setTheme,
  toggleTheme,
  setCurrentView,
  setTasksView,
  setTasksFilter,
  clearTasksFilters,
  setTasksPagination,
  nextTasksPage,
  previousTasksPage,
} = uiSlice.actions;

export default uiSlice.reducer;
