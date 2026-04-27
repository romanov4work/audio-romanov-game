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
        const container = document.getElementById('menu-character-animation');

        if (!container) {
            console.error('[LOTTIE] ❌ Контейнер #menu-character-animation не найден!');
            return;
        }

        console.log('[LOTTIE] ✅ Контейнер найден:', container);

        if (typeof lottie === 'undefined') {
            console.error('[LOTTIE] ❌ Библиотека Lottie не загружена!');
            return;
        }

        console.log('[LOTTIE] Загружаем анимацию из assets/character-animation.json');

        try {
            const catAnimation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'assets/character-animation.json?v=' + Date.now()
            });

            catAnimation.addEventListener('DOMLoaded', () => {
                console.log('[LOTTIE] ✅✅✅ КОТ ЗАГРУЖЕН И ОТОБРАЖАЕТСЯ!');
            });

            catAnimation.addEventListener('data_ready', () => {
                console.log('[LOTTIE] ✅ Данные анимации готовы');
            });

            catAnimation.addEventListener('data_failed', (error) => {
                console.error('[LOTTIE] ❌ Ошибка загрузки данных:', error);
            });

            catAnimation.addEventListener('error', (error) => {
                console.error('[LOTTIE] ❌ Общая ошибка:', error);
            });

            console.log('[LOTTIE] Объект анимации создан:', catAnimation);
        } catch (error) {
            console.error('[LOTTIE] ❌ Исключение при создании анимации:', error);
        }
    };

    // Даём время на загрузку Lottie библиотеки
    setTimeout(initAnimation, 500);
});
