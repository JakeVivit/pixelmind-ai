import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Define the possible views in the application
export type AppView =
  | 'home'
  | 'welcome'
  | 'projects'
  | 'workspace'
  | 'editor'
  | 'preview'
  | 'webcontainer'

// Define the application state interface
interface AppState {
  // Current view state
  currentView: AppView

  // Loading states
  isLoading: boolean
  loadingMessage: string

  // WebContainer state
  isWebContainerReady: boolean
  webContainerError: string | null

  // Project state
  currentProject: {
    name: string
    framework: 'react' | 'vue' | null
    uiLibrary: 'antd' | 'material-ui' | null
  } | null

  // AI state
  isAIProcessing: boolean
  aiError: string | null

  // Actions
  setCurrentView: (view: AppView) => void
  setLoading: (loading: boolean, message?: string) => void
  setWebContainerReady: (ready: boolean) => void
  setWebContainerError: (error: string | null) => void
  setCurrentProject: (project: AppState['currentProject']) => void
  setAIProcessing: (processing: boolean) => void
  setAIError: (error: string | null) => void
  resetState: () => void
}

// Initial state
const initialState = {
  currentView: 'home' as AppView,
  isLoading: false,
  loadingMessage: '',
  isWebContainerReady: false,
  webContainerError: null,
  currentProject: null,
  isAIProcessing: false,
  aiError: null,
}

// Create the store with Zustand
export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setCurrentView: (view: AppView) => {
        set({ currentView: view }, false, 'setCurrentView')
      },

      setLoading: (loading: boolean, message = '') => {
        set(
          {
            isLoading: loading,
            loadingMessage: message,
          },
          false,
          'setLoading'
        )
      },

      setWebContainerReady: (ready: boolean) => {
        set(
          {
            isWebContainerReady: ready,
            // Clear error when WebContainer becomes ready
            webContainerError: ready ? null : get().webContainerError,
          },
          false,
          'setWebContainerReady'
        )
      },

      setWebContainerError: (error: string | null) => {
        set(
          {
            webContainerError: error,
            // Set ready to false if there's an error
            isWebContainerReady: error ? false : get().isWebContainerReady,
          },
          false,
          'setWebContainerError'
        )
      },

      setCurrentProject: (project: AppState['currentProject']) => {
        set({ currentProject: project }, false, 'setCurrentProject')
      },

      setAIProcessing: (processing: boolean) => {
        set(
          {
            isAIProcessing: processing,
            // Clear AI error when starting new processing
            aiError: processing ? null : get().aiError,
          },
          false,
          'setAIProcessing'
        )
      },

      setAIError: (error: string | null) => {
        set(
          {
            aiError: error,
            // Stop processing if there's an error
            isAIProcessing: error ? false : get().isAIProcessing,
          },
          false,
          'setAIError'
        )
      },

      resetState: () => {
        set(initialState, false, 'resetState')
      },
    }),
    {
      name: 'pixelmind-app-store',
      // Only enable devtools in development
      enabled: import.meta.env.DEV,
    }
  )
)

// Selector hooks for better performance
export const useCurrentView = () => useAppStore(state => state.currentView)
export const useLoadingState = () =>
  useAppStore(state => ({
    isLoading: state.isLoading,
    loadingMessage: state.loadingMessage,
  }))
export const useWebContainerState = () =>
  useAppStore(state => ({
    isReady: state.isWebContainerReady,
    error: state.webContainerError,
  }))
export const useCurrentProject = () => useAppStore(state => state.currentProject)
export const useAIState = () =>
  useAppStore(state => ({
    isProcessing: state.isAIProcessing,
    error: state.aiError,
  }))
