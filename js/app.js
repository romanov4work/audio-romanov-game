// Главный файл приложения

class App {
    constructor() {
        console.log('[App] Конструктор начат');
        try {
            this.setupErrorHandling();
            this.game = new Game();
            this.currentScreen = 'loading';
            this.soundManager = new SoundManager();
            this.voiceManager = new VoiceManager();
            this.confettiManager = new ConfettiManager();
            this.playerStats = new PlayerStats();
            this.achievementSystem = new AchievementSystem();
            this.tutorialSystem = new TutorialSystem();
            this.progressSystem = new ProgressSystem();
            this.rewardSystem = new RewardSystem();
            this.parentDashboard = new ParentDashboard();
            this.menuCharacterAnimation = null; // Lottie анимация персонажа
            console.log('[App] Все классы инициализированы');
            this.init();
        } catch (error) {
            console.error('[App] Ошибка в конструкторе:', error);
            alert('Ошибка загрузки приложения: ' + error.message);
        }
    }

    setupErrorHandling() {
        // Глобальный обработчик ошибок
        window.addEventListener('error', (event) => {
            console.error('[GLOBAL ERROR]', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Обработчик необработанных промисов
        window.addEventListener('unhandledrejection', (event) => {
            console.error('[UNHANDLED PROMISE REJECTION]', {
                reason: event.reason,
                promise: event.promise
            });
        });

        console.log('[App] Обработчики ошибок установлены');
    }

    async init() {
        console.log('[App.init] Начало инициализации');
        try {
            // Показать экран загрузки
            console.log('[App.init] Симуляция загрузки');
            await this.simulateLoading();

            // Инициализировать обработчики событий
            console.log('[App.init] Инициализация обработчиков событий');
            this.initEventListeners();

            // Проверить поддержку микрофона
            if (!this.game.speechRecognizer.isSupported()) {
                alert('Ваш браузер не поддерживает запись звука. Попробуйте Chrome или Firefox.');
            }

            // Загрузить голоса (отключено из-за ошибок на мобильных)
            // console.log('[App.init] Загрузка голосов');
            // await this.voiceManager.loadVoices();

            // Показать главное меню
            console.log('[App.init] Показываем главное меню');
            this.showScreen('menu');

            // Инициализировать Lottie анимацию персонажа
            this.initMenuCharacterAnimation();

            // Обновить индикатор уровня
            this.updateLevelIndicator();

            // Обновить состояние модулей (заблокированные/разблокированные)
            this.updateModulesState();

            // Приветствие персонажа (отключено)
            // setTimeout(() => {
            //     this.voiceManager.sayWelcome();
            // }, 500);

            // Показать туториал при первом запуске
            if (this.tutorialSystem.shouldShowTutorial()) {
                setTimeout(() => {
                    this.voiceManager.saySpecial('tutorial_start');
                    this.tutorialSystem.startTutorial();
                }, 3000);
            }

            console.log('[App.init] Инициализация завершена');
        } catch (error) {
            console.error('[App.init] Ошибка инициализации:', error);
            alert('Ошибка инициализации: ' + error.message);
        }
    }

    simulateLoading() {
        return new Promise(resolve => {
            setTimeout(() => resolve(), 2000);
        });
    }

    initMenuCharacterAnimation() {
        try {
            const container = document.getElementById('menu-character-animation');
            if (!container) {
                console.warn('[App] Контейнер для анимации персонажа не найден');
                return;
            }

            console.log('[App] Контейнер найден:', container);

            // Проверяем наличие библиотеки Lottie
            if (typeof lottie === 'undefined') {
                console.warn('[App] Библиотека Lottie не загружена');
                return;
            }

            console.log('[App] Библиотека Lottie загружена');

            // Инициализируем Lottie анимацию
            this.menuCharacterAnimation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'assets/character-animation.json'
            });

            this.menuCharacterAnimation.addEventListener('DOMLoaded', () => {
                console.log('[App] Lottie анимация загружена успешно');
            });

            this.menuCharacterAnimation.addEventListener('data_failed', (error) => {
                console.error('[App] Ошибка загрузки данных Lottie:', error);
            });

            console.log('[App] Lottie анимация персонажа инициализирована');
        } catch (error) {
            console.error('[App] Ошибка инициализации Lottie анимации:', error);
        }
    }

    initEventListeners() {
        // Главное меню - объединённые модули
        document.getElementById('tongue-twisters').addEventListener('click', () => {
            this.soundManager.playClick();
            this.startLevel('combined-tongue-twisters');
        });

        // Туториал
        document.getElementById('how-to-play').addEventListener('click', () => {
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

        // Кнопка "Назад" в игре
        document.getElementById('back-to-menu-game').addEventListener('click', () => {
            this.exitToMenu();
        });

        // Выбор уровня
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('menu');
        });

        // Игровой экран - кнопка записи

        document.getElementById('record-btn').addEventListener('click', () => {
            this.handleRecordButton();
        });

        // Убраны skip-task и exit-to-menu
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

        // Кнопка выхода в меню
        document.getElementById('exit-to-menu').addEventListener('click', () => {
            this.exitToMenu();
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
        if (task.targetTime) {
            contentHTML += `<div class="task-target-time">⏱️ Целевое время: ${task.targetTime} сек</div>`;
        }
        if (task.emotion) {
            contentHTML += `<div class="task-emotion">Эмоция: ${task.emotion}</div>`;
        }
        // Убрали hint чтобы не отвлекал от текста скороговорки
        // if (task.instruction) {
        //     contentHTML += `<div class="hint">${task.instruction}</div>`;
        // } else {
        //     const hint = getTaskHint(task.type);
        //     contentHTML += `<div class="hint">${hint}</div>`;
        // }

        taskContent.innerHTML = contentHTML;

        // Озвучить инструкцию к заданию (отключено)
        // setTimeout(() => {
        //     this.voiceManager.sayInstruction(task.type);
        // }, 500);
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
        console.log('[handleRecordButton] Начало');
        const recordBtn = document.getElementById('record-btn');
        const recordingIndicator = document.getElementById('recording-indicator');
        const visualizer = document.getElementById('audio-visualizer');

        if (!this.game.speechRecognizer.isRecording) {
            // Начать запись
            console.log('[handleRecordButton] Начинаем запись');
            try {
                const success = await this.game.startRecording();
                console.log('[handleRecordButton] Результат startRecording:', success);
                if (success) {
                    // Звук начала записи
                    this.soundManager.playRecordStart();

                    recordBtn.classList.add('recording');
                    recordBtn.querySelector('.record-text').textContent = 'Говори!';
                    recordingIndicator.classList.add('active');
                    visualizer.style.display = 'block';
                }
            } catch (error) {
                console.error('[handleRecordButton] Ошибка при начале записи:', error);
                alert('Ошибка доступа к микрофону: ' + error.message);
            }
        } else {
            // Остановить запись и проверить
            console.log('[handleRecordButton] Останавливаем запись');
            // Звук остановки записи
            this.soundManager.playRecordStop();

            recordBtn.classList.remove('recording');
            recordBtn.querySelector('.record-text').textContent = 'Обрабатываем...';
            recordingIndicator.classList.remove('active');
            visualizer.style.display = 'none';

            // Показать индикатор обработки
            this.showProcessingIndicator();

            try {
                console.log('[handleRecordButton] Вызываем stopRecordingAndCheck');
                const result = await this.game.stopRecordingAndCheck();
                console.log('[handleRecordButton] Результат распознавания:', result);

                // Показать расшифровку
                this.updateProcessingTranscription(result.recognized);

                // Подождать немного, чтобы пользователь увидел расшифровку
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Скрыть индикатор обработки
                this.hideProcessingIndicator();

                this.showTaskResult(result);
            } catch (error) {
                console.error('[handleRecordButton] Ошибка проверки:', error);
                this.hideProcessingIndicator();
                alert('Ошибка проверки: ' + error.message);
                recordBtn.querySelector('.record-text').textContent = 'Нажми и говори';
            }
        }
    }

    showProcessingIndicator() {
        const indicator = document.getElementById('processing-indicator');
        const transcription = document.getElementById('processing-transcription');
        transcription.textContent = '';
        indicator.style.display = 'block';
    }

    hideProcessingIndicator() {
        const indicator = document.getElementById('processing-indicator');
        indicator.style.display = 'none';
    }

    updateProcessingTranscription(text) {
        const transcription = document.getElementById('processing-transcription');
        transcription.textContent = `Вы сказали: "${text}"`;
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

            // Озвучить похвалу (отключено)
            // setTimeout(() => {
            //     this.voiceManager.sayPraise();
            // }, 500);

            resultMessage.className = 'result-message success';
            const stars = '⭐'.repeat(result.stars);
            resultMessage.innerHTML = `<span class="stars-animation">Отлично! ${stars}</span>`;

            // Показать время произношения
            let detailsText = `Точность: ${Math.round(result.similarity * 100)}%`;
            if (result.targetTime && result.speechTime) {
                detailsText += `<br>Время: ${result.speechTime}с / ${result.targetTime}с`;
                if (result.timeBonus) {
                    detailsText += ` ⚡`;
                }
            }
            resultDetails.innerHTML = detailsText;

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
                    // this.voiceManager.saySpecial('combo_start');
                }, 1500);
            }

            // Озвучить комбо (отключено)
            // if (result.comboInfo && result.comboInfo.combo === 2) {
            //     setTimeout(() => {
            //         this.voiceManager.saySpecial('combo_2x');
            //     }, 2000);
            // } else if (result.comboInfo && result.comboInfo.combo >= 3) {
            //     setTimeout(() => {
            //         this.voiceManager.saySpecial('combo_3x');
            //     }, 2000);
            // }

            // Показать бонусы
            let bonusText = [];
            if (result.timeBonus) {
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
                // Звук звезды для каждой звезды
                this.soundManager.playStar();
                setTimeout(() => this.soundManager.playStar(), 100);
                setTimeout(() => this.soundManager.playStar(), 200);

                this.confettiManager.create(window.innerWidth / 2, window.innerHeight / 2, 20);
            }

            // Звук комбо
            if (result.comboInfo && result.comboInfo.combo > 1) {
                setTimeout(() => {
                    this.soundManager.playCombo();
                }, 800);
            }
        } else {
            this.soundManager.playError();

            // Озвучить подбадривание
            setTimeout(() => {
                this.voiceManager.sayEncourage();
            }, 500);

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

        // Озвучить завершение уровня
        setTimeout(() => {
            this.voiceManager.saySpecial('level_complete');
        }, 1000);

        // Не сохранять статистику в демо-режиме
        if (!this.tutorialSystem.isDemoMode()) {
            // Рассчитать XP
            const xp = this.progressSystem.calculateXP(results.score, results.accuracy, results.tasksCompleted);

            // Добавить XP и проверить повышение уровня
            const leveledUp = this.progressSystem.addXP(xp);

            // Обновить прогресс модуля
            this.progressSystem.updateModuleProgress(
                this.game.currentLevel.id,
                results.score,
                results.accuracy
            );

            // Показать уведомление о XP
            this.showXPNotification(xp);

            // Если повысился уровень
            if (leveledUp) {
                setTimeout(() => {
                    const level = this.progressSystem.getPlayerLevel();
                    this.rewardSystem.show('levelUp', { level });
                    this.soundManager.playAchievement();
                    this.updateLevelIndicator();
                    this.updateModulesState();
                }, 2000);
            }

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
                // Озвучить достижение
                setTimeout(() => {
                    this.voiceManager.saySpecial('achievement');
                }, 2000);
            }

            // Сохранить сессию для родительской статистики
            const duration = Math.floor((Date.now() - this.game.startTime) / 1000);
            this.parentDashboard.saveSession(
                this.game.currentLevel.id,
                duration,
                results.score,
                results.accuracy
            );
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

    // Обновить индикатор уровня
    updateLevelIndicator() {
        const level = this.progressSystem.getPlayerLevel();
        const progress = this.progressSystem.getLevelProgress();
        const totalXP = this.progressSystem.getTotalXP();
        const xpNeeded = this.progressSystem.getXPForNextLevel();

        document.getElementById('level-badge').textContent = level;
        document.getElementById('xp-fill').style.width = `${progress * 100}%`;
        document.getElementById('xp-text').textContent = `${totalXP} / ${xpNeeded} XP`;
    }

    // Обновить состояние модулей (заблокированные/разблокированные)
    updateModulesState() {
        const modules = [
            { id: 'combined-tongue-twisters', element: 'tongue-twisters', name: 'Скороговорки и слова' },
            { id: 'combined-voicing', element: 'voicing', name: 'Озвучка и дыхание' },
            { id: 'speed-reading', element: 'speed-reading', name: 'Скорочтение' },
            { id: 'sound-improvement', element: 'sound-improvement', name: 'Как улучшить звуки' }
        ];

        modules.forEach((module, index) => {
            const btn = document.getElementById(module.element);
            if (!btn) {
                console.warn(`[App] Кнопка модуля ${module.element} не найдена`);
                return;
            }

            const isUnlocked = this.progressSystem.isModuleUnlocked(module.id);

            if (isUnlocked) {
                btn.classList.remove('module-locked');
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
            } else {
                btn.classList.add('module-locked');
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.6';

                // Показать требуемый уровень
                const requiredLevel = index + 1;
                const label = btn.querySelector('.btn-label');
                if (label && !label.textContent.includes('Уровень')) {
                    label.innerHTML += `<br><small style="font-size: 12px; color: #999;">Уровень ${requiredLevel}</small>`;
                }
            }
        });
    }

    // Показать уведомление о XP
    showXPNotification(xp) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.textContent = `+${xp} XP`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('active');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
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
                // Звук достижения
                this.soundManager.playAchievement();
            }, index * 500);
        });

        container.style.display = 'block';
    }

    showHint() {
        const task = this.game.getCurrentTask();
        if (!task) return;

        const hint = this.game.hintSystem.useHint(task);
        if (hint) {
            // Звук подсказки
            this.soundManager.playHint();

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

    exitToMenu() {
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

    showParentDashboard() {
        const stats = this.parentDashboard.getFullStats();

        // Заполняем общую статистику
        const statsOverview = document.getElementById('stats-overview');
        statsOverview.innerHTML = `
            <div class="stat-card primary">
                <div class="stat-value">${stats.playerLevel}</div>
                <div class="stat-label">Уровень</div>
            </div>
            <div class="stat-card success">
                <div class="stat-value">${stats.totalGames}</div>
                <div class="stat-label">Игр сыграно</div>
            </div>
            <div class="stat-card info">
                <div class="stat-value">${stats.totalStars}</div>
                <div class="stat-label">Звёзд собрано</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.timeStats.streak}</div>
                <div class="stat-label">Дней подряд</div>
            </div>
        `;

        // Заполняем статистику по модулям
        const modulesStats = document.getElementById('modules-stats');
        modulesStats.innerHTML = stats.modules.map(module => `
            <div class="module-stat-card">
                <div class="module-icon-stat">${module.icon}</div>
                <div class="module-stat-info">
                    <div class="module-stat-name">${module.name}</div>
                    <div class="module-stat-details">
                        <div>Игр: ${module.plays}</div>
                        <div>Звёзды: ${module.stars} ⭐</div>
                        <div>Точность: ${module.bestAccuracy}%</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Заполняем сильные стороны
        const strengthsList = document.getElementById('strengths-list');
        strengthsList.innerHTML = stats.strengths.length > 0
            ? stats.strengths.map(strength => `
                <div class="strength-item">
                    <div class="item-icon">${strength.icon}</div>
                    <div class="item-info">
                        <div class="item-title">${strength.title}</div>
                        <div class="item-description">${strength.description}</div>
                    </div>
                </div>
            `).join('')
            : '<p style="text-align: center; color: var(--text-secondary);">Продолжайте играть, чтобы увидеть сильные стороны!</p>';

        // Заполняем слабые стороны
        const weaknessesList = document.getElementById('weaknesses-list');
        weaknessesList.innerHTML = stats.weaknesses.length > 0
            ? stats.weaknesses.map(weakness => `
                <div class="weakness-item">
                    <div class="item-icon">${weakness.icon}</div>
                    <div class="item-info">
                        <div class="item-title">${weakness.title}</div>
                        <div class="item-description">${weakness.description}</div>
                    </div>
                </div>
            `).join('')
            : '<p style="text-align: center; color: var(--text-secondary);">Отлично! Слабых сторон не обнаружено.</p>';

        // Заполняем рекомендации
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = stats.recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="recommendation-icon">${rec.icon}</div>
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-description">${rec.description}</div>
                </div>
            </div>
        `).join('');

        // Показываем модальное окно
        document.getElementById('parent-dashboard-modal').classList.add('active');
    }

    hideParentDashboard() {
        document.getElementById('parent-dashboard-modal').classList.remove('active');
    }

    exportStatsPrint() {
        const stats = this.parentDashboard.getFullStats();
        const html = this.parentDashboard.generatePrintableHTML(stats);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    exportStatsCSV() {
        const csv = this.parentDashboard.exportToCSV(this.parentDashboard.getFullStats());

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `статистика_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Запуск приложения
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
