import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col">
            <header className="border-b p-4">
                <h1 className="text-xl font-bold tracking-tight">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Ask me anything about your projects.</p>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-secondary p-3 max-w-[75%]">
                        <p className="text-sm">
                           Hello! I'm your AI assistant for ConstructAI. How can I help you today? You can ask me things like "What are the overdue tasks for the Downtown Office Tower?"
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                     <div className="rounded-lg bg-primary text-primary-foreground p-3 max-w-[75%]">
                        <p className="text-sm">
                           Show me the budget for plumbing on project 2023-002
                        </p>
                    </div>
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src="https://i.pravatar.cc/150?u=john" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </div>
                 <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-secondary p-3 max-w-[75%]">
                        <p className="text-sm">
                           Searching for budget details... Unfortunately, I can't access live project data just yet. This feature is under construction.
                        </p>
                    </div>
                </div>
            </div>
            <div className="border-t p-4">
                <div className="relative">
                    <Input placeholder="Type your message..." className="pr-20" />
                    <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <Button size="icon">
                            <Send className="w-5 h-5" />
                        </Button>
                    