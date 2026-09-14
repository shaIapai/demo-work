import React, { useState } from 'react';
import {
  Users,
  Package,
  ClipboardCheck,
  Search,
  ExternalLink,
  Building2,
  Ship,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Clock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ClientsView: React.FC = () => {
  const { orders, openOrderCard } = useData();
  const [search, setSearch] = useState('');

  // Group orders by client
  const clientsMap = React.useMemo(() => {
    const map = new Map<string, { inn: string; orderCount: number; lastOrder: string; totalWeight: number }>();
    orders.forEach((o) => {
      const existing = map.get(o.client) || {
        inn: o.clientInn,
        orderCount: 0,
        lastOrder: o.orderNumber,
        totalWeight: 0,
      };
      existing.orderCount += 1;
      existing.totalWeight += o.netWeight;
      map.set(o.client, existing);
    });
    return Array.from(map.entries()).map(([client, data]) => ({ client, ...data }));
  }, [orders]);

  const filtered = clientsMap.filter(
    (c) =>
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.inn.includes(search)
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Реестр контрагентов и клиентов</h1>
            <p className="text-xs text-slate-500 font-medium">
              Обобщенные данные по клиентам, ИНН и объему перевалок
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <input
          type="text"
          placeholder="Поиск по наименованию или ИНН..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-3 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Клиент</th>
              <th className="py-3 px-4">ИНН</th>
              <th className="py-3 px-4 text-right">Заявок в системе</th>
              <th className="py-3 px-4 text-right">Суммарный тоннаж</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-800">{item.client}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{item.inn}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">
                  {item.orderCount}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">
                  {Math.round(item.totalWeight / 1000).toLocaleString('ru-RU')} т
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CargoesView: React.FC = () => {
  const { orders } = useData();

  const cargoStats = React.useMemo(() => {
    const map = new Map<string, { category: string; count: number; totalWeight: number }>();
    orders.forEach((o) => {
      const existing = map.get(o.cargo) || { category: o.cargoCategory, count: 0, totalWeight: 0 };
      existing.count += 1;
      existing.totalWeight += o.netWeight;
      map.set(o.cargo, existing);
    });
    return Array.from(map.entries()).map(([cargo, data]) => ({ cargo, ...data }));
  }, [orders]);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Номенклатура грузов</h1>
            <p className="text-xs text-slate-500 font-medium">
              Категории, типы насыпных и генеральных грузов в порту
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cargoStats.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-800">{item.cargo}</h2>
              <span className="text-xs text-slate-400">{item.category}</span>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-blue-700 font-mono">
                {Math.round(item.totalWeight / 1000).toLocaleString('ru-RU')} т
              </div>
              <div className="text-[11px] text-slate-500">{item.count} партий</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InspectionsView: React.FC = () => {
  const { orders, openOrderCard } = useData();
  const inspectedOrders = orders.filter((o) => o.reportNumber && o.inspector);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Инспекции и акты сюрвейеров</h1>
            <p className="text-xs text-slate-500 font-medium">
              Отчеты сюрвейерских компаний и результаты перевески
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">№ Акта/Отчета</th>
              <th className="py-3 px-4">Заявка</th>
              <th className="py-3 px-4">Инспектор</th>
              <th className="py-3 px-4">Дата инспекции</th>
              <th className="py-3 px-4">Судно</th>
              <th className="py-3 px-4 text-right">Зафиксированный вес</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inspectedOrders.slice(0, 15).map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-slate-800">{o.reportNumber}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => openOrderCard(o.orderNumber)}
                    className="font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    №{o.orderNumber}
                  </button>
                </td>
                <td className="py-3 px-4 text-slate-700">{o.inspector}</td>
                <td className="py-3 px-4 text-slate-500 font-mono">{o.operationDate}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{o.vessel}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                  {o.netWeight.toLocaleString('ru-RU')} {o.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
