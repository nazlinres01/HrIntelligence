import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Raporlar" 
        subtitle="İnsan kaynakları raporları ve analizleri"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <Card className="hr-stat-card">
          <CardHeader>
            <CardTitle>Raporlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">Raporlama özellikleri yakında eklenecek.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
