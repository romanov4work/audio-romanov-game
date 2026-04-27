// Объединённые уровни

// 1. Скороговорки + Сложные слова
const COMBINED_TONGUE_TWISTERS = {
    id: 'combined-tongue-twisters',
    title: 'Скороговорки и слова',
    description: 'Тренируй дикцию со скороговорками и сложными словами',
    icon: '👅',
    difficulty: 'medium',
    tasks: [
        // Лёгкие скороговорки
        { type: 'tongue-twister', text: 'Шла Саша по шоссе и сосала сушку', emotion: null, targetAccuracy: 0.8 },
        { type: 'tongue-twister', text: 'На дворе трава, на траве дрова', emotion: null, targetAccuracy: 0.8 },
        { type: 'tongue-twister', text: 'Белый снег, белый мел, белый заяц тоже бел', emotion: null, targetAccuracy: 0.8 },

        // Сложные слова
        { type: 'word', text: 'Достопримечательность', emotion: null, targetAccuracy: 0.85 },
        { type: 'word', text: 'Субстанциональность', emotion: null, targetAccuracy: 0.85 },

        // Сложные скороговорки
        { type: 'tongue-twister', text: 'Карл у Клары украл кораллы, а Клара у Карла украла кларнет', emotion: null, targetAccuracy: 0.8 },
        { type: 'tongue-twister', text: 'Ехал Грека через реку, видит Грека в реке рак', emotion: null, targetAccuracy: 0.8 },

        // Ещё сложные слова
        { type: 'word', text: 'Высокопревосходительство', emotion: null, targetAccuracy: 0.85 },
        { type: 'word', text: 'Переосвидетельствование', emotion: null, targetAccuracy: 0.85 },

        // Очень сложные скороговорки
        { type: 'tongue-twister', text: 'Расскажите про покупки. Про какие про покупки? Про покупки, про покупки, про покупочки свои', emotion: null, targetAccuracy: 0.85 },
        { type: 'tongue-twister', text: 'Корабли лавировали, лавировали, да не вылавировали', emotion: null, targetAccuracy: 0.85 }
    ]
};

// 2. Озвучка + Дыхание + Артикуляция
const COMBINED_VOICING = {
    id: 'combined-voicing',
    title: 'Озвучка и дыхание',
    description: 'Озвучивай с эмоциями и тренируй дыхание',
    icon: '🎭',
    difficulty: 'medium',
    tasks: [
        // Дыхательные упражнения
        { type: 'breathing', text: 'Вдохни глубоко через нос, выдохни через рот: Ааааааа', emotion: null, targetAccuracy: 0.7, instruction: 'Сделай глубокий вдох и на выдохе произнеси звук А' },
        { type: 'breathing', text: 'Ууууууу', emotion: null, targetAccuracy: 0.7, instruction: 'Вдохни и на выдохе тяни звук У' },

        // Артикуляция
        { type: 'articulation', text: 'Па-па-па, ба-ба-ба', emotion: null, targetAccuracy: 0.75, instruction: 'Чётко произноси каждый слог' },
        { type: 'articulation', text: 'Та-та-та, да-да-да', emotion: null, targetAccuracy: 0.75, instruction: 'Язык касается верхних зубов' },

        // Озвучка с эмоциями
        { type: 'voicing', text: 'Ура! Мы победили!', emotion: 'радость', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Ой, как страшно!', emotion: 'испуг', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Я так устал...', emotion: 'грусть', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Это невозможно!', emotion: 'удивление', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Я не буду это делать!', emotion: 'злость', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Какой прекрасный день!', emotion: 'восторг', targetAccuracy: 0.75 },

        // Продвинутая озвучка
        { type: 'voicing', text: 'Не может быть!', emotion: 'шок', targetAccuracy: 0.8 },
        { type: 'voicing', text: 'Я так рад тебя видеть!', emotion: 'радость', targetAccuracy: 0.8 }
    ]
};

// 3. Скорочтение (без изменений)
const SPEED_READING_LEVEL = {
    id: 'speed-reading',
    title: 'Скорочтение',
    description: 'Читай быстро и чётко',
    icon: '⚡',
    difficulty: 'medium',
    tasks: [
        { type: 'speed-reading', text: 'Кот, дом, лес, мяч, стол', emotion: null, targetAccuracy: 0.8, timeLimit: 5 },
        { type: 'speed-reading', text: 'Солнце светит ярко в небе', emotion: null, targetAccuracy: 0.8, timeLimit: 5 },
        { type: 'speed-reading', text: 'Дети играют в парке с мячом', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },
        { type: 'speed-reading', text: 'Мама купила яблоки и груши', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },
        { type: 'speed-reading', text: 'Кошка спит на мягком диване', emotion: null, targetAccuracy: 0.8, timeLimit: 6 }
    ]
};

// 4. Как улучшить звуки (бывший "Звук Р" + упражнения)
const SOUND_IMPROVEMENT = {
    id: 'sound-improvement',
    title: 'Как улучшить звуки',
    description: 'Учись произносить сложные звуки',
    icon: '🗣️',
    difficulty: 'easy',
    tasks: [
        // Звук Р
        { type: 'sound-practice', text: 'Ра-ра-ра, ра-ра-ра', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Ро-ро-ро, ро-ро-ро', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Рыба, рак, рука, роза', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Тигр рычит: р-р-р-р', emotion: null, targetAccuracy: 0.8 },

        // Другие сложные звуки
        { type: 'sound-practice', text: 'Ла-ла-ла, ло-ло-ло', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Ша-ша-ша, шо-шо-шо', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Жа-жа-жа, жо-жо-жо', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Ча-ча-ча, чо-чо-чо', emotion: null, targetAccuracy: 0.8 }
    ]
};

// Новый список всех уровней
const ALL_LEVELS_COMBINED = [
    COMBINED_TONGUE_TWISTERS,
    COMBINED_VOICING,
    SPEED_READING_LEVEL,
    SOUND_IMPROVEMENT
];

// Обновить функции
function getAllLevels() {
    return ALL_LEVELS_COMBINED;
}

function getLevelById(id) {
    return ALL_LEVELS_COMBINED.find(level => level.id === id);
}
