import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, User, Calendar, Briefcase, Plus, Edit, Eye, Download, Upload } from "lucide-react";

export default function PersonnelAffairsPage() {
  const personnelFiles = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "Ahmet Yılmaz",
      department: "Yazılım Geliştirme",
      position: "Senior Developer",
      hireDate: "2020-03-15",
      contractType: "Belirsiz Süreli",
      status: "aktif",
      lastUpdate: "2024-06-10",
      documents: {
        contract: true,
        cv: true,
        diploma: true,
        healthReport: true,
        references: true
      }
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Ayşe Kaya",
      department: "İnsan Kaynakları",
      position: "İK Uzmanı",
      hireDate: "2021-08-22",
      contractType: "Belirsiz Süreli",
      status: "aktif",
      lastUpdate: "2024-06-12",
      documents: {
        contract: true,
        cv: true,
        diploma: false,
        healthReport: true,
        references: true
      }
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Mehmet Öz",
      department: "Pazarlama",
      position: "Pazarlama Müdürü",
      hireDate: "2019-11-08",
      contractType: "Belirsiz Süreli",
      status: "izinde",
      lastUpdate: "2024-06-05",
      documents: {
        contract: true,
        cv: true,
        diploma: true,
        healthReport: true,
        references: true
      }
    }
  ];

  const pendingActions = [
    {
      id: 1,
      type: "contract_renewal",
      employeeName: "Fatma Demir",
      description: "Sözleşme yenileme - 6 aylık deneme süresi bitti",
      dueDate: "2024-06-20",
      priority: "yüksek",
      assignedTo: "Ayşe Kaya"
    },
    {
      id: 2,
      type: "document_missing",
      employeeName: "Can Arslan",
      description: "Eksik belge - Sağlık raporu",
      dueDate: "2024-06-25",
      priority: "orta",
      assignedTo: "Ayşe Kaya"
    },
    {
      id: 3,
      type: "position_change",
      employeeName: "Zeynep Aktaş",
      description: "Pozisyon değişikliği - Junior'dan Mid-level'a terfi",
      dueDate: "2024-06-18",
      priority: "yüksek",
      assignedTo: "Ayşe Kaya"
    }
  ];

  const documentTypes = [
    { name: "İş Sözleşmesi", required: true, icon: FileText },
    { name: "Özgeçmiş", required: true, icon: User },
    { name: "Diploma/Sertifika", required: false, icon: Briefcase },
    { name: "Sağlık Raporu", required: true, icon: Calendar },
    { name: "Referans Mektupları", required: false, icon: FileText }
  ];

  const stats = [
    {
      title: "Toplam Personel Dosyası",
      value: "147",
      trend: "+3 bu ay",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Bekleyen İşlemler",
      value: "8",
      trend: "-2 geçen hafta",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Eksik Belgeler",
      value: "12",
      trend: "+1 bu hafta",
      icon: User,
      color: "text-red-600"
    },
    {
      title: "Sözleşme Yenilemeleri",
      value: "5",
      trend: "Bu ay içinde",
      icon: Briefcase,
      color: "text-green-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800">🟢 Aktif</Badge>;
      case 'izinde':
        return <Badge className="bg-blue-100 text-blue-800">🏖️ İzinde</Badge>;
      case 'ayrıldı':
        return <Badge className="bg-gray-100 text-gray-800">❌ Ayrıldı</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'yüksek':
        return <Badge className="bg-red-100 text-red-800">🔴 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Orta</Badge>;
      case 'düşük':
        return <Badge className="bg-green-100 text-green-800">🟢 Düşük</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Özlük İşleri</h1>
            <p className="text-gray-600">Personel dosyaları ve özlük işlemlerini yönetin</p>
          </div>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Personel Dosyası
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Toplu Belge Yükleme
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Personel Dosyaları</TabsTrigger>
            <TabsTrigger value="pending">Bekleyen İşlemler</TabsTrigger>
            <TabsTrigger value="documents">Belge Yönetimi</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Personel Dosyaları</h2>
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Personel ara..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {personnelFiles.map((file) => (
                <Card key={file.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{file.employeeName}</CardTitle>
                        <CardDescription className="mt-1">
                          {file.position} - {file.department}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(file.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Personel No:</span>
                        <p className="font-medium">{file.employeeId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">İşe Giriş:</span>
                        <p className="font-medium">{file.hireDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sözleşme Türü:</span>
                        <p className="font-medium">{file.contractType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Son Güncelleme:</span>
                        <p className="font-medium">{file.lastUpdate}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Belgeler:</span>
                      <div className="flex gap-2 mt-2">
                        {Object.entries(file.documents).map(([doc, exists]) => (
                          <Badge key={doc} variant={exists ? "default" : "outline"} className={exists ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {exists ? "✓" : "✗"} {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Button>
                        <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                        <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Download className="h-4 w-4 mr-1" />
                          İndir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Bekleyen İşlemler</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Yeni İşlem Ekle
              </Button>
            </div>

            <div className="grid gap-6">
              {pendingActions.map((action) => (
                <Card key={action.id} className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{action.employeeName}</CardTitle>
                        <CardDescription className="mt-1">{action.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getPriorityBadge(action.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Sorumlu:</span>
                        <p className="font-medium">{action.assignedTo}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Son Tarih:</span>
                        <p className="font-medium">{action.dueDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">İşlem Türü:</span>
                        <p className="font-medium">{action.type.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        Detaylar
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        İşlemi Tamamla
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Belge Türleri Yönetimi</h2>
            
            <div className="grid gap-6">
              {documentTypes.map((docType, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <docType.icon className="h-8 w-8 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{docType.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {docType.required ? "Zorunlu belge" : "İsteğe bağlı belge"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={docType.required ? "default" : "outline"}>
                          {docType.required ? "Zorunlu" : "İsteğe Bağlı"}
                        </Badge>
                        <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          Şablonu İndir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}