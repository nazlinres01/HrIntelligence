import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  CreditCard,
  PieChart,
  BarChart3,
  Calendar,
  Settings,
  Shield,
  Eye,
  Edit,
  MoreHorizontal,
  Filter,
  Search
} from "lucide-react";

interface PayrollRecord {
  id: number;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  baseSalary: number;
  bonus: number;
  allowances: number;
  grossSalary: number;
  taxDeductions: number;
  ssiDeductions: number;
  netSalary: number;
  workingDays: number;
  overtime: number;
  period: string;
  status: string;
  bankAccount: string;
  costCenter: string;
}

export default function EnterprisePayrollCenter() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-12");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enterprise payroll data with comprehensive details
  const payrollData = [
    {
      id: 1,
      employeeName: "Dr. Mehmet Aksoy",
      employeeId: "EMP001",
      department: "Executive Management",
      position: "Chief Technology Officer",
      baseSalary: 85000,
      bonus: 15000,
      allowances: 8500,
      grossSalary: 108500,
      taxDeductions: 21700,
      ssiDeductions: 11935,
      netSalary: 74865,
      workingDays: 22,
      overtime: 0,
      period: "2024-12",
      status: "processed",
      bankAccount: "TR33 0006 1005 1978 6457 8413 26",
      costCenter: "CC-EXEC-001"
    },
    {
      id: 2,
      employeeName: "Ayşe Demir",
      employeeId: "EMP002",
      department: "Human Resources",
      position: "HR Director",
      baseSalary: 45000,
      bonus: 8000,
      allowances: 3500,
      grossSalary: 56500,
      taxDeductions: 11300,
      ssiDeductions: 6215,
      netSalary: 38985,
      workingDays: 22,
      overtime: 4,
      period: "2024-12",
      status: "processed",
      bankAccount: "TR64 0001 2009 4520 0058 9001 75",
      costCenter: "CC-HR-001"
    },
    {
      id: 3,
      employeeName: "Can Öztürk",
      employeeId: "EMP003",
      department: "Engineering",
      position: "Senior Software Architect",
      baseSalary: 55000,
      bonus: 12000,
      allowances: 4500,
      grossSalary: 71500,
      taxDeductions: 14300,
      ssiDeductions: 7865,
      netSalary: 49335,
      workingDays: 22,
      overtime: 16,
      period: "2024-12",
      status: "processed",
      bankAccount: "TR98 0004 6007 8888 8006 6639 01",
      costCenter: "CC-ENG-001"
    },
    {
      id: 4,
      employeeName: "Zeynep Kaya",
      employeeId: "EMP004",
      department: "Finance",
      position: "CFO",
      baseSalary: 75000,
      bonus: 18000,
      allowances: 6000,
      grossSalary: 99000,
      taxDeductions: 19800,
      ssiDeductions: 10890,
      netSalary: 68310,
      workingDays: 22,
      overtime: 0,
      period: "2024-12",
      status: "pending",
      bankAccount: "TR12 0010 3000 0000 0018 4006 17",
      costCenter: "CC-FIN-001"
    },
    {
      id: 5,
      employeeName: "Burak Şahin",
      employeeId: "EMP005",
      department: "Sales",
      position: "Sales Director",
      baseSalary: 48000,
      bonus: 25000,
      allowances: 5500,
      grossSalary: 78500,
      taxDeductions: 15700,
      ssiDeductions: 8635,
      netSalary: 54165,
      workingDays: 22,
      overtime: 8,
      period: "2024-12",
      status: "processed",
      bankAccount: "TR56 0020 9000 1234 5678 9012 34",
      costCenter: "CC-SAL-001"
    },
    {
      id: 6,
      employeeName: "Elif Yıldız",
      employeeId: "EMP006",
      department: "Marketing",
      position: "Marketing Manager",
      baseSalary: 38000,
      bonus: 8500,
      allowances: 3200,
      grossSalary: 49700,
      taxDeductions: 9940,
      ssiDeductions: 5467,
      netSalary: 34293,
      workingDays: 20,
      overtime: 0,
      period: "2024-12",
      status: "processed",
      bankAccount: "TR77 0006 7010 0000 0017 2994 58",
      costCenter: "CC-MKT-001"
    }
  ];

  const filteredPayroll = payrollData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate financial metrics
  const totalGross = filteredPayroll.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalNet = filteredPayroll.reduce((sum, record) => sum + record.netSalary, 0);
  const totalTax = filteredPayroll.reduce((sum, record) => sum + record.taxDeductions, 0);
  const totalSSI = filteredPayroll.reduce((sum, record) => sum + record.ssiDeductions, 0);
  const processedCount = filteredPayroll.filter(record => record.status === "processed").length;
  const pendingCount = filteredPayroll.filter(record => record.status === "pending").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-600 text-white">Processed</Badge>;
      case "pending":
        return <Badge className="bg-amber-600 text-white">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600 text-white">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enterprise Header */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-8 text-gray-800 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Bordro Merkezi</h1>
                  <p className="text-gray-600 text-lg">Kapsamlı Maaş ve Ödeme Yönetimi</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Güvenli Finansal İşlemler</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Otomatik Hesaplama</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Yasal Uyumluluk</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Gross Payroll</p>
                  <p className="text-3xl font-bold text-gray-900">₺{totalGross.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">+8.2%</span>
                    <span className="text-gray-500 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Net Disbursement</p>
                  <p className="text-3xl font-bold text-gray-900">₺{totalNet.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">+5.7%</span>
                    <span className="text-gray-500 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CreditCard className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Tax & Deductions</p>
                  <p className="text-3xl font-bold text-gray-900">₺{(totalTax + totalSSI).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-500 text-sm">
                      {Math.round(((totalTax + totalSSI) / totalGross) * 100)}% of gross
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <PieChart className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Processing Status</p>
                  <p className="text-3xl font-bold text-gray-900">{processedCount}/{filteredPayroll.length}</p>
                  <div className="mt-2">
                    <Progress 
                      value={(processedCount / filteredPayroll.length) * 100} 
                      className="h-2 bg-gray-200"
                    />
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Selection & Filters */}
        <Card className="bg-white border-0 shadow-xl mb-8">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Payroll Management Console</CardTitle>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500 text-sm">Advanced Controls</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Pay Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-12">December 2024</SelectItem>
                    <SelectItem value="2024-11">November 2024</SelectItem>
                    <SelectItem value="2024-10">October 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Search Employee</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Department</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Executive Management">Executive Management</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Table */}
        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Employee Compensation Details</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {processedCount} Processed
                </Badge>
                {pendingCount > 0 && (
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    {pendingCount} Pending
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Base Compensation</TableHead>
                    <TableHead className="font-semibold">Variable Pay</TableHead>
                    <TableHead className="font-semibold">Gross Amount</TableHead>
                    <TableHead className="font-semibold">Deductions</TableHead>
                    <TableHead className="font-semibold">Net Pay</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className="py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">{record.employeeId} • {record.position}</div>
                          <div className="text-xs text-gray-400">{record.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₺{record.baseSalary.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{record.workingDays} days</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">₺{(record.bonus + record.allowances).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Bonus + Allowances</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right font-semibold text-lg text-blue-600">
                          ₺{record.grossSalary.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">₺{(record.taxDeductions + record.ssiDeductions).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Tax + SSI</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right font-bold text-lg text-gray-900">
                          ₺{record.netSalary.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}