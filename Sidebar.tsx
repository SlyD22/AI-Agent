
import React from 'react';
import { LegalTemplate } from '../types';

const TEMPLATES: LegalTemplate[] = [
  {
    title: "Анализ договора",
    description: "Анализ условий и рисков",
    icon: "fa-file-signature",
    prompt: "Проанализируйте следующие условия договора на предмет потенциальных рисков и предложите улучшения: "
  },
  {
    title: "Поиск прецедентов",
    description: "Поиск судебной практики",
    icon: "fa-gavel",
    prompt: "Найдите недавние юридические прецеденты и судебные решения, связанные с: "
  },
  {
    title: "Поиск законов",
    description: "Поиск конкретных актов",
    icon: "fa-book-legal",
    prompt: "Найдите и объясните действующие законы и нормативные акты, регулирующие: "
  },
  {
    title: "Помощь в составлении",
    description: "Создание юридических формулировок",
    icon: "fa-pen-nib",
    prompt: "Помогите мне составить стандартную юридическую оговорку для: "
  }
];

interface SidebarProps {
  onSelectTemplate: (prompt: string) => void;
  onNewChat: () => void;
  chatHistory: { id: string; title: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTemplate, onNewChat, chatHistory }) => {
  return (
    <div className="w-80 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#aa8164] p-2 rounded-lg">
            <i className="fa-solid fa-scale-balanced text-xl"></i>
          </div>
          <h1 className="text-xl font-bold legal-title tracking-tight">ArmLegal AI</h1>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-[#aa8164] hover:opacity-90 transition-all py-2.5 rounded-lg font-medium mb-8 active:scale-95 transform"
        >
          <i className="fa-solid fa-plus text-sm"></i>
          Новая консультация
        </button>

        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Инструментарий</h2>
          <div className="space-y-2">
            {TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                onClick={() => onSelectTemplate(t.prompt)}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition-all group flex items-start gap-3"
              >
                <div className="mt-1 text-[#aa8164] group-hover:brightness-125">
                  <i className={`fa-solid ${t.icon}`}></i>
                </div>
                <div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-slate-500">{t.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-[#aa8164] flex items-center justify-center text-xs font-bold">
            ЮК
          </div>
          <div>
            <div className="text-sm font-medium">Профессиональный план</div>
            <div className="text-xs text-slate-500">Поиск в реальном времени активен</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
