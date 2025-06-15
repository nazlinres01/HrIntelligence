import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  Users,
  Paperclip
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const messageSchema = z.object({
  recipient: z.string().min(1, "Alıcı seçiniz"),
  subject: z.string().min(1, "Konu giriniz"),
  message: z.string().min(1, "Mesaj giriniz"),
  priority: z.string().optional()
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock messages data
  const messagesData = {
    conversations: [
      {
        id: 1,
        participants: [
          { id: "user1", name: "Ali Özkan", role: "Proje Yöneticisi", avatar: "" },
          { id: "employee_002", name: "Emre Şahin", role: "Frontend Developer", avatar: "" }
        ],
        lastMessage: {
          id: 101,
          senderId: "user1",
          content: "Yeni proje için toplantı zamanını planlamalıyız.",
          timestamp: "2024-06-13T14:30:00Z",
          isRead: false
        },
        unreadCount: 2
      },
      {
        id: 2,
        participants: [
          { id: "user2", name: "Ayşe Demir", role: "Takım Lideri", avatar: "" },
          { id: "employee_002", name: "Emre Şahin", role: "Frontend Developer", avatar: "" }
        ],
        lastMessage: {
          id: 201,
          senderId: "employee_002",
          content: "Code review tamamlandı, değişiklikleri gönderdim.",
          timestamp: "2024-06-12T16:45:00Z",
          isRead: true
        },
        unreadCount: 0
      },
      {
        id: 3,
        participants: [
          { id: "user3", name: "Mehmet Kaya", role: "HR Uzmanı", avatar: "" },
          { id: "employee_002", name: "Emre Şahin", role: "Frontend Developer", avatar: "" }
        ],
        lastMessage: {
          id: 301,
          senderId: "user3",
          content: "İzin talebiniz onaylandı.",
          timestamp: "2024-06-11T09:15:00Z",
          isRead: true
        },
        unreadCount: 0
      }
    ],
    messages: {
      1: [
        {
          id: 101,
          senderId: "user1",
          content: "Yeni proje için toplantı zamanını planlamalıyız.",
          timestamp: "2024-06-13T14:30:00Z",
          isRead: false
        },
        {
          id: 102,
          senderId: "user1",
          content: "Yarın saat 14:00 uygun mu?",
          timestamp: "2024-06-13T14:32:00Z",
          isRead: false
        },
        {
          id: 103,
          senderId: "employee_002",
          content: "Evet, uygun. Toplantı odasını ayarlayabilir misiniz?",
          timestamp: "2024-06-13T14:35:00Z",
          isRead: true
        }
      ],
      2: [
        {
          id: 201,
          senderId: "employee_002",
          content: "Code review tamamlandı, değişiklikleri gönderdim.",
          timestamp: "2024-06-12T16:45:00Z",
          isRead: true
        },
        {
          id: 202,
          senderId: "user2",
          content: "Teşekkürler, kontrol edeceğim.",
          timestamp: "2024-06-12T16:50:00Z",
          isRead: true
        }
      ],
      3: [
        {
          id: 301,
          senderId: "user3",
          content: "İzin talebiniz onaylandı.",
          timestamp: "2024-06-11T09:15:00Z",
          isRead: true
        }
      ]
    },
    contacts: [
      { id: "user1", name: "Ali Özkan", role: "Proje Yöneticisi", department: "IT" },
      { id: "user2", name: "Ayşe Demir", role: "Takım Lideri", department: "IT" },
      { id: "user3", name: "Mehmet Kaya", role: "HR Uzmanı", department: "İK" },
      { id: "user4", name: "Fatma Yıldız", role: "Grafik Tasarımcı", department: "Pazarlama" }
    ]
  };

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      recipient: "",
      subject: "",
      message: "",
      priority: "normal"
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      // Mock API call
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setIsComposeOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Mesajınız gönderildi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: MessageFormData) => {
    sendMessageMutation.mutate(data);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Dün " + format(date, "HH:mm");
    } else {
      return format(date, "dd/MM HH:mm");
    }
  };

  const getParticipantName = (conversationId: number, userId: string) => {
    const conversation = messagesData.conversations.find(c => c.id === conversationId);
    const participant = conversation?.participants.find(p => p.id === userId);
    return participant ? participant.name : "Bilinmeyen";
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p.id !== "employee_002");
  };

  const selectedConversationData = messagesData.conversations.find(c => c.id === selectedConversation);
  const selectedMessages = selectedConversation ? messagesData.messages[selectedConversation as keyof typeof messagesData.messages] || [] : [];

  const totalUnread = messagesData.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
          <p className="text-gray-600">İç iletişim ve mesajlaşma</p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button variant="lightgray">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Mesaj
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Mesaj</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alıcı</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Kişi seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {messagesData.contacts.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                <div className="flex items-center gap-2">
                                  <span>{contact.name}</span>
                                  <span className="text-xs text-gray-500">({contact.role})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konu</FormLabel>
                      <FormControl>
                        <Input placeholder="Mesaj konusu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Öncelik</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Öncelik seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Düşük</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">Yüksek</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesaj</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mesajınızı yazın..." 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" variant="lightgray">
                    <Send className="w-4 h-4 mr-2" />
                    Gönder
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Konuşma</p>
                <p className="text-lg font-semibold text-gray-900">{messagesData.conversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Okunmamış</p>
                <p className="text-lg font-semibold text-gray-900">{totalUnread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Okunmuş</p>
                <p className="text-lg font-semibold text-gray-900">
                  {messagesData.conversations.length - messagesData.conversations.filter(c => c.unreadCount > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kişiler</p>
                <p className="text-lg font-semibold text-gray-900">{messagesData.contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <CardTitle>Konuşmalar</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Konuşma ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto h-[480px]">
              {messagesData.conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={otherParticipant?.avatar} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-800">
                          {otherParticipant?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 truncate">
                            {otherParticipant?.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white ml-2">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{otherParticipant?.role}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Messages View */}
        <Card className="lg:col-span-2">
          {selectedConversationData ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getOtherParticipant(selectedConversationData)?.avatar} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-800">
                        {getOtherParticipant(selectedConversationData)?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getOtherParticipant(selectedConversationData)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getOtherParticipant(selectedConversationData)?.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-y-auto h-[400px] p-4 space-y-4">
                  {selectedMessages.map((message) => {
                    const isOwnMessage = message.senderId === "employee_002";
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isOwnMessage
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? "text-yellow-100" : "text-gray-500"
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input placeholder="Mesajınızı yazın..." className="flex-1" />
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Bir konuşma seçin</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}