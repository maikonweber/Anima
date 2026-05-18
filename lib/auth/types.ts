export type { User } from "@/lib/types";

export interface AuthState {
  user: import("@/lib/types").User | null;
  isLoading: boolean;
}
