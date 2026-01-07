
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex w-full mb-8 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAssistant ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
        }`}>
          <i className={`fa-solid ${isAssistant ? 'fa-robot' : 'fa-user'} text-xs`}></i>
        </div>
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className={`p-4 rounded-2xl shadow-sm leading-relaxed ${
            isAssistant 
              ? 'bg-white border border-slate-200 text-slate-800' 
              : 'bg-indigo-600 text-white'
          }`}>
            <div className="whitespace-pre-wrap text-sm md:text-base">
              {message.content}
            </div>

            {isAssistant && message.isSearching && (
              <div className="flex items-center gap-2 mt-3 text-indigo-600 text-sm animate-pulse">
                <i className="fa-brands fa-google"></i>
                <span>Проверка актуальных законов и юридических баз данных...</span>
              </div>
            )}
          </div>

          {isAssistant && message.groundingSources && message.groundingSources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400 w-full mb-1">Источники информации:</span>
              {message.groundingSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs text-slate-600 transition-colors"
                >
                  <i className="fa-solid fa-link text-[10px]"></i>
                  <span className="max-w-[150px] truncate">{source.title}</span>
                </a>
              ))}
            </div>
          )}

          <div className="mt-1 text-[10px] text-slate-400 uppercase tracking-widest px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
