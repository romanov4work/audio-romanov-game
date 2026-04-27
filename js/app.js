// Главный файл приложения

class App {
    constructor() {
        this.game = new Game();
        this.currentScreen = 'loading';
        this.soundManager = new SoundManager();
        this.confettiManager = new ConfettiManager();
        this.playerStats = new PlayerStats();
        this.achievementSystem = new AchievementSystem();
        this.tutorialSystem = new TutorialSystem();
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

        // Показать туториал при первом запуске
        if (this.tutorialSystem.shouldShowTutorial()) {
            setTimeout(() => {
                this.tutorialSystem.startTutorial();
            }, 500);
        }
    }

    simulateLoading() {
        return new Promise(resolve => {
            setTimeout(() => resolve(), 2000);
        });
    }

    initEventListeners() {
        // Главное меню - режим тренировки
        document.getElementById('demo-mode').addEventListener('click', () => {
            this.soundManager.playClick();
            this.startDemoMode();
        });

        // Главное меню - объединённые модули
        document.getElementById('tongue-twisters').addEventListener('click', () => {
            this.soundManager.playClick();
            this.startLevel('combined-tongue-twisters');
        });

        document.getElementById('voicing').addEventListener('click', () => {
            this.soundManager.playClick();
            this.startLevel('combined-voicing');
        });

        document.getElementById('speed-reading').addEventListener('click', () => {
            this.soundManager.playClick();
            this.startLevel('speed-reading');
        });

        document.getElementById('sound-improvement').addEventListener('click', () => {
            this.soundManager.playClick();
            this.startLevel('sound-improvement');
        });

        // Верхние кнопки
        document.getElementById('how-to-play').addEventListener('click', () => {
            this.soundManager.playClick();
            this.showTutorial();
        });

        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.soundManager.playClick();
            this.toggleFullscreen();
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
            this.showScreen('menu');
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

        // Кнопка подсказки
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
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

        // Показать подсказку для первого задания
        if (this.game.currentTaskIndex === 0 && !this.tutorialSystem.isDemoMode()) {
            setTimeout(() => {
                this.tutorialSystem.showInGameHint('first-task');
            }, 1000);
        }

        // Показать индикатор демо-режима
        if (this.tutorialSystem.isDemoMode()) {
            this.showDemoModeIndicator();
        }
    }

    startDemoMode() {
        const demoLevel = this.tutorialSystem.startDemoMode();
        this.game.currentLevel = demoLevel;
        this.game.currentTaskIndex = 0;
        this.game.score = 0;
        this.game.tasksCompleted = 0;
        this.game.comboSystem.reset();
        this.startLevel('demo-mode');
    }

    showDemoModeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'demo-mode-indicator';
        indicator.id = 'demo-mode-indicator';
        indicator.innerHTML = '🎓 Режим тренировки - оценки не сохраняются';
        document.body.appendChild(indicator);
    }

    hideDemoModeIndicator() {
        const indicator = document.getElementById('demo-mode-indicator');
        if (indicator) {
            indicator.remove();
        }
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
        document.getElementById('result-bonus').style.display = 'none';

        // Сбросить таймер
        this.game.taskTimer.reset();
        this.startTaskTimer();

        // Показать кнопку подсказки
        const hintBtn = document.getElementById('hint-btn');
        const hintsRemaining = document.getElementById('hints-remaining');
        if (this.game.hintSystem.canUseHint()) {
            hintBtn.style.display = 'inline-block';
            hintsRemaining.textContent = this.game.hintSystem.getRemaining();
        } else {
            hintBtn.style.display = 'none';
        }

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
        } else if (task.type === 'breathing') {
            title = 'Дыхательное упражнение';
        } else if (task.type === 'articulation') {
            title = 'Артикуляция';
        } else if (task.type === 'story') {
            title = 'Расскажи историю';
        }

        taskTitle.textContent = title;

        let contentHTML = `<div class="task-text">${task.text}</div>`;
        if (task.emotion) {
            contentHTML += `<div class="task-emotion">Эмоция: ${task.emotion}</div>`;
        }
        if (task.instruction) {
            contentHTML += `<div class="hint">${task.instruction}</div>`;
        } else {
            const hint = getTaskHint(task.type);
            contentHTML += `<div class="hint">${hint}</div>`;
        }

        taskContent.innerHTML = contentHTML;
    }

    startTaskTimer() {
        const timerValue = document.getElementById('timer-value');
        this.timerInterval = setInterval(() => {
            const seconds = this.game.taskTimer.getElapsedSeconds();
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerValue.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTaskTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    async handleRecordButton() {
        const recordBtn = document.getElementById('record-btn');
        const recordingIndicator = document.getElementById('recording-indicator');
        const visualizer = document.getElementById('audio-visualizer');

        if (!this.game.speechRecognizer.isRecording) {
            // Начать запись
            const success = await this.game.startRecording();
            if (success) {
                recordBtn.classList.add('recording');
                recordBtn.querySelector('.record-text').textContent = 'Говори!';
                recordingIndicator.classList.add('active');
                visualizer.style.display = 'block';

                // Анимация персонажа
                const gameCharacter = document.getElementById('game-character');
                gameCharacter.classList.add('talking');
            }
        } else {
            // Остановить запись и проверить
            recordBtn.classList.remove('recording');
            recordBtn.querySelector('.record-text').textContent = 'Проверяю...';
            recordingIndicator.classList.remove('active');
            visualizer.style.display = 'none';

            const gameCharacter = document.getElementById('game-character');
            gameCharacter.classList.remove('talking');

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
        const resultBonus = document.getElementById('result-bonus');

        if (result.isSuccess) {
            this.soundManager.playSuccess();
            const gameCharacter = document.getElementById('game-character');
            gameCharacter.classList.add('success');
            setTimeout(() => gameCharacter.classList.remove('success'), 600);

            resultMessage.className = 'result-message success';
            const stars = '⭐'.repeat(result.stars);
            resultMessage.innerHTML = `<span class="stars-animation">Отлично! ${stars}</span>`;
            resultDetails.textContent = `Точность: ${Math.round(result.similarity * 100)}%`;

            // Показать подсказку при хорошем результате
            if (!this.tutorialSystem.isDemoMode() && this.game.currentTaskIndex === 0) {
                setTimeout(() => {
                    this.tutorialSystem.showInGameHint('good-job');
                }, 1000);
            }

            // Показать подсказку при начале комбо
            if (result.comboInfo && result.comboInfo.combo === 2) {
                setTimeout(() => {
                    this.tutorialSystem.showInGameHint('combo-started');
                }, 1500);
            }

            // Показать бонусы
            let bonusText = [];
            if (result.speedBonus > 0) {
                bonusText.push(`⚡ Бонус за скорость: +${result.speedBonus} звезда`);
            }
            if (result.comboInfo && result.comboInfo.combo > 1) {
                bonusText.push(`🔥 Комбо x${result.comboInfo.combo}! Множитель: x${result.comboInfo.multiplier}`);
            }
            if (bonusText.length > 0) {
                resultBonus.innerHTML = bonusText.join('<br>');
                resultBonus.style.display = 'block';
            } else {
                resultBonus.style.display = 'none';
            }

            // Обновить комбо индикатор
            if (result.comboInfo && result.comboInfo.combo > 1) {
                this.updateComboDisplay(result.comboInfo.combo, result.comboInfo.multiplier);
            }

            if (result.stars === 3) {
                this.confettiManager.create(window.innerWidth / 2, window.innerHeight / 2, 20);
            }
        } else {
            this.soundManager.playError();
            resultMessage.className = 'result-message error';
            resultMessage.textContent = 'Попробуй ещё раз!';
            resultDetails.textContent = `Ты сказал: "${result.recognized}"`;
            resultBonus.style.display = 'none';

            // Показать подсказку при неудаче
            if (!this.tutorialSystem.isDemoMode()) {
                setTimeout(() => {
                    this.tutorialSystem.showInGameHint('try-again');
                }, 1000);
            }

            // Скрыть комбо
            document.getElementById('combo-indicator').style.display = 'none';

            const taskContainer = document.querySelector('.task-container');
            taskContainer.classList.add('shake');
            setTimeout(() => taskContainer.classList.remove('shake'), 500);
        }

        resultContainer.classList.add('active');
        document.getElementById('next-task').style.display = 'block';

        this.updateGameUI();
    }

    updateComboDisplay(combo, multiplier) {
        const comboIndicator = document.getElementById('combo-indicator');
        const comboValue = document.getElementById('combo-value');
        const multiplierEl = document.getElementById('multiplier');

        comboValue.textContent = combo;
        multiplierEl.textContent = `x${multiplier}`;
        comboIndicator.style.display = 'block';

        // Анимация
        comboIndicator.classList.remove('combo-appear');
        void comboIndicator.offsetWidth; // Trigger reflow
        comboIndicator.classList.add('combo-appear');
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
        this.stopTaskTimer();
        this.hideDemoModeIndicator();

        const results = this.game.getLevelResults();

        // Не сохранять статистику в демо-режиме
        if (!this.tutorialSystem.isDemoMode()) {
            // Сохранить статистику
            const stats = this.playerStats.getStats();
            stats.maxCombo = Math.max(stats.maxCombo || 0, results.maxCombo);
            stats.fastestLevel = Math.min(stats.fastestLevel || Infinity, results.fastestLevel);

            this.playerStats.addGame(
                this.game.currentLevel.id,
                results.score,
                results.tasksCompleted,
                results.totalTasks,
                results.accuracy
            );

            // Проверить достижения
            const newAchievements = this.achievementSystem.check(this.playerStats.getStats());

            // Показать новые достижения
            if (newAchievements.length > 0) {
                this.showNewAchievements(newAchievements);
            }
        } else {
            // Выйти из демо-режима
            this.tutorialSystem.exitDemoMode();
        }

        // Анимация чисел
        const finalScoreEl = document.getElementById('final-score');
        const tasksCompletedEl = document.getElementById('tasks-completed');
        const accuracyEl = document.getElementById('accuracy');
        const maxComboEl = document.getElementById('max-combo');

        animateNumber(finalScoreEl, 0, results.score, 1000);
        setTimeout(() => {
            tasksCompletedEl.textContent = `${results.tasksCompleted}/${results.totalTasks}`;
        }, 500);
        setTimeout(() => {
            accuracyEl.textContent = `${results.accuracy}%`;
        }, 1000);
        setTimeout(() => {
            maxComboEl.textContent = results.maxCombo;
        }, 1500);

        // Звук и конфетти
        this.soundManager.playComplete();
        this.confettiManager.celebrate();

        this.showScreen('results');
        this.game.reset();
    }

    showNewAchievements(achievements) {
        const container = document.getElementById('new-achievements');
        const list = document.getElementById('achievements-list');

        list.innerHTML = '';
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const item = document.createElement('div');
                item.className = 'achievement-item';
                item.innerHTML = `
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                    </div>
                `;
                list.appendChild(item);
                this.soundManager.playSuccess();
            }, index * 500);
        });

        container.style.display = 'block';
    }

    showHint() {
        const task = this.game.getCurrentTask();
        if (!task) return;

        const hint = this.game.hintSystem.useHint(task);
        if (hint) {
            alert(`💡 Подсказка:\n\n${hint}`);

            const hintsRemaining = document.getElementById('hints-remaining');
            hintsRemaining.textContent = this.game.hintSystem.getRemaining();

            if (!this.game.hintSystem.canUseHint()) {
                document.getElementById('hint-btn').style.display = 'none';
            }
        }
    }

    showSettings() {
        const soundEnabled = this.soundManager.enabled;
        const message = `Настройки\n\nЗвук: ${soundEnabled ? 'Включён' : 'Выключён'}\n\nИзменить звук?`;

        if (confirm(message)) {
            const newState = this.soundManager.toggle();
            alert(`Звук ${newState ? 'включён' : 'выключён'}`);
        }
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

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Войти в полноэкранный режим
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Ошибка входа в полноэкранный режим:', err);
            });
        } else {
            // Выйти из полноэкранного режима
            document.exitFullscreen();
        }
    }
}

// Запуск приложения
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
