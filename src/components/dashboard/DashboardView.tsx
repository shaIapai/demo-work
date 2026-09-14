import React from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  History,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Server,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    stats,
    discrepancies,
    dataErrors,
    historyEntries,
    sources,
    triggerDemoScenario,
    openDiscrepancyModal,
    openOrderCard,
    setActiveTab,
  } = useData();

  const recentDiscrepancies = discrepancies.slice(0, 5);

  // Mock analytics dynamics
  const qualityDynamics = [
    { date: '07.09', расхождения: 820, ошибки: 460, исправлено: 180 },
    { date: '08.09', расхождения: 790, ошибки: 450, исправлено: 220 },
    { date: '09.09', расхождения: 760, ошибки: 440, исправлено: 310 },
    { date: '10.09', расхождения: 745, ошибки: 435, исправлено: 290 },
    { date: '11.09', расхождения: 740, ошибки: 430, исправлено: 350 },
    { date: '12.09', расхождения: 738, ошибки: 429, исправлено: 390 },
    { date: '13.09', расхождения: 736, ошибки: 428, исправлено: 415 },
  ];

  const sourceErrorDist = [
    { name: 'Внутренняя БД', count: 18, color: '#3b82f6' },
    { name: 'Excel (Инв.)', count: 36, color: '#10b981' },
    { name: 'Внешняя база', count: 42, color: '#f59e0b' },
    { name: 'РЖД API', count: 15, color: '#8b5cf6' },
    { name: 'Почта', count: 21, color: '#ec4899' },
    { name: 'Telegram', count: 4, color: '#06b6d4' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Data Control Center
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              Версия 1.0 (Без AI)
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Система контроля и актуализации данных • Санкт-Петербургский филиал ООО «ГПК Дерфер»
          </p>
        </div>

        {/* Demo trigger card */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              Демонстрационный сценарий: Заявка №24581
            </div>
            <div className="text-[11px] text-amber-700">
              Внутренняя БД (24 500 кг) ↔ Excel (24 800 кг) ↔ Telegram (24,8 т)
            </div>
          </div>
          <button
            onClick={triggerDemoScenario}
            className="ml-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            Открыть кейс
          </button>
        </div>
      </div>

      {/* Section 4: Main 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Всего записей */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Всего записей</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
            {stats.totalRecords.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            По 10 источникам
          </div>
        </div>

        {/* 2. Проверено */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-medium">Проверено</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight font-mono">
            {stats.verifiedCount.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {stats.totalRecords > 0
              ? Math.min(100, (stats.verifiedCount / stats.totalRecords) * 100).toFixed(1)
              : '0.0'}
            % актуализировано
          </div>
        </div>

        {/* 3. Расхождения */}
        <div
          onClick={() => setActiveTab('discrepancies')}
          className="bg-white p-4 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50/40 to-white shadow-xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-medium">Расхождения</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-800 tracking-tight font-mono">
            {stats.discrepanciesCount.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
            <span>Требуют решения</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* 4. Ошибки */}
        <div
          onClick={() => setActiveTab('errors')}
          className="bg-white p-4 rounded-xl border border-red-200 bg-gradient-to-b from-red-50/40 to-white shadow-xs hover:border-red-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-xs font-medium">Ошибки</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-800 tracking-tight font-mono">
            {stats.errorsCount.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-red-700 mt-1 flex items-center gap-1 font-medium">
            <span>Формат и логика</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* 5. Требуют проверки */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-medium">Требуют проверки</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-800 tracking-tight font-mono">
            {stats.needsReviewCount.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-medium">
            Необработанные
          </div>
        </div>

        {/* 6. Исправлено */}
        <div
          onClick={() => setActiveTab('history')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-medium">Исправлено</span>
            <History className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-800 tracking-tight font-mono">
            {stats.fixedCount.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-purple-600 mt-1 font-medium">
            С фиксацией в аудите
          </div>
        </div>
      </div>

      {/* Section 5: "Состояние данных" Block & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Состояние данных Box matching Section 5 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Состояние данных</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">13.09.2026 16:30</span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Всего записей:</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {stats.totalRecords.toLocaleString('ru-RU')}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Проверено (актуально):
                </span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {stats.verifiedCount.toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full max-w-full transition-all duration-300"
                  style={{
                    width: `${stats.totalRecords > 0 ? Math.min(100, Math.max(0, (stats.verifiedCount / stats.totalRecords) * 100)) : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Требует проверки:
                </span>
                <span className="font-semibold text-blue-700 font-mono">
                  {stats.needsReviewCount.toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full max-w-full transition-all duration-300"
                  style={{
                    width: `${stats.totalRecords > 0 ? Math.min(100, Math.max(0, (stats.needsReviewCount / stats.totalRecords) * 100)) : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Имеются расхождения:
                </span>
                <span className="font-semibold text-amber-700 font-mono">
                  {stats.discrepanciesCount.toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full max-w-full transition-all duration-300"
                  style={{
                    width: `${stats.totalRecords > 0 ? Math.min(100, Math.max(0, (stats.discrepanciesCount / stats.totalRecords) * 100)) : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Имеются ошибки:
                </span>
                <span className="font-semibold text-red-700 font-mono">
                  {stats.errorsCount.toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-500 h-1.5 rounded-full max-w-full transition-all duration-300"
                  style={{
                    width: `${stats.totalRecords > 0 ? Math.min(100, Math.max(0, (stats.errorsCount / stats.totalRecords) * 100)) : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Алгоритм сверки:</span>
              <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                Детерминированный (без AI)
              </span>
            </div>
          </div>
        </div>

        {/* Quality dynamics chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Динамика выявления и устранения расхождений</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                За последние 7 дней работы филиала
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Подробная аналитика <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qualityDynamics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDisc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="расхождения"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDisc)"
                  name="Расхождения"
                />
                <Area
                  type="monotone"
                  dataKey="исправлено"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFixed)"
                  name="Исправлено"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables section: Discrepancies awaiting human review + Connected sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Discrepancies Table (2 columns) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Очередь ручной проверки расхождений</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Сравнение значений из подключенных источников (ручное решение сотрудника)
              </p>
            </div>
            <button
              onClick={() => setActiveTab('discrepancies')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Все расхождения ({discrepancies.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Приоритет</th>
                  <th className="py-2.5 px-3">Объект</th>
                  <th className="py-2.5 px-3">Поле</th>
                  <th className="py-2.5 px-3">Источник 1</th>
                  <th className="py-2.5 px-3">Источник 2</th>
                  <th className="py-2.5 px-3">Статус</th>
                  <th className="py-2.5 px-3 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDiscrepancies.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          d.priority === 'Критический'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : d.priority === 'Высокий'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {d.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">
                      <button
                        onClick={() => openOrderCard(d.orderNumber)}
                        className="hover:underline cursor-pointer"
                      >
                        №{d.orderNumber}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {d.fieldLabel}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {d.sources[0]?.displayValue || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-amber-700 font-semibold font-mono text-[11px] bg-amber-50/50">
                      {d.sources[1]?.displayValue || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          d.status === 'Новое'
                            ? 'bg-blue-50 text-blue-700'
                            : d.status === 'Исправлено'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => openDiscrepancyModal(d)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        Проверить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Connected Sources Overview (Section 6) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Источники данных</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Статус поступления информации
              </p>
            </div>
            <button
              onClick={() => setActiveTab('sources')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Все (10) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {sources.slice(0, 5).map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <span>{src.name}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        src.status === 'Активен' || src.status === 'Синхронизирован'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    Загрузка: {src.lastLoaded}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-700">
                    {src.recordsCount} зап.
                  </div>
                  {src.errorCount > 0 && (
                    <div className="text-[10px] text-red-600 font-semibold">
                      {src.errorCount} ошибок
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('import')}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>Загрузить новый XLSX / CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
