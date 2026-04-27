// Система таймера речи с детекцией активного произношения

class SpeechTimer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isSpeaking = false;
        this.speechStartTime = 0;
        this.totalSpeechTime = 0;
        this.silenceThreshold = 30; // Порог тишины (0-255)
        this.minSpeechDuration = 200; // Минимальная длительность речи в мс
        this.silenceTimeout = null;
        this.isMonitoring = false;
    }

    // Инициализация анализатора звука
    async init(stream) {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            source.connect(this.analyser);

            return true;
        } catch (error) {
            console.error('[SpeechTimer] Ошибка инициализации:', error);
            return false;
        }
    }

    // Начать мониторинг речи
    startMonitoring() {
        this.isMonitoring = true;
        this.isSpeaking = false;
        this.totalSpeechTime = 0;
        this.speechStartTime = 0;
        this.monitor();
    }

    // Остановить мониторинг
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
        }

        // Если говорил в момент остановки, добавить последний сегмент
        if (this.isSpeaking && this.speechStartTime > 0) {
            this.totalSpeechTime += Date.now() - this.speechStartTime;
        }

        return this.totalSpeechTime / 1000; // Вернуть в секундах
    }

    // Мониторинг уровня звука
    monitor() {
        if (!this.isMonitoring || !this.analyser) return;

        this.analyser.getByteTimeDomainData(this.dataArray);

        // Вычислить средний уровень звука
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            const value = Math.abs(this.dataArray[i] - 128);
            sum += value;
        }
        const average = sum / this.dataArray.length;

        // Проверить, говорит ли пользователь
        const isSpeakingNow = average > this.silenceThreshold;

        if (isSpeakingNow && !this.isSpeaking) {
            // Начало речи
            this.isSpeaking = true;
            this.speechStartTime = Date.now();
            console.log('[SpeechTimer] Начало речи');
        } else if (!isSpeakingNow && this.isSpeaking) {
            // Возможное окончание речи (ждём подтверждения тишины)
            if (!this.silenceTimeout) {
                this.silenceTimeout = setTimeout(() => {
                    if (this.isSpeaking) {
                        // Окончание речи подтверждено
                        const duration = Date.now() - this.speechStartTime;
                        if (duration >= this.minSpeechDuration) {
                            this.totalSpeechTime += duration;
                            console.log('[SpeechTimer] Окончание речи, длительность:', duration, 'мс');
                        }
                        this.isSpeaking = false;
                        this.speechStartTime = 0;
                    }
                    this.silenceTimeout = null;
                }, 300); // 300мс тишины для подтверждения
            }
        } else if (isSpeakingNow && this.isSpeaking) {
            // Продолжение речи - сбросить таймер тишины
            if (this.silenceTimeout) {
                clearTimeout(this.silenceTimeout);
                this.silenceTimeout = null;
            }
        }

        // Продолжить мониторинг
        requestAnimationFrame(() => this.monitor());
    }

    // Получить текущее время речи
    getCurrentSpeechTime() {
        let current = this.totalSpeechTime;
        if (this.isSpeaking && this.speechStartTime > 0) {
            current += Date.now() - this.speechStartTime;
        }
        return current / 1000; // В секундах
    }

    // Очистка ресурсов
    cleanup() {
        this.stopMonitoring();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}
