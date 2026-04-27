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

            // Запустить визуализатор
            if (this.speechRecognizer.stream) {
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
        if (this.isProcessing) return null;
        this.isProcessing = true;

        // Остановить визуализатор
        this.audioVisualizer.stop();

        const taskTime = this.taskTimer.stop();

        try {
            const audioBlob = await this.speechRecognizer.stopRecording();
            const recognition = await this.speechRecognizer.recognizeSpeech(audioBlob);

            const currentTask = this.getCurrentTask();
            if (!currentTask) {
                throw new Error('Нет текущего задания');
            }

            const comparison = this.speechRecognizer.compareTexts(
                recognition.text,
                currentTask.text
            );

            const isSuccess = comparison.similarity >= currentTask.targetAccuracy;
            let stars = this.calculateStars(comparison.similarity, currentTask.targetAccuracy);

            // Бонусы
            let speedBonus = 0;
            let comboBonus = 0;
            let comboInfo = null;

            if (isSuccess) {
                // Бонус за скорость (если быстрее 10 секунд)
                if (taskTime < 10000) {
                    speedBonus = 1;
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
                taskTime: Math.floor(taskTime / 1000)
            };

            this.isProcessing = false;
            return result;
        } catch (error) {
            console.error('Ошибка проверки:', error);
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
