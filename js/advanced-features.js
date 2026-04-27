// Визуализация звуковых волн в реальном времени

class AudioVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;
        this.isActive = false;
    }

    async init(stream) {
        if (!this.canvas || !stream) return false;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;

            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            this.isActive = true;
            this.draw();
            return true;
        } catch (error) {
            console.error('Ошибка инициализации визуализатора:', error);
            return false;
        }
    }

    draw() {
        if (!this.isActive || !this.ctx || !this.analyser) return;

        this.animationId = requestAnimationFrame(() => this.draw());

        this.analyser.getByteFrequencyData(this.dataArray);

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);

        const barWidth = (width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = (this.dataArray[i] / 255) * height * 0.8;

            const gradient = this.ctx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, '#FF8B3D');
            gradient.addColorStop(1, '#00C896');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Система комбо и бонусов
class ComboSystem {
    constructor() {
        this.combo = 0;
        this.maxCombo = 0;
        this.multiplier = 1;
        this.lastSuccessTime = 0;
        this.comboTimeout = 5000; // 5 секунд на следующее задание
    }

    addSuccess() {
        const now = Date.now();
        if (now - this.lastSuccessTime < this.comboTimeout) {
            this.combo++;
        } else {
            this.combo = 1;
        }

        this.lastSuccessTime = now;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.updateMultiplier();

        return {
            combo: this.combo,
            multiplier: this.multiplier,
            isNewRecord: this.combo === this.maxCombo && this.combo > 1
        };
    }

    addFailure() {
        this.combo = 0;
        this.multiplier = 1;
    }

    updateMultiplier() {
        if (this.combo >= 10) this.multiplier = 3;
        else if (this.combo >= 5) this.multiplier = 2;
        else if (this.combo >= 3) this.multiplier = 1.5;
        else this.multiplier = 1;
    }

    getCombo() {
        return this.combo;
    }

    getMultiplier() {
        return this.multiplier;
    }

    reset() {
        this.combo = 0;
        this.multiplier = 1;
        this.lastSuccessTime = 0;
    }
}

// Система достижений
class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_star',
                name: 'Первая звезда',
                description: 'Получи первую звезду',
                icon: '⭐',
                condition: (stats) => stats.totalStars >= 1,
                unlocked: false
            },
            {
                id: 'combo_master',
                name: 'Мастер комбо',
                description: 'Набери комбо x5',
                icon: '🔥',
                condition: (stats) => stats.maxCombo >= 5,
                unlocked: false
            },
            {
                id: 'perfectionist',
                name: 'Перфекционист',
                description: 'Получи 100% точность',
                icon: '💯',
                condition: (stats) => stats.bestAccuracy >= 100,
                unlocked: false
            },
            {
                id: 'speed_demon',
                name: 'Скоростной демон',
                description: 'Пройди уровень за 2 минуты',
                icon: '⚡',
                condition: (stats) => stats.fastestLevel <= 120,
                unlocked: false
            },
            {
                id: 'star_collector',
                name: 'Собиратель звёзд',
                description: 'Собери 50 звёзд',
                icon: '🌟',
                condition: (stats) => stats.totalStars >= 50,
                unlocked: false
            },
            {
                id: 'dedicated',
                name: 'Упорный',
                description: 'Сыграй 20 игр',
                icon: '🏆',
                condition: (stats) => stats.totalGames >= 20,
                unlocked: false
            },
            {
                id: 'voice_master',
                name: 'Мастер голоса',
                description: 'Пройди все типы уровней',
                icon: '🎭',
                condition: (stats) => Object.keys(stats.levelStats || {}).length >= 11,
                unlocked: false
            }
        ];
    }

    check(stats) {
        const newUnlocks = [];

        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(stats)) {
                achievement.unlocked = true;
                newUnlocks.push(achievement);
            }
        });

        return newUnlocks;
    }

    getAll() {
        return this.achievements;
    }

    getUnlocked() {
        return this.achievements.filter(a => a.unlocked);
    }

    getProgress() {
        const unlocked = this.getUnlocked().length;
        const total = this.achievements.length;
        return Math.round((unlocked / total) * 100);
    }
}

// Система подсказок
class HintSystem {
    constructor() {
        this.hintsUsed = 0;
        this.maxHints = 3;
    }

    canUseHint() {
        return this.hintsUsed < this.maxHints;
    }

    useHint(task) {
        if (!this.canUseHint()) return null;

        this.hintsUsed++;

        const hints = {
            'tongue-twister': [
                'Попробуй произнести медленно по слогам',
                'Сначала прошепчи, потом произнеси вслух',
                'Повтори 3 раза подряд, ускоряясь'
            ],
            'word': [
                'Раздели слово на части: ' + this.splitWord(task.text),
                'Ударение на слог: ' + this.getStress(task.text),
                'Произноси каждую букву чётко'
            ],
            'voicing': [
                'Представь себя актёром в мультике',
                'Покажи эмоцию лицом, потом голосом',
                'Измени тон голоса под эмоцию'
            ]
        };

        const taskHints = hints[task.type] || ['Говори чётко и громко'];
        return taskHints[Math.min(this.hintsUsed - 1, taskHints.length - 1)];
    }

    splitWord(word) {
        // Простое разделение на слоги (упрощённое)
        return word.match(/.{1,3}/g).join('-');
    }

    getStress(word) {
        // Заглушка для определения ударения
        const middle = Math.floor(word.length / 2);
        return Math.floor(middle / 3) + 1;
    }

    reset() {
        this.hintsUsed = 0;
    }

    getRemaining() {
        return this.maxHints - this.hintsUsed;
    }
}

// Таймер для заданий
class TaskTimer {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.isRunning = false;
    }

    start() {
        this.startTime = Date.now();
        this.isRunning = true;
    }

    stop() {
        this.endTime = Date.now();
        this.isRunning = false;
        return this.getElapsed();
    }

    getElapsed() {
        if (this.isRunning) {
            return Date.now() - this.startTime;
        }
        return this.endTime - this.startTime;
    }

    getElapsedSeconds() {
        return Math.floor(this.getElapsed() / 1000);
    }

    reset() {
        this.startTime = 0;
        this.endTime = 0;
        this.isRunning = false;
    }
}

// Экспорт
window.AudioVisualizer = AudioVisualizer;
window.ComboSystem = ComboSystem;
window.AchievementSystem = AchievementSystem;
window.HintSystem = HintSystem;
window.TaskTimer = TaskTimer;
