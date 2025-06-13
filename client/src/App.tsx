import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { useAuth } from "./hooks/useAuth";
import EnterpriseSidebar from "@/components/layout/EnterpriseSidebar";
import EnterpriseAdminDashboard from "@/pages/dashboard/EnterpriseAdminDashboard";
import HRManagerDashboard from "@/pages/dashboard/HRManagerDashboard";
import HRSpecialistDashboard from "@/pages/dashboard/HRSpecialistDashboard";
import DepartmentManagerDashboard from "@/pages/dashboard/DepartmentManagerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";

// Admin Management Pages
import EnterpriseCompanyManagement from "@/pages/admin/EnterpriseCompanyManagement";
import UserManagement from "@/pages/admin/UserManagement";
import DepartmentManagement from "@/pages/admin/DepartmentManagement";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";

// Enterprise HR Management Pages
import EnterpriseJobManagement from "@/pages/admin/EnterpriseJobManagement";
import EnterprisePayrollCenter from "@/pages/admin/EnterprisePayrollCenter";

// New Admin Pages
import EnterprisePayrollCenterNew from "@/pages/admin/EnterprisePayrollCenterNew";
import TalentAcquisition from "@/pages/admin/TalentAcquisition";
import DepartmentControl from "@/pages/admin/DepartmentControl";
import CompanyStructure from "@/pages/admin/CompanyStructure";
import AnalyticsCenter from "@/pages/admin/AnalyticsCenter";
import StrategicOverview from "@/pages/admin/StrategicOverview";

// Other Pages
import Employees from "@/pages/employees";
import Performance from "@/pages/performance";
import Leaves from "@/pages/leaves";
import Training from "@/pages/training";
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
        return EnterpriseAdminDashboard;
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
        return EnterpriseAdminDashboard;
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Switch>
        <Route path="/" component={DashboardComponent} />
        <Route path="/dashboard" component={DashboardComponent} />

        {/* Enterprise Admin Routes */}
        <Route path="/admin/companies" component={EnterpriseCompanyManagement} />
        <Route path="/admin/users" component={UserManagement} />
        <Route path="/admin/departments" component={DepartmentManagement} />
        <Route path="/admin/analytics" component={AnalyticsDashboard} />
        
        {/* Enterprise HR Management Routes */}
        <Route path="/admin/job-postings" component={EnterpriseJobManagement} />
        <Route path="/admin/payroll" component={EnterprisePayrollCenter} />
        
        {/* New Admin Routes */}
        <Route path="/admin/payroll-new" component={EnterprisePayrollCenterNew} />
        <Route path="/admin/talent-acquisition" component={TalentAcquisition} />
        <Route path="/admin/department-control" component={DepartmentControl} />
        <Route path="/admin/company-structure" component={CompanyStructure} />
        <Route path="/admin/analytics-center" component={AnalyticsCenter} />
        <Route path="/admin/strategic-overview" component={StrategicOverview} />
        
        {/* HR Management Routes */}
        <Route path="/employees" component={Employees} />
        <Route path="/performance" component={Performance} />
        <Route path="/leaves" component={Leaves} />
        <Route path="/training" component={Training} />
        <Route path="/payroll" component={Payroll} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/team" component={Team} />
        <Route path="/help" component={Help} />
        <Route path="/test" component={TestPage} />
        
        <Route component={NotFound} />
      </Switch>
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