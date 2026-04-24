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

            const result = {
                recognized: recognition.text,
                expected: currentTask.text,
                similarity: comparison.similarity,
                isSuccess: comparison.similarity >= currentTask.targetAccuracy,
                stars: this.calculateStars(comparison.similarity, currentTask.targetAccuracy)
            };

            if (result.isSuccess) {
                this.score += result.stars;
                this.tasksCompleted++;
            }

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
        return {
            score: this.score,
            tasksCompleted: this.tasksCompleted,
            totalTasks: this.totalTasks,
            accuracy: this.totalTasks > 0
                ? Math.round((this.tasksCompleted / this.totalTasks) * 100)
                : 0
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
        this.reset();
    }
}

// Экспорт
window.Game = Game;
