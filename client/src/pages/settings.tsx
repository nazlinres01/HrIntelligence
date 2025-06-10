import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Ayarlar" 
        subtitle="Sistem ayarları ve konfigürasyonları"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <Card className="hr-stat-card">
          <CardHeader>
            <CardTitle>Sistem Ayarları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">Ayarlar sayfası yakında eklenecek.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
