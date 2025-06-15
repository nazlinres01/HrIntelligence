import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Hata",
        description: "Lütfen e-posta adresinizi girin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast({
        title: "Başarılı",
        description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
      });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">E-posta Gönderildi</h2>
            <p className="text-gray-600 mb-6">
              <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi. 
              E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button variant="lightgray" className="w-full">
                  Giriş Sayfasına Dön
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="w-full"
              >
                Başka E-posta ile Dene
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-center">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@sirket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilecektir. 
                Spam klasörünüzü de kontrol etmeyi unutmayın.
              </AlertDescription>
            </Alert>

            <Button 
              type="submit" 
              variant="lightgray" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Hemen kayıt olun
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}