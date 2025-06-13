// Theme utility functions for role-based styling

export type UserRole = 'admin' | 'hr_manager' | 'hr_specialist' | 'department_manager' | 'employee' | 'owner';

export const getRoleTheme = (role: UserRole) => {
  const themes = {
    hr_manager: {
      name: 'İK Müdürü',
      primary: 'from-green-600 to-emerald-700',
      secondary: 'from-green-50 to-emerald-50',
      accent: 'green-600',
      text: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700',
      border: 'border-green-200',
      card: 'bg-gradient-to-br from-green-50 to-emerald-50',
      sidebar: 'from-teal-600 via-teal-700 to-emerald-700'
    },
    hr_specialist: {
      name: 'İK Uzmanı',
      primary: 'from-orange-500 to-orange-700',
      secondary: 'from-orange-50 to-orange-100',
      accent: 'orange-600',
      text: 'text-orange-700',
      button: 'bg-orange-600 hover:bg-orange-700',
      border: 'border-orange-200',
      card: 'bg-gradient-to-br from-orange-50 to-orange-100',
      sidebar: 'from-orange-500 via-orange-600 to-orange-700'
    },
    department_manager: {
      name: 'Departman Müdürü',
      primary: 'from-red-600 to-rose-700',
      secondary: 'from-red-50 to-rose-100',
      accent: 'red-600',
      text: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-200',
      card: 'bg-gradient-to-br from-red-50 to-rose-100',
      sidebar: 'from-red-600 via-red-700 to-rose-700'
    },
    employee: {
      name: 'Çalışan',
      primary: 'from-gray-600 to-gray-800',
      secondary: 'from-gray-50 to-gray-100',
      accent: 'gray-600',
      text: 'text-gray-700',
      button: 'bg-gray-600 hover:bg-gray-700',
      border: 'border-gray-200',
      card: 'bg-gradient-to-br from-gray-50 to-gray-100',
      sidebar: 'from-gray-600 via-gray-700 to-gray-800'
    },
    admin: {
      name: 'Yönetici',
      primary: 'from-purple-600 to-purple-800',
      secondary: 'from-purple-50 to-purple-100',
      accent: 'purple-600',
      text: 'text-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700',
      border: 'border-purple-200',
      card: 'bg-gradient-to-br from-purple-50 to-purple-100',
      sidebar: 'from-purple-600 via-purple-700 to-purple-800'
    },
    owner: {
      name: 'Sahibi',
      primary: 'from-gray-700 to-gray-900',
      secondary: 'from-gray-50 to-gray-100',
      accent: 'gray-700',
      text: 'text-gray-700',
      button: 'bg-gray-700 hover:bg-gray-800',
      border: 'border-gray-200',
      card: 'bg-gradient-to-br from-gray-50 to-gray-100',
      sidebar: 'from-gray-700 via-gray-800 to-gray-900'
    }
  };

  return themes[role] || themes.employee;
};

export const getThemeClasses = (role: UserRole) => {
  const theme = getRoleTheme(role);
  
  return {
    pageBackground: `bg-gradient-to-br ${theme.secondary}`,
    cardBackground: theme.card,
    headerGradient: `bg-gradient-to-r ${theme.primary}`,
    sidebarGradient: `bg-gradient-to-r ${theme.sidebar}`,
    buttonPrimary: theme.button,
    textPrimary: theme.text,
    borderPrimary: theme.border,
    accentColor: theme.accent
  };
};

export const getRoleDisplayName = (role: UserRole): string => {
  return getRoleTheme(role).name;
};