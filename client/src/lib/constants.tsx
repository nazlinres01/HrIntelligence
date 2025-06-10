import { Home, Users, TrendingUp, Calendar, DollarSign, FileText, Settings } from "lucide-react";

export const DEPARTMENTS = [
  "Yazılım",
  "İnsan Kaynakları", 
  "Pazarlama",
  "Satış",
  "Muhasebe",
  "Operasyon"
] as const;

export const EMPLOYEE_STATUSES = [
  { value: "active", label: "Aktif" },
  { value: "on_leave", label: "İzinli" },
  { value: "inactive", label: "Pasif" }
] as const;

export const LEAVE_TYPES = [
  { value: "annual", label: "Yıllık İzin" },
  { value: "sick", label: "Hastalık İzni" },
  { value: "personal", label: "Mazeret İzni" },
  { value: "maternity", label: "Doğum İzni" }
] as const;

export const LEAVE_STATUSES = [
  { value: "pending", label: "Beklemede" },
  { value: "approved", label: "Onaylandı" },
  { value: "rejected", label: "Reddedildi" }
] as const;

export const NAVIGATION_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home
  },
  {
    href: "/employees",
    label: "Çalışanlar",
    icon: Users
  },
  {
    href: "/performance",
    label: "Performans",
    icon: TrendingUp
  },
  {
    href: "/leaves",
    label: "İzin Yönetimi",
    icon: Calendar
  },
  {
    href: "/payroll",
    label: "Bordro",
    icon: DollarSign
  },
  {
    href: "/reports",
    label: "Raporlar",
    icon: FileText
  },
  {
    href: "/settings",
    label: "Ayarlar",
    icon: Settings
  }
] as const;

export const QUICK_ACTIONS = [
  {
    title: "Toplu Maaş Güncelleme",
    icon: "fas fa-money-bill-wave",
    color: "primary"
  },
  {
    title: "Aylık Rapor Oluştur", 
    icon: "fas fa-file-download",
    color: "secondary"
  },
  {
    title: "Duyuru Gönder",
    icon: "fas fa-bullhorn", 
    color: "accent"
  }
] as const;
