import { useAuth } from "@/hooks/useAuth";

// Mock department mapping for demonstration - in a real app this would come from the backend
const DEPARTMENT_MANAGER_MAPPING = {
  "dept_manager_001": 1302, // Ali Özkan manages "Yazılım Geliştirme Departmanı" (ID: 1302)
  // Add more mappings as needed
};

export function useDepartmentManager() {
  const { user } = useAuth();
  
  const getDepartmentId = () => {
    if (!user) return null;
    
    const userData = user as any;
    // For department managers, get their department ID from the mapping
    if (userData.role === 'department_manager' || userData.role === 'departman_müdürü') {
      return DEPARTMENT_MANAGER_MAPPING[userData.id as keyof typeof DEPARTMENT_MANAGER_MAPPING] || null;
    }
    
    return null;
  };

  const isDepartmentManager = () => {
    if (!user) return false;
    const userData = user as any;
    return userData.role === 'department_manager' || userData.role === 'departman_müdürü';
  };

  return {
    departmentId: getDepartmentId(),
    isDepartmentManager: isDepartmentManager(),
    user
  };
}