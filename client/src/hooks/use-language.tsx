import { createContext, useContext, useState } from "react";

type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    dashboard: "Dashboard",
    employees: "Çalışanlar",
    performance: "Performans",
    leaves: "İzin Yönetimi",
    payroll: "Bordro",
    reports: "Raporlar",
    settings: "Ayarlar",
    totalEmployees: "Toplam Çalışan",
    activeLeaves: "Aktif İzinler",
    monthlyPayroll: "Bu Ay Bordro",
    avgPerformance: "Ortalama Performans",
    searchEmployee: "Çalışan ara...",
    addEmployee: "Çalışan Ekle",
    employeeManagement: "Çalışan Yönetimi",
    departmentPerformance: "Departman Performansı",
    leaveCalendar: "İzin Takvimi",
    quickActions: "Hızlı İşlemler",
    recentActivities: "Son Aktiviteler",
    systemAlerts: "Sistem Uyarıları"
  },
  en: {
    dashboard: "Dashboard",
    employees: "Employees", 
    performance: "Performance",
    leaves: "Leave Management",
    payroll: "Payroll",
    reports: "Reports",
    settings: "Settings",
    totalEmployees: "Total Employees",
    activeLeaves: "Active Leaves",
    monthlyPayroll: "Monthly Payroll",
    avgPerformance: "Average Performance",
    searchEmployee: "Search employee...",
    addEmployee: "Add Employee",
    employeeManagement: "Employee Management",
    departmentPerformance: "Department Performance",
    leaveCalendar: "Leave Calendar",
    quickActions: "Quick Actions",
    recentActivities: "Recent Activities",
    systemAlerts: "System Alerts"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
