import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer,
  Settings,
  Calendar,
  Users,
  BarChart3
} from "lucide-react";

interface ExportField {
  key: string;
  label: string;
  required?: boolean;
}

interface ExportReportsProps {
  data: any[];
  filename: string;
  fields: ExportField[];
  reportType: "employees" | "leaves" | "payroll" | "performance" | "dashboard";
}

export function ExportReports({ data, filename, fields, reportType }: ExportReportsProps) {
  const [isCustomExportOpen, setIsCustomExportOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(
    fields.filter(f => f.required).map(f => f.key)
  );
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");

  const exportToCSV = (customFields?: string[]) => {
    const fieldsToExport = customFields || fields.map(f => f.key);
    const headers = fields
      .filter(f => fieldsToExport.includes(f.key))
      .map(f => f.label);
    
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        fieldsToExport.map(field => {
          const value = row[field] || "";
          return typeof value === "string" && value.includes(",") 
            ? `"${value}"` 
            : value;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = async (customFields?: string[]) => {
    try {
      const XLSX = await import('xlsx');
      const fieldsToExport = customFields || selectedFields;
      
      // Prepare data with proper headers
      const headers = fields
        .filter(f => fieldsToExport.includes(f.key))
        .map(f => f.label);
      
      const exportData = [
        headers,
        ...data.map(row => 
          fieldsToExport.map(field => {
            const value = row[field];
            // Handle different data types properly
            if (value === null || value === undefined) return "";
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
          })
        )
      ];

      // Create worksheet with proper formatting
      const worksheet = XLSX.utils.aoa_to_sheet(exportData);
      
      // Set column widths
      const colWidths = headers.map(() => ({ wch: 15 }));
      worksheet['!cols'] = colWidths;
      
      // Create workbook and add metadata
      const workbook = XLSX.utils.book_new();
      workbook.Props = {
        Title: getReportTitle(),
        Subject: `${reportType} verisi`,
        Author: "İK360 Sistemi",
        CreatedDate: new Date()
      };
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Veri");
      
      // Download file with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      XLSX.writeFile(workbook, `${filename}-${timestamp}.xlsx`);
      
      return true;
    } catch (error) {
      console.error("Excel export error:", error);
      exportToCSV(customFields);
      return false;
    }
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportTitle = getReportTitle();
    const tableHeaders = fields.map(f => f.label).join('</th><th>');
    const tableRows = data.map(row => 
      `<tr><td>${fields.map(f => row[f.key] || '').join('</td><td>')}</td></tr>`
    ).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
            @media print { 
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>İK360 - ${reportTitle}</h1>
            <div class="company-info">
              <p><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
              <p><strong>Toplam Kayıt:</strong> ${data.length}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr><th>${tableHeaders}</th></tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>Bu rapor İK360 sistemi tarafından otomatik olarak oluşturulmuştur.</p>
            <p>Rapor oluşturma zamanı: ${new Date().toLocaleString('tr-TR')}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "employees": return "Çalışan Listesi Raporu";
      case "leaves": return "İzin Durumu Raporu";
      case "payroll": return "Bordro Raporu";
      case "performance": return "Performans Değerlendirme Raporu";
      case "dashboard": return "Genel Durum Raporu";
      default: return "Sistem Raporu";
    }
  };

  const handleCustomExport = () => {
    if (exportFormat === "csv") {
      exportToCSV(selectedFields);
    } else if (exportFormat === "excel") {
      exportToExcel(selectedFields);
    } else if (exportFormat === "pdf") {
      exportToPDF();
    }
    setIsCustomExportOpen(false);
  };

  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(key => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => exportToCSV()}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV Olarak İndir
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel()}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel Olarak İndir
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            PDF Olarak İndir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCustomExportOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Özel Rapor Ayarları
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCustomExportOpen} onOpenChange={setIsCustomExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Özel Rapor Ayarları</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Rapor Formatı</Label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV Dosyası</SelectItem>
                  <SelectItem value="excel">Excel Dosyası</SelectItem>
                  <SelectItem value="pdf">PDF Dosyası</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Dahil Edilecek Alanlar</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={selectedFields.includes(field.key)}
                      onCheckedChange={() => toggleField(field.key)}
                      disabled={field.required}
                    />
                    <Label 
                      htmlFor={field.key} 
                      className={`flex-1 ${field.required ? 'text-gray-500' : ''}`}
                    >
                      {field.label}
                      {field.required && <span className="text-xs text-gray-400 ml-1">(gerekli)</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCustomExportOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleCustomExport} disabled={selectedFields.length === 0}>
                Raporu İndir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}