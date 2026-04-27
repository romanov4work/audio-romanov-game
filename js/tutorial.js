// Обучающий режим и туториал

class TutorialSystem {
    constructor() {
        this.isFirstTime = !localStorage.getItem('tutorial_completed');
        this.currentStep = 0;
        this.tutorialActive = false;
        this.demoMode = false;
    }

    // Проверить, первый ли раз пользователь
    shouldShowTutorial() {
        return this.isFirstTime;
    }

    // Начать обучающий режим
    startTutorial() {
        this.tutorialActive = true;
        this.currentStep = 0;
        this.showTutorialOverlay();
    }

    // Показать оверлей с туториалом
    showTutorialOverlay() {
        const overlay = document.getElementById('tutorial-overlay');
        if (!overlay) {
            this.createTutorialOverlay();
        }

        const tutorialOverlay = document.getElementById('tutorial-overlay');
        tutorialOverlay.classList.add('active');
        this.showStep(this.currentStep);
    }

    // Создать оверлей туториала
    createTutorialOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'tutorial-overlay';
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-character">🎭</div>
                <h2 class="tutorial-title" id="tutorial-title"></h2>
                <p class="tutorial-text" id="tutorial-text"></p>
                <div class="tutorial-demo" id="tutorial-demo"></div>
                <div class="tutorial-buttons">
                    <button class="btn btn-secondary" id="tutorial-skip">Пропустить</button>
                    <button class="btn btn-primary" id="tutorial-next">Далее</button>
                </div>
                <div class="tutorial-progress">
                    <span id="tutorial-step-indicator">1 / 5</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Обработчики
        document.getElementById('tutorial-skip').addEventListener('click', () => {
            this.skipTutorial();
        });

        document.getElementById('tutorial-next').addEventListener('click', () => {
            this.nextStep();
        });
    }

    // Шаги туториала
    getTutorialSteps() {
        return [
            {
                title: 'Добро пожаловать! 👋',
                text: 'Привет! Я помогу тебе научиться говорить чётко и красиво. Давай начнём!',
                demo: '<div class="tutorial-animation">🎬</div>'
            },
            {
                title: 'Выбери модуль 🎮',
                text: 'На главном экране выбери один из 4 модулей: скороговорки, озвучка, скорочтение или звуки.',
                demo: `
                    <div class="tutorial-menu-demo">
                        <div class="demo-button">👅 Скороговорки</div>
                        <div class="demo-button">🎭 Озвучка</div>
                        <div class="demo-button">⚡ Скорочтение</div>
                        <div class="demo-button">🗣️ Звуки</div>
                    </div>
                `
            },
            {
                title: 'Нажми на микрофон 🎤',
                text: 'Когда увидишь задание, нажми на большую кнопку с микрофоном и произнеси текст чётко и громко.',
                demo: `
                    <div class="tutorial-mic-demo">
                        <div class="demo-mic-button">
                            <span class="demo-mic-icon">🎤</span>
                            <span>Нажми и говори</span>
                        </div>
                    </div>
                `
            },
            {
                title: 'Получай звёзды ⭐',
                text: 'За правильное произношение ты получишь от 1 до 3 звёзд. Чем точнее говоришь, тем больше звёзд!',
                demo: `
                    <div class="tutorial-stars-demo">
                        <div class="demo-stars">⭐⭐⭐</div>
                        <div class="demo-accuracy">95% точность</div>
                    </div>
                `
            },
            {
                title: 'Собирай комбо! 🔥',
                text: 'Отвечай правильно несколько раз подряд, чтобы получить комбо-множитель и больше очков!',
                demo: `
                    <div class="tutorial-combo-demo">
                        <div class="demo-combo">
                            <span class="demo-combo-label">КОМБО</span>
                            <span class="demo-combo-value">5</span>
                        </div>
                        <div class="demo-multiplier">x2</div>
                    </div>
                `
            }
        ];
    }

    // Показать шаг
    showStep(stepIndex) {
        const steps = this.getTutorialSteps();
        if (stepIndex >= steps.length) {
            this.completeTutorial();
            return;
        }

        const step = steps[stepIndex];
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-text').textContent = step.text;
        document.getElementById('tutorial-demo').innerHTML = step.demo;
        document.getElementById('tutorial-step-indicator').textContent = `${stepIndex + 1} / ${steps.length}`;

        // Изменить кнопку на последнем шаге
        const nextBtn = document.getElementById('tutorial-next');
        if (stepIndex === steps.length - 1) {
            nextBtn.textContent = 'Начать игру!';
        } else {
            nextBtn.textContent = 'Далее';
        }
    }

    // Следующий шаг
    nextStep() {
        this.currentStep++;
        this.showStep(this.currentStep);
    }

    // Пропустить туториал
    skipTutorial() {
        if (confirm('Ты уверен, что хочешь пропустить обучение?')) {
            this.completeTutorial();
        }
    }

    // Завершить туториал
    completeTutorial() {
        localStorage.setItem('tutorial_completed', 'true');
        this.tutorialActive = false;
        this.isFirstTime = false;

        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Сбросить туториал (для тестирования)
    resetTutorial() {
        localStorage.removeItem('tutorial_completed');
        this.isFirstTime = true;
    }

    // Демо-режим (тренировка без оценок)
    startDemoMode() {
        this.demoMode = true;
        return {
            id: 'demo-mode',
            title: 'Тренировка',
            description: 'Попробуй без оценок',
            icon: '🎓',
            difficulty: 'easy',
            tasks: [
                {
                    type: 'tongue-twister',
                    text: 'Шла Саша по шоссе',
                    emotion: null,
                    targetAccuracy: 0.5,
                    isDemo: true
                },
                {
                    type: 'voicing',
                    text: 'Привет!',
                    emotion: 'радость',
                    targetAccuracy: 0.5,
                    isDemo: true
                },
                {
                    type: 'speed-reading',
                    text: 'Кот, дом, лес',
                    emotion: null,
                    targetAccuracy: 0.5,
                    timeLimit: 10,
                    isDemo: true
                }
            ]
        };
    }

    // Проверить, демо-режим ли
    isDemoMode() {
        return this.demoMode;
    }

    // Выйти из демо-режима
    exitDemoMode() {
        this.demoMode = false;
    }

    // Показать подсказку во время игры
    showInGameHint(hintType) {
        const hints = {
            'first-task': {
                title: '💡 Первое задание!',
                text: 'Прочитай текст, нажми на микрофон и произнеси его чётко.',
                duration: 5000
            },
            'good-job': {
                title: '🎉 Отлично!',
                text: 'Ты справился! Продолжай в том же духе!',
                duration: 3000
            },
            'try-again': {
                title: '💪 Попробуй ещё раз',
                text: 'Не переживай! Говори медленнее и чётче.',
                duration: 3000
            },
            'combo-started': {
                title: '🔥 Комбо началось!',
                text: 'Продолжай отвечать правильно, чтобы увеличить множитель!',
                duration: 3000
            }
        };

        const hint = hints[hintType];
        if (!hint) return;

        this.showToast(hint.title, hint.text, hint.duration);
    }

    // Показать всплывающую подсказку
    showToast(title, text, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'tutorial-toast';
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-text">${text}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('active');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
}
