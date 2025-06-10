import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t("searchEmployee")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {/* Language Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={language === "tr" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("tr")}
              className="px-3 py-1 text-sm font-medium"
            >
              TR
            </Button>
            <Button
              variant={language === "en" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="px-3 py-1 text-sm font-medium"
            >
              EN
            </Button>
          </div>
          
          {/* Notifications */}
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
