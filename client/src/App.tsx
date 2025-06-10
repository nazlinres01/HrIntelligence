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
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/team-login" component={TeamLogin} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/employees" component={Employees} />
      <Route path="/performance" component={Performance} />
      <Route path="/leaves" component={Leaves} />
      <Route path="/payroll" component={Payroll} />
      <Route path="/reports" component={Reports} />
      <Route path="/help" component={Help} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/team" component={Team} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
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
