"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageCircle, X, Send, User, Bot, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Halo! Saya asisten virtual Adventure Curug Mara. Ada yang bisa saya bantu mengenai paket wisata kami?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content })
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const data = await response.json();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Maaf, fitur AI sedang tidak tersedia (API Key mungkin belum dikonfigurasi). Silakan hubungi admin via WhatsApp untuk bantuan langsung."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsAppRedirect = () => {
        window.open("https://wa.me/6283874065238?text=Halo, saya ingin berbicara dengan agen CS.", "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] h-[500px] mb-4 shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-full">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Curug Mara AI</CardTitle>
                                <p className="text-xs text-primary-foreground/80">Online</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-white/20 h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    msg.role === "user"
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-white border border-gray-200 text-gray-800"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-white border border-gray-200">
                                <span className="animate-pulse">Sedang mengetik...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <CardFooter className="p-3 bg-white border-t flex flex-col gap-2">
                        <form onSubmit={handleSubmit} className="flex w-full gap-2">
                            <Input
                                placeholder="Tanya sesuatu..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs text-green-600 border-green-200 hover:bg-green-50"
                            onClick={handleWhatsAppRedirect}
                        >
                            <Phone className="w-3 h-3 mr-2" />
                            Chat dengan Agen (WhatsApp)
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all hover:scale-110"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageCircle className="w-7 h-7" />
                </Button>
            )}
        </div>
    );
}
