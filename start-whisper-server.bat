@echo off
echo ========================================
echo Запуск Whisper сервера
echo ========================================
echo.

echo Проверка установки Whisper...
python -c "import whisper" 2>nul
if errorlevel 1 (
    echo ОШИБКА: Whisper не установлен!
    echo Запустите: install-whisper.bat
    pause
    exit /b 1
)

echo Whisper найден!
echo Запуск сервера на http://localhost:9000
echo.
echo Для остановки нажмите Ctrl+C
echo ========================================
echo.

python whisper_server.py
