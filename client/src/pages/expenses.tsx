import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CreditCard, 
  Plus, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Receipt,
  Upload,
  DollarSign,
  FileText,
  Car,
  Coffee,
  Plane,
  Hotel
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const expenseSchema = z.object({
  category: z.string().min(1, "Harcama kategorisi seçiniz"),
  amount: z.string().min(1, "Tutar giriniz").refine((val) => !isNaN(Number(val)), "Geçerli bir tutar giriniz"),
  date: z.string().min(1, "Tarih seçiniz"),
  description: z.string().min(5, "Açıklama en az 5 karakter olmalıdır"),
  project: z.string().optional(),
  receipt: z.string().optional()
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const expenseCategories = [
  { value: "travel", label: "Seyahat", icon: Plane, color: "bg-blue-100 text-blue-800" },
  { value: "accommodation", label: "Konaklama", icon: Hotel, color: "bg-purple-100 text-purple-800" },
  { value: "fuel", label: "Yakıt", icon: Car, color: "bg-green-100 text-green-800" },
  { value: "meal", label: "Yemek", icon: Coffee, color: "bg-orange-100 text-orange-800" },
  { value: "office", label: "Ofis Malzemeleri", icon: FileText, color: "bg-gray-100 text-gray-800" },
  { value: "other", label: "Diğer", icon: Receipt, color: "bg-red-100 text-red-800" }
];

const projects = [
  { value: "project_1", label: "Website Yenileme Projesi" },
  { value: "project_2", label: "Mobil Uygulama Geliştirme" },
  { value: "project_3", label: "E-ticaret Platformu" },
  { value: "project_4", label: "Müşteri Portalı" },
  { value: "general", label: "Genel İşler" }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

const statusLabels = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi"
};

export default function Expenses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock data for expense reports
  const mockExpenses = [
    {
      id: 1,
      category: "travel",
      amount: 450.00,
      date: "2024-06-10",
      description: "İstanbul - Ankara uçak bileti (müşteri ziyareti)",
      project: "project_4",
      receipt: "receipt_001.pdf",
      status: "approved",
      approvedBy: "Ali Özkan",
      approvedDate: "2024-06-11",
      currency: "TL"
    },
    {
      id: 2,
      category: "accommodation",
      amount: 280.00,
      date: "2024-06-10",
      description: "Ankara'da 1 gece konaklama",
      project: "project_4",
      receipt: "receipt_002.pdf",
      status: "approved",
      approvedBy: "Ali Özkan",
      approvedDate: "2024-06-11",
      currency: "TL"
    },
    {
      id: 3,
      category: "meal",
      amount: 125.50,
      date: "2024-06-11",
      description: "Müşteri yemeği (3 kişi)",
      project: "project_4",
      receipt: "receipt_003.pdf",
      status: "pending",
      approvedBy: null,
      approvedDate: null,
      currency: "TL"
    },
    {
      id: 4,
      category: "fuel",
      amount: 200.00,
      date: "2024-06-08",
      description: "Ofis araç yakıt masrafı",
      project: "general",
      receipt: "receipt_004.pdf",
      status: "rejected",
      approvedBy: "Ali Özkan",
      approvedDate: "2024-06-09",
      currency: "TL",
      rejectionReason: "Yakıt masrafları şirket kartı ile yapılmalıdır"
    }
  ];

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      project: "",
      receipt: ""
    }
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      return apiRequest("POST", "/api/expenses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Harcama talebiniz başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Harcama talebi oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ExpenseFormData) => {
    createExpenseMutation.mutate(data);
  };

  const getCategoryLabel = (categoryValue: string) => {
    return expenseCategories.find(c => c.value === categoryValue)?.label || categoryValue;
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = expenseCategories.find(c => c.value === categoryValue);
    return category?.icon || Receipt;
  };

  const getCategoryColor = (categoryValue: string) => {
    return expenseCategories.find(c => c.value === categoryValue)?.color || "bg-gray-100 text-gray-800";
  };

  const getProjectLabel = (projectValue: string) => {
    return projects.find(p => p.value === projectValue)?.label || projectValue;
  };

  const filteredExpenses = selectedFilter === "all" 
    ? mockExpenses 
    : mockExpenses.filter(expense => expense.status === selectedFilter);

  const expenseStats = {
    totalAmount: mockExpenses.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0),
    pending: mockExpenses.filter(e => e.status === "pending").length,
    approved: mockExpenses.filter(e => e.status === "approved").length,
    rejected: mockExpenses.filter(e => e.status === "rejected").length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Harcama Talepleri</h1>
          <p className="text-gray-600">Harcama taleplerinizi yönetin ve takip edin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Harcama Talebi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Harcama Talebi</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harcama Kategorisi</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center gap-2">
                                  <category.icon className="w-4 h-4" />
                                  {category.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tutar (TL)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarih</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proje (Opsiyonel)</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Proje seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.value} value={project.value}>
                                {project.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                        <Textarea 
                          placeholder="Harcamanın detaylarını açıklayınız" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiş/Fatura</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Fiş veya fatura yükleyin</p>
                          <Input type="file" accept="image/*,application/pdf" className="hidden" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                    Talep Oluştur
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Onaylanan Toplam</p>
                <p className="text-lg font-semibold text-gray-900">₺{expenseStats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Onaylanan</p>
                <p className="text-lg font-semibold text-gray-900">{expenseStats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Beklemede</p>
                <p className="text-lg font-semibold text-gray-900">{expenseStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reddedilen</p>
                <p className="text-lg font-semibold text-gray-900">{expenseStats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("all")}
          className={selectedFilter === "all" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Tümü
        </Button>
        <Button
          variant={selectedFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("pending")}
          className={selectedFilter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Beklemede
        </Button>
        <Button
          variant={selectedFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("approved")}
          className={selectedFilter === "approved" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Onaylanan
        </Button>
        <Button
          variant={selectedFilter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("rejected")}
          className={selectedFilter === "rejected" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Reddedilen
        </Button>
      </div>

      {/* Expense Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Harcama Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Bu kategoride harcama talebi bulunmuyor</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => {
                const CategoryIcon = getCategoryIcon(expense.category);
                return (
                  <div key={expense.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${getCategoryColor(expense.category)}`}>
                              <CategoryIcon className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{getCategoryLabel(expense.category)}</span>
                          </div>
                          <Badge className={statusColors[expense.status as keyof typeof statusColors]}>
                            {statusLabels[expense.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(expense.date), "dd/MM/yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">₺{expense.amount.toFixed(2)}</span>
                          </div>
                          {expense.project && (
                            <div className="text-blue-600">
                              {getProjectLabel(expense.project)}
                            </div>
                          )}
                        </div>
                      </div>
                      {expense.receipt && (
                        <Button size="sm" variant="outline">
                          <Receipt className="w-4 h-4 mr-1" />
                          Fiş
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Açıklama:</strong> {expense.description}
                    </div>
                    {expense.status === "pending" && (
                      <div className="flex items-center gap-2 text-sm text-yellow-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Yönetici onayı bekleniyor</span>
                      </div>
                    )}
                    {expense.status === "rejected" && expense.rejectionReason && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span>Red nedeni: {expense.rejectionReason}</span>
                      </div>
                    )}
                    {expense.status === "approved" && expense.approvedBy && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{expense.approvedBy} tarafından onaylandı</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}