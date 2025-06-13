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
  FolderOpen,
  Edit,
  Star,
  Filter,
  Grid,
  List,
  MoreVertical
} from "lucide-react";
import { format, isThisWeek, isThisMonth } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

const documentSchema = z.object({
  title: z.string().min(1, "Doküman başlığı gereklidir"),
  category: z.string().min(1, "Kategori seçiniz"),
  description: z.string().optional(),
  tags: z.string().optional(),
  isPrivate: z.boolean().optional()
});

type DocumentFormData = z.infer<typeof documentSchema>;

const documentCategories = [
  { value: "work", label: "İş Belgeleri", color: "bg-blue-100 text-blue-800", icon: "💼" },
  { value: "personal", label: "Kişisel Belgeler", color: "bg-green-100 text-green-800", icon: "👤" },
  { value: "certificates", label: "Sertifikalar", color: "bg-purple-100 text-purple-800", icon: "🏆" },
  { value: "contracts", label: "Sözleşmeler", color: "bg-orange-100 text-orange-800", icon: "📋" },
  { value: "reports", label: "Raporlar", color: "bg-red-100 text-red-800", icon: "📊" },
  { value: "presentations", label: "Sunumlar", color: "bg-yellow-100 text-yellow-800", icon: "📽️" },
  { value: "templates", label: "Şablonlar", color: "bg-pink-100 text-pink-800", icon: "📝" },
  { value: "archive", label: "Arşiv", color: "bg-gray-100 text-gray-800", icon: "📦" }
];

export default function MyDocuments() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("date");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock documents data - personal documents for employee
  const documentsData = {
    documents: [
      {
        id: 1,
        title: "React Projesi Teknik Dokümantasyon",
        fileName: "react-project-docs.pdf",
        category: "work",
        description: "Frontend projesi için hazırladığım teknik dokümantasyon",
        uploadDate: "2024-06-10T09:00:00Z",
        lastModified: "2024-06-12T14:30:00Z",
        size: "2.4 MB",
        type: "application/pdf",
        status: "active",
        isPrivate: false,
        isStarred: true,
        tags: ["react", "frontend", "dokümantasyon"],
        downloadCount: 8,
        views: 24,
        sharedWith: ["Ali Özkan", "Ayşe Demir"],
        lastAccessed: "2024-06-12T16:45:00Z"
      },
      {
        id: 2,
        title: "Meta React Developer Sertifikası",
        fileName: "meta-react-certificate.pdf",
        category: "certificates",
        description: "Coursera üzerinden aldığım Meta React Developer Professional Certificate",
        uploadDate: "2023-08-20T14:30:00Z",
        lastModified: "2023-08-20T14:30:00Z",
        size: "1.8 MB",
        type: "application/pdf",
        status: "active",
        isPrivate: false,
        isStarred: true,
        tags: ["react", "sertifika", "meta", "coursera"],
        downloadCount: 15,
        views: 32,
        sharedWith: ["Mehmet Kaya"],
        lastAccessed: "2024-05-15T10:20:00Z"
      },
      {
        id: 3,
        title: "Performans Değerlendirme Notlarım",
        fileName: "performance-notes-2024.docx",
        category: "personal",
        description: "2024 yılı performans değerlendirmesi için hazırladığım notlar",
        uploadDate: "2024-06-01T11:00:00Z",
        lastModified: "2024-06-08T16:20:00Z",
        size: "456 KB",
        type: "application/docx",
        status: "active",
        isPrivate: true,
        isStarred: false,
        tags: ["performans", "notlar", "2024"],
        downloadCount: 3,
        views: 12,
        sharedWith: [],
        lastAccessed: "2024-06-08T16:25:00Z"
      },
      {
        id: 4,
        title: "Frontend Best Practices Sunum",
        fileName: "frontend-best-practices.pptx",
        category: "presentations",
        description: "Takım toplantısında sunduğum frontend best practices sunumu",
        uploadDate: "2024-05-25T10:15:00Z",
        lastModified: "2024-05-25T10:15:00Z",
        size: "5.2 MB",
        type: "application/pptx",
        status: "active",
        isPrivate: false,
        isStarred: false,
        tags: ["frontend", "best-practices", "sunum"],
        downloadCount: 22,
        views: 45,
        sharedWith: ["Ali Özkan", "Zeynep Kara", "Frontend Takımı"],
        lastAccessed: "2024-06-05T14:30:00Z"
      },
      {
        id: 5,
        title: "Proje Zaman Çizelgesi Şablonu",
        fileName: "project-timeline-template.xlsx",
        category: "templates",
        description: "Projeler için kullandığım zaman çizelgesi şablonu",
        uploadDate: "2024-04-12T09:30:00Z",
        lastModified: "2024-05-20T11:45:00Z",
        size: "234 KB",
        type: "application/xlsx",
        status: "active",
        isPrivate: false,
        isStarred: true,
        tags: ["şablon", "proje", "timeline"],
        downloadCount: 12,
        views: 28,
        sharedWith: ["Ali Özkan"],
        lastAccessed: "2024-05-20T12:00:00Z"
      },
      {
        id: 6,
        title: "Kod Review Checklist",
        fileName: "code-review-checklist.md",
        category: "work",
        description: "Code review sürecinde kullandığım kontrol listesi",
        uploadDate: "2024-03-18T14:20:00Z",
        lastModified: "2024-04-05T09:15:00Z",
        size: "45 KB",
        type: "text/markdown",
        status: "active",
        isPrivate: false,
        isStarred: false,
        tags: ["code-review", "checklist", "geliştirme"],
        downloadCount: 18,
        views: 56,
        sharedWith: ["Frontend Takımı"],
        lastAccessed: "2024-06-10T15:30:00Z"
      },
      {
        id: 7,
        title: "Eski Proje Arşivi",
        fileName: "legacy-project-archive.zip",
        category: "archive",
        description: "2023 yılında tamamladığım projelerin arşivi",
        uploadDate: "2024-01-15T16:45:00Z",
        lastModified: "2024-01-15T16:45:00Z",
        size: "15.6 MB",
        type: "application/zip",
        status: "archived",
        isPrivate: true,
        isStarred: false,
        tags: ["arşiv", "2023", "projeler"],
        downloadCount: 2,
        views: 5,
        sharedWith: [],
        lastAccessed: "2024-02-20T10:15:00Z"
      }
    ],
    stats: {
      totalDocuments: 7,
      totalSize: "25.7 MB",
      recentUploads: 2,
      sharedDocuments: 5,
      starredDocuments: 3,
      storageUsed: 25.7,
      storageLimit: 100
    },
    recentActivity: [
      {
        action: "modified",
        document: "React Projesi Teknik Dokümantasyon",
        date: "2024-06-12T14:30:00Z",
        user: "Sen"
      },
      {
        action: "viewed",
        document: "Kod Review Checklist",
        date: "2024-06-10T15:30:00Z",
        user: "Ali Özkan"
      },
      {
        action: "shared",
        document: "Frontend Best Practices Sunum",
        date: "2024-06-05T14:30:00Z",
        user: "Sen"
      }
    ]
  };

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      tags: "",
      isPrivate: false
    }
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      return apiRequest("POST", "/api/my-documents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-documents"] });
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

  const toggleStar = (documentId: number) => {
    toast({
      title: "Güncellendi",
      description: "Favori durumu güncellendi",
    });
  };

  const shareDocument = (document: any) => {
    toast({
      title: "Paylaşım Linki",
      description: `${document.title} paylaşım linki panoya kopyalandı`,
    });
  };

  const getCategoryInfo = (category: string) => {
    return documentCategories.find(cat => cat.value === category) || 
           { label: category, color: "bg-gray-100 text-gray-800", icon: "📄" };
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("doc")) return "📝";
    if (type.includes("sheet") || type.includes("excel")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📽️";
    if (type.includes("image")) return "🖼️";
    if (type.includes("zip") || type.includes("archive")) return "📦";
    return "📄";
  };

  const filteredDocuments = documentsData.documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "starred" && doc.isStarred) ||
                         (selectedStatus === "private" && doc.isPrivate) ||
                         (selectedStatus === "shared" && doc.sharedWith.length > 0);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "size":
        return parseFloat(b.size) - parseFloat(a.size);
      case "type":
        return a.type.localeCompare(b.type);
      case "date":
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokümanlarım</h1>
          <p className="text-gray-600">Kişisel belgelerinizi yönetin ve organize edin</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Doküman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Doküman Yükle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
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
                              {category.icon} {category.label}
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
                        <Input placeholder="etiket1, etiket2, etiket3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">Dosyayı buraya sürükleyin</p>
                  <p className="text-xs text-gray-500 mt-1">Maksimum 10MB</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-xl font-bold">{documentsData.stats.totalDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favoriler</p>
                <p className="text-xl font-bold">{documentsData.stats.starredDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Share className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paylaşılan</p>
                <p className="text-xl font-bold">{documentsData.stats.sharedDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Boyut</p>
                <p className="text-xl font-bold">{documentsData.stats.totalSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Son Yüklenen</p>
                <p className="text-xl font-bold">{documentsData.stats.recentUploads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="starred">Favoriler</SelectItem>
                  <SelectItem value="private">Özel</SelectItem>
                  <SelectItem value="shared">Paylaşılan</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Tarihe Göre</SelectItem>
                  <SelectItem value="name">İsme Göre</SelectItem>
                  <SelectItem value="size">Boyuta Göre</SelectItem>
                  <SelectItem value="type">Türe Göre</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Dokümanlarım ({sortedDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDocuments.map((document) => {
                const categoryInfo = getCategoryInfo(document.category);
                return (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getFileIcon(document.type)}</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm truncate">{document.title}</h4>
                            <p className="text-xs text-gray-500">{document.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStar(document.id)}
                            className="p-1"
                          >
                            <Star className={`h-4 w-4 ${document.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{document.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.label}
                        </Badge>
                        {document.isPrivate && (
                          <Badge variant="outline" className="text-xs">Özel</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <p>Değiştirilme: {format(new Date(document.lastModified), 'dd MMM yyyy')}</p>
                        <p>Görüntüleme: {document.views} • İndirme: {document.downloadCount}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => downloadDocument(document)}>
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => shareDocument(document)}>
                            <Share className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedDocuments.map((document) => {
                const categoryInfo = getCategoryInfo(document.category);
                return (
                  <div key={document.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="text-xl">{getFileIcon(document.type)}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{document.title}</h4>
                          {document.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                          {document.isPrivate && <Badge variant="outline" className="text-xs">Özel</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{document.size}</span>
                          <span>{format(new Date(document.lastModified), 'dd MMM yyyy')}</span>
                          <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => downloadDocument(document)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => shareDocument(document)}>
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}