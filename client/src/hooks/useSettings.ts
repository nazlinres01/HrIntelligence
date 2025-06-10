import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Setting {
  id: number;
  userId: string;
  category: string;
  key: string;
  value: string;
  updatedAt: string;
}

interface CreateSettingRequest {
  category: string;
  key: string;
  value: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ["/api/settings"],
    staleTime: 30000, // 30 seconds
  });
}

export function useSetting(category: string, key: string) {
  return useQuery({
    queryKey: ["/api/settings", category, key],
    enabled: !!(category && key),
    staleTime: 30000,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (setting: CreateSettingRequest) => {
      const response = await fetch(`/api/settings`, {
        method: "PUT",
        body: JSON.stringify(setting),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ category, key }: { category: string; key: string }) => {
      const response = await fetch(`/api/settings/${category}/${key}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });
}

// Convenience hooks for specific settings
export function useThemeSetting() {
  const { data: setting } = useSetting("appearance", "theme");
  const updateSetting = useUpdateSetting();
  
  const setTheme = (theme: "light" | "dark" | "system") => {
    updateSetting.mutate({
      category: "appearance",
      key: "theme",
      value: theme,
    });
  };
  
  return {
    theme: (setting as Setting)?.value || "system",
    setTheme,
    isLoading: updateSetting.isPending,
  };
}

export function useLanguageSetting() {
  const { data: setting } = useSetting("general", "language");
  const updateSetting = useUpdateSetting();
  
  const setLanguage = (language: "tr" | "en") => {
    updateSetting.mutate({
      category: "general",
      key: "language",
      value: language,
    });
  };
  
  return {
    language: (setting as Setting)?.value || "tr",
    setLanguage,
    isLoading: updateSetting.isPending,
  };
}

export function useNotificationSettings() {
  const { data: settings } = useSettings();
  const updateSetting = useUpdateSetting();
  
  const notificationSettings = (settings as Setting[])?.filter((s: Setting) => s.category === "notifications") || [];
  
  const updateNotificationSetting = (key: string, value: boolean) => {
    updateSetting.mutate({
      category: "notifications",
      key,
      value: value.toString(),
    });
  };
  
  return {
    settings: notificationSettings,
    updateSetting: updateNotificationSetting,
    isLoading: updateSetting.isPending,
  };
}