// Игровая логика

class Game {
    constructor() {
        this.currentLevel = null;
        this.currentTaskIndex = 0;
        this.score = 0;
        this.tasksCompleted = 0;
        this.totalTasks = 0;
        this.speechRecognizer = new SpeechRecognizer();
        this.isProcessing = false;

        // Новые системы
        this.comboSystem = new ComboSystem();
        this.hintSystem = new HintSystem();
        this.taskTimer = new TaskTimer();
        this.speechTimer = new SpeechTimer(); // Таймер активной речи
        this.audioVisualizer = new AudioVisualizer('audio-visualizer');
        this.levelStartTime = 0;
        this.fastestLevel = Infinity;
    }

    // Начать уровень
    startLevel(levelId) {
        this.currentLevel = getLevelById(levelId);
        if (!this.currentLevel) {
            console.error('Уровень не найден:', levelId);
            return false;
        }

        this.currentTaskIndex = 0;
        this.score = 0;
        this.tasksCompleted = 0;
        this.totalTasks = this.currentLevel.tasks.length;
        this.comboSystem.reset();
        this.hintSystem.reset();
        this.levelStartTime = Date.now();

        return true;
    }

    // Получить текущее задание
    getCurrentTask() {
        if (!this.currentLevel || this.currentTaskIndex >= this.currentLevel.tasks.length) {
            return null;
        }
        return this.currentLevel.tasks[this.currentTaskIndex];
    }

    // Получить прогресс
    getProgress() {
        if (!this.currentLevel) return 0;
        return (this.currentTaskIndex / this.totalTasks) * 100;
    }

    // Начать запись
    async startRecording() {
        if (this.isProcessing) return false;

        try {
            await this.speechRecognizer.startRecording();
            this.taskTimer.start();

            // Инициализировать и запустить таймер речи
            if (this.speechRecognizer.stream) {
                await this.speechTimer.init(this.speechRecognizer.stream);
                this.speechTimer.startMonitoring();

                // Запустить визуализатор
                await this.audioVisualizer.init(this.speechRecognizer.stream);
            }

            return true;
        } catch (error) {
            console.error('Ошибка начала записи:', error);
            return false;
        }
    }

    // Остановить запись и проверить
    async stopRecordingAndCheck() {
        console.log('[Game.stopRecordingAndCheck] Начало');
        if (this.isProcessing) {
            console.warn('[Game.stopRecordingAndCheck] Уже обрабатывается');
            return null;
        }
        this.isProcessing = true;

        // Остановить визуализатор
        this.audioVisualizer.stop();

        const taskTime = this.taskTimer.stop();
        const speechTime = this.speechTimer.stopMonitoring(); // Время активной речи
        console.log('[Game.stopRecordingAndCheck] Общее время:', taskTime, 'мс, время речи:', speechTime, 'сек');

        try {
            console.log('[Game.stopRecordingAndCheck] Останавливаем запись');
            const audioBlob = await this.speechRecognizer.stopRecording();
            console.log('[Game.stopRecordingAndCheck] Аудио получено, размер:', audioBlob.size, 'байт');

            console.log('[Game.stopRecordingAndCheck] Распознаём речь');
            const recognition = await this.speechRecognizer.recognizeSpeech(audioBlob);
            console.log('[Game.stopRecordingAndCheck] Распознано:', recognition);

            const currentTask = this.getCurrentTask();
            if (!currentTask) {
                throw new Error('Нет текущего задания');
            }
            console.log('[Game.stopRecordingAndCheck] Текущее задание:', currentTask.text);

            const comparison = this.speechRecognizer.compareTexts(
                recognition.text,
                currentTask.text
            );
            console.log('[Game.stopRecordingAndCheck] Сравнение:', comparison);

            const isSuccess = comparison.similarity >= currentTask.targetAccuracy;
            let stars = this.calculateStars(comparison.similarity, currentTask.targetAccuracy);

            // Бонусы
            let speedBonus = 0;
            let comboBonus = 0;
            let comboInfo = null;
            let timeBonus = false;

            if (isSuccess) {
                // Бонус за скорость речи (если уложился в целевое время)
                if (currentTask.targetTime && speechTime <= currentTask.targetTime) {
                    speedBonus = 1;
                    timeBonus = true;
                    stars = Math.min(3, stars + speedBonus);
                }

                // Комбо
                comboInfo = this.comboSystem.addSuccess();
                const comboStars = Math.floor(comboInfo.combo / 3);
                comboBonus = comboStars;
                stars = Math.min(3, stars + comboBonus);

                this.score += stars * comboInfo.multiplier;
                this.tasksCompleted++;
            } else {
                this.comboSystem.addFailure();
            }

            const result = {
                recognized: recognition.text,
                expected: currentTask.text,
                similarity: comparison.similarity,
                isSuccess: isSuccess,
                stars: stars,
                baseStars: this.calculateStars(comparison.similarity, currentTask.targetAccuracy),
                speedBonus: speedBonus,
                comboBonus: comboBonus,
                comboInfo: comboInfo,
                taskTime: Math.floor(taskTime / 1000),
                speechTime: speechTime.toFixed(1), // Время активной речи
                targetTime: currentTask.targetTime || null, // Целевое время
                timeBonus: timeBonus
            };

            console.log('[Game.stopRecordingAndCheck] Результат:', result);
            this.isProcessing = false;
            return result;
        } catch (error) {
            console.error('[Game.stopRecordingAndCheck] Ошибка:', error);
            this.isProcessing = false;
            throw error;
        }
    }

    // Вычислить количество звёзд
    calculateStars(similarity, targetAccuracy) {
        if (similarity < targetAccuracy) return 0;
        if (similarity >= 0.95) return 3;
        if (similarity >= 0.85) return 2;
        return 1;
    }

    // Следующее задание
    nextTask() {
        this.currentTaskIndex++;
        return this.getCurrentTask();
    }

    // Пропустить задание
    skipTask() {
        return this.nextTask();
    }

    // Проверить завершение уровня
    isLevelComplete() {
        return this.currentTaskIndex >= this.totalTasks;
    }

    // Получить результаты уровня
    getLevelResults() {
        const levelTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
        this.fastestLevel = Math.min(this.fastestLevel, levelTime);

        return {
            score: Math.floor(this.score),
            tasksCompleted: this.tasksCompleted,
            totalTasks: this.totalTasks,
            accuracy: this.totalTasks > 0
                ? Math.round((this.tasksCompleted / this.totalTasks) * 100)
                : 0,
            maxCombo: this.comboSystem.maxCombo,
            levelTime: levelTime,
            fastestLevel: this.fastestLevel
        };
    }

    // Сбросить игру
    reset() {
        this.currentLevel = null;
        this.currentTaskIndex = 0;
        this.score = 0;
        this.tasksCompleted = 0;
        this.totalTasks = 0;
        this.isProcessing = false;
    }

    // Очистка ресурсов
    cleanup() {
        this.speechRecognizer.cleanup();
        this.audioVisualizer.stop();
        this.taskTimer.reset();
        this.reset();
    }
}

// Экспорт
window.Game = Game;
