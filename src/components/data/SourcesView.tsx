import React, { useState } from 'react';
import {
  Server,
  RefreshCw,
  Sliders,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  Database,
  FileSpreadsheet,
  MessageSquare,
  Mail,
  FileText,
  FileDown,
  Terminal,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SourceInfo } from '../../types/data';

export const SourcesView: React.FC = () => {
  const { sources, setActiveTab } = useData();
  const [sourcesList, setSourcesList] = useState<SourceInfo[]>(sources);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [configuredSource, setConfiguredSource] = useState<SourceInfo | null>(null);

  const getSourceIcon = (type: SourceInfo['type']) => {
    switch (type) {
      case 'Внутренняя база данных':
        return <Database className="w-5 h-5 text-blue-600" />;
      case 'Excel':
      case 'CSV':
      case 'Google Sheets':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'Telegram':
        return <MessageSquare className="w-5 h-5 text-sky-500" />;
      case 'Электронная почта':
        return <Mail className="w-5 h-5 text-purple-600" />;
      case 'API':
        return <Terminal className="w-5 h-5 text-indigo-600" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleRefresh = (id: string) => {
    setUpdatingId(id);
    setTimeout(() => {
      const now = new Date();
      const timestamp = `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
      setSourcesList((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, lastLoaded: timestamp, status: 'Синхронизирован' }
            : s
        )
      );
      setUpdatingId(null);
    }, 700);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Источники данных</h1>
              <p className="text-xs text-slate-500 font-medium">
                Подключенные информационные потоки Санкт-Петербургского филиала ООО «ГПК Дерфер»
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('import')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Подключить / загрузить файл</span>
        </button>
      </div>

      {/* Grid of Sources (Section 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sourcesList.map((src) => {
          const isUpdating = updatingId === src.id;

          return (
            <div
              key={src.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      {getSourceIcon(src.type)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-tight">
                        {src.name}
                      </h2>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {src.type}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      src.status === 'Активен' || src.status === 'Синхронизирован'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : src.status === 'Ошибки'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {src.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {src.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Записей:</span>
                    <div className="font-mono font-bold text-slate-800 text-sm">
                      {src.recordsCount.toLocaleString('ru-RU')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Ошибок:</span>
                    <div
                      className={`font-mono font-bold text-sm ${
                        src.errorCount > 0 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {src.errorCount}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500 font-mono">
                  Посл. загрузка: <strong className="text-slate-700">{src.lastLoaded}</strong>
                </div>
              </div>

              {/* Action Buttons: «Открыть», «Обновить», «Настроить» (Section 6) */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (src.type === 'Telegram') setActiveTab('telegram');
                    else setActiveTab('all-records');
                  }}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 px-2 rounded-md border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Открыть</span>
                </button>

                <button
                  onClick={() => handleRefresh(src.id)}
                  disabled={isUpdating}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 px-2 rounded-md border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span>Обновить</span>
                </button>

                <button
                  onClick={() => setConfiguredSource(src)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 px-2 rounded-md border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Настроить</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Modal for Source */}
      {configuredSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Настройка источника: {configuredSource.name}
            </h2>
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Тип коннектора:</strong> {configuredSource.type}
              </p>
              <p>
                <strong>Параметры опроса:</strong> Каждые 15 минут (активный pull/webhook)
              </p>
              <p>
                <strong>Кодировка:</strong> UTF-8 / Windows-1251 автоопределение
              </p>
              <p>
                <strong>Режим сопоставления:</strong> Детерминированный по номеру заявки и ИНН
              </p>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setConfiguredSource(null)}
                className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
