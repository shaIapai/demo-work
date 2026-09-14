import React, { useState, useMemo } from 'react';
import {
  History,
  RotateCcw,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { HistoryEntry } from '../../types/data';
import * as XLSX from 'xlsx';

export const HistoryView: React.FC = () => {
  const { historyEntries, currentUserRole, revertHistory, openOrderCard } = useData();

  const [search, setSearch] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('Все');
  const [dateFilter, setDateFilter] = useState<string>('Все');

  // List of unique users
  const usersList = useMemo(() => {
    return Array.from(new Set(historyEntries.map((h) => h.user))).filter(Boolean);
  }, [historyEntries]);

  // List of unique dates
  const datesList = useMemo(() => {
    return Array.from(new Set(historyEntries.map((h) => h.date))).filter(Boolean);
  }, [historyEntries]);

  const filteredHistory = useMemo(() => {
    return historyEntries.filter((h) => {
      if (userFilter !== 'Все' && h.user !== userFilter) return false;
      if (dateFilter !== 'Все' && h.date !== dateFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const matchObj = h.orderNumber.toLowerCase().includes(s);
        const matchField = h.fieldLabel.toLowerCase().includes(s);
        const matchReason = h.reason.toLowerCase().includes(s);
        const matchSrc = h.source.toLowerCase().includes(s);
        if (!matchObj && !matchField && !matchReason && !matchSrc) return false;
      }
      return true;
    });
  }, [historyEntries, userFilter, dateFilter, search]);

  // Export history to XLSX
  const handleExportHistory = () => {
    const data = filteredHistory.map((h) => ({
      'Дата': h.date,
      'Время': h.time,
      'Пользователь': h.user,
      'Роль': h.role,
      'Заявка': h.orderNumber,
      'Поле': h.fieldLabel,
      'Было': h.oldValue,
      'Стало': h.newValue,
      'Причина': h.reason,
      'Источник': h.source,
      'Комментарий': h.comment || '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Журнал изменений');
    XLSX.writeFile(wb, `audit_log_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Журнал изменений и аудит</h1>
              <p className="text-xs text-slate-500 font-medium">
                Неизменяемый реестр всех ручных корректировок данных сотрудниками
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportHistory}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Экспорт журнала (Excel)</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по номеру заявки, полю, причине или источнику..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Пользователь:</span>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="Все">Все пользователи</option>
              {usersList.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Дата:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="Все">Все даты</option>
              {datesList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Записей: <strong className="text-slate-800">{filteredHistory.length}</strong>
        </div>
      </div>

      {/* History Timeline / Table (Section 21) */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            Записей в журнале по выбранным фильтрам не найдено
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white p-5 rounded-xl border transition-all shadow-xs ${
                entry.orderNumber === '24581' ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {entry.date} {entry.time}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{entry.user}</strong>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.2 rounded border border-blue-200">
                      {entry.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openOrderCard(entry.orderNumber)}
                    className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Заявка №{entry.orderNumber}
                  </button>

                  {/* Revert action (Section 21: "возможность отката изменения (для администратора)") */}
                  {currentUserRole === 'Администратор' && (
                    <button
                      onClick={() => revertHistory(entry.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Откатить</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Diff line */}
              <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Измененное поле:</span>
                  <strong className="text-slate-800 text-sm">{entry.fieldLabel}</strong>
                  <div className="mt-1 flex items-center gap-2 font-mono">
                    <span className="text-slate-500 line-through">{entry.oldValue}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-700 font-bold">{entry.newValue}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Обоснование:</span>
                  <div className="text-slate-800 mt-0.5">
                    <strong>Причина:</strong> {entry.reason}
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    <strong>Источник:</strong> {entry.source}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Комментарий аудита:</span>
                  <div className="text-slate-600 italic mt-0.5">
                    {entry.comment || 'Без дополнительного комментария'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
