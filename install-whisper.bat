@echo off
echo ========================================
echo Установка Whisper для игры
echo ========================================
echo.

echo Проверка Python...
python --version
if errorlevel 1 (
    echo ОШИБКА: Python не установлен!
    echo Скачайте Python с https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo Установка зависимостей...
pip install openai-whisper flask flask-cors

echo.
echo ========================================
echo Установка завершена!
echo ========================================
echo.
echo Теперь запустите: start-whisper-server.bat
pause
