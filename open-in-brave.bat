@echo off
REM Скрипт для открытия игры в Brave Browser

REM Попробовать найти Brave в стандартных местах
set BRAVE_PATH=""

if exist "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set BRAVE_PATH="C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
) else if exist "C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set BRAVE_PATH="C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
) else if exist "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set BRAVE_PATH="%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"
)

if %BRAVE_PATH%=="" (
    echo Brave Browser не найден!
    echo Открываю в браузере по умолчанию...
    start index.html
) else (
    echo Открываю в Brave Browser...
    %BRAVE_PATH% "%~dp0index.html"
)
