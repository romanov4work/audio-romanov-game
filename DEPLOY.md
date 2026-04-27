# Деплой инструкция

## Локальный запуск

### Вариант 1: Прямое открытие файла
```bash
# Windows
start index.html

# Mac/Linux
open index.html
```

### Вариант 2: Локальный сервер (рекомендуется)
```bash
# Python 3
python -m http.server 8000

# Node.js (если установлен)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Затем откройте http://localhost:8000 в браузере.

## Настройка Whisper API

### Быстрый старт (без Whisper)
Игра работает из коробки с Web Speech API (встроенный в Chrome/Edge).

### Для продакшена (с Whisper)

1. Установите Python и зависимости:
```bash
pip install openai-whisper flask flask-cors
```

2. Создайте файл `whisper_server.py` (см. WHISPER_SETUP.md)

3. Запустите сервер:
```bash
python whisper_server.py
```

4. Игра автоматически подключится к локальному Whisper

## Деплой на хостинг

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

В настройках репозитория включите GitHub Pages (Settings → Pages → Source: main branch).

### Netlify
1. Перетащите папку проекта на https://app.netlify.com/drop
2. Готово! Получите ссылку на игру

### Vercel
```bash
npm i -g vercel
vercel
```

## Требования к браузеру

- Chrome 80+ (рекомендуется)
- Firefox 75+
- Edge 80+
- Safari 14+ (ограниченная поддержка Web Speech API)

## Проверка перед деплоем

- [ ] Игра открывается и загружается
- [ ] Микрофон запрашивает разрешение
- [ ] Можно выбрать уровень
- [ ] Запись голоса работает
- [ ] Результаты отображаются
- [ ] Звуки воспроизводятся
- [ ] Адаптивная вёрстка на мобильных

## Оптимизация

### Минификация (опционально)
```bash
# Установить uglify-js
npm install -g uglify-js

# Минифицировать JS
uglifyjs js/*.js -o js/bundle.min.js -c -m

# Обновить index.html для использования bundle.min.js
```

### Сжатие изображений
Если добавите изображения, используйте:
- TinyPNG для PNG
- ImageOptim для общего сжатия
- WebP формат для современных браузеров

## Мониторинг

Добавьте Google Analytics или Яндекс.Метрику в `<head>`:
```html
<!-- Яндекс.Метрика -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
   ym(XXXXXX, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
</script>
```

## Troubleshooting

### Микрофон не работает
- Проверьте HTTPS (требуется для Web Speech API)
- Разрешите доступ к микрофону в браузере
- Проверьте настройки приватности ОС

### Whisper не подключается
- Убедитесь, что сервер запущен на порту 9000
- Проверьте CORS настройки
- Игра автоматически переключится на Web Speech API

### Звуки не воспроизводятся
- Проверьте, что звук не отключён в настройках игры
- Некоторые браузеры блокируют автовоспроизведение
- Требуется взаимодействие пользователя перед первым звуком
