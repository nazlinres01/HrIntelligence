import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, BarChart3, Clock, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export default function Landing() {
  const { t } = useLanguage();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">İK360</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t("Modern İnsan Kaynakları Yönetim Sistemi")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <span>{t("Replit ile Giriş Yap")}</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Button>
            <div className="flex space-x-3">
              <Link href="/login">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-3"
                >
                  {t("Giriş Yap")}
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-6 py-3"
                >
                  {t("Kayıt Ol")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t("Çalışan Yönetimi")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("Çalışan bilgilerini merkezi olarak yönetin")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t("Performans Takibi")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("Çalışan performansını izleyin ve değerlendirin")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t("İzin Yönetimi")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("İzin talepleri ve onaylarını kolayca yönetin")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t("Bordro Yönetimi")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("Maaş ve bordro işlemlerini otomatikleştirin")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t("Neden İK360?")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                {t("Kolay Kullanım")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Sezgisel arayüz ile hızlı öğrenme")}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                {t("Güvenli")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Çalışan verileriniz en yüksek güvenlik ile korunur")}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                {t("Entegre")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Tüm İK süreçlerinizi tek platformda yönetin")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}