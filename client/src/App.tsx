import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import HRManagerDashboard from "@/pages/dashboard/HRManagerDashboard";
import HRSpecialistDashboard from "@/pages/dashboard/HRSpecialistDashboard";
import DepartmentManagerDashboard from "@/pages/dashboard/DepartmentManagerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";

// Admin Management Pages
import CompanyManagement from "@/pages/admin/CompanyManagement";
import UserManagement from "@/pages/admin/UserManagement";
import DepartmentManagement from "@/pages/admin/DepartmentManagement";
import RecruitmentManagement from "@/pages/admin/RecruitmentManagement";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import FinancialReports from "@/pages/admin/FinancialReports";
import HRReports from "@/pages/admin/HRReports";
import AuditLogs from "@/pages/admin/AuditLogs";

// Other Pages
import Employees from "@/pages/employees";
import Performance from "@/pages/performance";
import Leaves from "@/pages/leaves";
import Payroll from "@/pages/payroll";
import Reports from "@/pages/reports";
import Help from "@/pages/help";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import Team from "@/pages/team";
import TestPage from "@/pages/test";

import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";
import { getUserPermissions, type UserRole } from "@/lib/permissions";

function Router() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  const userRole = (user as any)?.role as UserRole || "employee";
  const permissions = getUserPermissions(userRole);

  // Role-specific dashboard component selector
  const getDashboardComponent = () => {
    switch (userRole?.toLowerCase()) {
      case 'admin':
      case 'owner':
        return AdminDashboard;
      case 'hr_manager':
      case 'ik_müdürü':
        return HRManagerDashboard;
      case 'hr_specialist':
      case 'ik':
        return HRSpecialistDashboard;
      case 'department_manager':
      case 'departman_müdürü':
        return DepartmentManagerDashboard;
      case 'employee':
      case 'çalışan':
        return EmployeeDashboard;
      default:
        return AdminDashboard;
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={DashboardComponent} />
            <Route path="/dashboard" component={DashboardComponent} />

            {/* Admin Management Routes */}
            <Route path="/admin/companies" component={CompanyManagement} />
            <Route path="/admin/users" component={UserManagement} />
            <Route path="/company" component={CompanyManagement} />
            <Route path="/users" component={UserManagement} />
            <Route path="/departments" component={DepartmentManagement} />
            <Route path="/recruitment" component={RecruitmentManagement} />
            <Route path="/analytics" component={AnalyticsDashboard} />
            <Route path="/reports" component={HRReports} />
            <Route path="/financial-reports" component={FinancialReports} />
            <Route path="/audit" component={AuditLogs} />
            
            {/* Other routes */}
            <Route path="/employees" component={Employees} />
            <Route path="/performance" component={Performance} />
            <Route path="/leaves" component={Leaves} />
            <Route path="/payroll" component={Payroll} />
            <Route path="/team" component={Team} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/settings" component={Settings} />
            <Route path="/help" component={Help} />
            <Route path="/test" component={TestPage} />
            
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;