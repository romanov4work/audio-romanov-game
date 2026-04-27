// Объединённые уровни

// 1. Скороговорки + Сложные слова
const COMBINED_TONGUE_TWISTERS = {
    id: 'combined-tongue-twisters',
    title: 'Скороговорки и слова',
    description: 'Тренируй дикцию со скороговорками и сложными словами',
    icon: '👅',
    difficulty: 'medium',
    tasks: [
        // Лёгкие скороговорки (разминка)
        { type: 'tongue-twister', text: 'Шла Саша по шоссе и сосала сушку', emotion: null, targetAccuracy: 0.75 },
        { type: 'tongue-twister', text: 'На дворе трава, на траве дрова', emotion: null, targetAccuracy: 0.75 },
        { type: 'tongue-twister', text: 'Белый снег, белый мел, белый заяц тоже бел', emotion: null, targetAccuracy: 0.75 },
        { type: 'tongue-twister', text: 'Мама мыла Милу мылом', emotion: null, targetAccuracy: 0.75 },
        { type: 'tongue-twister', text: 'Четыре чёрненьких чумазых чертёнка', emotion: null, targetAccuracy: 0.75 },

        // Простые сложные слова
        { type: 'word', text: 'Достопримечательность', emotion: null, targetAccuracy: 0.8 },
        { type: 'word', text: 'Фотоаппарат', emotion: null, targetAccuracy: 0.8 },
        { type: 'word', text: 'Велосипедист', emotion: null, targetAccuracy: 0.8 },

        // Средние скороговорки
        { type: 'tongue-twister', text: 'Карл у Клары украл кораллы, а Клара у Карла украла кларнет', emotion: null, targetAccuracy: 0.8 },
        { type: 'tongue-twister', text: 'Ехал Грека через реку, видит Грека в реке рак', emotion: null, targetAccuracy: 0.8 },
        { type: 'tongue-twister', text: 'От топота копыт пыль по полю летит', emotion: null, targetAccuracy: 0.8 },
        { type: 'tongue-twister', text: 'Бык тупогуб, тупогубенький бычок', emotion: null, targetAccuracy: 0.8 },

        // Средние сложные слова
        { type: 'word', text: 'Субстанциональность', emotion: null, targetAccuracy: 0.85 },
        { type: 'word', text: 'Высокопревосходительство', emotion: null, targetAccuracy: 0.85 },
        { type: 'word', text: 'Переосвидетельствование', emotion: null, targetAccuracy: 0.85 },

        // Сложные скороговорки
        { type: 'tongue-twister', text: 'Расскажите про покупки. Про какие про покупки? Про покупки, про покупки, про покупочки свои', emotion: null, targetAccuracy: 0.85 },
        { type: 'tongue-twister', text: 'Корабли лавировали, лавировали, да не вылавировали', emotion: null, targetAccuracy: 0.85 },
        { type: 'tongue-twister', text: 'Сшит колпак не по-колпаковски, вылит колокол не по-колоколовски', emotion: null, targetAccuracy: 0.85 },

        // Очень сложные слова
        { type: 'word', text: 'Человеконенавистничество', emotion: null, targetAccuracy: 0.9 },
        { type: 'word', text: 'Делопроизводительность', emotion: null, targetAccuracy: 0.9 },

        // Экспертные скороговорки
        { type: 'tongue-twister', text: 'Тридцать три корабля лавировали, лавировали, да не вылавировали', emotion: null, targetAccuracy: 0.9 },
        { type: 'tongue-twister', text: 'Интервьюер интервента интервьюировал', emotion: null, targetAccuracy: 0.9 },
        { type: 'tongue-twister', text: 'Дефибриллятор дефибриллировал дефибриллировал да не выдефибриллировал', emotion: null, targetAccuracy: 0.9 }
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
        // Дыхательные упражнения (разминка)
        { type: 'breathing', text: 'Вдохни глубоко через нос, выдохни через рот: Ааааааа', emotion: null, targetAccuracy: 0.7, instruction: 'Сделай глубокий вдох и на выдохе произнеси звук А' },
        { type: 'breathing', text: 'Ууууууу', emotion: null, targetAccuracy: 0.7, instruction: 'Вдохни и на выдохе тяни звук У' },
        { type: 'breathing', text: 'Иииииии', emotion: null, targetAccuracy: 0.7, instruction: 'Вдохни и на выдохе тяни звук И' },
        { type: 'breathing', text: 'Ооооооо', emotion: null, targetAccuracy: 0.7, instruction: 'Вдохни и на выдохе тяни звук О' },

        // Артикуляция (разминка речевого аппарата)
        { type: 'articulation', text: 'Па-па-па, ба-ба-ба', emotion: null, targetAccuracy: 0.75, instruction: 'Чётко произноси каждый слог' },
        { type: 'articulation', text: 'Та-та-та, да-да-да', emotion: null, targetAccuracy: 0.75, instruction: 'Язык касается верхних зубов' },
        { type: 'articulation', text: 'Ка-ка-ка, га-га-га', emotion: null, targetAccuracy: 0.75, instruction: 'Звук идёт из горла' },
        { type: 'articulation', text: 'Ма-ма-ма, на-на-на', emotion: null, targetAccuracy: 0.75, instruction: 'Губы работают активно' },

        // Простые эмоции
        { type: 'voicing', text: 'Ура! Мы победили!', emotion: 'радость', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Ой, как страшно!', emotion: 'испуг', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Я так устал...', emotion: 'грусть', targetAccuracy: 0.75 },
        { type: 'voicing', text: 'Это невозможно!', emotion: 'удивление', targetAccuracy: 0.75 },

        // Средние эмоции
        { type: 'voicing', text: 'Я не буду это делать!', emotion: 'злость', targetAccuracy: 0.8 },
        { type: 'voicing', text: 'Какой прекрасный день!', emotion: 'восторг', targetAccuracy: 0.8 },
        { type: 'voicing', text: 'Не может быть!', emotion: 'шок', targetAccuracy: 0.8 },
        { type: 'voicing', text: 'Я так рад тебя видеть!', emotion: 'радость', targetAccuracy: 0.8 },

        // Сложные эмоции
        { type: 'voicing', text: 'Мне очень жаль...', emotion: 'сочувствие', targetAccuracy: 0.85 },
        { type: 'voicing', text: 'Это просто невероятно!', emotion: 'восхищение', targetAccuracy: 0.85 },
        { type: 'voicing', text: 'Я немного волнуюсь', emotion: 'тревога', targetAccuracy: 0.85 },

        // Истории (озвучка сцен)
        { type: 'story', text: 'Жил-был маленький зайчик. Он очень любил морковку.', emotion: 'спокойствие', targetAccuracy: 0.8 },
        { type: 'story', text: 'Однажды он встретил в лесу большого медведя!', emotion: 'испуг', targetAccuracy: 0.8 },
        { type: 'story', text: 'Но медведь оказался добрым и подарил зайчику мёд.', emotion: 'радость', targetAccuracy: 0.8 }
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
        // Лёгкий уровень (короткие фразы)
        { type: 'speed-reading', text: 'Кот, дом, лес, мяч, стол', emotion: null, targetAccuracy: 0.8, timeLimit: 5 },
        { type: 'speed-reading', text: 'Мама, папа, брат, сестра', emotion: null, targetAccuracy: 0.8, timeLimit: 5 },
        { type: 'speed-reading', text: 'Солнце, небо, облака, ветер', emotion: null, targetAccuracy: 0.8, timeLimit: 5 },

        // Средний уровень (простые предложения)
        { type: 'speed-reading', text: 'Солнце светит ярко в небе', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },
        { type: 'speed-reading', text: 'Дети играют в парке с мячом', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },
        { type: 'speed-reading', text: 'Мама купила яблоки и груши', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },
        { type: 'speed-reading', text: 'Кошка спит на мягком диване', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },
        { type: 'speed-reading', text: 'Птицы поют весёлые песни', emotion: null, targetAccuracy: 0.8, timeLimit: 6 },

        // Сложный уровень (длинные предложения)
        { type: 'speed-reading', text: 'Весной расцветают красивые цветы в нашем саду', emotion: null, targetAccuracy: 0.85, timeLimit: 7 },
        { type: 'speed-reading', text: 'Маленький щенок весело бегает по зелёной траве', emotion: null, targetAccuracy: 0.85, timeLimit: 7 },
        { type: 'speed-reading', text: 'Бабушка испекла вкусный пирог с яблоками и корицей', emotion: null, targetAccuracy: 0.85, timeLimit: 7 },

        // Экспертный уровень (очень длинные)
        { type: 'speed-reading', text: 'В лесу живут разные животные: зайцы, белки, лисы и медведи', emotion: null, targetAccuracy: 0.85, timeLimit: 8 },
        { type: 'speed-reading', text: 'Летом мы ездили на море и купались в тёплой воде каждый день', emotion: null, targetAccuracy: 0.85, timeLimit: 8 },
        { type: 'speed-reading', text: 'Учитель рассказал нам интересную историю про древних динозавров', emotion: null, targetAccuracy: 0.85, timeLimit: 8 },
        { type: 'speed-reading', text: 'Космонавты летают в космос на больших ракетах и изучают звёзды', emotion: null, targetAccuracy: 0.9, timeLimit: 9 }
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
        // Звук Р (основной блок)
        { type: 'sound-practice', text: 'Ра-ра-ра, ра-ра-ра', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Ро-ро-ро, ро-ро-ро', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Ру-ру-ру, ру-ру-ру', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Рыба, рак, рука, роза', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Тигр рычит: р-р-р-р', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Рома, Рита, Родион, Раиса', emotion: null, targetAccuracy: 0.8 },

        // Звук Л
        { type: 'sound-practice', text: 'Ла-ла-ла, ло-ло-ло', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Лампа, лодка, лук, луна', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Лола, Лена, Лиза, Лёша', emotion: null, targetAccuracy: 0.8 },

        // Звук Ш
        { type: 'sound-practice', text: 'Ша-ша-ша, шо-шо-шо', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Шапка, шуба, шар, школа', emotion: null, targetAccuracy: 0.8 },
        { type: 'sound-practice', text: 'Шшшш - тише, мышка спит', emotion: null, targetAccuracy: 0.8 },

        // Звук Ж
        { type: 'sound-practice', text: 'Жа-жа-жа, жо-жо-жо', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Жук, жаба, жираф, ёжик', emotion: null, targetAccuracy: 0.8 },

        // Звук Ч
        { type: 'sound-practice', text: 'Ча-ча-ча, чо-чо-чо', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Чашка, часы, черепаха, чайка', emotion: null, targetAccuracy: 0.8 },

        // Звук Щ
        { type: 'sound-practice', text: 'Ща-ща-ща, що-що-що', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Щука, щенок, щётка, щавель', emotion: null, targetAccuracy: 0.8 },

        // Звук С
        { type: 'sound-practice', text: 'Са-са-са, со-со-со', emotion: null, targetAccuracy: 0.75 },
        { type: 'sound-practice', text: 'Сом, сок, сад, санки', emotion: null, targetAccuracy: 0.8 }
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
