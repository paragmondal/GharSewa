import { create } from 'zustand';

const useUIStore = create((set) => ({
  isSidebarCollapsed: localStorage.getItem('sidebar_collapsed') === 'true',
  toggleSidebar: () => set((state) => {
    const newVal = !state.isSidebarCollapsed;
    localStorage.setItem('sidebar_collapsed', String(newVal));
    return { isSidebarCollapsed: newVal };
  }),
  setSidebarCollapsed: (value) => set(() => {
    localStorage.setItem('sidebar_collapsed', String(value));
    return { isSidebarCollapsed: value };
  })
}));

export default useUIStore;
