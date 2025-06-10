import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Employees from "@/pages/employees";
import Performance from "@/pages/performance";
import Leaves from "@/pages/leaves";
import Payroll from "@/pages/payroll";
import Reports from "@/pages/reports";
import Help from "@/pages/help";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import Team from "@/pages/team";
import TeamLogin from "@/pages/team-login";
import Profile from "@/pages/profile";
import OwnerDashboard from "@/pages/owner-dashboard";
import HRManagerDashboard from "@/pages/hr-manager-dashboard";
import HRSpecialistDashboard from "@/pages/hr-specialist-dashboard";
import DepartmentManagerDashboard from "@/pages/department-manager-dashboard";
import EmployeeDashboard from "@/pages/employee-dashboard";
import RoleLogin from "@/pages/role-login";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";
import { getUserPermissions, type UserRole } from "@/lib/permissions";

function Router() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/team-login" component={TeamLogin} />
        <Route path="/owner" component={RoleLogin} />
        <Route path="/hr-manager" component={RoleLogin} />
        <Route path="/hr-specialist" component={RoleLogin} />
        <Route path="/department-manager" component={RoleLogin} />
        <Route path="/employee" component={RoleLogin} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  const userRole = (user as any)?.role as UserRole || "employee";
  const permissions = getUserPermissions(userRole);

  // Role-based dashboard component
  const getDashboardComponent = () => {
    switch (userRole) {
      case "owner":
        return OwnerDashboard;
      case "hr_manager":
        return HRManagerDashboard;
      case "hr_specialist":
        return HRSpecialistDashboard;
      case "department_manager":
        return DepartmentManagerDashboard;
      case "employee":
        return EmployeeDashboard;
      default:
        return EmployeeDashboard;
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <Switch>
      <Route path="/" component={DashboardComponent} />
      <Route path="/dashboard" component={DashboardComponent} />
      
      {/* Role-specific dashboard routes */}
      <Route path="/owner" component={OwnerDashboard} />
      <Route path="/hr-manager" component={HRManagerDashboard} />
      <Route path="/hr-specialist" component={HRSpecialistDashboard} />
      <Route path="/department-manager" component={DepartmentManagerDashboard} />
      <Route path="/employee" component={EmployeeDashboard} />

      {/* Conditional routes based on permissions */}
      {permissions.canManageEmployees && <Route path="/employees" component={Employees} />}
      {permissions.canManagePerformance && <Route path="/performance" component={Performance} />}
      {(permissions.canManageLeaves || permissions.canRequestLeave) && <Route path="/leaves" component={Leaves} />}
      {permissions.canManagePayroll && <Route path="/payroll" component={Payroll} />}
      {permissions.canViewReports && <Route path="/reports" component={Reports} />}
      {permissions.canManageTeam && <Route path="/team" component={Team} />}
      
      {/* Always available routes */}
      <Route path="/profile" component={Profile} />
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Router />
      </div>
    </div>
  );
}

export default App;
