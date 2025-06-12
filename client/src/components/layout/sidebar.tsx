import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserPermissions, roleLabels, type UserRole } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

import { 
  Building2, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Users,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
  UserCircle,
  Shield,
  Target,
  Clock,
  TrendingUp,
  Briefcase,
  Award,
  BookOpen,
  DollarSign,
  MessageSquare,
  PieChart,
  Zap
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  show: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const getRoleBasedNavigation = (userRole: UserRole): NavigationSection[] => {
  switch (userRole?.toLowerCase()) {
    case 'admin':
    case 'owner':
      return [
        {
          title: "Yönetim Paneli",
          items: [
            { name: "Ana Dashboard", href: "/", icon: LayoutDashboard, show: true },
            { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3, show: true },
            { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, show: true },
            { name: "Şirket Yönetimi", href: "/admin/companies", icon: Building2, show: true },
            { name: "Departman Yönetimi", href: "/admin/departments", icon: Target, show: true },
            { name: "İş İlanları", href: "/admin/job-postings", icon: Briefcase, show: true },
            { name: "Bordro Yönetimi", href: "/admin/payroll", icon: DollarSign, show: true },
            { name: "İzin Yönetimi", href: "/admin/leaves", icon: Calendar, show: true },
            { name: "Performans Yönetimi", href: "/admin/performance", icon: TrendingUp, show: true },
            { name: "Eğitim Yönetimi", href: "/admin/trainings", icon: BookOpen, show: true },
          ]
        }
      ];

    case 'hr_manager':
    case 'ik_müdürü':
      return [
        {
          title: "İK Yönetimi",
          items: [
            { name: "Ana Dashboard", href: "/", icon: LayoutDashboard, show: true },
            { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, show: true },
            { name: "Departman Yönetimi", href: "/admin/departments", icon: Target, show: true },
            { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3, show: true },
          ]
        }
      ];

    case 'hr_specialist':
    case 'ik':
      return [
        {
          title: "İK Panel",
          items: [
            { name: "Ana Dashboard", href: "/", icon: LayoutDashboard, show: true },
            { name: "Departman Yönetimi", href: "/admin/departments", icon: Target, show: true },
            { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3, show: true },
          ]
        }
      ];

    case 'department_manager':
    case 'departman_müdürü':
      return [
        {
          title: "Departman Panel",
          items: [
            { name: "Ana Dashboard", href: "/", icon: LayoutDashboard, show: true },
            { name: "Departman Yönetimi", href: "/admin/departments", icon: Target, show: true },
            { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3, show: true },
          ]
        }
      ];

    case 'employee':
    case 'çalışan':
      return [
        {
          title: "Çalışan Panel",
          items: [
            { name: "Ana Dashboard", href: "/", icon: LayoutDashboard, show: true },
            { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3, show: true },
          ]
        }
      ];

    default:
      return [
        {
          title: "Ana Panel",
          items: [
            { name: "Dashboard", href: "/", icon: LayoutDashboard, show: true },
          ]
        }
      ];
  }
};

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      toast({
        title: "Başarıyla çıkış yapıldı",
        description: "Güvenli bir şekilde oturumunuz sonlandırıldı.",
      });
      window.location.href = "/login";
    },
    onError: () => {
      toast({
        title: "Çıkış yapılırken hata oluştu",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return null;
  }

  const userData = user as any;
  const userRole = userData.role as UserRole;
  const navigation = getRoleBasedNavigation(userRole);
  const userInitials = `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex h-screen w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">HR360</h1>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.profileImageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {roleLabels[userRole] || userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items
                .filter(item => item.show)
                .map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-10 px-3 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <Icon className={cn(
                          "mr-3 h-4 w-4",
                          isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        )} />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <Link href="/notifications">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Bildirimler
          </Button>
        </Link>
        
        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Ayarlar
          </Button>
        </Link>

        <Button
          variant="ghost"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full justify-start h-10 px-3 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="mr-3 h-4 w-4" />
          {logout.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </Button>
      </div>
    </div>
  );
}