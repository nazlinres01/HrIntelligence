import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, FileText, Download, Upload, Plus, Edit, Eye, Folder, Calendar, User } from "lucide-react";

export default function HRDocumentationPage() {
  const documentCategories = [
    {
      id: 1,
      name: "Politikalar ve Prosedürler",
      description: "Şirket politikaları ve iş süreçleri",
      documentCount: 24,
      lastUpdated: "2024-06-10",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      id: 2,
      name: "İş Sözleşmeleri",
      description: "Personel sözleşme şablonları",
      documentCount: 8,
      lastUpdated: "2024-06-05",
      icon: User,
      color: "text-green-600"
    },
    {
      id: 3,
      name: "Eğitim Materyalleri",
      description: "Oryantasyon ve gelişim dokümanları",
      documentCount: 16,
      lastUpdated: "2024-06-12",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      id: 4,
      name: "Formlar ve Başvurular",
      description: "İK form şablonları",
      documentCount: 12,
      lastUpdated: "2024-06-08",
      icon: Folder,
      color: "text-orange-600"
    }
  ];

  const recentDocuments = [
    {
      id: 1,
      name: "Uzaktan Çalışma Politikası",
      category: "Politikalar",
      type: "PDF",
      size: "2.4 MB",
      version: "v2.1",
      lastModified: "2024-06-12",
      author: "Ayşe Kaya",
      status: "aktif",
      downloads: 45
    },
    {
      id: 2,
      name: "Yeni Çalışan Oryantasyon Kılavuzu",
      category: "Eğitim",
      type: "DOCX",
      size: "1.8 MB",
      version: "v3.0",
      lastModified: "2024-06-10",
      author: "Mehmet Öz",
      status: "aktif",
      downloads: 32
    },
    {
      id: 3,
      name: "İzin Talep Formu",
      category: "Formlar",
      type: "PDF",
      size: "524 KB",
      version: "v1.5",
      lastModified: "2024-06-08",
      author: "Selin Koca",
      status: "aktif",
      downloads: 78
    },
    {
      id: 4,
      name: "Performans Değerlendirme Şablonu",
      category: "Formlar",
      type: "XLSX",
      size: "892 KB",
      version: "v2.0",
      lastModified: "2024-06-05",
      author: "Ayşe Kaya",
      status: "revizyon_bekliyor",
      downloads: 23
    }
  ];

  const documentTemplates = [
    {
      id: 1,
      name: "İş Sözleşmesi Şablonu",
      description: "Standart iş sözleşmesi şablonu",
      category: "Sözleşmeler",
      language: "Türkçe",
      format: "DOCX"
    },
    {
      id: 2,
      name: "İzin Talep Formu",
      description: "Çalışan izin talep formu",
      category: "Formlar",
      language: "Türkçe",
      format: "PDF"
    },
    {
      id: 3,
      name: "Disiplin Prosedürü",
      description: "Disiplin işlemleri rehberi",
      category: "Prosedürler",
      language: "Türkçe",
      format: "PDF"
    },
    {
      id: 4,
      name: "Exit Interview Formu",
      description: "Çıkış görüşmesi değerlendirme formu",
      category: "Formlar",
      language: "Türkçe",
      format: "DOCX"
    }
  ];

  const stats = [
    {
      title: "Toplam Doküman",
      value: "156",
      trend: "+8 bu ay",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Aktif Politikalar",
      value: "24",
      trend: "2 güncellendi",
      icon: User,
      color: "text-green-600"
    },
    {
      title: "Bu Ay İndirilen",
      value: "247",
      trend: "+15% artış",
      icon: Download,
      color: "text-purple-600"
    },
    {
      title: "Bekleyen Onaylar",
      value: "3",
      trend: "Hızlı onay gerekli",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800">✅ Aktif</Badge>;
      case 'revizyon_bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Revizyon Bekliyor</Badge>;
      case 'arşivlendi':
        return <Badge className="bg-gray-100 text-gray-800">📁 Arşivlendi</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İK Dokümantasyonu</h1>
            <p className="text-gray-600">İnsan kaynakları dokümanlarını yönetin ve organize edin</p>
          </div>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Doküman
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Doküman Ekle</DialogTitle>
                  <DialogDescription>
                    Yeni bir İK dokümanı yükleyin veya oluşturun
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Doküman adı" />
                  <Input placeholder="Kategori" />
                  <div className="flex gap-2">
                    <Button variant="lightgray" className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Dosya Yükle
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Kaydet
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="lightgray" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              <Upload className="h-4 w-4 mr-2" />
              Toplu Yükleme
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

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="recent">Son Dokümanlar</TabsTrigger>
            <TabsTrigger value="templates">Şablonlar</TabsTrigger>
            <TabsTrigger value="archive">Arşiv</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Doküman Kategorileri</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Kategorilerde ara..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentCategories.map((category) => (
                <Card key={category.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <category.icon className={`h-8 w-8 ${category.color}`} />
                        <div>
                          <CardTitle className="text-xl text-gray-800">{category.name}</CardTitle>
                          <CardDescription className="mt-1">{category.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Doküman Sayısı:</span>
                        <p className="font-medium">{category.documentCount} adet</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Son Güncelleme:</span>
                        <p className="font-medium">{category.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="lightgray" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Görüntüle
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Yönet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Son Dokümanlar</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Doküman ara..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {recentDocuments.map((doc) => (
                <Card key={doc.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{doc.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {doc.category} • {doc.type} • {doc.size}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(doc.status)}
                        <Badge variant="lightgray">{doc.version}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Yazar:</span>
                        <p className="font-medium">{doc.author}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Son Değişiklik:</span>
                        <p className="font-medium">{doc.lastModified}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">İndirme:</span>
                        <p className="font-medium">{doc.downloads} kez</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Dosya Türü:</span>
                        <p className="font-medium">{doc.type}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                        <Button variant="lightgray" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Eye className="h-4 w-4 mr-1" />
                          Önizle
                        </Button>
                        <Button variant="lightgray" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Download className="h-4 w-4 mr-1" />
                          İndir
                        </Button>
                        <Button variant="lightgray" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Doküman Şablonları</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Şablon
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge variant="lightgray">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Dil:</span>
                        <p className="font-medium">{template.language}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Format:</span>
                        <p className="font-medium">{template.format}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="lightgray" size="sm" className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50">
                        <Download className="h-4 w-4 mr-1" />
                        İndir
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archive" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Arşivlenen Dokümanlar</h2>
            
            <Card>
              <CardContent className="p-8 text-center">
                <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Arşiv Boş</h3>
                <p className="text-gray-600">
                  Henüz arşivlenen doküman bulunmamaktadır.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}