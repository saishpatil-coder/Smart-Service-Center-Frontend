"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { Loader2, Send, Image as ImageIcon, X, User, Lock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export default function TicketMessaging({ ticketId, status }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Check if messaging is allowed based on ticket status
  const canSendMessage = status === "ASSIGNED" || status === "IN_PROGRESS";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${ticketId}/messages`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [ticketId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendMessage = async () => {
    if (!message && !imageFile) return;
    if (!canSendMessage) return; // Guard clause

    const formData = new FormData();
    if (message) formData.append("message", message);
    if (imageFile) formData.append("image", imageFile);

    try {
      setSending(true);
      await api.post(`/messages/${ticketId}/messages`, formData);
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
      fetchMessages();
    } catch (err) {
      console.error("Send message failed", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
            Case Support
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">{ticketId}</p>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            canSendMessage
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-200"
          )}
        >
          {status?.replace("_", " ")}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#f8fafc] scroll-smooth"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm italic">
            No communication history found.
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderRole === user?.role;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col",
                  isMine ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                    isMine
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                  )}
                >
                  {msg.imageUrl && (
                    <div className="relative w-full min-w-[220px] h-48 mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={msg.imageUrl}
                        alt="attachment"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {msg.message && (
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  )}
                  <p
                    className={cn(
                      "text-[9px] mt-2 font-medium opacity-70",
                      isMine ? "text-blue-100" : "text-slate-400"
                    )}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer (Conditional) */}
      <div className="p-4 bg-white border-t border-slate-100">
        {canSendMessage ? (
          <>
            {imagePreview && (
              <div className="relative inline-block mb-3 ml-2">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                </div>
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <label className="cursor-pointer p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <ImageIcon size={22} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none px-2 py-2 text-sm focus:outline-none text-slate-700"
              />

              <button
                onClick={sendMessage}
                disabled={sending || (!message && !imageFile)}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Lock size={16} className="text-slate-400" />
            <p className="text-xs text-slate-500 font-medium text-center">
              Messaging is disabled because this ticket is currently{" "}
              <span className="font-bold">{status?.replace("_", " ")}</span>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
