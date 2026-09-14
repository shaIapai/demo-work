import {
  OrderRecord,
  SourceInfo,
  Discrepancy,
  DataError,
  HistoryEntry,
  TelegramMessage,
  ValidationRuleConfig,
  CargoCategory,
} from '../types/data';

const CLIENTS = [
  { name: 'ООО «Вектор»', inn: '7801458921', variations: ['ООО Вектор', 'Вектор ООО', 'ООО "Вектор"'] },
  { name: 'АО «Балтийский Терминал»', inn: '7805129384', variations: ['АО Балтийский Терминал', 'Балтийский Терминал АО'] },
  { name: 'ООО «Северная Логистика»', inn: '7811983742', variations: ['ООО Северная Логистика', 'Северная Логистика ООО'] },
  { name: 'ООО «АгроЭкспорт СПб»', inn: '7842091823', variations: ['ООО АгроЭкспорт СПб', 'АгроЭкспорт СПб'] },
  { name: 'АО «Морской Порт Санкт-Петербург»', inn: '7804001928', variations: ['АО Морской Порт СПб', 'Морской Порт СПб АО'] },
  { name: 'ПАО «Фосагро-Балтика»', inn: '7816029381', variations: ['ПАО Фосагро-Балтика', 'Фосагро Балтика'] },
  { name: 'ООО «Еврохим Трейдинг»', inn: '7802891230', variations: ['ООО Еврохим Трейдинг', 'Еврохим Трейдинг'] },
  { name: 'ООО «Петролеспорт Контейнер»', inn: '7805098234', variations: ['ООО Петролеспорт', 'Петролеспорт ООО'] },
  { name: 'АО «Невская Зерновая Компания»', inn: '7810349821', variations: ['АО Невская Зерновая', 'Невская Зерновая Ко'] },
  { name: 'ООО «ТрансКом Океан»', inn: '7801982736', variations: ['ООО ТрансКом Океан', 'ТрансКом Океан'] },
];

const CARGOES: { name: string; category: CargoCategory; unit: string; avgNet: number }[] = [
  { name: 'Пшеница продовольственная 3 класс', category: 'Зерновые', unit: 'кг', avgNet: 24500 },
  { name: 'Ячмень фуражный', category: 'Зерновые', unit: 'кг', avgNet: 23800 },
  { name: 'Шрот соевый гранулированный', category: 'Навалочные', unit: 'кг', avgNet: 25200 },
  { name: 'Удобрения минеральные NPK', category: 'Химические', unit: 'кг', avgNet: 26000 },
  { name: 'Кукуруза кормовая', category: 'Зерновые', unit: 'кг', avgNet: 24000 },
  { name: 'Чугун передельный в чушках', category: 'Генеральные', unit: 'кг', avgNet: 28000 },
  { name: 'Сера гранулированная', category: 'Химические', unit: 'кг', avgNet: 25000 },
  { name: 'Калий хлористый гранулят', category: 'Химические', unit: 'кг', avgNet: 26500 },
  { name: 'Целлюлоза сульфатная беленая', category: 'Генеральные', unit: 'кг', avgNet: 22000 },
  { name: 'Оборудование технологическое', category: 'Контейнерные', unit: 'кг', avgNet: 18500 },
];

const VESSELS = ['VICTORIA', 'BALTIC SEA', 'NORDIC STAR', 'СВЯТОЙ ГЕОРГИЙ', 'LADY ROSE', 'SEAPOWER', 'PETROGRAD', 'ATLANTIC SPIRIT', 'FINNMASTER'];
const WAREHOUSES = ['Терминал 1 (Причал 12)', 'Элеватор 3 (Причал 5)', 'Склад ВТТ (Сектор Б)', 'Причал 8-А', 'Холодильный комплекс 2', 'Открытая площадка 4'];
const INSPECTORS = ['Иванов И.И.', 'Смирнов А.В.', 'Ковалев Д.С.', 'Морозов Е.П.', 'Федоров М.Ю.', 'Николаев С.Н.'];

export const INITIAL_SOURCES: SourceInfo[] = [
  {
    id: 'src-internal-db',
    name: 'Внутренняя база данных',
    type: 'Внутренняя база данных',
    status: 'Активен',
    lastLoaded: '13.09.2026 15:32',
    recordsCount: 3500,
    errorCount: 18,
    description: 'Основная ERP/СУБД Санкт-Петербургского филиала ООО «ГПК Дерфер»',
  },
  {
    id: 'src-excel-inv',
    name: 'Инвентаризация.xlsx',
    type: 'Excel',
    status: 'Синхронизирован',
    lastLoaded: '13.09.2026 16:04',
    recordsCount: 2800,
    errorCount: 36,
    description: 'Файл инвентаризационного учета inventory_2026_09_13.xlsx',
  },
  {
    id: 'src-ext-db',
    name: 'Внешняя база (Портовая СУО)',
    type: 'Внешние базы данных',
    status: 'Активен',
    lastLoaded: '13.09.2026 14:15',
    recordsCount: 2100,
    errorCount: 42,
    description: 'Информационная система стивидорной компании Большого порта СПб',
  },
  {
    id: 'src-telegram',
    name: 'Telegram: Инспекции СПб',
    type: 'Telegram',
    status: 'Активен',
    lastLoaded: '13.09.2026 16:11',
    recordsCount: 380,
    errorCount: 4,
    description: 'Канал оперативных полевых докладов инспекторов на причалах',
  },
  {
    id: 'src-csv-customs',
    name: 'Таможенные декларации (CSV)',
    type: 'CSV',
    status: 'Синхронизирован',
    lastLoaded: '13.09.2026 12:00',
    recordsCount: 1650,
    errorCount: 12,
    description: 'Выгрузка из системы таможенного декларирования',
  },
  {
    id: 'src-gsheets-dispatch',
    name: 'Google Таблица диспетчера',
    type: 'Google Sheets',
    status: 'На паузе',
    lastLoaded: '12.09.2026 18:30',
    recordsCount: 550,
    errorCount: 8,
    description: 'Оперативный журнал сменного диспетчера терминала',
  },
  {
    id: 'src-api-rzd',
    name: 'API РЖД-Логистика (АСУ)',
    type: 'API',
    status: 'Активен',
    lastLoaded: '13.09.2026 15:45',
    recordsCount: 1120,
    errorCount: 15,
    description: 'Шлюз прибытия вагонов и полувагонов на припортовые станции',
  },
  {
    id: 'src-email-reports',
    name: 'Электронная почта судовладельцев',
    type: 'Электронная почта',
    status: 'Активен',
    lastLoaded: '13.09.2026 15:10',
    recordsCount: 240,
    errorCount: 21,
    description: 'Входящие нотисы готовности и коносаментные партии',
  },
  {
    id: 'src-pdf-surveys',
    name: 'PDF Сюрвейерские акты',
    type: 'PDF',
    status: 'Синхронизирован',
    lastLoaded: '13.09.2026 11:20',
    recordsCount: 140,
    errorCount: 6,
    description: 'Распознанные сканы актов драфт-сюрвея и отбора проб',
  },
  {
    id: 'src-manual-input',
    name: 'Ручной ввод оператора',
    type: 'Ручной ввод',
    status: 'Активен',
    lastLoaded: '13.09.2026 16:20',
    recordsCount: 120,
    errorCount: 2,
    description: 'Корректировки и ручные проводки инспекторов и операторов',
  },
];

export const INITIAL_VALIDATION_RULES: ValidationRuleConfig[] = [
  {
    id: 'rule-mandatory-fields',
    title: 'Обязательные поля',
    description: 'Проверка заполнения: номер заявки, клиент, дата, груз, вес, статус',
    category: 'mandatory',
    enabled: true,
    priority: 'Критический',
  },
  {
    id: 'rule-format-inn',
    title: 'Формат ИНН юридического лица',
    description: 'Проверка длины (10 цифр) и числового формата ИНН',
    category: 'format',
    enabled: true,
    priority: 'Высокий',
  },
  {
    id: 'rule-logic-weight',
    title: 'Логика весов: Вес нетто ≤ Вес брутто',
    description: 'Вес нетто не может превышать вес брутто контейнера или партии',
    category: 'logic',
    enabled: true,
    priority: 'Критический',
  },
  {
    id: 'rule-positive-weight',
    title: 'Положительные значения веса и объема',
    description: 'Значения веса нетто и брутто должны быть строго больше 0',
    category: 'logic',
    enabled: true,
    priority: 'Критический',
  },
  {
    id: 'rule-format-date',
    title: 'Стандартный формат даты',
    description: 'Соответствие формату YYYY-MM-DD или DD.MM.YYYY',
    category: 'format',
    enabled: true,
    priority: 'Низкий',
  },
  {
    id: 'rule-duplicate-order',
    title: 'Уникальность номера заявки',
    description: 'Контроль появления повторных номеров заявок в одном источнике',
    category: 'duplicate',
    enabled: true,
    priority: 'Высокий',
  },
];

export const INITIAL_TELEGRAM_MESSAGES: TelegramMessage[] = [
  {
    id: 'tg-001',
    chat: 'Инспекции СПб',
    author: 'Иван Петров',
    timestamp: '13.09.2026 16:11',
    rawDate: '2026-09-13T16:11:00',
    text: 'По заявке 24581 фактический вес 24,8 т. Проверили при выгрузке.',
    linkedOrderNumber: '24581',
    verified: true,
  },
  {
    id: 'tg-002',
    chat: 'Инспекции СПб',
    author: 'Ковалев Д.С.',
    timestamp: '13.09.2026 15:40',
    rawDate: '2026-09-13T15:40:00',
    text: 'Заявка №24582: клиент подтвердил наименование ООО "Вектор". В коносаменте без кавычек.',
    linkedOrderNumber: '24582',
    verified: false,
  },
  {
    id: 'tg-003',
    chat: 'Инспекции СПб',
    author: 'Смирнов А.В.',
    timestamp: '13.09.2026 15:15',
    rawDate: '2026-09-13T15:15:00',
    text: 'Контейнер на заявке 24583 на самом деле ABC123, на бирке опечатка ABC132 исправлена стивидором.',
    linkedOrderNumber: '24583',
    verified: true,
  },
  {
    id: 'tg-004',
    chat: 'Инспекции СПб',
    author: 'Морозов Е.П.',
    timestamp: '13.09.2026 14:50',
    rawDate: '2026-09-13T14:50:00',
    text: 'Заявка 24584: ошибка весов на причале 12! Нетто 32.1т быть не может, перевешиваем.',
    linkedOrderNumber: '24584',
    verified: false,
  },
  {
    id: 'tg-005',
    chat: 'Инспекции СПб',
    author: 'Федоров М.Ю.',
    timestamp: '13.09.2026 14:10',
    rawDate: '2026-09-13T14:10:00',
    text: 'Судно VICTORIA завершило разгрузку партии 24590. Вес совпал с инвентаризацией: 25 100 кг.',
    linkedOrderNumber: '24590',
    verified: true,
  },
  {
    id: 'tg-006',
    chat: 'Диспетчерская Порт',
    author: 'Николаев С.Н.',
    timestamp: '13.09.2026 13:30',
    rawDate: '2026-09-13T13:30:00',
    text: 'По заявке 24585 дата операции 12.09.2026, судовой журнал проверен.',
    linkedOrderNumber: '24585',
    verified: true,
  },
  {
    id: 'tg-007',
    chat: 'Инспекции СПб',
    author: 'Иван Петров',
    timestamp: '13.09.2026 12:45',
    rawDate: '2026-09-13T12:45:00',
    text: 'Заявка 24601 - партия пшеницы с элеватора 3 принята без замечаний.',
    linkedOrderNumber: '24601',
    verified: true,
  },
];

// Generate synthetic records up to 1000 items
export function generateInitialDataset(): {
  internalOrders: OrderRecord[];
  excelOrders: OrderRecord[];
  externalOrders: OrderRecord[];
  discrepancies: Discrepancy[];
  dataErrors: DataError[];
  historyEntries: HistoryEntry[];
  telegramMessages: TelegramMessage[];
} {
  const internalOrders: OrderRecord[] = [];
  const excelOrders: OrderRecord[] = [];
  const externalOrders: OrderRecord[] = [];
  const discrepancies: Discrepancy[] = [];
  const dataErrors: DataError[] = [];
  const historyEntries: HistoryEntry[] = [];

  // 1. SPECIFIC MANDATORY DEMO ORDER №24581
  const demoInternal: OrderRecord = {
    id: 'ORD-24581',
    orderNumber: '24581',
    client: 'ООО «Вектор»',
    clientInn: '7801458921',
    cargo: 'Пшеница',
    cargoCategory: 'Зерновые',
    quantity: 24500,
    unit: 'кг',
    netWeight: 24500,
    grossWeight: 26200,
    vessel: 'VICTORIA',
    container: 'MSKU4829104',
    warehouse: 'Элеватор 3 (Причал 5)',
    sender: 'ООО «АгроЭкспорт»',
    receiver: 'Dorfman Logistics GmbH',
    operationDate: '2026-09-12',
    status: 'Расхождение',
    inspector: 'Иванов И.И.',
    reportNumber: 'REP-2026-0912-81',
    createdAt: '2026-09-12 09:15',
    updatedAt: '13.09.2026 15:32',
    source: 'Внутренняя БД',
    notes: 'Партия зерна на экспорт, судно VICTORIA',
  };
  internalOrders.push(demoInternal);

  const demoExcel: OrderRecord = {
    ...demoInternal,
    netWeight: 24800,
    grossWeight: 26500,
    updatedAt: '13.09.2026 16:04',
    source: 'Инвентаризация.xlsx',
  };
  excelOrders.push(demoExcel);

  const demoExternal: OrderRecord = {
    ...demoInternal,
    netWeight: 24800,
    vessel: 'Виктория',
    updatedAt: '13.09.2026 14:15',
    source: 'Внешняя база (Портовая СУО)',
  };
  externalOrders.push(demoExternal);

  // Mandatory Discrepancy D-000124 for №24581
  discrepancies.push({
    id: 'D-000124',
    orderNumber: '24581',
    fieldName: 'netWeight',
    fieldLabel: 'Вес нетто',
    priority: 'Высокий',
    status: 'Новое',
    detectedAt: '13.09.2026 16:05',
    sources: [
      {
        sourceName: 'Внутренняя БД',
        value: 24500,
        displayValue: '24 500 кг',
        timestamp: '13.09.2026 15:32',
        metadata: 'Учетная запись складского модуля',
      },
      {
        sourceName: 'Excel (Инвентаризация)',
        value: 24800,
        displayValue: '24 800 кг',
        timestamp: '13.09.2026 16:04',
        metadata: 'inventory_2026_09_13.xlsx',
      },
      {
        sourceName: 'Telegram (Инспекции СПб)',
        value: 24800,
        displayValue: '24,8 т',
        timestamp: '13.09.2026 16:11',
        metadata: 'Сообщение инспектора: Иван Петров',
      },
    ],
  });

  // 2. SPECIFIC DEMO ORDER №24582: Client Name Discrepancy
  const ord2: OrderRecord = {
    id: 'ORD-24582',
    orderNumber: '24582',
    client: 'ООО «Вектор»',
    clientInn: '7801458921',
    cargo: 'Пшеница',
    cargoCategory: 'Зерновые',
    quantity: 24000,
    unit: 'кг',
    netWeight: 24000,
    grossWeight: 25600,
    vessel: 'VICTORIA',
    container: 'MSKU4829105',
    warehouse: 'Элеватор 3 (Причал 5)',
    sender: 'ООО «Вектор»',
    receiver: 'EuroAgro BV',
    operationDate: '2026-09-12',
    status: 'Расхождение',
    inspector: 'Смирнов А.В.',
    reportNumber: 'REP-2026-0912-82',
    createdAt: '2026-09-12 09:30',
    updatedAt: '13.09.2026 15:30',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord2);
  excelOrders.push({
    ...ord2,
    client: 'Вектор ООО',
    source: 'Инвентаризация.xlsx',
    updatedAt: '13.09.2026 16:04',
  });
  externalOrders.push({
    ...ord2,
    client: 'ООО Вектор',
    source: 'Внешняя база (Портовая СУО)',
    updatedAt: '13.09.2026 14:15',
  });
  discrepancies.push({
    id: 'D-000125',
    orderNumber: '24582',
    fieldName: 'client',
    fieldLabel: 'Клиент',
    priority: 'Средний',
    status: 'Новое',
    detectedAt: '13.09.2026 16:05',
    sources: [
      { sourceName: 'Внутренняя БД', value: 'ООО «Вектор»', displayValue: 'ООО «Вектор»', timestamp: '13.09.2026 15:30' },
      { sourceName: 'Excel', value: 'Вектор ООО', displayValue: 'Вектор ООО', timestamp: '13.09.2026 16:04' },
      { sourceName: 'Внешняя база', value: 'ООО Вектор', displayValue: 'ООО Вектор', timestamp: '13.09.2026 14:15' },
    ],
  });

  // 3. SPECIFIC DEMO ORDER №24583: Container typo
  const ord3: OrderRecord = {
    id: 'ORD-24583',
    orderNumber: '24583',
    client: 'АО «Балтийский Терминал»',
    clientInn: '7805129384',
    cargo: 'Удобрения минеральные NPK',
    cargoCategory: 'Химические',
    quantity: 26000,
    unit: 'кг',
    netWeight: 26000,
    grossWeight: 28400,
    vessel: 'BALTIC SEA',
    container: 'ABC123',
    warehouse: 'Склад ВТТ (Сектор Б)',
    sender: 'ПАО «Фосагро»',
    receiver: 'Fertilizer Trade Int',
    operationDate: '2026-09-12',
    status: 'Расхождение',
    inspector: 'Смирнов А.В.',
    reportNumber: 'REP-2026-0912-83',
    createdAt: '2026-09-12 10:00',
    updatedAt: '13.09.2026 15:15',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord3);
  excelOrders.push({
    ...ord3,
    container: 'ABC132',
    source: 'Инвентаризация.xlsx',
    updatedAt: '13.09.2026 16:04',
  });
  discrepancies.push({
    id: 'D-000126',
    orderNumber: '24583',
    fieldName: 'container',
    fieldLabel: 'Контейнер',
    priority: 'Высокий',
    status: 'Новое',
    detectedAt: '13.09.2026 16:05',
    sources: [
      { sourceName: 'Внутренняя БД', value: 'ABC123', displayValue: 'ABC123', timestamp: '13.09.2026 15:15' },
      { sourceName: 'Excel', value: 'ABC132', displayValue: 'ABC132', timestamp: '13.09.2026 16:04' },
      { sourceName: 'Telegram', value: 'ABC123', displayValue: 'ABC123 (на бирке опечатка ABC132)', timestamp: '13.09.2026 15:15' },
    ],
  });

  // 4. SPECIFIC DEMO ORDER №24584: Logical Error: Net > Gross
  const ord4: OrderRecord = {
    id: 'ORD-24584',
    orderNumber: '24584',
    client: 'ООО «Северная Логистика»',
    clientInn: '7811983742',
    cargo: 'Чугун передельный в чушках',
    cargoCategory: 'Генеральные',
    quantity: 32100,
    unit: 'кг',
    netWeight: 32100,
    grossWeight: 30000, // ERROR: Net > Gross!
    vessel: 'NORDIC STAR',
    container: 'CMAU9821481',
    warehouse: 'Терминал 1 (Причал 12)',
    sender: 'Северсталь ПАО',
    receiver: 'Nordic Metals Oy',
    operationDate: '2026-09-12',
    status: 'Ошибка',
    inspector: 'Морозов Е.П.',
    reportNumber: 'REP-2026-0912-84',
    createdAt: '2026-09-12 10:20',
    updatedAt: '13.09.2026 14:50',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord4);
  dataErrors.push({
    id: 'ERR-001',
    orderNumber: '24584',
    field: 'netWeight',
    fieldLabel: 'Вес нетто / брутто',
    errorType: 'logic',
    message: 'Вес нетто (32 100 кг) превышает вес брутто (30 000 кг)',
    priority: 'Критический',
    source: 'Внутренняя БД',
    currentValue: '32 100 кг > 30 000 кг',
    date: '13.09.2026 14:50',
  });

  // 5. SPECIFIC DEMO ORDER №24585: Date format difference
  const ord5: OrderRecord = {
    id: 'ORD-24585',
    orderNumber: '24585',
    client: 'ООО «АгроЭкспорт СПб»',
    clientInn: '7842091823',
    cargo: 'Ячмень фуражный',
    cargoCategory: 'Зерновые',
    quantity: 23800,
    unit: 'кг',
    netWeight: 23800,
    grossWeight: 25400,
    vessel: 'VICTORIA',
    container: 'MSKU9918231',
    warehouse: 'Элеватор 3 (Причал 5)',
    sender: 'ООО «АгроЭкспорт СПб»',
    receiver: 'Baltic Agro Trading',
    operationDate: '2026-09-12',
    status: 'Требует проверки',
    inspector: 'Николаев С.Н.',
    reportNumber: 'REP-2026-0912-85',
    createdAt: '2026-09-12 11:00',
    updatedAt: '13.09.2026 13:30',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord5);
  excelOrders.push({
    ...ord5,
    operationDate: '12.09.2026',
    source: 'Инвентаризация.xlsx',
    updatedAt: '13.09.2026 16:04',
  });

  // 6. SPECIFIC DEMO ORDER №24586: Duplicate test
  const ord6a: OrderRecord = {
    id: 'ORD-24586-A',
    orderNumber: '24586',
    client: 'АО «Морской Порт Санкт-Петербург»',
    clientInn: '7804001928',
    cargo: 'Целлюлоза сульфатная беленая',
    cargoCategory: 'Генеральные',
    quantity: 22000,
    unit: 'кг',
    netWeight: 22000,
    grossWeight: 23500,
    vessel: 'СВЯТОЙ ГЕОРГИЙ',
    container: 'MEDU7718291',
    warehouse: 'Холодильный комплекс 2',
    sender: 'Илим Групп',
    receiver: 'China Paper Corp',
    operationDate: '2026-09-12',
    status: 'Ошибка',
    inspector: 'Федоров М.Ю.',
    reportNumber: 'REP-2026-0912-86A',
    createdAt: '2026-09-12 11:15',
    updatedAt: '13.09.2026 12:00',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord6a);
  dataErrors.push({
    id: 'ERR-002',
    orderNumber: '24586',
    field: 'orderNumber',
    fieldLabel: 'Номер заявки',
    errorType: 'duplicate',
    message: 'Обнаружен дубликат номера заявки 24586 в системе',
    priority: 'Высокий',
    source: 'Внутренняя БД',
    currentValue: '24586',
    date: '13.09.2026 12:00',
  });

  // 7. SPECIFIC DEMO ORDER №24587: Format error - invalid INN length
  const ord7: OrderRecord = {
    id: 'ORD-24587',
    orderNumber: '24587',
    client: 'ООО «ТрансКом Океан»',
    clientInn: '7801982', // Invalid INN (7 digits instead of 10)
    cargo: 'Сера гранулированная',
    cargoCategory: 'Химические',
    quantity: 25000,
    unit: 'кг',
    netWeight: 25000,
    grossWeight: 27100,
    vessel: 'LADY ROSE',
    container: 'TGHU5518290',
    warehouse: 'Открытая площадка 4',
    sender: 'Газпром сера',
    receiver: 'Morocco Chemical Ltd',
    operationDate: '2026-09-12',
    status: 'Ошибка',
    inspector: 'Ковалев Д.С.',
    reportNumber: 'REP-2026-0912-87',
    createdAt: '2026-09-12 11:30',
    updatedAt: '13.09.2026 11:30',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord7);
  dataErrors.push({
    id: 'ERR-003',
    orderNumber: '24587',
    field: 'clientInn',
    fieldLabel: 'ИНН клиента',
    errorType: 'format',
    message: 'Некорректная длина ИНН (7 цифр вместо 10)',
    priority: 'Высокий',
    source: 'Внутренняя БД',
    currentValue: '7801982',
    date: '13.09.2026 11:30',
  });

  // 8. SPECIFIC DEMO ORDER №24588: Negative weight
  const ord8: OrderRecord = {
    id: 'ORD-24588',
    orderNumber: '24588',
    client: 'ПАО «Фосагро-Балтика»',
    clientInn: '7816029381',
    cargo: 'Калий хлористый гранулят',
    cargoCategory: 'Химические',
    quantity: -500, // Invalid negative weight
    unit: 'кг',
    netWeight: -500,
    grossWeight: 26000,
    vessel: 'SEAPOWER',
    container: 'KKFU1182746',
    warehouse: 'Причал 8-А',
    sender: 'Уралкалий',
    receiver: 'Agro Brasil SA',
    operationDate: '2026-09-12',
    status: 'Ошибка',
    inspector: 'Иванов И.И.',
    reportNumber: 'REP-2026-0912-88',
    createdAt: '2026-09-12 11:45',
    updatedAt: '13.09.2026 11:45',
    source: 'Внутренняя БД',
  };
  internalOrders.push(ord8);
  dataErrors.push({
    id: 'ERR-004',
    orderNumber: '24588',
    field: 'netWeight',
    fieldLabel: 'Вес нетто',
    errorType: 'format',
    message: 'Отрицательное значение веса нетто (-500 кг)',
    priority: 'Критический',
    source: 'Внутренняя БД',
    currentValue: '-500 кг',
    date: '13.09.2026 11:45',
  });

  // 9. Initial History Entry from specifications (Section 18)
  historyEntries.push({
    id: 'HIST-001',
    date: '13.09.2026',
    time: '18:42',
    user: 'Иванов И.И.',
    objectId: 'Заявка №24581',
    orderNumber: '24581',
    field: 'netWeight',
    fieldLabel: 'Вес нетто',
    oldValue: '24 500 кг',
    newValue: '24 800 кг',
    unit: 'кг',
    source: 'inventory_2026_09_13.xlsx',
    reason: 'Подтверждено данными инвентаризации',
    comment: 'Сверено с весовой картой причала №5 и перепроверено драфт-сюрвеем',
    canRevert: true,
  });

  // 10. Generate the remaining ~990 records deterministically
  const startOrderNum = 24589;
  const totalToGenerate = 992; // 8 + 992 = 1000 records

  for (let i = 0; i < totalToGenerate; i++) {
    const num = startOrderNum + i;
    const clientObj = CLIENTS[i % CLIENTS.length];
    const cargoObj = CARGOES[i % CARGOES.length];
    const vessel = VESSELS[i % VESSELS.length];
    const warehouse = WAREHOUSES[i % WAREHOUSES.length];
    const inspector = INSPECTORS[i % INSPECTORS.length];
    const baseWeight = cargoObj.avgNet + ((i * 137) % 3000) - 1500;
    const grossWeight = baseWeight + 1600 + ((i * 73) % 800);
    const day = (i % 28) + 1;
    const month = (i % 8) + 1;
    const dateStr = `2026-0${month < 10 ? month : month}-${day < 10 ? '0' + day : day}`;
    const container = `CONT${(1000000 + (i * 9973) % 9000000)}`;

    let status: 'Проверено' | 'Требует проверки' | 'Расхождение' | 'Ошибка' = 'Проверено';
    if (i % 7 === 0) status = 'Расхождение';
    else if (i % 11 === 0) status = 'Требует проверки';
    else if (i % 29 === 0) status = 'Ошибка';

    const order: OrderRecord = {
      id: `ORD-${num}`,
      orderNumber: String(num),
      client: clientObj.name,
      clientInn: clientObj.inn,
      cargo: cargoObj.name,
      cargoCategory: cargoObj.category,
      quantity: baseWeight,
      unit: cargoObj.unit,
      netWeight: baseWeight,
      grossWeight: grossWeight,
      vessel: vessel,
      container: container,
      warehouse: warehouse,
      sender: clientObj.name,
      receiver: `International Cargo Handler #${(i % 15) + 1}`,
      operationDate: dateStr,
      status: status,
      inspector: inspector,
      reportNumber: `REP-2026-${num}`,
      createdAt: `${dateStr} 08:00`,
      updatedAt: '13.09.2026 15:00',
      source: 'Внутренняя БД',
    };

    internalOrders.push(order);

    // Seed Excel with slight variations in some records
    if (i % 5 === 0) {
      // Weight discrepancy
      const excelWeight = baseWeight + ((i % 3 === 0) ? 300 : -250);
      excelOrders.push({
        ...order,
        netWeight: excelWeight,
        grossWeight: excelWeight + 1800,
        source: 'Инвентаризация.xlsx',
        updatedAt: '13.09.2026 16:04',
      });

      if (status === 'Расхождение' && discrepancies.length < 45) {
        discrepancies.push({
          id: `D-${String(1000 + discrepancies.length).padStart(6, '0')}`,
          orderNumber: String(num),
          fieldName: 'netWeight',
          fieldLabel: 'Вес нетто',
          priority: i % 2 === 0 ? 'Высокий' : 'Средний',
          status: 'Новое',
          detectedAt: '13.09.2026 16:05',
          sources: [
            { sourceName: 'Внутренняя БД', value: baseWeight, displayValue: `${baseWeight.toLocaleString('ru-RU')} кг`, timestamp: '13.09.2026 15:00' },
            { sourceName: 'Excel', value: excelWeight, displayValue: `${excelWeight.toLocaleString('ru-RU')} кг`, timestamp: '13.09.2026 16:04' },
          ],
        });
      }
    } else if (i % 13 === 0) {
      // Client spelling discrepancy
      const variant = clientObj.variations[1] || clientObj.name;
      excelOrders.push({
        ...order,
        client: variant,
        source: 'Инвентаризация.xlsx',
        updatedAt: '13.09.2026 16:04',
      });
      if (discrepancies.length < 50) {
        discrepancies.push({
          id: `D-${String(1000 + discrepancies.length).padStart(6, '0')}`,
          orderNumber: String(num),
          fieldName: 'client',
          fieldLabel: 'Клиент',
          priority: 'Средний',
          status: 'Новое',
          detectedAt: '13.09.2026 16:05',
          sources: [
            { sourceName: 'Внутренняя БД', value: clientObj.name, displayValue: clientObj.name, timestamp: '13.09.2026 15:00' },
            { sourceName: 'Excel', value: variant, displayValue: variant, timestamp: '13.09.2026 16:04' },
          ],
        });
      }
    } else {
      excelOrders.push({
        ...order,
        source: 'Инвентаризация.xlsx',
        updatedAt: '13.09.2026 16:04',
      });
    }

    // Seed External DB (up to 800 items)
    if (i < 792) {
      externalOrders.push({
        ...order,
        source: 'Внешняя база (Портовая СУО)',
        updatedAt: '13.09.2026 14:15',
      });
    }

    // Seed some format errors
    if (i % 47 === 0 && dataErrors.length < 35) {
      dataErrors.push({
        id: `ERR-${String(100 + dataErrors.length)}`,
        orderNumber: String(num),
        field: 'operationDate',
        fieldLabel: 'Дата операции',
        errorType: 'format',
        message: 'Нестандартный формат даты в файле импорта',
        priority: 'Низкий',
        source: 'Инвентаризация.xlsx',
        currentValue: '12-09-2026 (ожидается YYYY-MM-DD)',
        date: '13.09.2026 16:04',
      });
    }
  }

  // Generate 200 Telegram mock messages
  const telegramMessages = [...INITIAL_TELEGRAM_MESSAGES];
  const sampleInspectors = ['Иван Петров', 'Смирнов А.В.', 'Ковалев Д.С.', 'Морозов Е.П.', 'Федоров М.Ю.'];
  for (let m = 8; m <= 200; m++) {
    const linkedNum = 24580 + (m * 4) % 950;
    const author = sampleInspectors[m % sampleInspectors.length];
    const weightTons = (20 + (m % 10) * 0.9).toFixed(1);
    telegramMessages.push({
      id: `tg-${String(m).padStart(3, '0')}`,
      chat: m % 3 === 0 ? 'Диспетчерская Порт' : 'Инспекции СПб',
      author: author,
      timestamp: `13.09.2026 ${10 + (m % 6)}:${10 + (m % 50)}`,
      rawDate: `2026-09-13T${10 + (m % 6)}:${10 + (m % 50)}:00`,
      text: `Заявка №${linkedNum}: зафиксирован вес ${weightTons} т при перевалке на причале ${(m % 10) + 1}.`,
      linkedOrderNumber: String(linkedNum),
      verified: m % 2 === 0,
    });
  }

  return {
    internalOrders,
    excelOrders,
    externalOrders,
    discrepancies,
    dataErrors,
    historyEntries,
    telegramMessages,
  };
}
