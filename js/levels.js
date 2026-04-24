// Данные уровней и заданий

const LEVELS = [
    {
        id: 'tongue-twisters-easy',
        title: 'Скороговорки',
        description: 'Тренируй дикцию с весёлыми скороговорками',
        icon: '👅',
        difficulty: 'easy',
        tasks: [
            {
                type: 'tongue-twister',
                text: 'Шла Саша по шоссе и сосала сушку',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'tongue-twister',
                text: 'Карл у Клары украл кораллы, а Клара у Карла украла кларнет',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'tongue-twister',
                text: 'На дворе трава, на траве дрова',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'tongue-twister',
                text: 'Ехал Грека через реку, видит Грека в реке рак',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'tongue-twister',
                text: 'Белый снег, белый мел, белый заяц тоже бел',
                emotion: null,
                targetAccuracy: 0.8
            }
        ]
    },
    {
        id: 'tongue-twisters-hard',
        title: 'Сложные скороговорки',
        description: 'Для настоящих мастеров дикции!',
        icon: '🔥',
        difficulty: 'hard',
        tasks: [
            {
                type: 'tongue-twister',
                text: 'Расскажите про покупки. Про какие про покупки? Про покупки, про покупки, про покупочки свои',
                emotion: null,
                targetAccuracy: 0.85
            },
            {
                type: 'tongue-twister',
                text: 'Корабли лавировали, лавировали, да не вылавировали',
                emotion: null,
                targetAccuracy: 0.85
            },
            {
                type: 'tongue-twister',
                text: 'Сшит колпак не по-колпаковски, вылит колокол не по-колоколовски',
                emotion: null,
                targetAccuracy: 0.85
            }
        ]
    },
    {
        id: 'difficult-words',
        title: 'Сложные слова',
        description: 'Произноси трудные слова правильно',
        icon: '📚',
        difficulty: 'medium',
        tasks: [
            {
                type: 'word',
                text: 'Достопримечательность',
                emotion: null,
                targetAccuracy: 0.85
            },
            {
                type: 'word',
                text: 'Переосвидетельствование',
                emotion: null,
                targetAccuracy: 0.85
            },
            {
                type: 'word',
                text: 'Субстанциональность',
                emotion: null,
                targetAccuracy: 0.85
            },
            {
                type: 'word',
                text: 'Высокопревосходительство',
                emotion: null,
                targetAccuracy: 0.85
            },
            {
                type: 'word',
                text: 'Человеконенавистничество',
                emotion: null,
                targetAccuracy: 0.85
            }
        ]
    },
    {
        id: 'cartoon-voicing',
        title: 'Озвучка мультиков',
        description: 'Озвучивай фразы с разными эмоциями',
        icon: '🎬',
        difficulty: 'medium',
        tasks: [
            {
                type: 'voicing',
                text: 'Ура! Мы победили!',
                emotion: 'радость',
                targetAccuracy: 0.75
            },
            {
                type: 'voicing',
                text: 'Ой, как страшно!',
                emotion: 'испуг',
                targetAccuracy: 0.75
            },
            {
                type: 'voicing',
                text: 'Я так устал...',
                emotion: 'грусть',
                targetAccuracy: 0.75
            },
            {
                type: 'voicing',
                text: 'Это невозможно!',
                emotion: 'удивление',
                targetAccuracy: 0.75
            },
            {
                type: 'voicing',
                text: 'Я не буду это делать!',
                emotion: 'злость',
                targetAccuracy: 0.75
            },
            {
                type: 'voicing',
                text: 'Какой прекрасный день!',
                emotion: 'восторг',
                targetAccuracy: 0.75
            }
        ]
    },
    {
        id: 'speed-reading',
        title: 'Скорочтение',
        description: 'Читай быстро и чётко',
        icon: '⚡',
        difficulty: 'medium',
        tasks: [
            {
                type: 'speed-reading',
                text: 'Кот, дом, лес, мяч, стол',
                emotion: null,
                targetAccuracy: 0.8,
                timeLimit: 5
            },
            {
                type: 'speed-reading',
                text: 'Солнце светит ярко в небе',
                emotion: null,
                targetAccuracy: 0.8,
                timeLimit: 5
            },
            {
                type: 'speed-reading',
                text: 'Дети играют в парке с мячом',
                emotion: null,
                targetAccuracy: 0.8,
                timeLimit: 6
            }
        ]
    },
    {
        id: 'sound-r',
        title: 'Звук Р',
        description: 'Учись произносить звук Р',
        icon: '🗣️',
        difficulty: 'easy',
        tasks: [
            {
                type: 'sound-practice',
                text: 'Ра-ра-ра, ра-ра-ра',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'sound-practice',
                text: 'Ро-ро-ро, ро-ро-ро',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'sound-practice',
                text: 'Рыба, рак, рука, роза',
                emotion: null,
                targetAccuracy: 0.8
            },
            {
                type: 'sound-practice',
                text: 'Тигр рычит: р-р-р-р',
                emotion: null,
                targetAccuracy: 0.8
            }
        ]
    }
];

// Получить все уровни
function getAllLevels() {
    return LEVELS;
}

// Получить уровень по ID
function getLevelById(id) {
    return LEVELS.find(level => level.id === id);
}

// Получить задания уровня
function getLevelTasks(levelId) {
    const level = getLevelById(levelId);
    return level ? level.tasks : [];
}

// Получить цвет сложности
function getDifficultyColor(difficulty) {
    const colors = {
        easy: '#95E1D3',
        medium: '#FFD93D',
        hard: '#F38181'
    };
    return colors[difficulty] || colors.medium;
}

// Получить текст сложности
function getDifficultyText(difficulty) {
    const texts = {
        easy: 'Легко',
        medium: 'Средне',
        hard: 'Сложно'
    };
    return texts[difficulty] || texts.medium;
}
