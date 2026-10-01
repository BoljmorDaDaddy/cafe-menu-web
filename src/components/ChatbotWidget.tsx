import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import type { MenuItem, CafeSettings, ChatMessage } from '../types';
import { askRagAi } from '../services/ragService';

interface ChatbotWidgetProps {
  menuItems: MenuItem[];
  settings: CafeSettings;
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem: (item: MenuItem) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  menuItems,
  settings,
  isOpen,
  onToggle,
  onSelectItem,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Сайн байна уу! ☕ Би **${settings.cafe_name || 'Aura Cafe'}**-ийн RAG AI туслах байна. Манай хоол, ундааны сонголт, орц найрлага, харшил, кафены цагийн хуваарь болон Wi-Fi зэрэг бүх асуултад хариулахад бэлэн байна.`,
      timestamp: 'Яг одоо',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askRagAi(text, menuItems, settings);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_items: response.suggestedItems,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Уучлаарай, холболтонд алдаа гарлаа. Та дахин оролдоно уу.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: '🥩 Онцлох хоол', prompt: 'Тогоочийн онцлох шилдэг хоол юу вэ?' },
    { label: '☕ Кофе сонголт', prompt: 'Ямар онцлох кофе байгаа вэ?' },
    { label: '🌱 Веган / Салад', prompt: 'Цагаан хоолтон хүнд юу санал болгох вэ?' },
    { label: '📶 Wi-Fi нууц үг', prompt: 'Wi-Fi сүлжээний нууц үг юу вэ?' },
    { label: '⏰ Цагийн хуваарь', prompt: 'Кафены ажиллах цагийн хуваарь ямар вэ?' },
  ];

  return (
    <>
      {/* Floating Trigger Circle Button — clean, no glow */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-[#2C1A0E] hover:bg-[#3B2415] shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8785A] focus-visible:ring-offset-2"
          aria-label="AI туслах"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#D4B896]" />
          ) : (
            <MessageCircle className="w-5 h-5 text-[#D4B896]" />
          )}
        </button>
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[400px] h-[520px] max-h-[80vh] z-50 bg-white rounded-3xl overflow-hidden border border-[#d9cfba] shadow-2xl flex flex-col animate-slideUp">
          {/* Chat Header */}
          <div className="p-4 bg-[#123F36] border-b border-[#2A6B5C] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-stone-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-sm font-bold text-[#E8DCC4]">
                    Mo's Cafe AI
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-stone-400">
                  {settings.rag_api_url ? 'Connected API' : 'Realtime Menu Intelligence'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-stone-300" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#4A3F35] text-white font-medium rounded-tr-none'
                      : 'bg-[#F5F2EA] border border-[#E8E2D9] text-[#2D241E] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Suggested Menu Item Cards inside AI Bubble */}
                  {msg.suggested_items && msg.suggested_items.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B645D] block">
                        Санал болгох бүтээгдэхүүн:
                      </span>
                      {msg.suggested_items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onSelectItem(item)}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#2D241E] truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-[#6B645D] font-serif">
                              {item.price.toLocaleString()}₮
                            </span>
                          </div>
                          <span className="text-[10px] text-[#2D241E] bg-[#F5F2EA] px-2 py-1 rounded-md">
                            Үзэх
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-stone-400/80 block mt-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-stone-600/30 border border-stone-600/40 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-stone-200" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-white/5 p-3 rounded-2xl w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-stone-400" />
                <span>RAG AI бодож байна...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white hover:bg-stone-200 text-stone-600 hover:text-stone-800 border border-stone-200 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Хоол, кофе, орцын тухай асууна уу..."
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#2D241E] placeholder-stone-500 focus:outline-none focus:border-stone-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#2D241E] hover:bg-[#4A3F35] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                aria-label="Илгээх"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
