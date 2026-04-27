// Простая тестовая инициализация Lottie для отладки
console.log('[TEST] Проверка Lottie');

window.addEventListener('DOMContentLoaded', () => {
    console.log('[TEST] DOM загружен');

    setTimeout(() => {
        const container = document.getElementById('menu-character-animation');
        console.log('[TEST] Контейнер:', container);

        if (typeof lottie !== 'undefined') {
            console.log('[TEST] Lottie доступен');

            // Простая тестовая анимация
            const anim = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: {
                    "v": "5.7.4",
                    "fr": 30,
                    "ip": 0,
                    "op": 60,
                    "w": 280,
                    "h": 180,
                    "nm": "Simple Test",
                    "ddd": 0,
                    "assets": [],
                    "layers": [
                        {
                            "ddd": 0,
                            "ind": 1,
                            "ty": 4,
                            "nm": "Circle",
                            "sr": 1,
                            "ks": {
                                "o": { "a": 0, "k": 100 },
                                "r": { "a": 0, "k": 0 },
                                "p": { "a": 0, "k": [140, 90, 0] },
                                "a": { "a": 0, "k": [0, 0, 0] },
                                "s": {
                                    "a": 1,
                                    "k": [
                                        { "t": 0, "s": [100, 100, 100] },
                                        { "t": 30, "s": [120, 120, 100] },
                                        { "t": 60, "s": [100, 100, 100] }
                                    ]
                                }
                            },
                            "ao": 0,
                            "shapes": [
                                {
                                    "ty": "gr",
                                    "it": [
                                        {
                                            "ty": "el",
                                            "p": { "a": 0, "k": [0, 0] },
                                            "s": { "a": 0, "k": [100, 100] }
                                        },
                                        {
                                            "ty": "fl",
                                            "c": { "a": 0, "k": [0.42, 0.36, 0.74, 1] },
                                            "o": { "a": 0, "k": 100 }
                                        }
                                    ]
                                }
                            ],
                            "ip": 0,
                            "op": 60,
                            "st": 0,
                            "bm": 0
                        }
                    ]
                }
            });

            console.log('[TEST] Анимация создана:', anim);
        } else {
            console.error('[TEST] Lottie не загружен!');
        }
    }, 3000);
});
