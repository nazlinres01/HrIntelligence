import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Building,
  FileText,
  Download
} from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: any;
  color: string;
}

export function KPICard({ title, value, change, changeType, icon: Icon, color }: KPICardProps) {
  const getChangeIcon = () => {
    if (changeType === "increase") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (changeType === "decrease") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              {change !== 0 && (
                <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
                  {getChangeIcon()}
                  <span className="text-sm font-medium">{Math.abs(change)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DepartmentPerformanceProps {
  departments: Array<{
    name: string;
    performance: number;
    employees: number;
    budget: number;
    utilization: number;
  }>;
}

export function DepartmentPerformance({ departments }: DepartmentPerformanceProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <span>Departman Performansı</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                <Badge 
                  variant={dept.performance >= 4.0 ? "default" : dept.performance >= 3.5 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {dept.performance.toFixed(1)}/5.0
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Çalışan Sayısı</p>
                  <p className="font-semibold">{dept.employees}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bütçe Kullanımı</p>
                  <p className="font-semibold">{dept.utilization}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Performans</p>
                  <Progress value={dept.performance * 20} className="w-full h-2 mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ComplianceOverviewProps {
  complianceMetrics: {
    trainingCompliance: number;
    documentCompliance: number;
    policyCompliance: number;
    auditScore: number;
  };
}

export function ComplianceOverview({ complianceMetrics }: ComplianceOverviewProps) {
  const metrics = [
    {
      label: "Eğitim Uygunluğu",
      value: complianceMetrics.trainingCompliance,
      icon: Target,
      target: 90
    },
    {
      label: "Belge Uygunluğu", 
      value: complianceMetrics.documentCompliance,
      icon: FileText,
      target: 95
    },
    {
      label: "Politika Uygunluğu",
      value: complianceMetrics.policyCompliance,
      icon: CheckCircle,
      target: 100
    },
    {
      label: "Denetim Puanı",
      value: complianceMetrics.auditScore,
      icon: Award,
      target: 85
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Uygunluk ve Kalite</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isCompliant = metric.value >= metric.target;
            
            return (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isCompliant ? 'text-green-600' : 'text-yellow-600'}`} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  {!isCompliant && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Mevcut: {metric.value}%</span>
                    <span className="text-gray-600">Hedef: {metric.target}%</span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`w-full h-2 ${isCompliant ? 'bg-green-100' : 'bg-yellow-100'}`} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionsProps {
  onGenerateReport: (type: string) => void;
  onExportData: (module: string) => void;
}

export function QuickActions({ onGenerateReport, onExportData }: QuickActionsProps) {
  const actions = [
    {
      label: "Aylık Performans Raporu",
      description: "Detaylı performans analizi",
      action: () => onGenerateReport("performance"),
      icon: BarChart3,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      label: "Bordro Raporu",
      description: "Maaş ve ödemeler özeti",
      action: () => onGenerateReport("payroll"),
      icon: DollarSign,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      label: "İzin Durumu Raporu",
      description: "Çalışan izin analizi",
      action: () => onGenerateReport("leaves"),
      icon: Calendar,
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      label: "Çalışan Verileri",
      description: "Tüm çalışan bilgileri",
      action: () => onExportData("employees"),
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Hızlı İşlemler</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-left">{action.label}</span>
                </div>
                <p className="text-xs text-gray-600 text-left">{action.description}</p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}