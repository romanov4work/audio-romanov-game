// Инициализация анимации кота
console.log('[LOTTIE] Скрипт загружен');

// Проверяем загрузку Lottie сразу
if (typeof lottie !== 'undefined') {
    console.log('[LOTTIE] ✅ Библиотека Lottie доступна');
} else {
    console.log('[LOTTIE] ⏳ Ожидаем загрузку Lottie...');
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('[LOTTIE] DOM загружен, запускаем инициализацию');

    const initAnimation = () => {
        // Массив котов для инициализации
        const cats = [
            { id: 'menu-character-animation', path: 'assets/character-animation.json', name: 'Кот 1 (idle)' },
            { id: 'menu-character-animation-2', path: 'assets/cat-uchi-real.json', name: 'Кот 2 (real)' },
            { id: 'menu-character-animation-3', path: 'assets/cat-home.json', name: 'Кот 3 (home)' }
        ];

        cats.forEach(cat => {
            const container = document.getElementById(cat.id);

            if (!container) {
                console.warn(`[LOTTIE] ⚠️ Контейнер ${cat.id} не найден`);
                return;
            }

            console.log(`[LOTTIE] ✅ Контейнер ${cat.id} найден`);

            if (typeof lottie === 'undefined') {
                console.error('[LOTTIE] ❌ Библиотека Lottie не загружена!');
                return;
            }

            console.log(`[LOTTIE] Загружаем ${cat.name} из ${cat.path}`);

            try {
                const catAnimation = lottie.loadAnimation({
                    container: container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: cat.path + '?v=' + Date.now()
                });

                catAnimation.addEventListener('DOMLoaded', () => {
                    console.log(`[LOTTIE] ✅✅✅ ${cat.name} ЗАГРУЖЕН И ОТОБРАЖАЕТСЯ!`);
                });

                catAnimation.addEventListener('data_ready', () => {
                    console.log(`[LOTTIE] ✅ Данные ${cat.name} готовы`);
                });

                catAnimation.addEventListener('data_failed', (error) => {
                    console.error(`[LOTTIE] ❌ Ошибка загрузки ${cat.name}:`, error);
                });

                catAnimation.addEventListener('error', (error) => {
                    console.error(`[LOTTIE] ❌ Общая ошибка ${cat.name}:`, error);
                });

                console.log(`[LOTTIE] Объект анимации ${cat.name} создан`);
            } catch (error) {
                console.error(`[LOTTIE] ❌ Исключение при создании ${cat.name}:`, error);
            }
        });
    };

    // Даём время на загрузку Lottie библиотеки
    setTimeout(initAnimation, 500);
});
