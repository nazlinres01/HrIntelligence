import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Temporarily return false for authentication to show login pages
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}