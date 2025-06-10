import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Performance() {
  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Performans" 
        subtitle="Çalışan performansı değerlendirme ve takibi"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <Card className="hr-stat-card">
          <CardHeader>
            <CardTitle>Performans Yönetimi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">Performans yönetimi özellikleri yakında eklenecek.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
