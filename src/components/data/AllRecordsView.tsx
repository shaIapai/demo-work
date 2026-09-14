import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  FileSpreadsheet,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { OrderRecord } from '../../types/data';
import * as XLSX from 'xlsx';

export const AllRecordsView: React.FC = () => {
  const { orders, openOrderCard, openDiscrepancyModal, discrepancies } = useData();

  // Filters
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Все');
  const [cargoFilter, setCargoFilter] = useState<string>('Все');
  const [sourceFilter, setSourceFilter] = useState<string>('Все');
  const [onlyDiscrepancies, setOnlyDiscrepancies] = useState<boolean>(false);
  const [onlyErrors, setOnlyErrors] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Sorting
  const [sortField, setSortField] = useState<keyof OrderRecord>('orderNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Cargo categories for filter
  const cargoList = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.cargoCategory))).filter(Boolean);
  }, [orders]);

  // Sources list for filter
  const sourcesList = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.source))).filter(Boolean);
  }, [orders]);

  // Filter & Sort
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Search across number, client, inn, cargo, container
        if (search) {
          const s = search.toLowerCase();
          const matchNumber = o.orderNumber.toLowerCase().includes(s);
          const matchClient = o.client.toLowerCase().includes(s);
          const matchInn = o.clientInn.toLowerCase().includes(s);
          const matchCargo = o.cargo.toLowerCase().includes(s);
          const matchContainer = o.container.toLowerCase().includes(s);
          if (!matchNumber && !matchClient && !matchInn && !matchCargo && !matchContainer) {
            return false;
          }
        }

        // Status
        if (statusFilter !== 'Все' && o.status !== statusFilter) return false;

        // Cargo
        if (cargoFilter !== 'Все' && o.cargoCategory !== cargoFilter) return false;

        // Source
        if (sourceFilter !== 'Все' && o.source !== sourceFilter) return false;

        // Only discrepancies
        if (onlyDiscrepancies && o.status !== 'Расхождение') return false;

        // Only errors
        if (onlyErrors && o.status !== 'Ошибка') return false;

        return true;
      })
      .sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || '').localeCompare(String(valB || ''))
          : String(valB || '').localeCompare(String(valA || ''));
      });
  }, [
    orders,
    search,
    statusFilter,
    cargoFilter,
    sourceFilter,
    onlyDiscrepancies,
    onlyErrors,
    sortField,
    sortAsc,
  ]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleSort = (field: keyof OrderRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export to Excel (XLSX)
  const handleExportXLSX = () => {
    const exportData = filteredOrders.map((o) => ({
      'Номер заявки': o.orderNumber,
      'Дата операции': o.operationDate,
      'Клиент': o.client,
      'ИНН': o.clientInn,
      'Груз': o.cargo,
      'Категория': o.cargoCategory,
      'Количество': o.quantity,
      'Ед. изм.': o.unit,
      'Вес нетто': o.netWeight,
      'Вес брутто': o.grossWeight,
      'Склад': o.warehouse,
      'Судно': o.vessel,
      'Контейнер/вагон': o.container,
      'Статус': o.status,
      'Источник данных': o.source,
      'Дата создания': o.createdAt,
      'Дата обновления': o.updatedAt,
      'Инспектор': o.inspector,
      'Номер отчета': o.reportNumber,
      'Отправитель': o.sender,
      'Получатель': o.receiver,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Реестр заявок');
    XLSX.writeFile(wb, `orders_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const exportData = filteredOrders.map((o) => ({
      orderNumber: o.orderNumber,
      operationDate: o.operationDate,
      client: o.client,
      clientInn: o.clientInn,
      cargo: o.cargo,
      netWeight: o.netWeight,
      grossWeight: o.grossWeight,
      vessel: o.vessel,
      container: o.container,
      status: o.status,
      source: o.source,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Все записи реестра</h1>
              <p className="text-xs text-slate-500 font-medium">
                Генеральный массив данных (1 000 записей): просмотр, фильтрация, проверка расхождений
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXLSX}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Экспорт в Excel (XLSX)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>Экспорт CSV</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar (Section 10) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Top search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по номеру заявки (напр. 24581), клиенту, ИНН, грузу или контейнеру..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
            >
              <option value="Все">Все статусы</option>
              <option value="Проверено">Проверено</option>
              <option value="Требует проверки">Требует проверки</option>
              <option value="Расхождение">Расхождение</option>
              <option value="Ошибка">Ошибка</option>
            </select>

            {/* Cargo Category filter */}
            <select
              value={cargoFilter}
              onChange={(e) => {
                setCargoFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
            >
              <option value="Все">Все категории груза</option>
              {cargoList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Source filter */}
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
            >
              <option value="Все">Все источники</option>
              {sourcesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={onlyDiscrepancies}
                onChange={(e) => {
                  setOnlyDiscrepancies(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Только с расхождениями
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={onlyErrors}
                onChange={(e) => {
                  setOnlyErrors(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                Только с ошибками
              </span>
            </label>
          </div>

          <div className="text-slate-500">
            Отображено: <strong className="text-slate-800">{filteredOrders.length}</strong> из{' '}
            <span className="font-mono">1 000</span>
          </div>
        </div>
      </div>

      {/* Main Table (Section 10) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th
                  onClick={() => handleSort('orderNumber')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>№ Заявки</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('operationDate')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Дата</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('client')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Клиент / ИНН</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cargo')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Груз</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('netWeight')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Вес нетто</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Судно / Контейнер</th>
                <th className="py-3 px-3">Склад</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Статус</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Источник</th>
                <th className="py-3 px-3 text-right">Карточка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-sans">
                    Записей, соответствующих критериям фильтрации, не обнаружено
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => {
                  const hasDiscrepancy = order.status === 'Расхождение';
                  const orderDisc = discrepancies.find((d) => d.orderNumber === order.orderNumber);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        order.orderNumber === '24581'
                          ? 'bg-amber-50/40 font-bold'
                          : hasDiscrepancy
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      {/* Номер заявки */}
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => openOrderCard(order.orderNumber)}
                          className="font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>№{order.orderNumber}</span>
                          {order.orderNumber === '24581' && (
                            <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-sans">
                              КЕЙС
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Дата */}
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        {order.operationDate}
                      </td>

                      {/* Клиент / ИНН */}
                      <td className="py-2.5 px-3 font-sans">
                        <div className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {order.client}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ИНН: {order.clientInn}
                        </div>
                      </td>

                      {/* Груз */}
                      <td className="py-2.5 px-3 font-sans">
                        <div className="text-slate-800 truncate max-w-[140px]">
                          {order.cargo}
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">
                          {order.cargoCategory}
                        </span>
                      </td>

                      {/* Вес нетто */}
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-bold ${
                            hasDiscrepancy ? 'text-amber-700 font-mono' : 'text-slate-900'
                          }`}
                        >
                          {order.netWeight.toLocaleString('ru-RU')}
                        </span>{' '}
                        <span className="text-[10px] text-slate-400 font-sans">{order.unit}</span>
                      </td>

                      {/* Судно / Контейнер */}
                      <td className="py-2.5 px-3 text-[11px] text-slate-700">
                        <div className="font-semibold text-slate-800">{order.vessel}</div>
                        <div className="text-[10px] text-slate-400">{order.container}</div>
                      </td>

                      {/* Склад */}
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 font-sans">
                        {order.warehouse}
                      </td>

                      {/* Статус */}
                      <td className="py-2.5 px-3 font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            order.status === 'Проверено'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Расхождение'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : order.status === 'Ошибка'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Источник */}
                      <td className="py-2.5 px-3 text-[11px] text-slate-500 font-sans truncate max-w-[120px]">
                        {order.source}
                      </td>

                      {/* Карточка */}
                      <td className="py-2.5 px-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1">
                          {orderDisc && (
                            <button
                              onClick={() => openDiscrepancyModal(orderDisc)}
                              title="Проверить расхождение"
                              className="p-1 text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openOrderCard(order.orderNumber)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Открыть</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Страница <strong className="text-slate-800">{currentPage}</strong> из{' '}
            <strong className="text-slate-800">{totalPages || 1}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
