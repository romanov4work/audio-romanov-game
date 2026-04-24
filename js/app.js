// Главный файл приложения

class App {
    constructor() {
        this.game = new Game();
        this.currentScreen = 'loading';
        this.init();
    }

    async init() {
        // Показать экран загрузки
        await this.simulateLoading();

        // Инициализировать обработчики событий
        this.initEventListeners();

        // Проверить поддержку микрофона
        if (!this.game.speechRecognizer.isSupported()) {
            alert('Ваш браузер не поддерживает запись звука. Попробуйте Chrome или Firefox.');
        }

        // Показать главное меню
        this.showScreen('menu');
    }

    simulateLoading() {
        return new Promise(resolve => {
            setTimeout(() => resolve(), 2000);
        });
    }

    initEventListeners() {
        // Главное меню
        document.getElementById('start-game').addEventListener('click', () => {
            this.showScreen('level-select');
            this.renderLevels();
        });

        document.getElementById('how-to-play').addEventListener('click', () => {
            this.showTutorial();
        });

        // Выбор уровня
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('menu');
        });

        // Игровой экран
        document.getElementById('pause-game').addEventListener('click', () => {
            this.pauseGame();
        });

        document.getElementById('record-btn').addEventListener('click', () => {
            this.handleRecordButton();
        });

        document.getElementById('skip-task').addEventListener('click', () => {
            this.skipTask();
        });

        document.getElementById('next-task').addEventListener('click', () => {
            this.nextTask();
        });

        // Экран результатов
        document.getElementById('play-again').addEventListener('click', () => {
            this.showScreen('level-select');
            this.renderLevels();
        });

        document.getElementById('back-to-menu-results').addEventListener('click', () => {
            this.showScreen('menu');
        });

        // Туториал
        document.getElementById('close-tutorial').addEventListener('click', () => {
            this.hideTutorial();
        });

        document.getElementById('start-from-tutorial').addEventListener('click', () => {
            this.hideTutorial();
            this.showScreen('level-select');
            this.renderLevels();
        });
    }

    showScreen(screenName) {
        // Скрыть все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показать нужный экран
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    renderLevels() {
        const levelsGrid = document.getElementById('levels-grid');
        levelsGrid.innerHTML = '';

        const levels = getAllLevels();
        levels.forEach(level => {
            const levelCard = document.createElement('div');
            levelCard.className = 'level-card';
            levelCard.innerHTML = `
                <div class="level-icon">${level.icon}</div>
                <div class="level-title">${level.title}</div>
                <div class="level-description">${level.description}</div>
                <div class="level-stats">
                    <span>${getDifficultyText(level.difficulty)}</span>
                    <span>${level.tasks.length} заданий</span>
                </div>
            `;

            levelCard.addEventListener('click', () => {
                this.startLevel(level.id);
            });

            levelsGrid.appendChild(levelCard);
        });
    }

    async startLevel(levelId) {
        const success = this.game.startLevel(levelId);
        if (!success) {
            alert('Ошибка загрузки уровня');
            return;
        }

        // Запросить доступ к микрофону
        const hasAccess = await this.game.speechRecognizer.requestMicrophoneAccess();
        if (!hasAccess) {
            alert('Для игры нужен доступ к микрофону');
            return;
        }

        this.showScreen('game');
        this.updateGameUI();
        this.showCurrentTask();
    }

    updateGameUI() {
        // Обновить прогресс
        const progress = this.game.getProgress();
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // Обновить счёт
        document.getElementById('score').textContent = `⭐ ${this.game.score}`;
    }

    showCurrentTask() {
        const task = this.game.getCurrentTask();
        if (!task) {
            this.showResults();
            return;
        }

        // Скрыть результат предыдущего задания
        document.getElementById('result-container').classList.remove('active');
        document.getElementById('next-task').style.display = 'none';

        // Показать задание
        const taskTitle = document.getElementById('task-title');
        const taskContent = document.getElementById('task-content');

        let title = 'Произнеси фразу';
        if (task.type === 'tongue-twister') {
            title = 'Скороговорка';
        } else if (task.type === 'word') {
            title = 'Сложное слово';
        } else if (task.type === 'voicing') {
            title = 'Озвучь с эмоцией';
        } else if (task.type === 'speed-reading') {
            title = 'Прочитай быстро';
        } else if (task.type === 'sound-practice') {
            title = 'Повтори звуки';
        }

        taskTitle.textContent = title;

        let contentHTML = `<div class="task-text">${task.text}</div>`;
        if (task.emotion) {
            contentHTML += `<div class="task-emotion">Эмоция: ${task.emotion}</div>`;
        }

        taskContent.innerHTML = contentHTML;
    }

    async handleRecordButton() {
        const recordBtn = document.getElementById('record-btn');
        const recordingIndicator = document.getElementById('recording-indicator');

        if (!this.game.speechRecognizer.isRecording) {
            // Начать запись
            const success = await this.game.startRecording();
            if (success) {
                recordBtn.classList.add('recording');
                recordBtn.querySelector('.record-text').textContent = 'Говори!';
                recordingIndicator.classList.add('active');
            }
        } else {
            // Остановить запись и проверить
            recordBtn.classList.remove('recording');
            recordBtn.querySelector('.record-text').textContent = 'Проверяю...';
            recordingIndicator.classList.remove('active');

            try {
                const result = await this.game.stopRecordingAndCheck();
                this.showTaskResult(result);
            } catch (error) {
                alert('Ошибка проверки. Попробуй ещё раз!');
                recordBtn.querySelector('.record-text').textContent = 'Нажми и говори';
            }
        }
    }

    showTaskResult(result) {
        const recordBtn = document.getElementById('record-btn');
        recordBtn.querySelector('.record-text').textContent = 'Нажми и говори';

        const resultContainer = document.getElementById('result-container');
        const resultMessage = document.getElementById('result-message');
        const resultDetails = document.getElementById('result-details');

        if (result.isSuccess) {
            resultMessage.className = 'result-message success';
            const stars = '⭐'.repeat(result.stars);
            resultMessage.textContent = `Отлично! ${stars}`;
            resultDetails.textContent = `Точность: ${Math.round(result.similarity * 100)}%`;
        } else {
            resultMessage.className = 'result-message error';
            resultMessage.textContent = 'Попробуй ещё раз!';
            resultDetails.textContent = `Ты сказал: "${result.recognized}"`;
        }

        resultContainer.classList.add('active');
        document.getElementById('next-task').style.display = 'block';

        this.updateGameUI();
    }

    nextTask() {
        const nextTask = this.game.nextTask();
        if (nextTask) {
            this.showCurrentTask();
        } else {
            this.showResults();
        }
    }

    skipTask() {
        this.nextTask();
    }

    showResults() {
        const results = this.game.getLevelResults();

        document.getElementById('final-score').textContent = results.score;
        document.getElementById('tasks-completed').textContent =
            `${results.tasksCompleted}/${results.totalTasks}`;
        document.getElementById('accuracy').textContent = `${results.accuracy}%`;

        this.showScreen('results');
        this.game.reset();
    }

    pauseGame() {
        if (confirm('Вернуться в меню? Прогресс будет потерян.')) {
            this.game.cleanup();
            this.showScreen('menu');
        }
    }

    showTutorial() {
        document.getElementById('tutorial-modal').classList.add('active');
    }

    hideTutorial() {
        document.getElementById('tutorial-modal').classList.remove('active');
    }
}

// Запуск приложения
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
