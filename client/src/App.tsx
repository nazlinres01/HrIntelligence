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
    <Switch>
      <Route path="/" component={DashboardComponent} />
      <Route path="/dashboard" component={DashboardComponent} />

      {/* Admin Management Routes */}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/admin/companies" component={CompanyManagement} />}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/admin/users" component={UserManagement} />}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/company" component={CompanyManagement} />}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/users" component={UserManagement} />}
      {(userRole === 'admin' || userRole === 'owner' || userRole === 'hr_manager') && <Route path="/departments" component={DepartmentManagement} />}
      {(userRole === 'admin' || userRole === 'owner' || userRole === 'hr_manager') && <Route path="/recruitment" component={RecruitmentManagement} />}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/analytics" component={AnalyticsDashboard} />}
      {(userRole === 'admin' || userRole === 'owner' || userRole === 'hr_manager') && <Route path="/reports" component={HRReports} />}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/financial-reports" component={FinancialReports} />}
      {(userRole === 'admin' || userRole === 'owner') && <Route path="/audit" component={AuditLogs} />}
      
      {/* Conditional routes based on permissions */}
      {permissions.canViewEmployees && <Route path="/employees" component={Employees} />}
      {permissions.canViewPerformance && <Route path="/performance" component={Performance} />}
      <Route path="/leaves" component={Leaves} />
      {permissions.canViewPayroll && <Route path="/payroll" component={Payroll} />}
      {permissions.canViewReports && <Route path="/reports" component={Reports} />}
      {permissions.canManageTeam && <Route path="/team" component={Team} />}
      
      {/* Always available routes */}
      <Route path="/notifications" component={Notifications} />
      <Route path="/settings" component={Settings} />
      <Route path="/help" component={Help} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <AuthenticatedLayout />
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Router />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Router />
      </div>
    </div>
  );
}

export default App;
