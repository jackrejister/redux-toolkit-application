
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Task } from '../api/tasksApi';
import { RootState } from '../store';

interface TasksState {
  selectedTasks: number[];
  draggedTask: Task | null;
  clipboardTasks: Task[];
  lastAction: {
    type: 'create' | 'update' | 'delete' | 'bulk_update';
    timestamp: number;
    taskIds: number[];
  } | null;
  undoStack: {
    action: string;
    data: any;
    timestamp: number;
  }[];
  redoStack: {
    action: string;
    data: any;
    timestamp: number;
  }[];
  quickFilters: {
    myTasks: boolean;
    dueSoon: boolean;
    highPriority: boolean;
  };
  sortBy: {
    field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
    direction: 'asc' | 'desc';
  };
  groupBy: 'none' | 'priority' | 'assignee' | 'status';
}

const initialState: TasksState = {
  selectedTasks: [],
  draggedTask: null,
  clipboardTasks: [],
  lastAction: null,
  undoStack: [],
  redoStack: [],
  quickFilters: {
    myTasks: false,
    dueSoon: false,
    highPriority: false,
  },
  sortBy: {
    field: 'createdAt',
    direction: 'desc',
  },
  groupBy: 'none',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Selection actions
    selectTask: (state, action: PayloadAction<number>) => {
      if (!state.selectedTasks.includes(action.payload)) {
        state.selectedTasks.push(action.payload);
      }
    },
    
    deselectTask: (state, action: PayloadAction<number>) => {
      state.selectedTasks = state.selectedTasks.filter(id => id !== action.payload);
    },
    
    toggleTaskSelection: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      if (state.selectedTasks.includes(taskId)) {
        state.selectedTasks = state.selectedTasks.filter(id => id !== taskId);
      } else {
        state.selectedTasks.push(taskId);
      }
    },
    
    selectAllTasks: (state, action: PayloadAction<number[]>) => {
      state.selectedTasks = action.payload;
    },
    
    clearSelection: (state) => {
      state.selectedTasks = [];
    },
    
    // Drag and drop actions
    setDraggedTask: (state, action: PayloadAction<Task | null>) => {
      state.draggedTask = action.payload;
    },
    
    // Clipboard actions
    copyTasks: (state, action: PayloadAction<Task[]>) => {
      state.clipboardTasks = action.payload;
    },
    
    clearClipboard: (state) => {
      state.clipboardTasks = [];
    },
    
    // Action tracking
    recordAction: (state, action: PayloadAction<{
      type: 'create' | 'update' | 'delete' | 'bulk_update';
      taskIds: number[];
    }>) => {
      state.lastAction = {
        ...action.payload,
        timestamp: Date.now(),
      };
    },
    
    // Undo/Redo actions
    pushToUndoStack: (state, action: PayloadAction<{
      action: string;
      data: any;
    }>) => {
      state.undoStack.push({
        ...action.payload,
        timestamp: Date.now(),
      });
      
      // Limit undo stack size
      if (state.undoStack.length > 50) {
        state.undoStack.shift();
      }
      
      // Clear redo stack when new action is performed
      state.redoStack = [];
    },
    
    undo: (state) => {
      const lastAction = state.undoStack.pop();
      if (lastAction) {
        state.redoStack.push(lastAction);
      }
    },
    
    redo: (state) => {
      const lastUndone = state.redoStack.pop();
      if (lastUndone) {
        state.undoStack.push(lastUndone);
      }
    },
    
    // Quick filters
    setQuickFilter: (state, action: PayloadAction<{
      filter: keyof TasksState['quickFilters'];
      value: boolean;
    }>) => {
      state.quickFilters[action.payload.filter] = action.payload.value;
    },
    
    clearQuickFilters: (state) => {
      state.quickFilters = {
        myTasks: false,
        dueSoon: false,
        highPriority: false,
      };
    },
    
    // Sorting
    setSortBy: (state, action: PayloadAction<TasksState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    
    toggleSortDirection: (state) => {
      state.sortBy.direction = state.sortBy.direction === 'asc' ? 'desc' : 'asc';
    },
    
    // Grouping
    setGroupBy: (state, action: PayloadAction<TasksState['groupBy']>) => {
      state.groupBy = action.payload;
    },
  },
});

// Selectors using createSelector for memoization
export const selectSelectedTasksCount = createSelector(
  (state: RootState) => state.tasks.selectedTasks,
  (selectedTasks) => selectedTasks.length
);

export const selectHasSelectedTasks = createSelector(
  selectSelectedTasksCount,
  (count) => count > 0
);

export const selectCanUndo = createSelector(
  (state: RootState) => state.tasks.undoStack,
  (undoStack) => undoStack.length > 0
);

export const selectCanRedo = createSelector(
  (state: RootState) => state.tasks.redoStack,
  (redoStack) => redoStack.length > 0
);

export const selectActiveFiltersCount = createSelector(
  (state: RootState) => state.tasks.quickFilters,
  (filters) => Object.values(filters).filter(Boolean).length
);

export const {
  selectTask,
  deselectTask,
  toggleTaskSelection,
  selectAllTasks,
  clearSelection,
  setDraggedTask,
  copyTasks,
  clearClipboard,
  recordAction,
  pushToUndoStack,
  undo,
  redo,
  setQuickFilter,
  clearQuickFilters,
  setSortBy,
  toggleSortDirection,
  setGroupBy,
} = tasksSlice.actions;

export default tasksSlice.reducer;
