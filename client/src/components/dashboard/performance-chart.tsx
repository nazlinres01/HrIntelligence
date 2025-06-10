import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export function PerformanceChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/performance-chart"],
  });

  if (isLoading) {
    return (
      <Card className="hr-stat-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Departman Performansı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hr-stat-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Departman Performansı</CardTitle>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="px-3 py-1 text-sm">
              Aylık
            </Button>
            <Button variant="ghost" size="sm" className="px-3 py-1 text-sm">
              Çeyreklik
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="department" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Bar 
                dataKey="score" 
                fill="#1976D2" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
