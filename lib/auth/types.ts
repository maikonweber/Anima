export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
