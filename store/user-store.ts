import { create } from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false, // Mặc định là chưa đăng nhập
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));