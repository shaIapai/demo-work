import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Database,
  FileSpreadsheet,
  MessageSquare,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Discrepancy } from '../../types/data';

interface Props {
  discrepancy: Discrepancy;
  onClose: () => void;
}

export const ManualResolutionModal: React.FC<Props> = ({ discrepancy, onClose }) => {
  const { resolveDiscrepancy, orders } = useData();

  const currentOrder = orders.find((o) => o.orderNumber === discrepancy.orderNumber);

  // Resolution mode: 'view' | 'form' | 'confirm'
  const [step, setStep] = useState<'view' | 'form' | 'confirm'>('view');
  const [decision, setDecision] = useState<
    'Значение корректно' | 'Исправить' | 'Требует уточнения' | 'Отклонить расхождение'
  >('Исправить');

  // Form states (Section 15)
  const initialCurrentValue =
    currentOrder && (currentOrder as any)[discrepancy.fieldName] !== undefined
      ? String((currentOrder as any)[discrepancy.fieldName])
      : discrepancy.sources[0]?.value !== undefined
      ? String(discrepancy.sources[0].value)
      : '';

  const [newValue, setNewValue] = useState<string>('24800');
  const [unit, setUnit] = useState<string>(currentOrder?.unit || 'кг');
  const [reason, setReason] = useState<string>('Подтверждено данными инвентаризации');
  const [confirmationSource, setConfirmationSource] = useState<string>('inventory_2026_09_13.xlsx');
  const [comment, setComment] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Pre-fill smart defaults based on the discrepancy
  useEffect(() => {
    if (discrepancy.orderNumber === '24581' && discrepancy.fieldName === 'netWeight') {
      setNewValue('24800');
      setUnit('кг');
      setReason('Подтверждено данными инвентаризации');
      setConfirmationSource('inventory_2026_09_13.xlsx');
      setComment('Сверено с весовой картой причала №5 и перепроверено драфт-сюрвеем судна VICTORIA');
    } else {
      // Pick second source as candidate if exists
      if (discrepancy.sources.length > 1) {
        setNewValue(String(discrepancy.sources[1].value));
        setConfirmationSource(discrepancy.sources[1].sourceName);
      } else {
        setNewValue(initialCurrentValue);
      }
      setReason('');
      setComment('');
    }
  }, [discrepancy, initialCurrentValue]);

  // Handle quick selection from a source card (Section 16)
  const handleSelectSourceValue = (val: string | number, sourceName: string) => {
    let cleanVal = String(val);
    // If telegram mentions "24,8 т", convert to 24800 or keep
    if (cleanVal.includes('т') || cleanVal.includes('24,8')) {
      cleanVal = '24800';
    }
    setNewValue(cleanVal);
    setConfirmationSource(sourceName);
    if (!reason) {
      setReason(`Подтверждено данными из источника: ${sourceName}`);
    }
    setStep('form');
  };

  const handleStartFix = () => {
    setDecision('Исправить');
    setStep('form');
  };

  const handleKeepExisting = () => {
    setDecision('Значение корректно');
    resolveDiscrepancy(
      discrepancy.id,
      'Значение корректно',
      initialCurrentValue,
      unit,
      'Текущее значение во внутренней БД признано корректным сотрудником',
      'Внутренняя БД',
      'Проверено оператором без изменений'
    );
  };

  const handlePostpone = () => {
    setDecision('Требует уточнения');
    resolveDiscrepancy(
      discrepancy.id,
      'Требует уточнения',
      initialCurrentValue,
      unit,
      'Требуется дополнительная информация от стивидора / диспетчера',
      'Запрос в порт',
      'Ожидание уточненных весовых документов'
    );
  };

  const handleReject = () => {
    setDecision('Отклонить расхождение');
    resolveDiscrepancy(
      discrepancy.id,
      'Отклонить расхождение',
      initialCurrentValue,
      unit,
      'Расхождение признано нерелевантным или ошибочным',
      'Решение оператора',
      'Отклонено'
    );
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setValidationError('Причина изменения обязательна для заполнения согласно правилам аудита');
      return;
    }
    setValidationError('');
    setStep('confirm');
  };

  const handleFinalConfirm = () => {
    resolveDiscrepancy(
      discrepancy.id,
      'Исправить',
      newValue,
      unit,
      reason,
      confirmationSource,
      comment
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden transition-all my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                {discrepancy.id}
              </span>
              <h2 className="text-base font-bold">
                {step === 'confirm'
                  ? 'Подтверждение изменения'
                  : step === 'form'
                  ? 'Ручное изменение данных'
                  : 'Ручная проверка расхождения'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Заявка №<strong className="text-slate-200">{discrepancy.orderNumber}</strong> • Поле:{' '}
              <strong className="text-slate-200">{discrepancy.fieldLabel}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: View Sources & Choose Decision */}
          {step === 'view' && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-semibold">Главный принцип системы:</p>
                  <p className="mt-0.5 text-blue-800 leading-relaxed">
                    Система выполнила техническое сопоставление и выявила отличие. Система{' '}
                    <strong>не принимает решение</strong>, какое значение верно. Окончательное решение
                    принимает сотрудник на основе изучения источников.
                  </p>
                </div>
              </div>

              {/* Side-by-side Sources Cards (Section 14) */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Показания подключенных источников:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {discrepancy.sources.map((src, index) => {
                    const isInternal = src.sourceName.includes('Внутренняя');
                    const isExcel = src.sourceName.includes('Excel');
                    const isTelegram = src.sourceName.includes('Telegram');

                    return (
                      <div
                        key={index}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isInternal
                            ? 'bg-slate-50 border-slate-200'
                            : isExcel
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-sky-50/40 border-sky-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {isInternal ? (
                            <Database className="w-4 h-4 text-slate-600" />
                          ) : isExcel ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-sky-600" />
                          )}
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {src.sourceName}
                          </span>
                        </div>

                        <div className="my-2 p-2 bg-white rounded-lg border border-slate-200/80">
                          <div className="text-base font-bold text-slate-900 font-mono tracking-tight">
                            {src.displayValue}
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{src.timestamp}</span>
                          </div>
                          {src.metadata && (
                            <div className="text-[10px] text-slate-500 italic truncate">
                              {src.metadata}
                            </div>
                          )}
                        </div>

                        {/* Quick Pick Action */}
                        <button
                          type="button"
                          onClick={() => handleSelectSourceValue(src.value, src.sourceName)}
                          className="w-full mt-3 text-[11px] font-semibold py-1.5 px-2 rounded-md bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-colors cursor-pointer"
                        >
                          Использовать это
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Decision of User (Section 14 & 16) */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Решение пользователя:
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={handleStartFix}
                    className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Исправить</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleKeepExisting}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Оставить БД</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePostpone}
                    className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold py-2.5 px-3 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Уточнить</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold py-2.5 px-3 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Отклонить</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Edit Form (Section 15) */}
          {step === 'form' && (
            <form onSubmit={handleProceedToConfirm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Объект:</span>
                  <div className="font-bold text-slate-800">Заявка №{discrepancy.orderNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500">Поле:</span>
                  <div className="font-bold text-slate-800">{discrepancy.fieldLabel}</div>
                </div>
                <div>
                  <span className="text-slate-500">Текущее значение во внутренней БД:</span>
                  <div className="font-mono font-semibold text-slate-700">
                    {initialCurrentValue} {unit}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Статус сверки:</span>
                  <div className="font-semibold text-amber-700">Обнаружено расхождение</div>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Новое значение <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="напр. 24800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Единица изм.
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="кг"
                  />
                </div>
              </div>

              {/* Reason (MANDATORY per spec Section 15: "Причина изменения обязательна") */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Причина изменения <span className="text-red-500 font-bold">* (Обязательно)</span>
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value) setValidationError('');
                  }}
                  placeholder="напр. Подтверждено данными инвентаризации"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {validationError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {validationError}
                  </p>
                )}
              </div>

              {/* Confirmation Source */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Источник подтверждения <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={confirmationSource}
                  onChange={(e) => setConfirmationSource(e.target.value)}
                  placeholder="напр. inventory_2026_09_13.xlsx / Сообщение инспектора"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Комментарий (опционально)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительные примечания к изменению для журнала аудита..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('view')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Далее к подтверждению</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmation Screen (Section 17) */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-3">
                <div className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                  Сводка изменения перед фиксацией:
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <span className="text-slate-500">Заявка:</span>
                    <div className="font-bold text-base">{discrepancy.orderNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Поле:</span>
                    <div className="font-bold text-base">{discrepancy.fieldLabel}</div>
                  </div>
                </div>

                {/* Diff visualizer */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                  <div className="text-left">
                    <span className="text-[11px] text-slate-500 block">Было:</span>
                    <span className="text-sm font-mono font-bold text-slate-500 line-through">
                      {initialCurrentValue} {unit}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-600" />
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-600 font-semibold block">Станет:</span>
                    <span className="text-base font-mono font-bold text-emerald-700">
                      {newValue} {unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-slate-700 pt-1">
                  <div>
                    <strong className="text-slate-900">Причина:</strong> {reason}
                  </div>
                  <div>
                    <strong className="text-slate-900">Источник:</strong> {confirmationSource}
                  </div>
                  {comment && (
                    <div>
                      <strong className="text-slate-900">Комментарий:</strong> {comment}
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-amber-100/60 rounded-md text-[11px] text-amber-900 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Изменение будет перманентно записано в историю аудита с сохранением авторства и времени.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Подтвердить изменение</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
