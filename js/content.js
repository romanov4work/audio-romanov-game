// Дополнительные уровни и контент

const ADDITIONAL_LEVELS = [
    {
        id: 'breathing-exercises',
        title: 'Дыхательные упражнения',
        description: 'Учись правильно дышать для чёткой речи',
        icon: '💨',
        difficulty: 'easy',
        tasks: [
            {
                type: 'breathing',
                text: 'Вдохни глубоко через нос, выдохни через рот: Ааааааа',
                emotion: null,
                targetAccuracy: 0.7,
                instruction: 'Сделай глубокий вдох и на выдохе произнеси звук А'
            },
            {
                type: 'breathing',
                text: 'Ууууууу',
                emotion: null,
                targetAccuracy: 0.7,
                instruction: 'Вдохни и на выдохе тяни звук У'
            },
            {
                type: 'breathing',
                text: 'Иииииии',
                emotion: null,
                targetAccuracy: 0.7,
                instruction: 'Вдохни и на выдохе тяни звук И'
            }
        ]
    },
    {
        id: 'articulation',
        title: 'Артикуляционная гимнастика',
        description: 'Разминка для языка и губ',
        icon: '😛',
        difficulty: 'easy',
        tasks: [
            {
                type: 'articulation',
                text: 'Па-па-па, ба-ба-ба',
                emotion: null,
                targetAccuracy: 0.75,
                instruction: 'Чётко произноси каждый слог'
            },
            {
                type: 'articulation',
                text: 'Та-та-та, да-да-да',
                emotion: null,
                targetAccuracy: 0.75,
                instruction: 'Язык касается верхних зубов'
            },
            {
                type: 'articulation',
                text: 'Ка-ка-ка, га-га-га',
                emotion: null,
                targetAccuracy: 0.75,
                instruction: 'Звук идёт из горла'
            }
        ]
    },
    {
        id: 'emotions-advanced',
        title: 'Мастер эмоций',
        description: 'Продвинутая озвучка с разными чувствами',
        icon: '🎭',
        difficulty: 'hard',
        tasks: [
            {
                type: 'voicing',
                text: 'Не может быть!',
                emotion: 'шок',
                targetAccuracy: 0.8
            },
            {
                type: 'voicing',
                text: 'Я так рад тебя видеть!',
                emotion: 'радость',
                targetAccuracy: 0.8
            },
            {
                type: 'voicing',
                text: 'Мне очень жаль...',
                emotion: 'сочувствие',
                targetAccuracy: 0.8
            },
            {
                type: 'voicing',
                text: 'Это просто невероятно!',
                emotion: 'восхищение',
                targetAccuracy: 0.8
            },
            {
                type: 'voicing',
                text: 'Я немного волнуюсь',
                emotion: 'тревога',
                targetAccuracy: 0.8
            }
        ]
    },
    {
        id: 'story-telling',
        title: 'Рассказчик историй',
        description: 'Озвучь целые сцены из мультиков',
        icon: '📖',
        difficulty: 'hard',
        tasks: [
            {
                type: 'story',
                text: 'Жил-был маленький зайчик. Он очень любил морковку.',
                emotion: 'спокойствие',
                targetAccuracy: 0.75
            },
            {
                type: 'story',
                text: 'Однажды он встретил в лесу большого медведя!',
                emotion: 'испуг',
                targetAccuracy: 0.75
            },
            {
                type: 'story',
                text: 'Но медведь оказался добрым и подарил зайчику мёд.',
                emotion: 'радость',
                targetAccuracy: 0.75
            }
        ]
    },
    {
        id: 'tongue-twisters-expert',
        title: 'Эксперт скороговорок',
        description: 'Самые сложные скороговорки',
        icon: '🏆',
        difficulty: 'hard',
        tasks: [
            {
                type: 'tongue-twister',
                text: 'Тридцать три корабля лавировали, лавировали, да не вылавировали',
                emotion: null,
                targetAccuracy: 0.9
            },
            {
                type: 'tongue-twister',
                text: 'Интервьюер интервента интервьюировал',
                emotion: null,
                targetAccuracy: 0.9
            },
            {
                type: 'tongue-twister',
                text: 'Дефибриллятор дефибриллировал дефибриллировал да не выдефибриллировал',
                emotion: null,
                targetAccuracy: 0.9
            }
        ]
    }
];

// Объединить все уровни
const ALL_LEVELS = [...LEVELS, ...ADDITIONAL_LEVELS];

// Обновить функции
function getAllLevels() {
    return ALL_LEVELS;
}

function getLevelById(id) {
    return ALL_LEVELS.find(level => level.id === id);
}

// Подсказки для разных типов заданий
const TASK_HINTS = {
    'tongue-twister': [
        'Произноси медленно и чётко',
        'Сначала прочитай про себя',
        'Следи за каждым звуком'
    ],
    'word': [
        'Раздели слово на слоги',
        'Произноси каждый слог отдельно',
        'Потом соедини всё вместе'
    ],
    'voicing': [
        'Представь, что ты актёр',
        'Покажи эмоцию голосом',
        'Можно даже показать мимикой!'
    ],
    'speed-reading': [
        'Читай быстро, но понятно',
        'Не глотай окончания слов',
        'Дыши ровно'
    ],
    'sound-practice': [
        'Язык должен вибрировать',
        'Не торопись',
        'Повторяй несколько раз'
    ],
    'breathing': [
        'Вдыхай через нос',
        'Выдыхай медленно',
        'Звук должен быть ровным'
    ],
    'articulation': [
        'Открывай рот широко',
        'Чётко двигай губами',
        'Язык работает активно'
    ],
    'story': [
        'Читай с выражением',
        'Делай паузы между предложениями',
        'Меняй интонацию'
    ]
};

function getTaskHint(taskType) {
    const hints = TASK_HINTS[taskType] || ['Старайся говорить чётко и громко'];
    return hints[Math.floor(Math.random() * hints.length)];
}

// Мотивационные сообщения
const MOTIVATION_MESSAGES = {
    high: [
        'Невероятно! Ты настоящий мастер!',
        'Потрясающе! Так держать!',
        'Великолепно! Ты супер!',
        'Браво! Отличная работа!'
    ],
    medium: [
        'Хорошо! Продолжай стараться!',
        'Неплохо! Ещё немного практики!',
        'Молодец! У тебя получается!',
        'Здорово! Ты на правильном пути!'
    ],
    low: [
        'Ничего страшного! Попробуй ещё раз!',
        'Не сдавайся! У тебя всё получится!',
        'Продолжай тренироваться!',
        'Каждая попытка делает тебя лучше!'
    ]
};

function getMotivationMessage(accuracy) {
    let category;
    if (accuracy >= 90) category = 'high';
    else if (accuracy >= 70) category = 'medium';
    else category = 'low';

    const messages = MOTIVATION_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
}
