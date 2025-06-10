import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
  };
}