import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Download, 
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  Calculator,
  PieChart,
  CreditCard,
  Banknote,
  Receipt
} from "lucide-react";
import { format, subMonths } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function MyPayroll() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const { user } = useAuth();

  // Mock payroll data for employee
  const payrollData = {
    currentMonth: {
      grossSalary: 18500,
      netSalary: 13542,
      currency: "TL",
      paymentDate: "2024-06-28",
      deductions: {
        tax: 2775,
        socialSecurity: 1628,
        unemployment: 185,
        other: 370
      },
      allowances: {
        mealAllowance: 1200,
        transportAllowance: 800,
        performanceBonus: 2500,
        other: 0
      }
    },
    yearlyStats: {
      totalEarned: 162084,
      totalTax: 24933,
      totalDeductions: 20251,
      averageNetSalary: 13507,
      bonusesReceived: 15000,
      taxRefund: 0
    },
    payrollHistory: [
      {
        id: "pay_2024_06",
        month: "Haziran 2024",
        grossSalary: 18500,
        netSalary: 13542,
        paymentDate: "2024-06-28",
        status: "paid",
        overtimeHours: 8,
        overtimePay: 800
      },
      {
        id: "pay_2024_05",
        month: "Mayıs 2024",
        grossSalary: 17500,
        netSalary: 12894,
        paymentDate: "2024-05-30",
        status: "paid",
        overtimeHours: 4,
        overtimePay: 400
      },
      {
        id: "pay_2024_04",
        month: "Nisan 2024",
        grossSalary: 17500,
        netSalary: 12894,
        paymentDate: "2024-04-30",
        status: "paid",
        overtimeHours: 0,
        overtimePay: 0
      },
      {
        id: "pay_2024_03",
        month: "Mart 2024",
        grossSalary: 17500,
        netSalary: 12894,
        paymentDate: "2024-03-29",
        status: "paid",
        overtimeHours: 12,
        overtimePay: 1200
      },
      {
        id: "pay_2024_02",
        month: "Şubat 2024",
        grossSalary: 17500,
        netSalary: 12894,
        paymentDate: "2024-02-29",
        status: "paid",
        overtimeHours: 6,
        overtimePay: 600
      },
      {
        id: "pay_2024_01",
        month: "Ocak 2024",
        grossSalary: 17500,
        netSalary: 12894,
        paymentDate: "2024-01-31",
        status: "paid",
        overtimeHours: 0,
        overtimePay: 0
      }
    ],
    payrollEvents: [
      {
        id: "evt_001",
        date: "2024-06-15",
        type: "bonus",
        title: "Performans Primi",
        description: "Q2 hedeflerin %120'sini tamamladığın için performans primi",
        amount: 2500,
        status: "ödendi",
        category: "ek_ödeme"
      },
      {
        id: "evt_002", 
        date: "2024-06-10",
        type: "overtime",
        title: "Fazla Mesai Ödemesi",
        description: "Mayıs ayı 8 saat fazla mesai ödemesi",
        amount: 800,
        status: "ödendi",
        category: "fazla_mesai"
      },
      {
        id: "evt_003",
        date: "2024-05-28",
        type: "allowance",
        title: "Yemek Yardımı Artışı",
        description: "Aylık yemek yardımı 1000 TL'den 1200 TL'ye yükseltildi",
        amount: 200,
        status: "aktif",
        category: "sosyal_hak"
      },
      {
        id: "evt_004",
        date: "2024-05-15",
        type: "deduction",
        title: "Bireysel Emeklilik Primi",
        description: "BES katkı payı kesintisi başlatıldı",
        amount: -350,
        status: "aktif",
        category: "kesinti"
      },
      {
        id: "evt_005",
        date: "2024-04-01",
        type: "raise",
        title: "Maaş Artışı",
        description: "Yıllık performans değerlendirmesi sonucu %8 maaş artışı",
        amount: 1300,
        status: "uygulandı",
        category: "maaş_artışı"
      },
      {
        id: "evt_006",
        date: "2024-03-20",
        type: "bonus",
        title: "Proje Tamamlama Bonusu",
        description: "CRM projesi başarıyla tamamlandığı için takım bonusu",
        amount: 1500,
        status: "ödendi",
        category: "ek_ödeme"
      },
      {
        id: "evt_007",
        date: "2024-03-01",
        type: "allowance",
        title: "Ulaşım Yardımı Güncelleme",
        description: "İş yeri değişikliği nedeniyle ulaşım yardımı artırıldı",
        amount: 200,
        status: "aktif",
        category: "sosyal_hak"
      },
      {
        id: "evt_008",
        date: "2024-02-14",
        type: "overtime",
        title: "Şubat Fazla Mesai",
        description: "Şubat ayı 6 saat fazla mesai ödemesi",
        amount: 600,
        status: "ödendi",
        category: "fazla_mesai"
      }
    ]
  };

  const currentPayroll = payrollData.currentMonth;
  const deductionTotal = Object.values(currentPayroll.deductions).reduce((sum, val) => sum + val, 0);
  const allowanceTotal = Object.values(currentPayroll.allowances).reduce((sum, val) => sum + val, 0);

  const downloadPayslip = (payrollId: string) => {
    // Mock download functionality
    console.log(`Downloading payslip for ${payrollId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bordro & Maaş Bilgilerim</h1>
          <p className="text-gray-600">Maaş bilgilerinizi ve bordro geçmişinizi görüntüleyin</p>
        </div>
        <Button variant="lightgray">
          <Download className="w-4 h-4 mr-2" />
          Bu Ayın Bordrosu
        </Button>
      </div>

      {/* Current Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Net Maaş</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{currentPayroll.netSalary.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ödeme: {format(new Date(currentPayroll.paymentDate), 'dd MMM yyyy')}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Brüt Maaş</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{currentPayroll.grossSalary.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Ana maaş</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Toplam Kesinti</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{deductionTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Vergi & SSK</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Ek Ödemeler</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{allowanceTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Prim & Yardım</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deductions Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Kesintiler Detayı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Gelir Vergisi</span>
                  <span className="text-red-600 font-semibold">₺{currentPayroll.deductions.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">SGK Primi</span>
                  <span className="text-red-600 font-semibold">₺{currentPayroll.deductions.socialSecurity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">İşsizlik Sigortası</span>
                  <span className="text-red-600 font-semibold">₺{currentPayroll.deductions.unemployment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Diğer Kesintiler</span>
                  <span className="text-red-600 font-semibold">₺{currentPayroll.deductions.other.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>Toplam Kesinti</span>
                    <span className="text-red-600">₺{deductionTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allowances Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Ek Ödemeler Detayı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Yemek Yardımı</span>
                  <span className="text-green-600 font-semibold">₺{currentPayroll.allowances.mealAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Ulaşım Yardımı</span>
                  <span className="text-green-600 font-semibold">₺{currentPayroll.allowances.transportAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Performans Primi</span>
                  <span className="text-green-600 font-semibold">₺{currentPayroll.allowances.performanceBonus.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>Toplam Ek Ödeme</span>
                    <span className="text-green-600">₺{allowanceTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Yıllık Özet (2024)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Toplam Kazanç</span>
                  <span className="font-semibold">₺{payrollData.yearlyStats.totalEarned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Toplam Vergi</span>
                  <span className="font-semibold text-red-600">₺{payrollData.yearlyStats.totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ortalama Net Maaş</span>
                  <span className="font-semibold">₺{payrollData.yearlyStats.averageNetSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Alınan Primler</span>
                  <span className="font-semibold text-green-600">₺{payrollData.yearlyStats.bonusesReceived.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payroll Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            Bordro Olayları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payrollData.payrollEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'bonus' ? 'bg-green-100' :
                    event.type === 'raise' ? 'bg-blue-100' :
                    event.type === 'allowance' ? 'bg-purple-100' :
                    event.type === 'overtime' ? 'bg-orange-100' :
                    'bg-red-100'
                  }`}>
                    {event.type === 'bonus' && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {event.type === 'raise' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {event.type === 'allowance' && <CreditCard className="h-4 w-4 text-purple-600" />}
                    {event.type === 'overtime' && <Calculator className="h-4 w-4 text-orange-600" />}
                    {event.type === 'deduction' && <TrendingDown className="h-4 w-4 text-red-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500">{format(new Date(event.date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`font-semibold ${event.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {event.amount > 0 ? '+' : ''}₺{Math.abs(event.amount).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={
                    event.status === 'ödendi' ? 'bg-green-100 text-green-800' :
                    event.status === 'aktif' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bordro Geçmişi</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollData.payrollHistory.map((payroll) => (
              <div key={payroll.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Receipt className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{payroll.month}</h4>
                    <p className="text-sm text-gray-600">
                      Ödeme: {format(new Date(payroll.paymentDate), 'dd MMM yyyy')}
                    </p>
                    {payroll.overtimeHours > 0 && (
                      <p className="text-xs text-blue-600">
                        Mesai: {payroll.overtimeHours} saat (+₺{payroll.overtimePay})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">₺{payroll.netSalary.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Net Maaş</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Ödendi
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPayslip(payroll.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}