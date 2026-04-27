// Интеграция с локальным Whisper сервером

class WhisperClient {
    constructor(apiUrl = 'http://localhost:9000/v1/audio/transcriptions') {
        this.apiUrl = apiUrl;
        this.isAvailable = false;
        this.checkAvailability();
    }

    async checkAvailability() {
        try {
            const response = await fetch(this.apiUrl.replace('/v1/audio/transcriptions', '/health'), {
                method: 'GET',
                signal: AbortSignal.timeout(2000)
            });
            this.isAvailable = response.ok;
        } catch (e) {
            this.isAvailable = false;
        }
        return this.isAvailable;
    }

    async transcribe(audioBlob) {
        if (!this.isAvailable) {
            throw new Error('Whisper сервер недоступен');
        }

        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            return {
                text: result.text,
                language: result.language || 'ru',
                confidence: 0.9
            };
        } catch (error) {
            console.error('Ошибка Whisper API:', error);
            throw error;
        }
    }
}

// Fallback на Web Speech API
class WebSpeechClient {
    constructor() {
        this.recognition = null;
        this.isAvailable = this.checkAvailability();
    }

    checkAvailability() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    async transcribe() {
        if (!this.isAvailable) {
            throw new Error('Web Speech API недоступен');
        }

        return new Promise((resolve, reject) => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'ru-RU';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.recognition.onresult = (event) => {
                const result = event.results[0][0];
                resolve({
                    text: result.transcript,
                    confidence: result.confidence
                });
            };

            this.recognition.onerror = (event) => {
                reject(new Error(event.error));
            };

            this.recognition.start();
        });
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

// Экспорт
window.WhisperClient = WhisperClient;
window.WebSpeechClient = WebSpeechClient;
