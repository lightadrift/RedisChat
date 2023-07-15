import { create } from "zustand";


export const useAuthStore = create((set) => ({
    current_room: null,
    roomId: null,
    setRoom: () => {
        
    }
  }));
  