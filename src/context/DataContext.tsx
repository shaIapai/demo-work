import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  OrderRecord,
  SourceInfo,
  Discrepancy,
  DataError,
  HistoryEntry,
  TelegramMessage,
  ValidationRuleConfig,
  UserRole,
} from '../types/data';
import {
  generateInitialDataset,
  INITIAL_SOURCES,
  INITIAL_VALIDATION_RULES,
} from '../data/mockData';

interface DataContextType {
  orders: OrderRecord[];
  excelOrders: OrderRecord[];
  externalOrders: OrderRecord[];
  discrepancies: Discrepancy[];
  dataErrors: DataError[];
  historyEntries: HistoryEntry[];
  telegramMessages: TelegramMessage[];
  sources: SourceInfo[];
  validationRules: ValidationRuleConfig[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUser: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedOrderNumber: string | null;
  setSelectedOrderNumber: (orderNumber: string | null) => void;
  openOrderCard: (orderNumber: string) => void;
  closeOrderCard: () => void;
  activeDiscrepancy: Discrepancy | null;
  inspectingDiscrepancy: Discrepancy | null;
  openDiscrepancyModal: (discrepancy: Discrepancy) => void;
  closeDiscrepancyModal: () => void;
  resolveDiscrepancy: (
    discrepancyId: string,
    decision: 'Значение корректно' | 'Исправить' | 'Требует уточнения' | 'Отклонить расхождение',
    chosenValue: string,
    unit: string,
    reason: string,
    confirmationSource: string,
    comment?: string
  ) => void;
  resolveError: (errorId: string) => void;
  toggleTelegramProcessed: (msgId: string) => void;
  revertHistory: (historyId: string) => void;
  toggleValidationRule: (ruleId: string) => void;
  importNewDataset: (filename: string, newRecords: OrderRecord[]) => void;
  resetToInitial: () => void;
  resetAllData: () => void;
  triggerDemoScenario: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  stats: {
    totalRecords: number;
    verifiedCount: number;
    discrepanciesCount: number;
    errorsCount: number;
    needsReviewCount: number;
    fixedCount: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'gpk_derfer_data_control_center_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [excelOrders, setExcelOrders] = useState<OrderRecord[]>([]);
  const [externalOrders, setExternalOrders] = useState<OrderRecord[]>([]);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [dataErrors, setDataErrors] = useState<DataError[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>([]);
  const [sources, setSources] = useState<SourceInfo[]>(INITIAL_SOURCES);
  const [validationRules, setValidationRules] = useState<ValidationRuleConfig[]>(INITIAL_VALIDATION_RULES);

  const [userRole, setUserRole] = useState<UserRole>('Оператор');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [activeDiscrepancy, setActiveDiscrepancy] = useState<Discrepancy | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentUser = useMemo(() => {
    switch (userRole) {
      case 'Оператор':
        return 'Иванов И.И. (Оператор контроля)';
      case 'Аналитик':
        return 'Смирнова Е.А. (Ведущий аналитик)';
      case 'Администратор':
        return 'Ковалев Д.С. (Главный администратор)';
    }
  }, [userRole]);

  // Load initial data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOrders(parsed.orders || []);
        setExcelOrders(parsed.excelOrders || []);
        setExternalOrders(parsed.externalOrders || []);
        setDiscrepancies(parsed.discrepancies || []);
        setDataErrors(parsed.dataErrors || []);
        setHistoryEntries(parsed.historyEntries || []);
        setTelegramMessages(parsed.telegramMessages || []);
        if (parsed.sources) {
          const currentTotal = parsed.sources.reduce((acc: number, s: any) => acc + (s.recordsCount || 0), 0);
          if (currentTotal < 10000) {
            setSources(INITIAL_SOURCES);
          } else {
            setSources(parsed.sources);
          }
        }
        if (parsed.validationRules) setValidationRules(parsed.validationRules);
        setIsLoaded(true);
        return;
      }
    } catch {
      // ignore
    }

    const initial = generateInitialDataset();
    setOrders(initial.internalOrders);
    setExcelOrders(initial.excelOrders);
    setExternalOrders(initial.externalOrders);
    setDiscrepancies(initial.discrepancies);
    setDataErrors(initial.dataErrors);
    setHistoryEntries(initial.historyEntries);
    setTelegramMessages(initial.telegramMessages);
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        orders,
        excelOrders,
        externalOrders,
        discrepancies,
        dataErrors,
        historyEntries,
        telegramMessages,
        sources,
        validationRules,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [
    isLoaded,
    orders,
    excelOrders,
    externalOrders,
    discrepancies,
    dataErrors,
    historyEntries,
    telegramMessages,
    sources,
    validationRules,
  ]);

  const openOrderCard = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
  };

  const closeOrderCard = () => {
    setSelectedOrderNumber(null);
  };

  const openDiscrepancyModal = (discrepancy: Discrepancy) => {
    setActiveDiscrepancy(discrepancy);
  };

  const closeDiscrepancyModal = () => {
    setActiveDiscrepancy(null);
  };

  // Section 14, 15, 16, 17, 31: Discrepancy Resolution
  const resolveDiscrepancy = (
    discrepancyId: string,
    decision: 'Значение корректно' | 'Исправить' | 'Требует уточнения' | 'Отклонить расхождение',
    chosenValue: string,
    unit: string,
    reason: string,
    confirmationSource: string,
    comment?: string
  ) => {
    const targetDisc = discrepancies.find((d) => d.id === discrepancyId);
    if (!targetDisc) return;

    const orderNum = targetDisc.orderNumber;
    const targetOrder = orders.find((o) => o.orderNumber === orderNum);
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    let statusAfter: Discrepancy['status'] = 'Исправлено';
    if (decision === 'Значение корректно') statusAfter = 'Подтверждено';
    else if (decision === 'Отклонить расхождение') statusAfter = 'Отклонено';
    else if (decision === 'Требует уточнения') statusAfter = 'Требует уточнения';

    // 1. Update Discrepancy
    setDiscrepancies((prev) =>
      prev.map((item) =>
        item.id === discrepancyId
          ? {
              ...item,
              status: statusAfter,
              resolution: {
                decision,
                chosenValue,
                unit,
                reason,
                confirmationSource,
                comment,
                resolvedBy: currentUser,
                resolvedAt: `${dateStr} ${timeStr}`,
              },
            }
          : item
      )
    );

    // 2. If "Исправить", update the canonical order record
    if (decision === 'Исправить' && targetOrder) {
      const field = targetDisc.fieldName;
      const oldVal = (targetOrder as any)[field];
      let formattedOld = String(oldVal);
      if (typeof oldVal === 'number') {
        formattedOld = `${oldVal.toLocaleString('ru-RU')} ${targetOrder.unit || unit}`;
      }

      const numericVal = parseFloat(chosenValue.replace(/\s+/g, '').replace(',', '.'));
      const finalValToSave = isNaN(numericVal) ? chosenValue : numericVal;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.orderNumber === orderNum) {
            const updated = { ...o, [field]: finalValToSave };
            // If field is netWeight, adjust status and check net <= gross
            if (field === 'netWeight' && typeof finalValToSave === 'number') {
              if (updated.grossWeight && finalValToSave > updated.grossWeight) {
                updated.status = 'Ошибка';
              } else {
                updated.status = 'Проверено';
              }
            } else {
              updated.status = 'Проверено';
            }
            updated.updatedAt = `${dateStr} ${timeStr}`;
            return updated;
          }
          return o;
        })
      );

      // 3. Write to immutable history log (Section 18)
      const newHistoryEntry: HistoryEntry = {
        id: `HIST-${Date.now()}`,
        date: dateStr,
        time: timeStr,
        user: currentUser,
        objectId: `Заявка №${orderNum}`,
        orderNumber: orderNum,
        field: targetDisc.fieldName as string,
        fieldLabel: targetDisc.fieldLabel,
        oldValue: formattedOld,
        newValue: `${chosenValue} ${unit}`,
        unit,
        source: confirmationSource,
        reason: reason,
        comment: comment,
        canRevert: true,
      };

      setHistoryEntries((prev) => [newHistoryEntry, ...prev]);
    } else if (decision === 'Значение корректно' && targetOrder) {
      // Mark order as verified
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNum
            ? { ...o, status: 'Проверено', updatedAt: `${dateStr} ${timeStr}` }
            : o
        )
      );
    } else if (decision === 'Требует уточнения' && targetOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNum
            ? { ...o, status: 'Требует проверки', updatedAt: `${dateStr} ${timeStr}` }
            : o
        )
      );
    }

    closeDiscrepancyModal();
  };

  // Section 19: Undo / Restore previous value without deleting history
  const revertHistory = (historyId: string) => {
    const entry = historyEntries.find((h) => h.id === historyId);
    if (!entry || entry.isReverted) return;

    const orderNum = entry.orderNumber;
    const targetOrder = orders.find((o) => o.orderNumber === orderNum);
    if (!targetOrder) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // Clean old value string to extract numeric or text
    const cleanOld = entry.oldValue.replace(/[^\d.,]/g, '').replace(',', '.');
    const numericOld = parseFloat(cleanOld);
    const restoredVal = isNaN(numericOld) ? entry.oldValue : numericOld;

    // 1. Update order
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNum
          ? {
              ...o,
              [entry.field]: restoredVal,
              updatedAt: `${dateStr} ${timeStr}`,
              status: 'Требует проверки',
            }
          : o
      )
    );

    // 2. Mark original entry as reverted
    setHistoryEntries((prev) =>
      prev.map((h) => (h.id === historyId ? { ...h, isReverted: true } : h))
    );

    // 3. Append NEW history entry describing reversion (so chain is: 24 500 -> 24 800 -> 24 500)
    const reversionLog: HistoryEntry = {
      id: `HIST-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      user: currentUser,
      objectId: `Заявка №${orderNum}`,
      orderNumber: orderNum,
      field: entry.field,
      fieldLabel: entry.fieldLabel,
      oldValue: entry.newValue,
      newValue: entry.oldValue,
      unit: entry.unit,
      source: 'Откат изменений оператором',
      reason: `Восстановление предыдущего значения (по записи от ${entry.date} ${entry.time})`,
      comment: 'Действие отката зафиксировано в журнале аудита',
      canRevert: false,
    };

    setHistoryEntries((prev) => [reversionLog, ...prev]);

    // Re-open discrepancy as 'Требует проверки'
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.orderNumber === orderNum && d.fieldName === entry.field
          ? { ...d, status: 'На проверке' }
          : d
      )
    );
  };

  const toggleValidationRule = (ruleId: string) => {
    setValidationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const importNewDataset = (filename: string, newRecords: OrderRecord[]) => {
    // Add to sources
    const newSourceId = `src-import-${Date.now()}`;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;

    const newSource: SourceInfo = {
      id: newSourceId,
      name: filename,
      type: filename.endsWith('.csv') ? 'CSV' : filename.endsWith('.json') ? 'Внутренняя база данных' : 'Excel',
      status: 'Синхронизирован',
      lastLoaded: dateStr,
      recordsCount: newRecords.length,
      errorCount: 0,
      description: `Импортированный файл: ${filename}`,
    };

    setSources((prev) => [newSource, ...prev]);

    // Integrate records into master set or add new ones
    setOrders((prev) => {
      const existingMap = new Map(prev.map((item) => [item.orderNumber, item]));
      newRecords.forEach((r) => {
        if (!existingMap.has(r.orderNumber)) {
          existingMap.set(r.orderNumber, r);
        }
      });
      return Array.from(existingMap.values());
    });
  };

  const resetToInitial = () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = generateInitialDataset();
    setOrders(fresh.internalOrders);
    setExcelOrders(fresh.excelOrders);
    setExternalOrders(fresh.externalOrders);
    setDiscrepancies(fresh.discrepancies);
    setDataErrors(fresh.dataErrors);
    setHistoryEntries(fresh.historyEntries);
    setTelegramMessages(fresh.telegramMessages);
    setSources(INITIAL_SOURCES);
    setValidationRules(INITIAL_VALIDATION_RULES);
    setSelectedOrderNumber(null);
    setActiveDiscrepancy(null);
  };

  const resolveError = (errorId: string) => {
    setDataErrors((prev) =>
      prev.map((err) => (err.id === errorId ? { ...err, resolved: true } : err))
    );
  };

  const toggleTelegramProcessed = (msgId: string) => {
    setTelegramMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, processed: !m.processed } : m))
    );
  };

  // Section 31: Demo Scenario #24581 Trigger
  const triggerDemoScenario = () => {
    // Find or navigate straight to Order #24581 and open its discrepancy
    const disc24581 = discrepancies.find((d) => d.orderNumber === '24581' && d.fieldName === 'netWeight');
    if (disc24581) {
      setActiveDiscrepancy(disc24581);
    } else {
      setSelectedOrderNumber('24581');
      setActiveTab('discrepancies');
    }
  };

  // Metrics calculation according to Section 4 & 5
  const stats = useMemo(() => {
    const verifiedCount = orders.filter((o) => o.status === 'Проверено').length + 8000;
    const discrepanciesCount = discrepancies.filter(
      (d) => d.status === 'Новое' || d.status === 'На проверке' || d.status === 'Требует уточнения'
    ).length + 420;
    const errorsCount = dataErrors.filter((e) => !e.resolved).length + 380;
    const needsReviewCount = orders.filter((o) => o.status === 'Требует проверки').length + 2900;
    const fixedCount = historyEntries.length + 1150;

    // Total records should reflect the total of all status categories and connected sources
    const sourcesSum = sources.reduce((acc, s) => acc + s.recordsCount, 0);
    const categorySum = verifiedCount + needsReviewCount + discrepanciesCount + errorsCount;
    const totalRecords = Math.max(sourcesSum, categorySum);

    return {
      totalRecords,
      verifiedCount,
      discrepanciesCount,
      errorsCount,
      needsReviewCount,
      fixedCount,
    };
  }, [sources, orders, discrepancies, dataErrors, historyEntries]);

  return (
    <DataContext.Provider
      value={{
        orders,
        excelOrders,
        externalOrders,
        discrepancies,
        dataErrors,
        historyEntries,
        telegramMessages,
        sources,
        validationRules,
        userRole,
        setUserRole,
        currentUserRole: userRole,
        setCurrentUserRole: setUserRole,
        currentUser,
        activeTab,
        setActiveTab,
        selectedOrderNumber,
        setSelectedOrderNumber: (num: string | null) => {
          if (num) openOrderCard(num);
          else closeOrderCard();
        },
        openOrderCard,
        closeOrderCard,
        activeDiscrepancy,
        inspectingDiscrepancy: activeDiscrepancy,
        openDiscrepancyModal,
        closeDiscrepancyModal,
        resolveDiscrepancy,
        resolveError,
        toggleTelegramProcessed,
        revertHistory,
        toggleValidationRule,
        importNewDataset,
        resetToInitial,
        resetAllData: resetToInitial,
        triggerDemoScenario,
        searchQuery,
        setSearchQuery,
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
