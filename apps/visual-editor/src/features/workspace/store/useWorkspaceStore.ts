import { create } from 'zustand'

interface WorkspaceState {
  selectedPageId: string | null
  selectedComponentId: string | null
  setSelectedPage: (pageId: string) => void
  setSelectedComponent: (componentId: string) => void
  clearSelection: () => void
}

/**
 * 工作台状态管理
 * 管理当前选中的页面和组件
 */
export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedPageId: 'page-1', // 默认选中首页
  selectedComponentId: null,
  
  setSelectedPage: (pageId: string) => 
    set({ selectedPageId: pageId, selectedComponentId: null }),
  
  setSelectedComponent: (componentId: string) => 
    set({ selectedComponentId: componentId }),
  
  clearSelection: () => 
    set({ selectedPageId: null, selectedComponentId: null }),
}))
