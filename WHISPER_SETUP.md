# Инструкция по интеграции Whisper API

## Вариант 1: Локальный Whisper сервер (Рекомендуется для РФ)

### Установка Whisper локально

1. Установите Python 3.8+
2. Установите Whisper:
```bash
pip install openai-whisper
```

3. Установите FFmpeg:
```bash
# Windows (через Chocolatey)
choco install ffmpeg

# Или скачайте с https://ffmpeg.org/download.html
```

### Запуск локального API сервера

Создайте файл `whisper_server.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os

app = Flask(__name__)
CORS(app)

# Загрузка модели (base - быстрая, medium - точнее)
model = whisper.load_model("base")

@app.route('/v1/audio/transcriptions', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Сохранить временный файл
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name
    
    try:
        # Распознать речь
        result = model.transcribe(tmp_path, language='ru')
        
        return jsonify({
            'text': result['text'],
            'language': result['language']
        })
    finally:
        # Удалить временный файл
        os.unlink(tmp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
```

Установите зависимости:
```bash
pip install flask flask-cors openai-whisper
```

Запустите сервер:
```bash
python whisper_server.py
```

### Обновление speech.js для локального Whisper

В файле `js/speech.js` замените метод `recognizeSpeech`:

```javascript
async recognizeSpeech(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        const response = await fetch('http://localhost:9000/v1/audio/transcriptions', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Ошибка API');
        }

        const result = await response.json();
        
        return {
            text: result.text,
            confidence: 0.9
        };
    } catch (error) {
        console.error('Ошибка распознавания:', error);
        throw error;
    }
}
```

## Вариант 2: OpenAI Whisper API (требует VPN в РФ)

Если у вас есть доступ к OpenAI API:

```javascript
async recognizeSpeech(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ru');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: formData
    });

    const result = await response.json();
    return {
        text: result.text,
        confidence: 0.9
    };
}
```

## Вариант 3: Web Speech API (встроенный в браузер)

Для быстрого прототипа можно использовать встроенный API браузера:

```javascript
class BrowserSpeechRecognizer {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.lang = 'ru-RU';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
    }

    async recognize() {
        return new Promise((resolve, reject) => {
            this.recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                resolve({ text, confidence });
            };

            this.recognition.onerror = (event) => {
                reject(event.error);
            };

            this.recognition.start();
        });
    }
}
```

## Тестирование

1. Откройте `index.html` в браузере
2. Разрешите доступ к микрофону
3. Выберите уровень и попробуйте записать фразу
4. Проверьте консоль браузера на наличие ошибок

## Рекомендации

- **Для разработки**: используйте локальный Whisper сервер (Вариант 1)
- **Для продакшена**: рассмотрите облачные решения или оптимизируйте локальный сервер
- **Для быстрого прототипа**: Web Speech API (Вариант 3)

## Производительность

- Модель `base`: быстрая, подходит для реального времени
- Модель `small`: баланс скорости и точности
- Модель `medium`: высокая точность, медленнее
- Модель `large`: максимальная точность, требует GPU
