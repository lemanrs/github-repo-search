import React, { createContext, useReducer, ReactNode } from 'react';

export interface AppState {
  searchValue: string;
  repositories: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  type: string | null;
  endpoint:string;
  sortKey: string;
  sortDirection: string;
  itemsPerPage:number
}

const initialState: AppState = {
  searchValue: '',
  repositories: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  sortKey: 'full_name', // Set default sort key
  sortDirection: 'asc', // Set default sort direction
  type: null,
  endpoint:"user",
  itemsPerPage:10
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AppReducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    case 'SET_SEARCH_VALUE':
      return { ...state, searchValue: action.payload };
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_ENDPOINT':
      return { ...state, endpoint: action.payload };
    case 'SET_SORT_KEY':
      return { ...state, sortKey: action.payload };
    case 'SET_SORT_DIRECTION':
      return { ...state, sortDirection: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
