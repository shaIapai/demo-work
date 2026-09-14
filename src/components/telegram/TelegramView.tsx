import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  User,
  Paperclip,
  Check,
  Send,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TelegramMessage } from '../../types/data';

export const TelegramView: React.FC = () => {
  const {
    telegramMessages,
    openOrderCard,
    toggleTelegramProcessed,
    discrepancies,
    openDiscrepancyModal,
  } = useData();

  const [search, setSearch] = useState<string>('');
  const [filterProcessed, setFilterProcessed] = useState<string>('Все');

  const filteredMessages = telegramMessages.filter((m) => {
    if (filterProcessed === 'Новые' && m.processed) return false;
    if (filterProcessed === 'Обработанные' && !m.processed) return false;
    if (search) {
      const s = search.toLowerCase();
      const matchText = m.text.toLowerCase().includes(s);
      const matchAuthor = m.author.toLowerCase().includes(s);
      const matchOrder = (m.linkedOrderNumber || '').toLowerCase().includes(s);
      if (!matchText && !matchAuthor && !matchOrder) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Лента сообщений Telegram
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Оперативные данные от сюрвейеров и инспекторов с терминалов Большого порта СПб
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Канал: <strong className="text-slate-800">@derfer_spb_inspection_bot</strong>
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск по тексту, инспектору или номеру заявки..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterProcessed('Все')}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
              filterProcessed === 'Все'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Все ({telegramMessages.length})
          </button>
          <button
            onClick={() => setFilterProcessed('Новые')}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
              filterProcessed === 'Новые'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Новые ({telegramMessages.filter((m) => !m.processed).length})
          </button>
          <button
            onClick={() => setFilterProcessed('Обработанные')}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
              filterProcessed === 'Обработанные'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Обработанные ({telegramMessages.filter((m) => m.processed).length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.map((msg) => {
          const isDemoMsg = msg.linkedOrderNumber === '24581';
          const linkedDisc = discrepancies.find((d) => d.orderNumber === msg.linkedOrderNumber);

          return (
            <div
              key={msg.id}
              className={`bg-white p-4 rounded-xl border transition-all shadow-xs ${
                isDemoMsg
                  ? 'border-sky-300 bg-sky-50/20'
                  : msg.processed
                  ? 'border-slate-200 opacity-70'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-xs text-sky-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>{msg.author}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {msg.linkedOrderNumber && (
                    <button
                      onClick={() => openOrderCard(msg.linkedOrderNumber!)}
                      className="text-xs font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Заявка №{msg.linkedOrderNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleTelegramProcessed(msg.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 border ${
                      msg.processed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{msg.processed ? 'Обработано' : 'Отметить обработанным'}</span>
                  </button>
                </div>
              </div>

              {/* Message text */}
              <div className="pt-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-800 leading-relaxed">
                  {msg.text}
                </div>

                {/* Parsed attributes pills */}
                {msg.parsedData && Object.keys(msg.parsedData).length > 0 && (
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Распознанные данные для переноса:
                    </span>
                    {msg.parsedData.weight && (
                      <span className="text-[11px] bg-sky-100 text-sky-800 font-mono font-bold px-2 py-0.5 rounded border border-sky-200">
                        Вес: {msg.parsedData.weight}
                      </span>
                    )}
                    {msg.parsedData.actNumber && (
                      <span className="text-[11px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                        Акт: {msg.parsedData.actNumber}
                      </span>
                    )}
                    {msg.parsedData.inspector && (
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        Инспектор: {msg.parsedData.inspector}
                      </span>
                    )}

                    {/* Quick transfer button to card */}
                    {linkedDisc && (
                      <button
                        onClick={() => openDiscrepancyModal(linkedDisc)}
                        className="ml-auto text-[11px] bg-amber-600 hover:bg-amber-700 text-white font-semibold px-2.5 py-1 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Применить значение (24 800 кг)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
