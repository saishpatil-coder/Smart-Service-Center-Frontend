"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Phone,
  Mail,
  HelpCircle,
  Wrench,
  Ticket
} from "lucide-react";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";

export default function Chatbot() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize chatbot conversation
  useEffect(() => {
    if (user) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: `Hello ${user.name.split(" ")[0]}! Welcome to SSCMS Support. I am your virtual assistant. How can I help you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!user) return null;

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender,
        text,
        timestamp: new Date()
      }
    ]);
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    if (!textToSend) {
      addMessage("user", query);
      setInputText("");
    } else {
      addMessage("user", query);
    }

    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      await processBotReply(query.toLowerCase());
    }, 800);
  };

  const processBotReply = async (query) => {
    setIsTyping(false);

    // Keyword matching
    if (
      query.includes("ticket") ||
      query.includes("status") ||
      query.includes("progress") ||
      query.includes("track")
    ) {
      await handleTicketStatusQuery();
    } else if (
      query.includes("service") ||
      query.includes("menu") ||
      query.includes("cost") ||
      query.includes("price") ||
      query.includes("offer")
    ) {
      await handleServicesQuery();
    } else if (
      query.includes("contact") ||
      query.includes("support") ||
      query.includes("phone") ||
      query.includes("email") ||
      query.includes("call") ||
      query.includes("help")
    ) {
      handleContactQuery();
    } else if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey") ||
      query.includes("greetings")
    ) {
      addMessage(
        "bot",
        "Hello! How can I assist you? You can type a question, or use one of the quick options below."
      );
    } else {
      addMessage(
        "bot",
        "I'm sorry, I didn't quite catch that. You can try selecting one of the quick options below or contact our support desk directly at support@sscms.com."
      );
    }
  };

  // Actions
  const handleTicketStatusQuery = async () => {
    try {
      const res = await api.get("/client/tickets");
      const tickets = res.data.tickets || [];

      if (tickets.length === 0) {
        addMessage(
          "bot",
          "You currently have no active tickets. If you need a service, click the '+ New Request' button on your dashboard."
        );
        return;
      }

      const activeTickets = tickets.filter(
        (t) => !["COMPLETED", "CANCELLED"].includes(t.status)
      );

      if (activeTickets.length === 0) {
        addMessage(
          "bot",
          `All your service requests are completed. Here is your latest request:\n\n**${tickets[0].title}**\nStatus: **${tickets[0].status}**\nTotal Cost: ₹${tickets[0].cost}\n\nWould you like to review all tickets?`
        );
        return;
      }

      let ticketListStr = "Here are your active service requests:\n\n";
      activeTickets.forEach((t) => {
        ticketListStr += `• **${t.title}**\n  Status: **${t.status}**\n  Base Cost: ₹${t.cost}\n  Created: ${new Date(t.createdAt).toLocaleDateString()}\n\n`;
      });

      addMessage("bot", ticketListStr);
    } catch (err) {
      addMessage("bot", "I ran into an issue retrieving your tickets. Please try again later.");
    }
  };

  const handleServicesQuery = async () => {
    try {
      const res = await api.get("/client/services");
      const services = res.data.services || [];

      if (services.length === 0) {
        addMessage("bot", "No services are currently listed. Please contact support.");
        return;
      }

      let serviceListStr = "Here are our available services:\n\n";
      services.slice(0, 5).forEach((s) => {
        serviceListStr += `• **${s.serviceTitle}** (${s.type})\n  Base Cost: ₹${s.defaultCost} | Est: ${s.defaultExpectedHours} hrs\n\n`;
      });
      if (services.length > 5) {
        serviceListStr += `...and ${services.length - 5} more options available when creating a ticket!`;
      }

      addMessage("bot", serviceListStr);
    } catch (err) {
      addMessage("bot", "I couldn't fetch our service list right now. Please check back later.");
    }
  };

  const handleContactQuery = () => {
    addMessage(
      "bot",
      "You can get in touch with our main support office at:\n\n📞 **Phone**: +1 (800) 555-0199\n📧 **Email**: support@sscms.com\n🏢 **Hours**: Monday - Friday, 9:00 AM - 6:00 PM"
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer border border-blue-500/20 group"
      >
        {isOpen ? (
          <X size={24} className="animate-in spin-in-90 duration-300" />
        ) : (
          <MessageCircle size={24} className="animate-in zoom-in duration-300 group-hover:rotate-6" />
        )}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 ease-out">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Bot size={22} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">Support Assistant</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                      isBot
                        ? "bg-slate-900 text-blue-400 border-slate-800"
                        : "bg-blue-600 text-white border-blue-500"
                    }`}
                  >
                    {isBot ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isBot
                        ? "bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-line"
                        : "bg-blue-600 text-white rounded-tr-none"
                    }`}
                  >
                    {/* Render basic markdown/bolding safely */}
                    {msg.text.split("\n").map((line, idx) => {
                      // Simple regex matching for bold parts
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                          {parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-blue-400 border border-slate-800 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 p-3 px-4 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies & Actions */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => handleSend("Check Ticket Status")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all cursor-pointer"
              >
                <Ticket size={12} /> Check Status
              </button>
              <button
                onClick={() => handleSend("Browse Services")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all cursor-pointer"
              >
                <Wrench size={12} /> Services
              </button>
              <button
                onClick={() => handleSend("Contact Support")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all cursor-pointer"
              >
                <HelpCircle size={12} /> Support Info
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about tickets, services..."
                className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 p-3 rounded-2xl shadow-lg shadow-blue-100 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
