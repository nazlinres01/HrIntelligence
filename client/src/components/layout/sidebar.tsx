import { Link, useLocation } from "wouter";
import { Users } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";

export function Sidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <Users className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">İK360</h1>
          <p className="text-xs text-gray-500">HR Management</p>
        </div>
      </div>

      {/* Navigation Menu */} 
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <a className={`${isActive ? "hr-sidebar-active" : "hr-sidebar-link"}`}>
                <i className={`${item.icon} mr-3 text-lg`}></i>
                <span>{t(item.label.toLowerCase().replace(/\s+/g, ""))}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
            alt="User Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Ahmet Yılmaz</p>
            <p className="text-xs text-gray-500">İK Müdürü</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
