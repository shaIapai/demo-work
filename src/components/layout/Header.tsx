import React from 'react';
import {
  Search,
  Zap,
  RotateCcw,
  Bell,
  Shield,
  UserCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types/data';

export const Header: React.FC = () => {
  const {
    currentUser,
    userRole,
    setUserRole,
    searchQuery,
    setSearchQuery,
    triggerDemoScenario,
    resetToInitial,
    stats,
    setActiveTab,
    openOrderCard,
  } = useData();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // If it looks like a number, open order card directly, otherwise go to 'all-records'
      const trimmed = searchQuery.trim();
      if (/^\d+$/.test(trimmed)) {
        openOrderCard(trimmed);
      } else {
        setActiveTab('all-records');
      }
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-sm">
            ГПК
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">
                Data Control Center
              </span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                СПб филиал
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              ООО «ГПК Дерфер» • Контроль и актуализация данных
            </div>
          </div>
        </div>

        {/* Demo Scenario Button */}
        <button
          onClick={triggerDemoScenario}
          className="ml-4 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer"
          title="Запустить обязательный проверочный сценарий: Заявка №24581 (Вес 24 500 / 24 800 / 24,8 т)"
        >
          <Zap className="w-3.5 h-3.5 text-amber-100" />
          <span>Сценарий №24581</span>
        </button>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск по номеру заявки (напр. 24581), клиенту, ИНН, судну, контейнеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Очистить
            </button>
          )}
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-4">
        {/* Role Selector (Section 28) */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
          <Shield className="w-3.5 h-3.5 text-slate-600 ml-1.5" />
          <span className="text-slate-500 font-medium">Роль:</span>
          {(['Оператор', 'Аналитик', 'Администратор'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                userRole === role
                  ? 'bg-white text-blue-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Notifications & Tasks */}
        <button
          onClick={() => setActiveTab('discrepancies')}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Расхождения и задачи, требующие внимания"
        >
          <Bell className="w-5 h-5" />
          {stats.discrepanciesCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* Reset Demo Button */}
        <button
          onClick={() => {
            if (window.confirm('Сбросить все данные к исходному демонстрационному набору?')) {
              resetToInitial();
            }
          }}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Сбросить к исходным тестовым данным"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-xs border border-blue-200">
            {userRole === 'Оператор' ? 'ИИ' : userRole === 'Аналитик' ? 'СА' : 'КД'}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser.split(' ')[0]} {currentUser.split(' ')[1]}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {userRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
