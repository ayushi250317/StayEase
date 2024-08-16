import {removeToken} from '@src/src/lib/auth';
import {User} from '@src/src/lib/dto';
import {create} from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  user?: User['payload'];

  login(user: User['payload']): void;
  logout(): void;
}

export const useUserStore = create<UserState>()((set) => ({
  isLoggedIn: false,
  login: (user) => {
    if (user) set((state) => ({...state, isLoggedIn: true, user}));
  },
  logout: () => {
    removeToken();
    set((state) => ({...state, isLoggedIn: false, user: undefined}));
  },
}));
