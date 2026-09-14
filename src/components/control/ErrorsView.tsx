import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  AlertOctagon,
  Search,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DataError, DataErrorCategory } from '../../types/data';

const getErrorCategory = (e: DataError): string => {
  if (e.category) return e.category;
  if (e.errorType === 'format') return 'Ошибка формата';
  if (e.errorType === 'logic') return 'Логическая ошибка';
  return 'Ошибка сопоставления';
};

const getObjectNumber = (e: DataError): string => e.objectNumber || e.orderNumber;
const getFieldName = (e: DataError): string => e.fieldName || e.fieldLabel || e.field;
const getDescription = (e: DataError): string => e.description || e.message;
const getCurrentVal = (e: DataError): string => String(e.currentValue ?? '');

export const ErrorsView: React.FC = () => {
  const { dataErrors, openOrderCard, resolveError } = useData();

  const [categoryFilter, setCategoryFilter] = useState<string>('Все');
  const [search, setSearch] = useState<string>('');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  const filteredErrors = useMemo(() => {
    return dataErrors.filter((e) => {
      if (!showResolved && e.resolved) return false;
      const cat = getErrorCategory(e);
      if (categoryFilter !== 'Все' && cat !== categoryFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const matchObj = getObjectNumber(e).toLowerCase().includes(s);
        const matchDesc = getDescription(e).toLowerCase().includes(s);
        const matchField = getFieldName(e).toLowerCase().includes(s);
        const matchVal = getCurrentVal(e).toLowerCase().includes(s);
        if (!matchObj && !matchDesc && !matchField && !matchVal) return false;
      }
      return true;
    });
  }, [dataErrors, categoryFilter, search, showResolved]);

  const stats = useMemo(() => {
    return {
      format: dataErrors.filter((e) => getErrorCategory(e) === 'Ошибка формата' && !e.resolved).length,
      logic: dataErrors.filter((e) => getErrorCategory(e) === 'Логическая ошибка' && !e.resolved).length,
      matching: dataErrors.filter((e) => getErrorCategory(e) === 'Ошибка сопоставления' && !e.resolved).length,
      total: dataErrors.filter((e) => !e.resolved).length,
    };
  }, [dataErrors]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-800 rounded-lg">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Журнал ошибок данных</h1>
              <p className="text-xs text-slate-500 font-medium">
                Автоматически выявленные дефекты формата, логические коллизии и дубликаты
              </p>
            </div>
          </div>
        </div>

        {/* Category breakdown pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('Все')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
              categoryFilter === 'Все'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Все ({stats.total})
          </button>
          <button
            onClick={() => setCategoryFilter('Ошибка формата')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
              categoryFilter === 'Ошибка формата'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            Формат ({stats.format})
          </button>
          <button
            onClick={() => setCategoryFilter('Логическая ошибка')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
              categoryFilter === 'Логическая ошибка'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Логика ({stats.logic})
          </button>
          <button
            onClick={() => setCategoryFilter('Ошибка сопоставления')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
              categoryFilter === 'Ошибка сопоставления'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            Сопоставление ({stats.matching})
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск ошибки по заявке, полю, описанию или значению..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Показывать исправленные ({dataErrors.filter((e) => e.resolved).length})</span>
        </label>
      </div>

      {/* Table of Errors (Section 18) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">Объект</th>
                <th className="py-3 px-4">Поле</th>
                <th className="py-3 px-4">Недопустимое значение</th>
                <th className="py-3 px-4">Описание ошибки</th>
                <th className="py-3 px-4">Источник</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredErrors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Ошибок по выбранным фильтрам не найдено
                  </td>
                </tr>
              ) : (
                filteredErrors.map((err) => {
                  const cat = getErrorCategory(err);
                  const objNum = getObjectNumber(err);
                  const fieldName = getFieldName(err);
                  const desc = getDescription(err);
                  const currentVal = getCurrentVal(err);

                  return (
                    <tr
                      key={err.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        err.resolved ? 'opacity-50 bg-slate-50/50' : ''
                      }`}
                    >
                      {/* Category */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                            cat === 'Ошибка формата'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : cat === 'Логическая ошибка'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {cat}
                        </span>
                      </td>

                      {/* Object */}
                      <td className="py-3 px-4 font-bold text-blue-700">
                        <button
                          onClick={() => openOrderCard(objNum)}
                          className="hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>№{objNum}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      </td>

                      {/* Field */}
                      <td className="py-3 px-4 font-semibold text-slate-800 font-mono text-[11px]">
                        {fieldName}
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4 font-mono text-[11px] text-red-700 font-bold bg-red-50/30">
                        {currentVal || '<ПУСТО>'}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-slate-700 max-w-xs leading-tight">
                        {desc}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 text-slate-500 font-sans text-[11px]">
                        {err.source}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        {err.resolved ? (
                          <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Устранена
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => resolveError(err.id)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              Исправлено
                            </button>
                            <button
                              onClick={() => openOrderCard(objNum)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-[11px] px-2 py-1 rounded transition-colors cursor-pointer"
                            >
                              Карточка
                            </button>
                          </div>
                        )}
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
