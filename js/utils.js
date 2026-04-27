// Утилиты и вспомогательные функции

// Воспроизведение звуковых эффектов
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API не поддерживается');
        }
    }

    // Создать звук из частоты (для простых эффектов)
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Звук успеха (восходящая мелодия)
    playSuccess() {
        this.playTone(523.25, 0.1, 'sine', 0.25); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.25), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.3), 200); // G5
    }

    // Звук ошибки (нисходящий грустный)
    playError() {
        this.playTone(400, 0.15, 'sawtooth', 0.2);
        setTimeout(() => this.playTone(300, 0.15, 'sawtooth', 0.2), 150);
    }

    // Звук клика (короткий щелчок)
    playClick() {
        this.playTone(800, 0.05, 'sine', 0.2);
    }

    // Звук завершения уровня (фанфары)
    playComplete() {
        this.playTone(523.25, 0.1, 'sine', 0.3); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.3), 200); // G5
        setTimeout(() => this.playTone(1046.50, 0.3, 'sine', 0.35), 300); // C6
    }

    // Звук комбо (быстрая трель)
    playCombo() {
        const notes = [659.25, 783.99, 659.25, 783.99]; // E5, G5, E5, G5
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.08, 'square', 0.2);
            }, index * 80);
        });
    }

    // Звук достижения (волшебный)
    playAchievement() {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5-E6
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.12, 'sine', 0.25);
            }, index * 120);
        });
    }

    // Звук подсказки (мягкий колокольчик)
    playHint() {
        this.playTone(1046.50, 0.3, 'sine', 0.2); // C6
        setTimeout(() => {
            this.playTone(1318.51, 0.3, 'sine', 0.15); // E6
        }, 150);
    }

    // Звук начала записи (восходящий)
    playRecordStart() {
        this.playTone(440, 0.08, 'sine', 0.2); // A4
        setTimeout(() => {
            this.playTone(880, 0.08, 'sine', 0.2); // A5
        }, 80);
    }

    // Звук остановки записи (нисходящий)
    playRecordStop() {
        this.playTone(880, 0.08, 'sine', 0.2); // A5
        setTimeout(() => {
            this.playTone(440, 0.08, 'sine', 0.2); // A4
        }, 80);
    }

    // Звук звезды (блеск)
    playStar() {
        this.playTone(1568, 0.1, 'sine', 0.15); // G6
        setTimeout(() => {
            this.playTone(2093, 0.15, 'sine', 0.1); // C7
        }, 50);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Создание конфетти
class ConfettiManager {
    constructor() {
        this.colors = ['#FF8B3D', '#00C896', '#FFC107', '#2196F3', '#FF5252'];
    }

    create(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createPiece(x, y);
            }, i * 30);
        }
    }

    createPiece(x, y) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 5;

        confetti.style.setProperty('--vx', vx + 'px');
        confetti.style.setProperty('--vy', vy + 'px');

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }

    celebrate() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        this.create(centerX, centerY, 50);
    }
}

// Управление локальным хранилищем
class StorageManager {
    constructor() {
        this.prefix = 'uchi_voice_';
    }

    save(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            return false;
        }
    }

    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.error('Ошибка удаления:', e);
            return false;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Ошибка очистки:', e);
            return false;
        }
    }
}

// Статистика игрока
class PlayerStats {
    constructor() {
        this.storage = new StorageManager();
        this.stats = this.load();
    }

    load() {
        return this.storage.load('stats', {
            totalGames: 0,
            totalStars: 0,
            totalTasks: 0,
            completedTasks: 0,
            bestAccuracy: 0,
            levelStats: {},
            achievements: []
        });
    }

    save() {
        this.storage.save('stats', this.stats);
    }

    addGame(levelId, stars, tasksCompleted, totalTasks, accuracy) {
        this.stats.totalGames++;
        this.stats.totalStars += stars;
        this.stats.totalTasks += totalTasks;
        this.stats.completedTasks += tasksCompleted;
        this.stats.bestAccuracy = Math.max(this.stats.bestAccuracy, accuracy);

        if (!this.stats.levelStats[levelId]) {
            this.stats.levelStats[levelId] = {
                plays: 0,
                bestStars: 0,
                bestAccuracy: 0
            };
        }

        const levelStat = this.stats.levelStats[levelId];
        levelStat.plays++;
        levelStat.bestStars = Math.max(levelStat.bestStars, stars);
        levelStat.bestAccuracy = Math.max(levelStat.bestAccuracy, accuracy);

        this.checkAchievements();
        this.save();
    }

    checkAchievements() {
        const achievements = [
            { id: 'first_game', name: 'Первая игра', condition: () => this.stats.totalGames >= 1 },
            { id: 'star_collector', name: 'Собиратель звёзд', condition: () => this.stats.totalStars >= 50 },
            { id: 'perfectionist', name: 'Перфекционист', condition: () => this.stats.bestAccuracy >= 95 },
            { id: 'dedicated', name: 'Упорный', condition: () => this.stats.totalGames >= 10 }
        ];

        achievements.forEach(achievement => {
            if (achievement.condition() && !this.stats.achievements.includes(achievement.id)) {
                this.stats.achievements.push(achievement.id);
            }
        });
    }

    getStats() {
        return this.stats;
    }

    reset() {
        this.stats = {
            totalGames: 0,
            totalStars: 0,
            totalTasks: 0,
            completedTasks: 0,
            bestAccuracy: 0,
            levelStats: {},
            achievements: []
        };
        this.save();
    }
}

// Форматирование текста
function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

function formatPercent(num) {
    return Math.round(num) + '%';
}

// Анимация чисел
function animateNumber(element, from, to, duration = 1000) {
    const start = Date.now();
    const range = to - from;

    function update() {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(from + range * easeProgress);

        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Экспорт
window.SoundManager = SoundManager;
window.ConfettiManager = ConfettiManager;
window.StorageManager = StorageManager;
window.PlayerStats = PlayerStats;
window.animateNumber = animateNumber;
window.formatNumber = formatNumber;
window.formatPercent = formatPercent;
