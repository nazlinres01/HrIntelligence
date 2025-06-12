import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Database,
  Server,
  Wifi,
  Clock,
  Activity,
  Cpu,
  HardDrive,
  MemoryStick
} from "lucide-react";

export default function TestPage() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const runSystemTests = async () => {
    setIsTestRunning(true);
    const tests = [
      { name: "Veritabanı Bağlantısı", status: "running", duration: 0 },
      { name: "API Endpoint'leri", status: "pending", duration: 0 },
      { name: "Kimlik Doğrulama", status: "pending", duration: 0 },
      { name: "Dosya Sistemi", status: "pending", duration: 0 },
      { name: "Bellek Kullanımı", status: "pending", duration: 0 },
      { name: "Network Bağlantısı", status: "pending", duration: 0 }
    ];

    setTestResults([...tests]);

    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const updatedTests = [...tests];
      updatedTests[i].status = Math.random() > 0.1 ? "passed" : "failed";
      updatedTests[i].duration = Math.floor(Math.random() * 3000) + 500;
      
      if (i < tests.length - 1) {
        updatedTests[i + 1].status = "running";
      }
      
      setTestResults([...updatedTests]);
    }

    setIsTestRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const mockSystemMetrics = {
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 78,
    uptime: "7 gün 14 saat",
    activeUsers: 156,
    apiCalls: 12847,
    dbQueries: 8932
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Test ve Durum</h1>
            <p className="text-gray-600">Sistem sağlığını kontrol edin ve testleri çalıştırın</p>
          </div>
          <Button 
            onClick={runSystemTests}
            disabled={isTestRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isTestRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testler Çalışıyor...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Testleri Başlat
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">CPU Kullanımı</p>
                  <p className="text-3xl font-bold text-blue-900">{mockSystemMetrics.cpu}%</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={mockSystemMetrics.cpu} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Bellek</p>
                  <p className="text-3xl font-bold text-green-900">{mockSystemMetrics.memory}%</p>
                </div>
                <MemoryStick className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={mockSystemMetrics.memory} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Disk</p>
                  <p className="text-3xl font-bold text-orange-900">{mockSystemMetrics.disk}%</p>
                </div>
                <HardDrive className="h-8 w-8 text-orange-600" />
              </div>
              <Progress value={mockSystemMetrics.disk} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Network</p>
                  <p className="text-3xl font-bold text-purple-900">{mockSystemMetrics.network}%</p>
                </div>
                <Wifi className="h-8 w-8 text-purple-600" />
              </div>
              <Progress value={mockSystemMetrics.network} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                Sistem Testleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(test.status)}
                        <span className="font-medium text-gray-900">{test.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {test.duration > 0 && (
                          <span className="text-xs text-gray-500">{test.duration}ms</span>
                        )}
                        <Badge className={getStatusColor(test.status)}>
                          {test.status === "passed" ? "Başarılı" :
                           test.status === "failed" ? "Başarısız" :
                           test.status === "running" ? "Çalışıyor" : "Bekliyor"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Henüz test çalıştırılmadı</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Sistem Metrikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sistem Çalışma Süresi</span>
                  <span className="font-medium text-gray-900">{mockSystemMetrics.uptime}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aktif Kullanıcılar</span>
                  <span className="font-medium text-gray-900">{mockSystemMetrics.activeUsers}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Çağrıları</span>
                  <span className="font-medium text-gray-900">{mockSystemMetrics.apiCalls.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Veritabanı Sorguları</span>
                  <span className="font-medium text-gray-900">{mockSystemMetrics.dbQueries.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Server className="h-5 w-5 mr-2 text-indigo-600" />
              Servis Durumları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Veritabanı</h3>
                <Badge className="bg-green-100 text-green-800 mt-2">Çevrimiçi</Badge>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Web Sunucusu</h3>
                <Badge className="bg-green-100 text-green-800 mt-2">Çevrimiçi</Badge>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Wifi className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">API Gateway</h3>
                <Badge className="bg-green-100 text-green-800 mt-2">Çevrimiçi</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}