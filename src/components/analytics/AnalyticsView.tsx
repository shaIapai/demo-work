import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Server,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { stats, discrepancies, historyEntries } = useData();

  // Top fields with discrepancies (Section 27)
  const fieldDist = [
    { name: 'Вес нетто', count: 320, color: '#3b82f6' },
    { name: 'Вес брутто', count: 185, color: '#6366f1' },
    { name: 'Контейнер / Вагон', count: 98, color: '#ec4899' },
    { name: 'Клиент', count: 64, color: '#f59e0b' },
    { name: 'Судно', count: 42, color: '#10b981' },
    { name: 'Дата операции', count: 27, color: '#8b5cf6' },
  ];

  // Error distribution by source (Section 27)
  const sourceShareData = [
    { name: 'Внутренняя БД', value: 34, color: '#3b82f6' },
    { name: 'Excel (Инвентаризация)', value: 180, color: '#10b981' },
    { name: 'Внешняя база (Порт)', value: 95, color: '#f59e0b' },
    { name: 'РЖД API', value: 48, color: '#8b5cf6' },
    { name: 'Электронная почта', value: 52, color: '#ec4899' },
    { name: 'Telegram', value: 19, color: '#06b6d4' },
  ];

  // Weekly dynamics
  const dynamicsData = [
    { day: 'Пн (07.09)', выявлено: 120, исправлено: 85, подтверждено: 30 },
    { day: 'Вт (08.09)', выявлено: 95, исправлено: 90, подтверждено: 25 },
    { day: 'Ср (09.09)', выявлено: 140, исправлено: 110, подтверждено: 40 },
    { day: 'Чт (10.09)', выявлено: 80, исправлено: 75, подтверждено: 20 },
    { day: 'Пт (11.09)', выявлено: 110, исправлено: 105, подтверждено: 35 },
    { day: 'Сб (12.09)', выявлено: 60, исправлено: 55, подтверждено: 15 },
    { day: 'Вс (13.09)', выявлено: 75, исправлено: 70, подтверждено: 22 },
  ];

  // User activity (Section 27)
  const userActivity = [
    { name: 'Иванов И.И. (Оператор)', resolved: 142, avgTime: '1.8 мин' },
    { name: 'Петров С.А. (Аналитик)', resolved: 98, avgTime: '2.4 мин' },
    { name: 'Сидоров М.В. (Оператор)', resolved: 86, avgTime: '1.9 мин' },
    { name: 'Кузнецова Е.Н. (Админ)', resolved: 45, avgTime: '3.1 мин' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Аналитика качества данных</h1>
              <p className="text-xs text-slate-500 font-medium">
                Метрики согласованности, статистика расхождений и показатели работы операторов
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards (Section 27) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center justify-between">
            <span>Загружено записей</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {stats.totalRecords.toLocaleString('ru-RU')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">10 источников</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center justify-between">
            <span>Выявлено расхождений</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-800 font-mono mt-1">
            {stats.discrepanciesCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">5.9% массива данных</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center justify-between">
            <span>Исправлено операторами</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {stats.fixedCount}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Внесено в аудит</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center justify-between">
            <span>Среднее время проверки</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-800 font-mono mt-1">
            2.1 мин
          </div>
          <div className="text-[11px] text-purple-600 mt-1 font-medium">На одну заявку</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Top Fields with Discrepancies */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Топ расхождений по полям (Section 27)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              В каких реквизитах чаще всего встречаются несоответствия
            </p>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fieldDist} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: number) => [`${val} расхождений`, 'Количество']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {fieldDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Source Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <span>Распределение ошибок по источникам (Section 27)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Доля некорректных значений в разрезе каналов поставки
            </p>
          </div>

          <div className="h-64 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name.slice(0, 10)}... ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} ошибок`, 'Количество']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Weekly Dynamics & Operator Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Динамика расхождений за неделю</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Соотношение выявленных и разрешенных вопросов по дням
            </p>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="выявлено" stroke="#ef4444" strokeWidth={2} name="Выявлено" />
                <Line type="monotone" dataKey="исправлено" stroke="#10b981" strokeWidth={2} name="Исправлено" />
                <Line type="monotone" dataKey="подтверждено" stroke="#3b82f6" strokeWidth={2} name="Подтверждено" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Ranking */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Активность операторов</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Показатели ручной обработки данных
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {userActivity.map((user, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">{user.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ср. время заявки: <strong className="text-slate-700">{user.avgTime}</strong>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-blue-700 text-sm">
                  {user.resolved} зап.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
