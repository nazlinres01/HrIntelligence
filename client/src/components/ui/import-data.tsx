import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  File, 
  Check, 
  X, 
  AlertTriangle,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImportDataProps {
  onImportComplete?: () => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  endpoint: string;
  templateFields: Array<{
    key: string;
    label: string;
    required: boolean;
    type: 'text' | 'number' | 'date' | 'email' | 'select';
    options?: string[];
  }>;
}

interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  data: any[];
  errors: ImportError[];
  warnings: string[];
}

export function ImportData({ 
  onImportComplete, 
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10,
  endpoint,
  templateFields
}: ImportDataProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importMode, setImportMode] = useState<'create' | 'update' | 'upsert'>('create');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    import('xlsx').then((XLSX) => {
      // Create template with headers and sample data
      const headers = templateFields.map(f => f.label);
      const sampleRow = templateFields.map(f => {
        switch (f.type) {
          case 'text': return 'Örnek Metin';
          case 'number': return '100';
          case 'date': return '2024-01-01';
          case 'email': return 'ornek@email.com';
          case 'select': return f.options?.[0] || 'Seçenek';
          default: return 'Veri';
        }
      });

      const templateData = [headers, sampleRow];
      
      const worksheet = XLSX.utils.aoa_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Şablon");
      
      // Add validation notes
      const notesData = [
        ['Alan', 'Zorunlu', 'Tür', 'Açıklama'],
        ...templateFields.map(f => [
          f.label,
          f.required ? 'Evet' : 'Hayır',
          f.type,
          f.options ? `Seçenekler: ${f.options.join(', ')}` : ''
        ])
      ];
      
      const notesWorksheet = XLSX.utils.aoa_to_sheet(notesData);
      XLSX.utils.book_append_sheet(workbook, notesWorksheet, "Alan Açıklamaları");
      
      XLSX.writeFile(workbook, `import-template-${Date.now()}.xlsx`);
    });
  };

  const validateData = async (data: any[]): Promise<ValidationResult> => {
    const errors: ImportError[] = [];
    const warnings: string[] = [];
    const validData: any[] = [];

    data.forEach((row, index) => {
      const validatedRow: any = {};
      let hasError = false;

      templateFields.forEach(field => {
        const value = row[field.label];
        
        // Check required fields
        if (field.required && (!value || value.toString().trim() === '')) {
          errors.push({
            row: index + 2, // +2 because Excel rows start at 1 and we have headers
            field: field.label,
            value,
            message: `${field.label} alanı zorunludur`
          });
          hasError = true;
          return;
        }

        // Validate data types
        if (value && value.toString().trim() !== '') {
          switch (field.type) {
            case 'email':
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                errors.push({
                  row: index + 2,
                  field: field.label,
                  value,
                  message: `Geçersiz e-posta formatı`
                });
                hasError = true;
              }
              break;
            case 'number':
              if (isNaN(Number(value))) {
                errors.push({
                  row: index + 2,
                  field: field.label,
                  value,
                  message: `Sayısal değer bekleniyor`
                });
                hasError = true;
              } else {
                validatedRow[field.key] = Number(value);
              }
              break;
            case 'date':
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                errors.push({
                  row: index + 2,
                  field: field.label,
                  value,
                  message: `Geçersiz tarih formatı (YYYY-MM-DD)`
                });
                hasError = true;
              } else {
                validatedRow[field.key] = date.toISOString().split('T')[0];
              }
              break;
            case 'select':
              if (field.options && !field.options.includes(value)) {
                errors.push({
                  row: index + 2,
                  field: field.label,
                  value,
                  message: `Geçersiz seçenek. Geçerli değerler: ${field.options.join(', ')}`
                });
                hasError = true;
              } else {
                validatedRow[field.key] = value;
              }
              break;
            default:
              validatedRow[field.key] = value;
          }
        }

        if (!hasError && value) {
          validatedRow[field.key] = validatedRow[field.key] || value;
        }
      });

      if (!hasError) {
        validData.push(validatedRow);
      }
    });

    return {
      valid: errors.length === 0,
      data: validData,
      errors,
      warnings
    };
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: "Geçersiz Dosya Türü",
        description: `Sadece ${acceptedTypes.join(', ')} dosyaları kabul edilir`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "Dosya Çok Büyük",
        description: `Maksimum dosya boyutu ${maxFileSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Parse file
    try {
      setUploadProgress(20);
      const XLSX = await import('xlsx');
      
      const data = await selectedFile.arrayBuffer();
      setUploadProgress(40);
      
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      setUploadProgress(60);
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [headers, ...rows] = jsonData as any[][];
      
      setUploadProgress(80);
      
      // Convert to object format
      const formattedData = rows.map(row => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      }).filter(row => Object.values(row).some(val => val !== undefined && val !== ''));
      
      setUploadProgress(90);
      
      // Validate data
      const result = await validateData(formattedData);
      setValidationResult(result);
      
      setUploadProgress(100);
      
      if (result.valid) {
        toast({
          title: "Dosya Başarıyla Yüklendi",
          description: `${result.data.length} satır veri hazır`,
        });
      } else {
        toast({
          title: "Doğrulama Hataları",
          description: `${result.errors.length} hata bulundu`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('File parsing error:', error);
      toast({
        title: "Dosya Okuma Hatası",
        description: "Dosya işlenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!validationResult?.valid || !validationResult.data.length) {
      toast({
        title: "İçe Aktarım Başarısız",
        description: "Geçerli veri bulunamadı",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await apiRequest('POST', endpoint, {
        data: validationResult.data,
        mode: importMode,
        options: {
          validateOnly: false,
          skipDuplicates: true,
          updateOnConflict: importMode === 'upsert'
        }
      });

      toast({
        title: "İçe Aktarım Başarılı",
        description: `${validationResult.data.length} kayıt başarıyla işlendi`,
      });

      onImportComplete?.();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "İçe Aktarım Hatası",
        description: error.message || "Veriler işlenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setValidationResult(null);
    setImportMode('create');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Veri İçe Aktar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Veri İçe Aktarma</DialogTitle>
          <DialogDescription>
            Excel veya CSV dosyasından veri içe aktarın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Şablon İndir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Doğru formatta veri yüklemek için şablonu indirin
              </p>
              <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                <Download className="h-4 w-4" />
                Excel Şablonu İndir
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dosya Seç</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Dosya</Label>
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  accept={acceptedTypes.join(',')}
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Desteklenen formatlar: {acceptedTypes.join(', ')} (Maks. {maxFileSize}MB)
                </p>
              </div>

              {uploadProgress > 0 && (
                <div>
                  <Label>Yükleme İlerlemesi</Label>
                  <Progress value={uploadProgress} className="mt-1" />
                </div>
              )}

              {file && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <File className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import Mode */}
          {validationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">İçe Aktarma Modu</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={importMode} onValueChange={(value: any) => setImportMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Yeni Kayıt Oluştur</SelectItem>
                    <SelectItem value="update">Mevcut Kayıtları Güncelle</SelectItem>
                    <SelectItem value="upsert">Oluştur veya Güncelle</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Validation Results */}
          {validationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  {validationResult.valid ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  Doğrulama Sonucu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult.data.length}
                    </div>
                    <div className="text-sm text-green-600">Geçerli Kayıt</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {validationResult.errors.length}
                    </div>
                    <div className="text-sm text-red-600">Hata</div>
                  </div>
                </div>

                {validationResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Hatalar:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {validationResult.errors.slice(0, 10).map((error, index) => (
                        <Alert key={index} className="py-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Satır {error.row}, {error.field}: {error.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                      {validationResult.errors.length > 10 && (
                        <p className="text-xs text-gray-500">
                          ... ve {validationResult.errors.length - 10} tane daha
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            İptal
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!validationResult?.valid || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>Aktarılıyor...</>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                İçe Aktar ({validationResult?.data.length || 0} kayıt)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}