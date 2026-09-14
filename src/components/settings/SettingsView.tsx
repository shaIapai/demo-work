import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Database,
  Key,
  RotateCcw,
  CheckCircle2,
  Save,
  Server,
  Users,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SettingsView: React.FC = () => {
  const { resetAllData, currentUserRole, setCurrentUserRole } = useData();

  const [weightToleranceKg, setWeightToleranceKg] = useState(50);
  const [weightTolerancePct, setWeightTolerancePct] = useState(0.5);
  const [autoRecheckInterval, setAutoRecheckInterval] = useState('15');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Параметры системы</h1>
              <p className="text-xs text-slate-500 font-medium">
                Конфигурация порогов расхождений, правил аудита и интеграционных интерфейсов
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Пороги отклонений */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Пороги допустимых отклонений</span>
          </h2>
          <p className="text-xs text-slate-500">
            Если разница между источниками превышает заданный порог, система создает задачу на ручную проверку.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Допустимое абсолютное отклонение веса (кг):
              </label>
              <input
                type="number"
                value={weightToleranceKg}
                onChange={(e) => setWeightToleranceKg(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Отклонения свыше {weightToleranceKg} кг помечаются как «Расхождение»
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Допустимое относительное отклонение (%):
              </label>
              <input
                type="number"
                step="0.1"
                value={weightTolerancePct}
                onChange={(e) => setWeightTolerancePct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Стандарт морского драфт-сюрвея: 0.5%
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Роли и пользователи */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Текущая роль в сессии</span>
          </h2>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {(['Оператор', 'Аналитик', 'Администратор'] as const).map((role) => (
              <div
                key={role}
                onClick={() => setCurrentUserRole(role)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentUserRole === role
                    ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{role}</span>
                  {currentUserRole === role && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="text-[11px] font-normal text-slate-500 mt-1">
                  {role === 'Оператор' && 'Проверка и исправление расхождений'}
                  {role === 'Аналитик' && 'Просмотр аналитики и отчетов'}
                  {role === 'Администратор' && 'Откат изменений и настройка'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Резервное копирование и Демо-данные */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-red-600" />
            <span>Управление данными и сброс</span>
          </h2>
          <div className="flex items-center justify-between p-4 bg-red-50/40 rounded-xl border border-red-200 text-xs">
            <div>
              <div className="font-bold text-red-900">
                Сброс локального хранилища к исходным демонстрационным данным
              </div>
              <p className="text-[11px] text-red-700 mt-0.5">
                Восстанавливает исходные 1 000 записей, включая демо-сценарий заявки №24581
              </p>
            </div>
            <button
              type="button"
              onClick={resetAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить данные</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Настройки успешно сохранены
            </span>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить настройки</span>
          </button>
        </div>
      </form>
    </div>
  );
};
