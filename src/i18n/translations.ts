export type Language = "en" | "cs" | "ru";

export const languageOptions: {
  code: Language;
  label: string;
  short: string;
  flag: string;
}[] = [
  {
    code: "en",
    label: "English",
    short: "EN",
    flag: "/images/flags/en.png",
  },
  {
    code: "cs",
    label: "Čeština",
    short: "CZ",
    flag: "/images/flags/cz.png",
  },
  {
    code: "ru",
    label: "Русский",
    short: "RU",
    flag: "/images/flags/ru.png",
  },
];

const translations = {
  en: {
    roomConstructor: "Interactive room constructor",
    howWorks: "How does it work?",
    uploadRoom: "Upload a room photo",
    uploadRoomDesc: "Add a clear photo of the room where you want to place the furniture",
    choosePhoto: "Choose photo",
    generatedAlt: "Generated AI visualization",
    roomAlt: "Room photo",
    creating: "Creating visualization…",
    mayTakeTime: "This may take some time",
    ready: "AI visualization is ready",
    saveImage: "Save image",
    changePhoto: "Change photo",
    prompt: "Prompt",
    promptHint: "Optionally add placement instructions and other details",
    promptPlaceholder: "For example: place the wardrobe by the right wall and keep the doorway clear...",
    generating: "Generating...",
    generate: "Generate",
    helpTitle: "How the constructor works",
    helpIntro: "Create a furniture visualization directly in your real room with the 2D AI constructor.",
    aiDesign: "AI Design Studio",
    aiDesignDesc: "Furniture visualization in your room",
    uploadRoomStep: "Upload a room photo",
    uploadRoomStepDesc: "Add a photo of your room so AI works with your actual interior.",
    parametersStep: "Set the required parameters",
    parametersStepDesc: "Choose a furniture model and specify width, height and depth.",
    appearanceStep: "Customize the appearance",
    appearanceStepDesc: "Choose material, color and fabric for the selected model.",
    customPromptStep: "Add your own prompt",
    customPromptStepDesc: "Describe where to place the furniture and which details should be taken into account.",
    aiResultStep: "Get an AI visualization",
    aiResultStepDesc: "Click Generate and preview the result in your room.",
    summary2d: "for visualizing furniture in your real room",
    startWork: "Got it, start working",
    close: "Close",
    catalog: "Catalog",
    openCatalog: "Open catalog",
    closeCatalog: "Close catalog",
    aiFurniture: "AI furniture constructor",
    chooseCategory: "Choose a category",
    chooseType: "Choose the required furniture type",
    allCategories: "All categories",
    chooseModel: "Choose a model",
    otherModels: "Other models",
    parameters: "Parameters",
    configureModel: "Configure the selected model",
    clickPreview: "Click to preview",
    widthMm: "Width, mm",
    heightMm: "Height, mm",
    depthMm: "Depth, mm",
    material: "Material",
    chooseMaterial: "Choose material",
    color: "Color",
    customColor: "Custom color",
    specifyColor: "Specify the required color",
    customColorPlaceholder: "For example: RAL 7035 or dark green",
    fabric: "Fabric",
    chooseFabric: "Choose fabric",
    changeProject: "Change project",
    characteristics: "Characteristics",
    width: "Width",
    height: "Height",
    depth: "Depth",
    notSpecified: "Not specified",
    standard: "Standard",
    customerPrompt: "Customer prompt",
    noPrompt: "The customer did not add a separate prompt.",
    price: "Price",
    estimatedPrice: "Estimated price",
    from: "from",
    estimatedTime: "Estimated lead time",
    addCart: "Add to cart",
    lightOak: "Light oak", naturalOak: "Natural oak", walnut: "Walnut", blackOak: "Black oak", beige: "Beige", graphite: "Graphite",
    veneer: "Veneer", velour: "Velour", boucle: "Bouclé", matting: "Matting",
    selectFurnitureFirst: "First choose a furniture model.", addRoomPhoto: "Add a room photo.", readRoomError: "Could not read the room photo.", furniturePhotoError: "Could not load the furniture photo.", generateError: "Could not create the image.", unknownError: "An unknown generation error occurred.",
  },
  cs: {
    roomConstructor: "Interaktivní návrhář místnosti",
    howWorks: "Jak to funguje?",
    uploadRoom: "Nahrajte fotografii místnosti",
    uploadRoomDesc: "Přidejte kvalitní fotografii místnosti, do které chcete umístit nábytek",
    choosePhoto: "Vybrat fotografii",
    generatedAlt: "Vygenerovaná AI vizualizace",
    roomAlt: "Fotografie místnosti",
    creating: "Vytváříme vizualizaci…",
    mayTakeTime: "Může to chvíli trvat",
    ready: "AI vizualizace je hotová",
    saveImage: "Uložit obrázek",
    changePhoto: "Změnit fotografii",
    prompt: "Prompt",
    promptHint: "Volitelně doplňte umístění a další upřesnění",
    promptPlaceholder: "Například: umístěte skříň k pravé stěně a nechte volný průchod u dveří...",
    generating: "Generování...",
    generate: "Generovat",
    helpTitle: "Jak funguje návrhář",
    helpIntro: "Vytvořte vizualizaci nábytku přímo ve své skutečné místnosti pomocí 2D AI návrháře.",
    aiDesign: "AI Design Studio", aiDesignDesc: "Vizualizace nábytku ve vaší místnosti",
    uploadRoomStep: "Nahrajte fotografii místnosti", uploadRoomStepDesc: "Přidejte fotografii své místnosti, aby AI pracovala s vaším skutečným interiérem.",
    parametersStep: "Zadejte požadované parametry", parametersStepDesc: "Vyberte model nábytku a zadejte šířku, výšku a hloubku.",
    appearanceStep: "Nastavte vzhled", appearanceStepDesc: "Vyberte materiál, barvu a látku pro zvolený model.",
    customPromptStep: "Přidejte vlastní prompt", customPromptStepDesc: "Napište, kam nábytek umístit a jaké detaily je třeba zohlednit.",
    aiResultStep: "Získejte AI vizualizaci", aiResultStepDesc: "Klikněte na Generovat a prohlédněte si výsledek ve své místnosti.",
    summary2d: "pro vizualizaci nábytku ve vaší skutečné místnosti", startWork: "Rozumím, začít pracovat", close: "Zavřít",
    catalog: "Katalog", openCatalog: "Otevřít katalog", closeCatalog: "Zavřít katalog", aiFurniture: "AI návrhář nábytku",
    chooseCategory: "Vyberte kategorii", chooseType: "Vyberte požadovaný typ nábytku", allCategories: "Všechny kategorie", chooseModel: "Vyberte model", otherModels: "Další modely", parameters: "Parametry", configureModel: "Nastavte vybraný model", clickPreview: "Kliknutím zobrazíte náhled",
    widthMm: "Šířka, mm", heightMm: "Výška, mm", depthMm: "Hloubka, mm", material: "Materiál", chooseMaterial: "Vyberte materiál", color: "Barva", customColor: "Vlastní barva", specifyColor: "Zadejte požadovanou barvu", customColorPlaceholder: "Například: RAL 7035 nebo tmavě zelená", fabric: "Látka", chooseFabric: "Vyberte látku",
    changeProject: "Změnit projekt", characteristics: "Parametry", width: "Šířka", height: "Výška", depth: "Hloubka", notSpecified: "Neuvedeno", standard: "Standardní", customerPrompt: "Prompt zákazníka", noPrompt: "Zákazník nepřidal samostatný prompt.", estimatedPrice: "Orientační cena", from: "od", estimatedTime: "Orientační termín", addCart: "Přidat do košíku",
    lightOak: "Světlý dub", naturalOak: "Přírodní dub", walnut: "Ořech", blackOak: "Černý dub", beige: "Béžová", graphite: "Grafit", veneer: "Dýha", velour: "Velur", boucle: "Buklé", matting: "Rohož",
    selectFurnitureFirst: "Nejprve vyberte model nábytku.", addRoomPhoto: "Přidejte fotografii místnosti.", readRoomError: "Fotografii místnosti se nepodařilo načíst.", furniturePhotoError: "Fotografii nábytku se nepodařilo načíst.", generateError: "Obrázek se nepodařilo vytvořit.", unknownError: "Došlo k neznámé chybě při generování.",
  },
  ru: {
    roomConstructor: "Интерактивный конструктор комнаты", howWorks: "Как это работает?",
    uploadRoom: "Загрузите фотографию комнаты", uploadRoomDesc: "Добавьте чёткую фотографию комнаты, в которой нужно разместить мебель", choosePhoto: "Выбрать фотографию", generatedAlt: "Сгенерированная AI-визуализация", roomAlt: "Фотография комнаты", creating: "Создаём визуализацию…", mayTakeTime: "Это может занять некоторое время", ready: "AI-визуализация готова", saveImage: "Сохранить изображение", changePhoto: "Изменить фото",
    prompt: "Промпт", promptHint: "При желании добавьте расположение и другие уточнения", promptPlaceholder: "Например: поставь шкаф у правой стены и сохрани свободный проход возле двери...", generating: "Генерация...", generate: "Сгенерировать",
    helpTitle: "Как работает конструктор", helpIntro: "Создайте визуализацию мебели прямо в своей реальной комнате с помощью 2D AI-конструктора.", aiDesign: "AI Design Studio", aiDesignDesc: "Визуализация мебели в вашей комнате",
    uploadRoomStep: "Загрузите фото комнаты", uploadRoomStepDesc: "Добавьте фотографию своей комнаты, чтобы AI работал именно с вашим интерьером.", parametersStep: "Укажите нужные параметры", parametersStepDesc: "Выберите модель мебели и задайте ширину, высоту и глубину.", appearanceStep: "Настройте внешний вид", appearanceStepDesc: "Выберите материал, цвет и ткань для нужной модели.", customPromptStep: "Добавьте свой промпт", customPromptStepDesc: "Напишите, где разместить мебель и какие детали нужно учесть.", aiResultStep: "Получите AI-визуализацию", aiResultStepDesc: "Нажмите «Сгенерировать» и посмотрите результат в своей комнате.",
    summary2d: "для визуализации мебели в вашей реальной комнате", startWork: "Понятно, начать работу", close: "Закрыть",
    catalog: "Каталог", openCatalog: "Открыть каталог", closeCatalog: "Закрыть каталог", aiFurniture: "AI-конструктор мебели", chooseCategory: "Выберите категорию", chooseType: "Выберите нужный тип мебели", allCategories: "Все категории", chooseModel: "Выберите модель", otherModels: "Другие модели", parameters: "Параметры", configureModel: "Настройте выбранную модель", clickPreview: "Нажмите, чтобы посмотреть",
    widthMm: "Ширина, мм", heightMm: "Высота, мм", depthMm: "Глубина, мм", material: "Материал", chooseMaterial: "Выберите материал", color: "Цвет", customColor: "Индивидуальный цвет", specifyColor: "Укажите нужный цвет", customColorPlaceholder: "Например: RAL 7035 или тёмно-зелёный", fabric: "Ткань", chooseFabric: "Выберите ткань", changeProject: "Изменить проект", characteristics: "Характеристики", width: "Ширина", height: "Высота", depth: "Глубина", notSpecified: "Не указано", standard: "Стандартная", customerPrompt: "Промпт заказчика", noPrompt: "Заказчик не добавил отдельный промпт.", estimatedPrice: "Ориентировочная стоимость", from: "от", estimatedTime: "Ориентировочный срок", addCart: "Добавить в корзину",
    lightOak: "Светлый дуб", naturalOak: "Натуральный дуб", walnut: "Орех", blackOak: "Чёрный дуб", beige: "Бежевый", graphite: "Графит", veneer: "Шпон", velour: "Велюр", boucle: "Букле", matting: "Рогожка",
    selectFurnitureFirst: "Сначала выберите модель мебели.", addRoomPhoto: "Добавьте фотографию комнаты.", readRoomError: "Не удалось прочитать фотографию комнаты.", furniturePhotoError: "Не удалось загрузить фотографию мебели.", generateError: "Не удалось создать изображение.", unknownError: "Произошла неизвестная ошибка генерации.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

type TranslationDictionary = Record<string, string>;

export function t(language: Language, key: TranslationKey): string {
  const dictionaries = translations as unknown as Record<
    Language,
    TranslationDictionary
  >;

  return (
    dictionaries[language]?.[String(key)] ??
    dictionaries.en?.[String(key)] ??
    String(key)
  );
}

const categoryNames: Record<string, Record<Language, string>> = {
  "hinged-wardrobe": { en: "Hinged wardrobe", cs: "Skříň s otočnými dveřmi", ru: "Распашной шкаф" },
  "hinged-wardrobes": { en: "Hinged wardrobe", cs: "Skříň s otočnými dveřmi", ru: "Распашной шкаф" },
  "sliding-wardrobe": { en: "Sliding wardrobe", cs: "Posuvná skříň", ru: "Шкаф-купе" },
  "sliding-wardrobes": { en: "Sliding wardrobe", cs: "Posuvná skříň", ru: "Шкаф-купе" },
  "wardrobe-system": { en: "Wardrobe system", cs: "Šatní systém", ru: "Гардеробная система" },
  "wardrobe-systems": { en: "Wardrobe system", cs: "Šatní systém", ru: "Гардеробная система" },
  "sliding-systems": { en: "Sliding systems", cs: "Posuvné systémy", ru: "Раздвижные системы" },
  "beds": { en: "Beds", cs: "Postele", ru: "Кровати" },
  "sofas": { en: "Sofas", cs: "Pohovky", ru: "Диваны" },
  "armchairs": { en: "Armchairs", cs: "Křesla", ru: "Кресла" },
  "hangers": { en: "Hangers", cs: "Věšáky", ru: "Вешалки" },
  "dressers": { en: "Cabinets and dressers", cs: "Skříňky a komody", ru: "Тумбы и комоды" },
  "tables": { en: "Tables", cs: "Stoly", ru: "Столы" },
  "chairs": { en: "Chairs", cs: "Židle", ru: "Стулья" },
  "table-chair-sets": { en: "Table and chair sets", cs: "Sady stolů a židlí", ru: "Комплекты столов и стульев" },
};

const categoryDescriptions: Record<string, Record<Language, string>> = {
  "hinged-wardrobe": { en: "Wardrobes with hinged fronts", cs: "Skříně s otočnými dveřmi", ru: "Шкафы с распашными фасадами" },
  "hinged-wardrobes": { en: "Wardrobes with hinged fronts", cs: "Skříně s otočnými dveřmi", ru: "Шкафы с распашными фасадами" },
  "sliding-wardrobe": { en: "Wardrobes with sliding doors", cs: "Skříně s posuvnými dveřmi", ru: "Шкафы с раздвижными дверями" },
  "sliding-wardrobes": { en: "Wardrobes with sliding doors", cs: "Skříně s posuvnými dveřmi", ru: "Шкафы с раздвижными дверями" },
  "wardrobe-system": { en: "Open storage systems", cs: "Otevřené úložné systémy", ru: "Открытые системы хранения" },
  "wardrobe-systems": { en: "Open storage systems", cs: "Otevřené úložné systémy", ru: "Открытые системы хранения" },
  "sliding-systems": { en: "Interior and furniture sliding systems", cs: "Interiérové a nábytkové posuvné systémy", ru: "Межкомнатные и мебельные раздвижные системы" },
  "beds": { en: "Upholstered beds", cs: "Čalouněné postele", ru: "Мягкие кровати" },
  "sofas": { en: "Straight, corner and modular sofas", cs: "Rovné, rohové a modulární pohovky", ru: "Прямые, угловые и модульные диваны" },
  "armchairs": { en: "Upholstered and designer armchairs", cs: "Čalouněná a designová křesla", ru: "Мягкие и дизайнерские кресла" },
  "hangers": { en: "Upholstered and decorative hallway hangers", cs: "Čalouněné a dekorativní věšáky", ru: "Мягкие и декоративные вешалки" },
  "dressers": { en: "Cabinets, dressers and bedside tables", cs: "Skříňky, komody a noční stolky", ru: "Тумбы, комоды и прикроватные тумбы" },
  "tables": { en: "Dining, coffee and work tables", cs: "Jídelní, konferenční a pracovní stoly", ru: "Обеденные, журнальные и рабочие столы" },
  "chairs": { en: "Dining and designer chairs", cs: "Jídelní a designové židle", ru: "Обеденные и дизайнерские стулья" },
  "table-chair-sets": { en: "Ready-made table and chair sets", cs: "Hotové sady stolů a židlí", ru: "Готовые комплекты столов со стульями" },
};

export const categoryName = (
  language: Language,
  id: string,
  fallback: string,
) => categoryNames[id]?.[language] ?? fallback;

export const categoryDescription = (
  language: Language,
  id: string,
  fallback: string,
) => categoryDescriptions[id]?.[language] ?? fallback;

export function modelName(
  language: Language,
  categoryId: string,
  name: string,
): string {
  const genericModel = name.match(
    /^(Розпашна шафа|Шафа-купе|Вбудована шафа|Гардеробна система|Ліжко|Диван|Тумба(?: або комод)?|Комод|Розсувна система|Крісло|Вішалка|Стіл|Стілець|Столи та стільці)\s*(\d{1,2})$/i,
  );

  if (!genericModel) {
    return name;
  }

  const translatedCategory = categoryName(
    language,
    categoryId,
    genericModel[1],
  );

  return `${translatedCategory} ${genericModel[2].padStart(2, "0")}`;
}

export function modelDescription(
  language: Language,
  categoryId: string,
  description: string,
): string {
  const genericDescription = description.match(
    /(?:модель|model)\s*(\d{1,2})\s*$/i,
  );

  if (!genericDescription) {
    return description;
  }

  const translatedCategory = categoryName(
    language,
    categoryId,
    description,
  );
  const number = genericDescription[1].padStart(2, "0");

  return language === "en"
    ? `${translatedCategory} — model ${number}`
    : language === "cs"
      ? `${translatedCategory} — model ${number}`
      : `${translatedCategory} — модель ${number}`;
}