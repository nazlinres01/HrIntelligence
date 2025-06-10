import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Payroll() {
  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Bordro" 
        subtitle="Maaş yönetimi ve bordro işlemleri"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <Card className="hr-stat-card">
          <CardHeader>
            <CardTitle>Bordro Yönetimi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500">Bordro yönetimi özellikleri yakında eklenecek.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
