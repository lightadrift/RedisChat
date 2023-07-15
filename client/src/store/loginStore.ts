import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthProps {
  isAuthenticated: boolean;
  user_id: string | null;
  setAuth: (auth: any, id: string) => void;
}

// export const useAuthStore = create<AuthProps>((set) => ({
//   isAuthenticated: false,
//   user_id: null,
//   setAuth: (auth: any, id: string) =>
//     set({ isAuthenticated: auth, user_id: id }),
// }));

export const useAuthStore = create<AuthProps>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user_id: null,
      setAuth: (auth: any, id: string) =>
        set({ isAuthenticated: auth, user_id: id }),
    }),
    {
      name: "login-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
