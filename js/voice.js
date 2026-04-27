// Система озвучки персонажа

class VoiceManager {
    constructor() {
        this.enabled = true;
        this.currentAudio = null;
        this.queue = [];
        this.isPlaying = false;
        this.useAPI = true; // true = API, false = локальные файлы

        // Настройки голоса
        this.voiceSettings = {
            provider: 'edge', // 'edge', 'elevenlabs', 'local'
            voice: 'ru-RU-DariyaNeural', // Edge TTS голос
            rate: 1.2, // Скорость (1.2 = быстрее, звучит моложе)
            pitch: '+5Hz' // Высота (выше = детский)
        };

        // API ключи (если нужны)
        this.apiKeys = {
            elevenlabs: '' // Заполнить если используем ElevenLabs
        };

        this.initEdgeTTS();
    }

    // Инициализация Edge TTS
    initEdgeTTS() {
        // Edge TTS работает через Web Speech API
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            this.loadVoices();
        } else {
            console.warn('Speech Synthesis не поддерживается');
            this.useAPI = false;
        }
    }

    // Загрузить доступные голоса
    loadVoices() {
        return new Promise((resolve) => {
            let voices = this.synthesis.getVoices();

            if (voices.length > 0) {
                this.voices = voices;
                resolve(voices);
            } else {
                this.synthesis.onvoiceschanged = () => {
                    this.voices = this.synthesis.getVoices();
                    resolve(this.voices);
                };
            }
        });
    }

    // Получить лучший детский голос
    getBestChildVoice() {
        if (!this.voices) return null;

        // Приоритет голосов (от лучшего к худшему)
        const preferredVoices = [
            'Microsoft Dariya Online (Natural) - Russian (Russia)',
            'Google русский',
            'ru-RU',
            'Russian'
        ];

        for (const preferred of preferredVoices) {
            const voice = this.voices.find(v =>
                v.name.includes(preferred) || v.lang.includes('ru')
            );
            if (voice) return voice;
        }

        return this.voices.find(v => v.lang.includes('ru')) || this.voices[0];
    }

    // Озвучить текст
    async speak(text, options = {}) {
        if (!this.enabled) return;

        // Остановить текущую озвучку
        this.stop();

        if (this.useAPI && this.synthesis) {
            return this.speakWithAPI(text, options);
        } else {
            return this.speakWithFile(text, options);
        }
    }

    // Озвучка через API (Web Speech)
    speakWithAPI(text, options = {}) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);

            // Настройки голоса
            const voice = this.getBestChildVoice();
            if (voice) {
                utterance.voice = voice;
            }

            utterance.lang = 'ru-RU';
            utterance.rate = options.rate || this.voiceSettings.rate;
            utterance.pitch = options.pitch || 1.3; // Выше = детский
            utterance.volume = options.volume || 1.0;

            utterance.onend = () => {
                this.isPlaying = false;
                this.playNext();
                resolve();
            };

            utterance.onerror = (error) => {
                console.error('Speech error:', error);
                this.isPlaying = false;
                reject(error);
            };

            this.isPlaying = true;
            this.synthesis.speak(utterance);
        });
    }

    // Озвучка через локальные файлы
    speakWithFile(audioPath, options = {}) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioPath);
            audio.volume = options.volume || 1.0;

            audio.onended = () => {
                this.isPlaying = false;
                this.currentAudio = null;
                this.playNext();
                resolve();
            };

            audio.onerror = (error) => {
                console.error('Audio error:', error);
                this.isPlaying = false;
                reject(error);
            };

            this.currentAudio = audio;
            this.isPlaying = true;
            audio.play();
        });
    }

    // Добавить в очередь
    enqueue(text, options = {}) {
        this.queue.push({ text, options });
        if (!this.isPlaying) {
            this.playNext();
        }
    }

    // Воспроизвести следующее
    playNext() {
        if (this.queue.length > 0 && !this.isPlaying) {
            const { text, options } = this.queue.shift();
            this.speak(text, options);
        }
    }

    // Остановить озвучку
    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        this.isPlaying = false;
        this.queue = [];
    }

    // Включить/выключить озвучку
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stop();
        }
        return this.enabled;
    }

    // Готовые фразы
    phrases = {
        welcome: [
            'Привет! Я помогу тебе научиться говорить чётко и красиво!',
            'Давай потренируемся вместе! Выбери задание!',
            'Готов стать мастером дикции? Начнём!'
        ],
        instructions: {
            'tongue-twister': 'Произнеси скороговорку чётко и не торопись!',
            'word': 'Раздели слово на слоги и произнеси его медленно!',
            'voicing': 'Покажи эмоцию голосом, как настоящий актёр!',
            'speed-reading': 'Читай быстро, но понятно! Не глотай слова!',
            'sound-practice': 'Повторяй звук несколько раз, чётко и громко!',
            'breathing': 'Вдохни глубоко через нос и на выдохе произнеси звук!',
            'articulation': 'Открывай рот широко и чётко двигай губами!',
            'story': 'Читай с выражением и делай паузы между предложениями!'
        },
        praise: [
            'Отлично! Ты молодец!',
            'Супер! Так держать!',
            'Невероятно! У тебя здорово получается!',
            'Браво! Ты настоящий мастер!',
            'Потрясающе! Продолжай в том же духе!',
            'Великолепно! Ты справился!',
            'Ура! Ты получил три звезды!',
            'Вау! Какая точность!',
            'Класс! Ты становишься лучше!',
            'Фантастика! Так держать!'
        ],
        encourage: [
            'Ничего страшного! Попробуй ещё раз!',
            'Не сдавайся! У тебя обязательно получится!',
            'Почти получилось! Давай ещё разок!',
            'Не переживай! Говори медленнее и чётче!',
            'Каждая попытка делает тебя лучше!',
            'Продолжай тренироваться! Ты на правильном пути!'
        ],
        special: {
            combo_start: 'Комбо началось! Продолжай отвечать правильно!',
            combo_2x: 'Множитель два! Ты в ударе!',
            combo_3x: 'Множитель три! Невероятно!',
            achievement: 'Поздравляю! Ты получил новое достижение!',
            level_complete: 'Уровень пройден! Отличная работа!',
            tutorial_start: 'Давай я покажу тебе, как играть!',
            demo_mode: 'Это режим тренировки. Попробуй без оценок!',
            hint_used: 'Вот тебе подсказка!',
            goodbye: 'Пока! Возвращайся скорее!'
        }
    };

    // Удобные методы
    sayWelcome() {
        const phrase = this.phrases.welcome[Math.floor(Math.random() * this.phrases.welcome.length)];
        return this.speak(phrase);
    }

    sayInstruction(taskType) {
        const phrase = this.phrases.instructions[taskType] || 'Произнеси текст чётко и громко!';
        return this.speak(phrase);
    }

    sayPraise() {
        const phrase = this.phrases.praise[Math.floor(Math.random() * this.phrases.praise.length)];
        return this.speak(phrase);
    }

    sayEncourage() {
        const phrase = this.phrases.encourage[Math.floor(Math.random() * this.phrases.encourage.length)];
        return this.speak(phrase);
    }

    saySpecial(key) {
        const phrase = this.phrases.special[key];
        if (phrase) {
            return this.speak(phrase);
        }
    }

    // Озвучить задание
    sayTask(task) {
        // Сначала инструкция
        this.enqueue(this.phrases.instructions[task.type] || 'Произнеси текст чётко!');

        // Потом само задание (если короткое)
        if (task.text.length < 100) {
            this.enqueue(task.text);
        }
    }
}
