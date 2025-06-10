import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, TrendingUp, DollarSign, Clock, UserCheck, AlertTriangle, Target } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function EnhancedStatsCards() {
  const { t } = useLanguage();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: leaves = [] } = useQuery({
    queryKey: ["/api/leaves"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeEmployees = Array.isArray(employees) ? employees.filter((emp: any) => emp.status === 'active').length : 0;
  const onLeaveEmployees = Array.isArray(employees) ? employees.filter((emp: any) => emp.status === 'on_leave').length : 0;
  const pendingLeaves = Array.isArray(leaves) ? leaves.filter((leave: any) => leave.status === 'pending').length : 0;
  const approvedLeaves = Array.isArray(leaves) ? leaves.filter((leave: any) => leave.status === 'approved').length : 0;
  
  const statsCards = [
    {
      title: t("Toplam Çalışan"),
      value: (stats as any)?.totalEmployees || 0,
      change: "+2.5%",
      changeType: "positive",
      icon: Users,
      color: "blue",
      description: t("Son ayda artış")
    },
    {
      title: t("Aktif Çalışan"),
      value: activeEmployees,
      change: `${onLeaveEmployees} ${t("izinli")}`,
      changeType: "neutral",
      icon: UserCheck,
      color: "green",
      description: t("Şu anda görevde")
    },
    {
      title: t("Bekleyen İzinler"),
      value: pendingLeaves,
      change: pendingLeaves > 5 ? t("Yüksek") : t("Normal"),
      changeType: pendingLeaves > 5 ? "negative" : "positive",
      icon: Clock,
      color: "orange",
      description: t("Onay bekliyor")
    },
    {
      title: t("Onaylı İzinler"),
      value: approvedLeaves,
      change: "+12%",
      changeType: "positive",
      icon: Calendar,
      color: "purple",
      description: t("Bu ay toplam")
    },
    {
      title: t("Ortalama Performans"),
      value: `${(stats as any)?.avgPerformance || 0}/10`,
      change: "+0.3",
      changeType: "positive",
      icon: Target,
      color: "emerald",
      description: t("Son çeyrek ortalaması")
    },
    {
      title: t("Aylık Bordro"),
      value: stats?.monthlyPayroll || "₺0",
      change: "+8.2%",
      changeType: "positive",
      icon: DollarSign,
      color: "indigo",
      description: t("Toplam maliyet")
    },
    {
      title: t("Performans Artışı"),
      value: "+15.3%",
      change: t("Hedef: +20%"),
      changeType: "positive",
      icon: TrendingUp,
      color: "cyan",
      description: t("Yıllık gelişim")
    },
    {
      title: t("Kritik Durumlar"),
      value: 2,
      change: t("Acil"),
      changeType: "negative",
      icon: AlertTriangle,
      color: "red",
      description: t("Dikkat gerekiyor")
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200", 
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
      cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
      red: "bg-red-50 text-red-700 border-red-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconBgColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600", 
      purple: "bg-purple-100 text-purple-600",
      emerald: "bg-emerald-100 text-emerald-600",
      indigo: "bg-indigo-100 text-indigo-600",
      cyan: "bg-cyan-100 text-cyan-600",
      red: "bg-red-100 text-red-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <Card key={index} className={`transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border ${getColorClasses(card.color)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getIconBgColor(card.color)}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <Badge 
                variant={card.changeType === 'positive' ? 'default' : card.changeType === 'negative' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {card.change}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}