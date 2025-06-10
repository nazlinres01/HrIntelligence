import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { Building2, Settings, LogOut, User, ChevronRight } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              İK360
            </h1>
            <p className="text-sm text-gray-500">{t("İnsan Kaynakları")}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-blue-100">
              <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-green-600 font-medium">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-colors",
                    isActive 
                      ? "bg-blue-200 text-blue-700" 
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{t(item.label)}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-blue-500 ml-2" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <Separator className="mx-4" />

      {/* Footer */}
      <div className="p-4 space-y-3">
        <Link href="/settings">
          <div className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-gray-100 text-gray-500 group-hover:bg-gray-200 transition-colors">
              <Settings className="h-4 w-4" />
            </div>
            <span className="flex-1">{t("Ayarlar")}</span>
          </div>
        </Link>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">{t("Dil Seçimi")}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={language === "tr" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("tr")}
              className="flex-1 text-xs h-8"
            >
              🇹🇷 TR
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="flex-1 text-xs h-8"
            >
              🇺🇸 EN
            </Button>
          </div>
        </div>
        
        <button
          onClick={() => window.location.href = "/api/logout"}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-red-100 text-red-500 group-hover:bg-red-200 transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="flex-1">{t("Çıkış Yap")}</span>
        </button>
      </div>
    </div>
  );
}