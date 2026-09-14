import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Filter,
  Search,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Discrepancy, DiscrepancyPriority, DiscrepancyStatus } from '../../types/data';

export const DiscrepanciesView: React.FC = () => {
  const { discrepancies, openDiscrepancyModal, openOrderCard } = useData();

  const [priorityFilter, setPriorityFilter] = useState<string>('Все');
  const [statusFilter, setStatusFilter] = useState<string>('Все');
  const [search, setSearch] = useState<string>('');

  const filteredDiscrepancies = useMemo(() => {
    return discrepancies.filter((d) => {
      const matchPriority = priorityFilter === 'Все' || d.priority === priorityFilter;
      const matchStatus = statusFilter === 'Все' || d.status === statusFilter;
      const matchSearch =
        !search ||
        d.orderNumber.includes(search) ||
        d.fieldLabel.toLowerCase().includes(search.toLowerCase()) ||
        d.sources.some((s) => s.displayValue.toLowerCase().includes(search.toLowerCase()));

      return matchPriority && matchStatus && matchSearch;
    });
  }, [discrepancies, priorityFilter, statusFilter, search]);

  const priorityCounts = useMemo(() => {
    return {
      all: discrepancies.length,
      critical: discrepancies.filter((d) => d.priority === 'Критический').length,
      high: discrepancies.filter((d) => d.priority === 'Высокий').length,
      medium: discrepancies.filter((d) => d.priority === 'Средний').length,
      low: discrepancies.filter((d) => d.priority === 'Низкий').length,
    };
  }, [discrepancies]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Расхождения данных
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Выявленные несоответствия между источниками. Решение принимает сотрудник.
              </p>
            </div>
          </div>
        </div>

        {/* Priority quick counters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPriorityFilter('Все')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              priorityFilter === 'Все'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Все ({priorityCounts.all})
          </button>
          <button
            onClick={() => setPriorityFilter('Критический')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              priorityFilter === 'Критический'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            Критические ({priorityCounts.critical})
          </button>
          <button
            onClick={() => setPriorityFilter('Высокий')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              priorityFilter === 'Высокий'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Высокие ({priorityCounts.high})
          </button>
          <button
            onClick={() => setPriorityFilter('Средний')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              priorityFilter === 'Средний'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            Средние ({priorityCounts.medium})
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по номеру заявки, полю или значению..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Статус:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
            >
              <option value="Все">Все статусы</option>
              <option value="Новое">Новое</option>
              <option value="На проверке">На проверке</option>
              <option value="Подтверждено">Подтверждено</option>
              <option value="Исправлено">Исправлено</option>
              <option value="Требует уточнения">Требует уточнения</option>
              <option value="Отклонено">Отклонено</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Найдено записей: <strong className="text-slate-800">{filteredDiscrepancies.length}</strong>
        </div>
      </div>

      {/* Discrepancies Table (Section 13) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Приоритет</th>
                <th className="py-3 px-4">Объект</th>
                <th className="py-3 px-4">Поле</th>
                <th className="py-3 px-4">Источник 1</th>
                <th className="py-3 px-4">Источник 2</th>
                <th className="py-3 px-4">Источник 3 (при наличии)</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDiscrepancies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Расхождений по выбранным фильтрам не найдено
                  </td>
                </tr>
              ) : (
                filteredDiscrepancies.map((d) => {
                  const src1 = d.sources[0];
                  const src2 = d.sources[1];
                  const src3 = d.sources[2];

                  return (
                    <tr
                      key={d.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        d.orderNumber === '24581' ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            d.priority === 'Критический'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : d.priority === 'Высокий'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : d.priority === 'Средний'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {d.priority}
                        </span>
                      </td>

                      {/* Object */}
                      <td className="py-3 px-4 font-bold text-blue-700">
                        <button
                          onClick={() => openOrderCard(d.orderNumber)}
                          className="hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>№{d.orderNumber}</span>
                          {d.orderNumber === '24581' && (
                            <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-mono">
                              ДЕМО
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Field */}
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {d.fieldLabel}
                      </td>

                      {/* Source 1 */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        <div>{src1?.displayValue || '—'}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{src1?.sourceName}</div>
                      </td>

                      {/* Source 2 */}
                      <td className="py-3 px-4 font-mono text-[11px] text-amber-700 font-bold bg-amber-50/40">
                        <div>{src2?.displayValue || '—'}</div>
                        <div className="text-[10px] text-slate-400 font-sans font-normal">{src2?.sourceName}</div>
                      </td>

                      {/* Source 3 */}
                      <td className="py-3 px-4 font-mono text-[11px] text-sky-700">
                        {src3 ? (
                          <>
                            <div className="font-semibold">{src3.displayValue}</div>
                            <div className="text-[10px] text-slate-400 font-sans">{src3.sourceName}</div>
                          </>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[11px] font-medium ${
                            d.status === 'Новое'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : d.status === 'Исправлено'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                              : d.status === 'Подтверждено'
                              ? 'bg-emerald-50 text-emerald-700'
                              : d.status === 'Требует уточнения'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openDiscrepancyModal(d)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Проверить</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
