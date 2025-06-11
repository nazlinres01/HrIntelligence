import { useState } from "react";
import { Search, Sun, Moon, Bell, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Link } from "wouter";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Corporate Title Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        
        {/* Corporate Controls Section */}
        <div className="flex items-center space-x-4">
          {/* Corporate Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>
          
          {/* Corporate Language Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
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

          {/* Corporate Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-9 w-9 p-0"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            )}
          </Button>

          {/* Corporate Notifications */}
          <NotificationBell />

          {/* Corporate Logout Button */}
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              Çıkış Yap
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}