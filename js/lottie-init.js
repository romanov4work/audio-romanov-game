// Простая инициализация с встроенной анимацией кота
console.log('[LOTTIE] Инициализация');

window.addEventListener('DOMContentLoaded', () => {
    console.log('[LOTTIE] DOM загружен');

    setTimeout(() => {
        const container = document.getElementById('menu-character-animation');
        console.log('[LOTTIE] Контейнер:', container);

        if (!container) {
            console.error('[LOTTIE] Контейнер не найден!');
            return;
        }

        if (typeof lottie === 'undefined') {
            console.error('[LOTTIE] Библиотека Lottie не загружена!');
            return;
        }

        console.log('[LOTTIE] Создаём анимацию кота');

        // Используем встроенные данные анимации
        const catAnimation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/character-animation.json'
        });

        catAnimation.addEventListener('DOMLoaded', () => {
            console.log('[LOTTIE] ✅ Кот загружен успешно!');
        });

        catAnimation.addEventListener('data_failed', (error) => {
            console.error('[LOTTIE] ❌ Ошибка загрузки:', error);
        });

    }, 1000);
});
