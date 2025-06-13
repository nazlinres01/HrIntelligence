import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FileText, 
  Upload, 
  Download,
  Search,
  Plus,
  Eye,
  Share,
  Archive,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Tag,
  FolderOpen
} from "lucide-react";
import { format, isThisYear } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

const documentSchema = z.object({
  title: z.string().min(1, "Doküman başlığı gereklidir"),
  category: z.string().min(1, "Kategori seçiniz"),
  description: z.string().optional(),
  tags: z.string().optional(),
  file: z.any().optional()
});

type DocumentFormData = z.infer<typeof documentSchema>;

const documentCategories = [
  { value: "personal", label: "Kişisel Belgeler", color: "bg-blue-100 text-blue-800" },
  { value: "contracts", label: "Sözleşmeler", color: "bg-green-100 text-green-800" },
  { value: "certificates", label: "Sertifikalar", color: "bg-purple-100 text-purple-800" },
  { value: "training", label: "Eğitim Belgeleri", color: "bg-orange-100 text-orange-800" },
  { value: "performance", label: "Performans Belgeleri", color: "bg-red-100 text-red-800" },
  { value: "payroll", label: "Bordro & Maaş", color: "bg-yellow-100 text-yellow-800" },
  { value: "other", label: "Diğer", color: "bg-gray-100 text-gray-800" }
];

export default function DocumentManagement() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock documents data
  const documentsData = {
    documents: [
      {
        id: 1,
        title: "İş Sözleşmesi",
        fileName: "is-sozlesmesi-2024.pdf",
        category: "contracts",
        description: "2024 yılı iş sözleşmesi belgesi",
        uploadDate: "2024-01-15T09:00:00Z",
        lastModified: "2024-01-15T09:00:00Z",
        size: "245 KB",
        type: "application/pdf",
        status: "approved",
        uploadedBy: "İK Departmanı",
        tags: ["sözleşme", "2024", "iş"],
        downloadCount: 5,
        isRequired: true,
        expiryDate: null
      },
      {
        id: 2,
        title: "React Developer Sertifikası",
        fileName: "react-certificate-2023.pdf",
        category: "certificates",
        description: "Meta React Developer Professional Certificate",
        uploadDate: "2023-08-20T14:30:00Z",
        lastModified: "2023-08-20T14:30:00Z",
        size: "1.2 MB",
        type: "application/pdf",
        status: "approved",
        uploadedBy: "Emre Şahin",
        tags: ["react", "sertifika", "meta"],
        downloadCount: 12,
        isRequired: false,
        expiryDate: "2025-08-20T00:00:00Z"
      },
      {
        id: 3,
        title: "Performans Değerlendirme Raporu",
        fileName: "performans-2023.pdf",
        category: "performance",
        description: "2023 yılı performans değerlendirme sonuçları",
        uploadDate: "2024-01-10T11:00:00Z",
        lastModified: "2024-01-10T11:00:00Z",
        size: "567 KB",
        type: "application/pdf",
        status: "approved",
        uploadedBy: "Ali Özkan",
        tags: ["performans", "değerlendirme", "2023"],
        downloadCount: 3,
        isRequired: false,
        expiryDate: null
      },
      {
        id: 4,
        title: "Kimlik Fotokopisi",
        fileName: "tc-kimlik.pdf",
        category: "personal",
        description: "T.C. Kimlik belgesi fotokopisi",
        uploadDate: "2024-03-15T16:45:00Z",
        lastModified: "2024-03-15T16:45:00Z",
        size: "890 KB",
        type: "application/pdf",
        status: "pending",
        uploadedBy: "Emre Şahin",
        tags: ["kimlik", "kişisel"],
        downloadCount: 1,
        isRequired: true,
        expiryDate: null
      },
      {
        id: 5,
        title: "İngilizce Yeterlilik Belgesi",
        fileName: "toefl-certificate.pdf",
        category: "certificates",
        description: "TOEFL IBT sınav sonuç belgesi",
        uploadDate: "2023-11-05T10:20:00Z",
        lastModified: "2023-11-05T10:20:00Z",
        size: "756 KB",
        type: "application/pdf",
        status: "approved",
        uploadedBy: "Emre Şahin",
        tags: ["toefl", "ingilizce", "dil"],
        downloadCount: 8,
        isRequired: false,
        expiryDate: "2025-11-05T00:00:00Z"
      },
      {
        id: 6,
        title: "Haziran 2024 Bordrosu",
        fileName: "bordro-06-2024.pdf",
        category: "payroll",
        description: "Haziran ayı maaş bordrosu",
        uploadDate: "2024-06-28T08:00:00Z",
        lastModified: "2024-06-28T08:00:00Z",
        size: "234 KB",
        type: "application/pdf",
        status: "approved",
        uploadedBy: "Bordro Sistemi",
        tags: ["bordro", "maaş", "haziran"],
        downloadCount: 2,
        isRequired: false,
        expiryDate: null
      }
    ],
    stats: {
      totalDocuments: 15,
      pendingApproval: 1,
      expiringDocuments: 2,
      storageUsed: "12.4 MB",
      storageLimit: "100 MB"
    }
  };

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      tags: ""
    }
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      return apiRequest("POST", "/api/documents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setIsUploadOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Doküman başarıyla yüklendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Doküman yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: DocumentFormData) => {
    uploadDocumentMutation.mutate(data);
  };

  const downloadDocument = (document: any) => {
    console.log(`Downloading document: ${document.fileName}`);
    toast({
      title: "İndiriliyor",
      description: `${document.title} indiriliyor...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Onaylandı";
      case "pending": return "Beklemede";
      case "rejected": return "Reddedildi";
      default: return status;
    }
  };

  const getCategoryInfo = (category: string) => {
    return documentCategories.find(cat => cat.value === category) || 
           { label: category, color: "bg-gray-100 text-gray-800" };
  };

  const filteredDocuments = documentsData.documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doküman Yönetimi</h1>
          <p className="text-gray-600">Belgelerinizi yükleyin, görüntüleyin ve organize edin</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Doküman Yükle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Doküman Yükle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doküman Başlığı</FormLabel>
                      <FormControl>
                        <Input placeholder="Doküman başlığı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Doküman açıklaması" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiketler</FormLabel>
                      <FormControl>
                        <Input placeholder="Virgülle ayırın: etiket1, etiket2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">Dosyayı buraya sürükleyin veya tıklayın</p>
                  <p className="text-xs text-gray-500 mt-1">Maksimum dosya boyutu: 10MB</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                    Yükle
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Doküman</p>
                <p className="text-2xl font-bold text-gray-900">{documentsData.stats.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onay Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">{documentsData.stats.pendingApproval}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Süresi Yaklaşan</p>
                <p className="text-2xl font-bold text-red-600">{documentsData.stats.expiringDocuments}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Depolama</p>
                <p className="text-2xl font-bold text-gray-900">{documentsData.stats.storageUsed}</p>
                <p className="text-xs text-gray-500">/ {documentsData.stats.storageLimit}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Doküman ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {documentCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="approved">Onaylandı</SelectItem>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="rejected">Reddedildi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Dokümanlarım</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((document) => {
              const categoryInfo = getCategoryInfo(document.category);
              return (
                <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{document.title}</h4>
                        {document.isRequired && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Gerekli</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Boyut: {document.size}</span>
                        <span>Yüklenme: {format(new Date(document.uploadDate), 'dd MMM yyyy')}</span>
                        <span>İndirme: {document.downloadCount}</span>
                        {document.expiryDate && (
                          <span className="text-orange-600">
                            Bitiş: {format(new Date(document.expiryDate), 'dd MMM yyyy')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.label}
                        </Badge>
                        <Badge className={getStatusColor(document.status)}>
                          {getStatusLabel(document.status)}
                        </Badge>
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}