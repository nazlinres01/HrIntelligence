import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hr-stat-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Toplam Çalışan",
      value: stats?.totalEmployees || 0,
      change: "+12",
      changeText: "bu ay",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Aktif İzinler", 
      value: stats?.activeLeaves || 0,
      change: "+5",
      changeText: "bugün",
      icon: Calendar,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Bu Ay Bordro",
      value: stats?.monthlyPayroll || "₺0",
      change: "+8.5%",
      changeText: "geçen ay",
      icon: DollarSign,
      iconBg: "bg-green-100", 
      iconColor: "text-green-600"
    },
    {
      title: "Ortalama Performans",
      value: stats?.avgPerformance || "0.0",
      change: "+0.3",
      changeText: "bu çeyrek",
      icon: TrendingUp,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <Card key={index} className="hr-stat-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  <span className="text-gray-500 text-sm ml-1">{stat.changeText}</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor}`} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
