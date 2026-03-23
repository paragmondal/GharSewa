import { create } from 'zustand';

const useSocketStore = create((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  clearSocket: () => set({ socket: null }),
}));

export default useSocketStore;
