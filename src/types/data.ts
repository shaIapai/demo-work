export type DiscrepancyPriority = 'Критический' | 'Высокий' | 'Средний' | 'Низкий';

export type DiscrepancyStatus =
  | 'Новое'
  | 'На проверке'
  | 'Подтверждено'
  | 'Исправлено'
  | 'Отклонено'
  | 'Требует уточнения';

export type MatchStatus =
  | 'Совпадает'
  | 'Расхождение'
  | 'Нет данных'
  | 'Дубликат'
  | 'Требует проверки';

export type UserRole = 'Оператор' | 'Аналитик' | 'Администратор';

export type CargoCategory = 'Зерновые' | 'Навалочные' | 'Генеральные' | 'Химические' | 'Контейнерные';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  client: string;
  clientInn: string;
  cargo: string;
  cargoCategory: CargoCategory;
  quantity: number;
  unit: string;
  netWeight: number; // кг
  grossWeight: number; // кг
  vessel: string;
  container: string;
  warehouse: string;
  sender: string;
  receiver: string;
  operationDate: string; // YYYY-MM-DD
  status: 'Проверено' | 'Требует проверки' | 'Расхождение' | 'Ошибка';
  inspector: string;
  reportNumber: string;
  createdAt: string;
  updatedAt: string;
  source: string; // 'Внутренняя БД' | 'Excel' | 'Внешняя БД' | 'Telegram' | etc.
  rawSourceValues?: Record<string, string | number>;
  notes?: string;
}

export interface SourceInfo {
  id: string;
  name: string;
  type:
    | 'Внутренняя база данных'
    | 'Excel'
    | 'CSV'
    | 'Google Sheets'
    | 'API'
    | 'Telegram'
    | 'Электронная почта'
    | 'Внешние базы данных'
    | 'PDF'
    | 'Ручной ввод';
  status: 'Активен' | 'Синхронизирован' | 'Ошибки' | 'На паузе';
  lastLoaded: string;
  recordsCount: number;
  errorCount: number;
  description: string;
}

export interface DiscrepancySourceData {
  sourceName: string;
  value: string | number;
  displayValue: string;
  timestamp: string;
  metadata?: string;
}

export interface Discrepancy {
  id: string; // e.g. 'D-000124'
  orderNumber: string;
  fieldName: keyof OrderRecord | string;
  fieldLabel: string;
  priority: DiscrepancyPriority;
  status: DiscrepancyStatus;
  sources: DiscrepancySourceData[];
  assignedTo?: string;
  detectedAt: string;
  resolution?: {
    decision: 'Значение корректно' | 'Исправить' | 'Требует уточнения' | 'Отклонить расхождение';
    chosenValue: string;
    unit: string;
    reason: string;
    confirmationSource: string;
    comment?: string;
    resolvedBy: string;
    resolvedAt: string;
  };
}

export type DataErrorCategory = 'Ошибка формата' | 'Логическая ошибка' | 'Ошибка сопоставления';

export interface DataError {
  id: string;
  orderNumber: string;
  objectNumber?: string;
  field: string;
  fieldName?: string;
  fieldLabel: string;
  errorType: 'format' | 'logic' | 'mandatory' | 'duplicate';
  category?: DataErrorCategory;
  message: string;
  description?: string;
  priority: DiscrepancyPriority;
  source: string;
  currentValue: string | number;
  date: string;
  resolved?: boolean;
}

export interface HistoryEntry {
  id: string;
  date: string;
  time: string;
  user: string;
  role?: string;
  objectId: string; // e.g. "Заявка №24581"
  orderNumber: string;
  field: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  unit: string;
  source: string;
  reason: string;
  comment?: string;
  canRevert?: boolean;
  isReverted?: boolean;
}

export interface TelegramMessage {
  id: string;
  chat: string;
  author: string;
  timestamp: string;
  text: string;
  linkedOrderNumber?: string;
  verified?: boolean;
  processed?: boolean;
  rawDate?: string;
  parsedData?: {
    weight?: string;
    actNumber?: string;
    inspector?: string;
    vessel?: string;
    container?: string;
  };
}

export interface ValidationRuleConfig {
  id: string;
  title: string;
  description: string;
  category: 'mandatory' | 'format' | 'logic' | 'duplicate';
  enabled: boolean;
  priority: DiscrepancyPriority;
}
