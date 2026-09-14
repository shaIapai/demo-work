import React, { useState } from 'react';
import {
  GitCompare,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface UnmatchedRecord {
  id: string;
  source: string;
  rawIdentifier: string;
  clientRaw: string;
  cargo: string;
  weight: string;
  candidateOrder: string;
  candidateClient: string;
  similarity: number;
}

export const MatchingView: React.FC = () => {
  const { openOrderCard } = useData();

  const [exactMatch, setExactMatch] = useState(true);
  const [compositeMatch, setCompositeMatch] = useState(true);
  const [fuzzyMatch, setFuzzyMatch] = useState(true);
  const [threshold, setThreshold] = useState(85);

  const [unmatchedList, setUnmatchedList] = useState<UnmatchedRecord[]>([
    {
      id: 'UNM-01',
      source: 'Excel (Инвентаризация)',
      rawIdentifier: 'ЗАЯВКА 24582',
      clientRaw: 'Вектор ООО',
      cargo: 'Пшеница 3 класс',
      weight: '24 000 кг',
      candidateOrder: '24582',
      candidateClient: 'ООО «Вектор» (ИНН 7801458921)',
      similarity: 94,
    },
    {
      id: 'UNM-02',
      source: 'Внешняя база (Порт)',
      rawIdentifier: 'EXP-84729',
      clientRaw: 'Агроэкспорт Северо-Запад',
      cargo: 'Ячмень фуражный',
      weight: '31 500 кг',
      candidateOrder: '24585',
      candidateClient: 'ООО «АгроЭкспорт СПб»',
      similarity: 88,
    },
    {
      id: 'UNM-03',
      source: 'РЖД API',
      rawIdentifier: 'ВАГОН 52910481',
      clientRaw: 'Балттранс АО',
      cargo: 'Удобрения калийные',
      weight: '68 000 кг',
      candidateOrder: '24589',
      candidateClient: 'АО «Балт-Транс»',
      similarity: 91,
    },
  ]);

  const [linkedIds, setLinkedIds] = useState<string[]>([]);

  const handleLink = (id: string) => {
    setLinkedIds((prev) => [...prev, id]);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-100 text-cyan-800 rounded-lg">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Сопоставление данных и правила сопряжения
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Детерминированная идентификация сущностей и ручная привязка не сопоставленных строк
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Config Panel (Section 9) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Параметры алгоритмов сопоставления</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Строгий детерминированный режим</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Rule 1: Exact */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. Точное сопоставление</span>
                <input
                  type="checkbox"
                  checked={exactMatch}
                  onChange={(e) => setExactMatch(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </div>
              <p className="text-slate-500 mt-1.5 leading-relaxed">
                По номеру заявки, номеру контейнера (ISO 6346) или номеру вагона (8 цифр).
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 mt-2 block">
              100% точность
            </span>
          </div>

          {/* Rule 2: Composite */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. Составное сопоставление</span>
                <input
                  type="checkbox"
                  checked={compositeMatch}
                  onChange={(e) => setCompositeMatch(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </div>
              <p className="text-slate-500 mt-1.5 leading-relaxed">
                По комбинации: «Клиент + Дата + Груз» либо «Клиент + ИНН + Вес».
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 mt-2 block">
              Многофакторный ключ
            </span>
          </div>

          {/* Rule 3: Fuzzy */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">3. Нечёткое сопоставление</span>
                <input
                  type="checkbox"
                  checked={fuzzyMatch}
                  onChange={(e) => setFuzzyMatch(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </div>
              <p className="text-slate-500 mt-1.5 leading-relaxed">
                Для опечаток в названиях контрагентов («Вектор ООО» = «ООО Вектор», Левенштейн).
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Порог: {threshold}%</span>
              <input
                type="range"
                min="70"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unmatched / Proposed linking (Section 9) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Очередь ручного связывания записей
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Строки из внешних источников, требующие подтверждения связывания оператором
            </p>
          </div>
          <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200">
            Осталось связать: {unmatchedList.length - linkedIds.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Источник</th>
                <th className="py-3 px-4">Входные данные</th>
                <th className="py-3 px-4">Кандидат в системе</th>
                <th className="py-3 px-4">Сходство</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unmatchedList.map((item) => {
                const isLinked = linkedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isLinked ? 'bg-emerald-50/40 opacity-70' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {item.source}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-mono text-[11px]">
                        {item.rawIdentifier}
                      </div>
                      <div className="text-slate-600 font-medium">{item.clientRaw}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.cargo} • {item.weight}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-blue-700">
                        <button
                          onClick={() => openOrderCard(item.candidateOrder)}
                          className="hover:underline cursor-pointer"
                        >
                          Заявка №{item.candidateOrder}
                        </button>
                      </div>
                      <div className="text-slate-700">{item.candidateClient}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block font-mono font-bold text-xs bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200">
                        {item.similarity}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isLinked ? (
                        <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Связано
                        </span>
                      ) : (
                        <button
                          onClick={() => handleLink(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Связать</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
