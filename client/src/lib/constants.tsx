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
    icon: "fas fa-chart-pie"
  },
  {
    href: "/employees",
    label: "Çalışanlar",
    icon: "fas fa-users"
  },
  {
    href: "/performance",
    label: "Performans",
    icon: "fas fa-chart-line"
  },
  {
    href: "/leaves",
    label: "İzin Yönetimi",
    icon: "fas fa-calendar-alt"
  },
  {
    href: "/payroll",
    label: "Bordro",
    icon: "fas fa-money-bill-wave"
  },
  {
    href: "/reports",
    label: "Raporlar",
    icon: "fas fa-file-alt"
  },
  {
    href: "/settings",
    label: "Ayarlar",
    icon: "fas fa-cog"
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
