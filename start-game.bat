@echo off
echo ========================================
echo Запуск игры "Озвучиваем Мультики"
echo ========================================
echo.

REM Проверить, запущен ли Whisper сервер
curl -s http://localhost:9000/health >nul 2>&1
if errorlevel 1 (
    echo [!] Whisper сервер не запущен
    echo [i] Игра будет использовать Web Speech API
    echo.
    echo Для лучшего качества распознавания:
    echo 1. Откройте новое окно командной строки
    echo 2. Запустите: start-whisper-server.bat
    echo.
) else (
    echo [OK] Whisper сервер работает!
    echo [OK] Игра будет использовать Whisper для распознавания речи
    echo.
)

timeout /t 3 >nul

REM Запустить веб-сервер
echo Запуск веб-сервера на http://localhost:8000
echo.
start "" python -m http.server 8000

REM Подождать запуска сервера
timeout /t 2 >nul

REM Открыть в Brave Browser
set BRAVE_PATH=""

if exist "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set BRAVE_PATH="C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
) else if exist "C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set BRAVE_PATH="C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
) else if exist "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set BRAVE_PATH="%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"
)

if %BRAVE_PATH%=="" (
    echo Открываю в браузере по умолчанию...
    start http://localhost:8000
) else (
    echo Открываю в Brave Browser...
    %BRAVE_PATH% http://localhost:8000
)

echo.
echo ========================================
echo Игра запущена!
echo ========================================
echo.
echo Для остановки закройте это окно
pause
