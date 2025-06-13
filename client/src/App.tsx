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
import Jobs from "@/pages/jobs";
import Training from "@/pages/training";
import Payroll from "@/pages/payroll";
import Reports from "@/pages/reports";
import Help from "@/pages/help";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import Team from "@/pages/team";
import TestPage from "@/pages/test";
import Targets from "@/pages/targets";
import Projects from "@/pages/projects";
import Meetings from "@/pages/meetings";
import Profile from "@/pages/profile";
import MyLeaves from "@/pages/my-leaves";
import Timesheet from "@/pages/timesheet";
import Expenses from "@/pages/expenses";
import MyPerformance from "@/pages/my-performance";
import MyTraining from "@/pages/my-training";
import Messages from "@/pages/messages";
import Announcements from "@/pages/announcements";
import MyPayroll from "@/pages/my-payroll";
import CareerDevelopment from "@/pages/career-development";
import DocumentManagement from "@/pages/document-management";
import EmployeeBenefits from "@/pages/employee-benefits";
import CompanyDirectory from "@/pages/company-directory";
import MyDocuments from "@/pages/my-documents";
import TeamCollaboration from "@/pages/team-collaboration";

// Department Manager Pages
import StrategicPlanning from "@/pages/strategic-planning";
import ResourcePlanning from "@/pages/resource-planning";
import ProcessOptimization from "@/pages/process-optimization";
import QualityControl from "@/pages/quality-control";
import ManagementReporting from "@/pages/management-reporting";
import TeamCommunication from "@/pages/team-communication";

// HR Specialist Pages
import HRProcesses from "@/pages/hr/processes";
import PersonnelAffairs from "@/pages/personnel-affairs";
import ReferenceChecks from "@/pages/reference-checks";
import Onboarding from "@/pages/onboarding";
import HRDocumentation from "@/pages/hr-documentation";
import InternalCommunication from "@/pages/internal-communication";
import DailyActivities from "@/pages/daily-activities";

// HR Manager Pages
import HRStrategy from "@/pages/hr-strategy";
import DepartmentManagementPage from "@/pages/department-management";
import ApplicationEvaluation from "@/pages/application-evaluation";
import ApplicationEvaluationSimple from "@/pages/application-evaluation-simple";
import JobPostings from "@/pages/job-postings";
import InterviewScheduling from "@/pages/interview-scheduling";
import TalentPool from "@/pages/talent-pool";

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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <EnterpriseSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto">
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
        <Route path="/jobs" component={Jobs} />
        <Route path="/training" component={Training} />
        <Route path="/payroll" component={Payroll} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/team" component={Team} />
        <Route path="/help" component={Help} />
        <Route path="/test" component={TestPage} />
        
        {/* New Management Pages */}
        <Route path="/targets" component={Targets} />
        <Route path="/projects" component={Projects} />
        <Route path="/meetings" component={Meetings} />
        
        {/* Employee-specific routes */}
        <Route path="/profile" component={Profile} />
        <Route path="/my-leaves" component={MyLeaves} />
        <Route path="/timesheet" component={Timesheet} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/my-performance" component={MyPerformance} />
        <Route path="/my-training" component={MyTraining} />
        <Route path="/messages" component={Messages} />
        <Route path="/announcements" component={Announcements} />
        <Route path="/my-payroll" component={MyPayroll} />
        <Route path="/career-development" component={CareerDevelopment} />
        <Route path="/document-management" component={DocumentManagement} />
        <Route path="/employee-benefits" component={EmployeeBenefits} />
        <Route path="/company-directory" component={CompanyDirectory} />
        <Route path="/my-documents" component={MyDocuments} />
        <Route path="/team-collaboration" component={TeamCollaboration} />
        
        {/* Department Manager Routes */}
        <Route path="/strategic-planning" component={StrategicPlanning} />
        <Route path="/resource-planning" component={ResourcePlanning} />
        <Route path="/process-optimization" component={ProcessOptimization} />
        <Route path="/quality-control" component={QualityControl} />
        <Route path="/management-reporting" component={ManagementReporting} />
        <Route path="/team-communication" component={TeamCommunication} />
        
        {/* HR Specialist Routes */}
        <Route path="/hr/processes" component={HRProcesses} />
        <Route path="/personnel-affairs" component={PersonnelAffairs} />
        <Route path="/applications" component={Jobs} />
        <Route path="/reference-checks" component={ReferenceChecks} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/hr-documentation" component={HRDocumentation} />
        <Route path="/internal-communication" component={InternalCommunication} />
        <Route path="/activities" component={DailyActivities} />
        
        {/* HR Manager Routes */}
        <Route path="/hr/strategy" component={HRStrategy} />
        <Route path="/departments" component={DepartmentManagementPage} />
        <Route path="/application-evaluation" component={ApplicationEvaluationSimple} />
        <Route path="/job-postings" component={JobPostings} />
        <Route path="/interview-scheduling" component={InterviewScheduling} />
        <Route path="/talent-pool" component={TalentPool} />
        
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