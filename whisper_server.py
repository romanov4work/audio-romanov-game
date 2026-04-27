#!/usr/bin/env python3
"""
Локальный Whisper сервер для игры "Озвучиваем Мультики"
Запуск: python whisper_server.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Разрешить CORS для локальной разработки

# Загрузка модели Whisper
# Варианты: tiny, base, small, medium, large
# base - хороший баланс скорости и точности
logger.info("Загрузка модели Whisper...")
model = whisper.load_model("base")
logger.info("Модель загружена успешно!")

@app.route('/health', methods=['GET'])
def health():
    """Проверка здоровья сервера"""
    return jsonify({'status': 'ok', 'model': 'base'}), 200

@app.route('/v1/audio/transcriptions', methods=['POST'])
def transcribe():
    """Распознавание речи из аудио файла"""
    try:
        # Проверка наличия файла
        if 'file' not in request.files:
            logger.error("Файл не предоставлен")
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            logger.error("Пустое имя файла")
            return jsonify({'error': 'Empty filename'}), 400

        # Сохранить временный файл
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        logger.info(f"Обработка файла: {tmp_path}")

        try:
            # Распознать речь
            result = model.transcribe(
                tmp_path,
                language='ru',
                fp16=False  # Для CPU
            )

            logger.info(f"Распознано: {result['text']}")

            return jsonify({
                'text': result['text'],
                'language': result['language']
            }), 200

        finally:
            # Удалить временный файл
            try:
                os.unlink(tmp_path)
            except Exception as e:
                logger.warning(f"Не удалось удалить временный файл: {e}")

    except Exception as e:
        logger.error(f"Ошибка обработки: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def index():
    """Главная страница API"""
    return jsonify({
        'name': 'Whisper API для Озвучиваем Мультики',
        'version': '1.0',
        'endpoints': {
            'health': '/health',
            'transcribe': '/v1/audio/transcriptions'
        }
    }), 200

if __name__ == '__main__':
    logger.info("Запуск Whisper сервера на http://localhost:9000")
    logger.info("Для остановки нажмите Ctrl+C")
    app.run(host='0.0.0.0', port=9000, debug=False)
