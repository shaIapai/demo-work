import React from 'react';
import {
  LayoutDashboard,
  Database,
  Upload,
  Server,
  AlertTriangle,
  AlertCircle,
  Copy,
  CheckSquare,
  FileSpreadsheet,
  Users,
  Package,
  ClipboardCheck,
  GitCompare,
  MessageSquare,
  BarChart3,
  History,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface NavGroup {
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, stats, discrepancies, dataErrors } = useData();
  const [dataOpen, setDataOpen] = React.useState(true);
  const [controlOpen, setControlOpen] = React.useState(true);
  const [objectsOpen, setObjectsOpen] = React.useState(true);

  const newDiscrepanciesCount = discrepancies.filter(
    (d) => d.status === 'Новое' || d.status === 'На проверке'
  ).length;

  const activeErrorsCount = dataErrors.filter((e) => !e.resolved).length;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-800 select-none overflow-y-auto">
      {/* Top Section / Dashboard */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 py-4 space-y-5">
        {/* Данные */}
        <div>
          <button
            onClick={() => setDataOpen(!dataOpen)}
            className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200 transition-colors"
          >
            <span>Данные</span>
            {dataOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {dataOpen && (
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveTab('all-records')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'all-records'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4" />
                  <span>Все записи</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">1 000</span>
              </button>

              <button
                onClick={() => setActiveTab('import')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'import'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4" />
                  <span>Импорт</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">XLSX/CSV</span>
              </button>

              <button
                onClick={() => setActiveTab('sources')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'sources'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4" />
                  <span>Источники</span>
                </div>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-700/50">
                  10
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Контроль */}
        <div>
          <button
            onClick={() => setControlOpen(!controlOpen)}
            className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200 transition-colors"
          >
            <span>Контроль</span>
            {controlOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {controlOpen && (
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveTab('discrepancies')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'discrepancies'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Расхождения</span>
                </div>
                {newDiscrepanciesCount > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded border border-amber-500/40">
                    {newDiscrepanciesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('errors')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'errors'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Ошибки</span>
                </div>
                {activeErrorsCount > 0 && (
                  <span className="text-[10px] bg-red-500/20 text-red-300 font-semibold px-1.5 py-0.2 rounded border border-red-500/40">
                    {activeErrorsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('duplicates')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'duplicates'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4" />
                  <span>Дубликаты</span>
                </div>
                <span className="text-[10px] text-slate-400">1</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  <span>Требуют проверки</span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.2 rounded border border-blue-500/30">
                  24
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Объекты */}
        <div>
          <button
            onClick={() => setObjectsOpen(!objectsOpen)}
            className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200 transition-colors"
          >
            <span>Объекты</span>
            {objectsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {objectsOpen && (
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Заявки</span>
              </button>

              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'clients'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Клиенты</span>
              </button>

              <button
                onClick={() => setActiveTab('cargoes')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'cargoes'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Грузы</span>
              </button>

              <button
                onClick={() => setActiveTab('inspections')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'inspections'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Инспекции</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct Sections */}
        <div className="space-y-0.5 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('matching')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'matching'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
            }`}
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Сопоставление</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Telegram</span>
            </div>
            <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded border border-sky-800">
              200
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Аналитика</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>История изменений</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Настройки</span>
          </button>
        </div>
      </div>

      {/* Footer info: strict non-AI policy reminder from specs */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Режим строгого контроля</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Без AI-решений. Окончательное решение принимает сотрудник.
        </p>
      </div>
    </aside>
  );
};
