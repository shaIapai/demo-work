import React, { useState } from 'react';
import {
  ArrowLeft,
  FileSpreadsheet,
  Database,
  MessageSquare,
  History,
  AlertTriangle,
  CheckCircle2,
  Ship,
  Box,
  Building2,
  Calendar,
  User,
  FileText,
  Clock,
  Layers,
  Edit3,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { OrderRecord } from '../../types/data';

interface Props {
  orderNumber: string;
  onBack: () => void;
}

export const OrderCardView: React.FC<Props> = ({ orderNumber, onBack }) => {
  const {
    orders,
    excelOrders,
    externalOrders,
    telegramMessages,
    discrepancies,
    historyEntries,
    openDiscrepancyModal,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'info' | 'sources' | 'discrepancies' | 'history'>('info');

  const canonicalOrder = orders.find((o) => o.orderNumber === orderNumber);
  const excelOrder = excelOrders.find((o) => o.orderNumber === orderNumber);
  const extOrder = externalOrders.find((o) => o.orderNumber === orderNumber);
  const orderTgMessages = telegramMessages.filter((m) => m.linkedOrderNumber === orderNumber);
  const orderDiscrepancies = discrepancies.filter((d) => d.orderNumber === orderNumber);
  const orderHistory = historyEntries.filter((h) => h.orderNumber === orderNumber);

  if (!canonicalOrder) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </button>
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <h2 className="text-lg font-bold text-slate-800">Заявка №{orderNumber} не найдена</h2>
          <p className="text-xs text-slate-500 mt-1">Проверьте правильность введенного номера.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к списку</span>
        </button>

        <div className="flex items-center gap-2">
          {orderDiscrepancies.length > 0 && (
            <button
              onClick={() => openDiscrepancyModal(orderDiscrepancies[0])}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Разрешить расхождение</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero card of Order */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                Заявка №{canonicalOrder.orderNumber}
              </h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  canonicalOrder.status === 'Проверено'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : canonicalOrder.status === 'Расхождение'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : canonicalOrder.status === 'Ошибка'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {canonicalOrder.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Операция перевалки в Большом порту Санкт-Петербург • Создано: {canonicalOrder.createdAt} • Обновлено: {canonicalOrder.updatedAt}
            </p>
          </div>

          {/* Key metrics header */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Вес нетто (БД)</div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {canonicalOrder.netWeight.toLocaleString('ru-RU')} {canonicalOrder.unit}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Судно</div>
              <div className="text-sm font-bold text-slate-800 font-mono">{canonicalOrder.vessel}</div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Контейнер</div>
              <div className="text-sm font-bold text-slate-800 font-mono">{canonicalOrder.container}</div>
            </div>
          </div>
        </div>

        {/* 4 Tabs Section 22 */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-200">
          <button
            onClick={() => setActiveSubTab('info')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Основная информация
          </button>
          <button
            onClick={() => setActiveSubTab('sources')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'sources'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Источники данных</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
              {[canonicalOrder, excelOrder, extOrder, orderTgMessages.length ? 1 : null].filter(Boolean).length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('discrepancies')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'discrepancies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Расхождения</span>
            {orderDiscrepancies.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                {orderDiscrepancies.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>История изменений</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
              {orderHistory.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Main Information */}
        {activeSubTab === 'info' && (
          <div className="pt-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Block 1: Client & Cargo */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Клиент и Груз</span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 block">Клиент:</span>
                    <strong className="text-slate-800">{canonicalOrder.client}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ИНН клиента:</span>
                    <span className="font-mono text-slate-800">{canonicalOrder.clientInn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Груз:</span>
                    <strong className="text-slate-800">{canonicalOrder.cargo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Категория:</span>
                    <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {canonicalOrder.cargoCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Block 2: Weights & Logistics */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Ship className="w-4 h-4 text-blue-600" />
                  <span>Веса и Логистика</span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 block">Вес нетто:</span>
                    <strong className="font-mono text-slate-900 text-sm">
                      {canonicalOrder.netWeight.toLocaleString('ru-RU')} {canonicalOrder.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Вес брутто:</span>
                    <strong className="font-mono text-slate-800">
                      {canonicalOrder.grossWeight.toLocaleString('ru-RU')} {canonicalOrder.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Судно:</span>
                    <strong className="font-mono text-slate-800">{canonicalOrder.vessel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Контейнер / Место:</span>
                    <strong className="font-mono text-slate-800">{canonicalOrder.container}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Склад:</span>
                    <span className="text-slate-800">{canonicalOrder.warehouse}</span>
                  </div>
                </div>
              </div>

              {/* Block 3: Inspection & Reports */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Инспекция и Документы</span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 block">Инспектор:</span>
                    <strong className="text-slate-800">{canonicalOrder.inspector}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Номер отчета / Акта:</span>
                    <span className="font-mono font-semibold text-slate-800">{canonicalOrder.reportNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Дата операции:</span>
                    <span className="font-mono text-slate-800">{canonicalOrder.operationDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Отправитель:</span>
                    <span className="text-slate-800">{canonicalOrder.sender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Получатель:</span>
                    <span className="text-slate-800">{canonicalOrder.receiver}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Sources Side by Side (Section 11) */}
        {activeSubTab === 'sources' && (
          <div className="pt-5 space-y-4">
            <div className="text-xs text-slate-500">
              Сравнение значений полей по всем подключенным информационным каналам. Различающиеся значения подсвечены желтым цветом.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-40">Поле</th>
                    <th className="py-2.5 px-3">Внутренняя БД</th>
                    <th className="py-2.5 px-3">Excel (Инвентаризация)</th>
                    <th className="py-2.5 px-3">Telegram (Инспекция)</th>
                    <th className="py-2.5 px-3">Внешняя БД (Порт)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Клиент */}
                  <tr className={excelOrder && canonicalOrder.client !== excelOrder.client ? 'bg-amber-50/60' : ''}>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">Клиент</td>
                    <td className="py-2.5 px-3 text-slate-800">{canonicalOrder.client}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {excelOrder?.client || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 italic">—</td>
                    <td className="py-2.5 px-3 text-slate-800">{extOrder?.client || '—'}</td>
                  </tr>

                  {/* Груз */}
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">Груз</td>
                    <td className="py-2.5 px-3 text-slate-800">{canonicalOrder.cargo}</td>
                    <td className="py-2.5 px-3 text-slate-800">{excelOrder?.cargo || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-800">
                      {orderTgMessages[0] ? 'Пшеница' : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">{extOrder?.cargo || '—'}</td>
                  </tr>

                  {/* Вес нетто (KEY DEMO ROW) */}
                  <tr className="bg-amber-100/50 font-semibold">
                    <td className="py-2.5 px-3 font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Вес нетто</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-900">
                      {canonicalOrder.netWeight.toLocaleString('ru-RU')} кг
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-900 font-bold bg-amber-200/50">
                      {excelOrder ? `${excelOrder.netWeight.toLocaleString('ru-RU')} кг` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-sky-900 font-bold bg-sky-100/60">
                      {orderTgMessages[0]?.text.includes('24,8') ? '24,8 т' : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">
                      {extOrder ? `${extOrder.netWeight.toLocaleString('ru-RU')} кг` : '—'}
                    </td>
                  </tr>

                  {/* Судно */}
                  <tr className={extOrder && extOrder.vessel !== canonicalOrder.vessel ? 'bg-amber-50/40' : ''}>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">Судно</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{canonicalOrder.vessel}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{excelOrder?.vessel || '—'}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {canonicalOrder.vessel}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{extOrder?.vessel || '—'}</td>
                  </tr>

                  {/* Контейнер */}
                  <tr className={excelOrder && excelOrder.container !== canonicalOrder.container ? 'bg-amber-50/60' : ''}>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">Контейнер</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{canonicalOrder.container}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-800">
                      {excelOrder?.container || '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {orderTgMessages[0] ? canonicalOrder.container : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{extOrder?.container || '—'}</td>
                  </tr>

                  {/* Дата операции */}
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">Дата операции</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{canonicalOrder.operationDate}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{excelOrder?.operationDate || '—'}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">12.09.2026</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{extOrder?.operationDate || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Discrepancies */}
        {activeSubTab === 'discrepancies' && (
          <div className="pt-5 space-y-3">
            {orderDiscrepancies.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="font-bold text-slate-800">Расхождений не обнаружено</div>
                <div className="text-xs text-slate-500 mt-1">
                  Данные во всех подключенных источниках согласованы либо уже проверены.
                </div>
              </div>
            ) : (
              orderDiscrepancies.map((disc) => (
                <div
                  key={disc.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        {disc.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        Расхождение в поле: {disc.fieldLabel}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-600 text-white">
                        {disc.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-2 flex items-center gap-4">
                      {disc.sources.map((s, i) => (
                        <span key={i} className="font-mono">
                          <strong>{s.sourceName}:</strong> {s.displayValue}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openDiscrepancyModal(disc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Проверить и исправить
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: History Timeline */}
        {activeSubTab === 'history' && (
          <div className="pt-5 space-y-4">
            {orderHistory.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                По этой заявке пока не было ручных корректировок.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {orderHistory.map((h) => (
                  <div key={h.id} className="relative bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                    <div className="flex items-center justify-between text-slate-500">
                      <div className="flex items-center gap-2 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{h.date} {h.time}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{h.user}</span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {h.fieldLabel}: <span className="line-through text-slate-500">{h.oldValue}</span> →{' '}
                      <span className="text-emerald-700">{h.newValue}</span>
                    </div>

                    <div className="text-slate-600">
                      <strong>Причина:</strong> {h.reason}
                    </div>
                    <div className="text-slate-600">
                      <strong>Источник:</strong> {h.source}
                    </div>
                    {h.comment && (
                      <div className="text-slate-500 italic">
                        <strong>Комментарий:</strong> {h.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
