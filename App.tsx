
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import { generateLegalResponse } from './services/geminiService';
import { Message } from './types';

const App: React.FC = () => {
  const initialMessages: Message[] = [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Добро пожаловать в ArmLegal AI Ассистент. Я ваш специализированный цифровой консультант, обладающий возможностью поиска правовой информации в реальном времени. Чем я могу помочь вам в ваших юридических исследованиях или подготовке документов сегодня?",
      timestamp: new Date(),
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([
      {
        ...initialMessages[0],
        id: `welcome-${Date.now()}`,
        timestamp: new Date()
      }
    ]);
    setInputValue('');
    setIsLoading(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add a placeholder assistant message that shows "searching"
    const assistantPlaceholderId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: "",
      timestamp: new Date(),
      isSearching: true
    }]);

    try {
      const { text, sources } = await generateLegalResponse(userMessage.content, [...messages, userMessage]);
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantPlaceholderId 
          ? { ...msg, content: text, groundingSources: sources, isSearching: false } 
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantPlaceholderId 
          ? { ...msg, content: "Произошла ошибка при обработке вашего юридического запроса. Пожалуйста, убедитесь в правильности настроек и попробуйте снова.", isSearching: false } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar 
        onSelectTemplate={handleTemplateSelect} 
        onNewChat={handleNewChat}
        chatHistory={[]} 
      />

      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#aa8164] bg-[#aa8164]/10 px-2 py-1 rounded">ПОИСК ВКЛЮЧЕН</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <span className="text-sm font-medium text-slate-600 italic">"Veritas et Iustitia"</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fa-solid fa-cloud-arrow-down"></i>
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>
        </header>

        {/* Chat Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-20 py-8 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length-1]?.content === "" && (
              <div className="flex justify-start mb-8 animate-pulse">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-[85%]">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-6">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Задайте вопрос по делу, составьте пункт договора или найдите конкретный закон..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pr-32 focus:outline-none focus:ring-2 focus:ring-[#aa8164]/20 focus:border-[#aa8164] transition-all resize-none min-h-[60px] max-h-[200px] text-slate-900"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <button 
                  type="button"
                  className="p-2.5 text-slate-400 hover:text-[#aa8164] transition-colors"
                  title="Прикрепить юридический документ"
                >
                  <i className="fa-solid fa-paperclip"></i>
                </button>
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
                    !inputValue.trim() || isLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-[#aa8164] text-white hover:opacity-90 active:scale-95'
                  }`}
                >
                  <span>Запрос</span>
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
              На базе системы ArmLegal AI и технологии Google Search Grounding
            </p>
          </div>
        </div>

        {/* Disclaimer Overlay */}
        <div className="absolute top-20 right-8 max-w-[240px] bg-amber-50 border border-amber-200 p-3 rounded-lg hidden md:block opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex gap-2 text-amber-800 mb-1">
            <i className="fa-solid fa-circle-exclamation mt-0.5 text-sm"></i>
            <span className="text-[11px] font-bold uppercase tracking-tight">Отказ от ответственности</span>
          </div>
          <p className="text-[10px] text-amber-700 leading-tight">
            Этот ИИ-ассистент предоставляет информацию на основе обработанных данных. Он не заменяет профессиональную юридическую помощь. Рекомендуется проверка всех результатов.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
