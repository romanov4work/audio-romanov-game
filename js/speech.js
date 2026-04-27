// Модуль работы с речью (Whisper API)

class SpeechRecognizer {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;

        // Инициализация клиентов распознавания
        this.whisperClient = new WhisperClient();
        this.useWebSpeech = false; // ВСЕГДА используем только Whisper
    }

    // Проверка поддержки браузером
    isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    // Запросить доступ к микрофону
    async requestMicrophoneAccess() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (error) {
            console.error('Ошибка доступа к микрофону:', error);
            return false;
        }
    }

    // Начать запись
    async startRecording() {
        if (!this.stream) {
            const hasAccess = await this.requestMicrophoneAccess();
            if (!hasAccess) {
                throw new Error('Нет доступа к микрофону');
            }
        }

        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream);

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
            }
        };

        this.mediaRecorder.start();
        this.isRecording = true;
    }

    // Остановить запись
    async stopRecording() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder || !this.isRecording) {
                reject(new Error('Запись не начата'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.isRecording = false;
                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }

    // Распознать речь через Whisper API
    async recognizeSpeech(audioBlob) {
        console.log('[SpeechRecognizer.recognizeSpeech] Начало, размер blob:', audioBlob.size);
        try {
            // Используем только Whisper
            if (this.whisperClient.isAvailable) {
                console.log('[SpeechRecognizer.recognizeSpeech] Используем Whisper');
                const result = await this.whisperClient.transcribe(audioBlob);
                console.log('[SpeechRecognizer.recognizeSpeech] Whisper результат:', result);
                return result;
            }

            // Если Whisper недоступен, используем mock
            console.warn('[SpeechRecognizer.recognizeSpeech] Whisper недоступен, используется mock');
            return await this.mockRecognition(audioBlob);
        } catch (error) {
            console.error('[SpeechRecognizer.recognizeSpeech] Ошибка:', error);
            throw error;
        }
    }

    // Заглушка для тестирования (удалить после интеграции Whisper)
    async mockRecognition(audioBlob) {
        // Симуляция задержки API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Возвращаем случайный результат для тестирования
        const mockTexts = [
            'Шла Саша по шоссе и сосала сушку',
            'Карл у Клары украл кораллы',
            'На дворе трава на траве дрова'
        ];

        return {
            text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
            confidence: 0.7 + Math.random() * 0.3
        };
    }

    // Сравнить распознанный текст с ожидаемым
    compareTexts(recognized, expected) {
        // Нормализация текста
        const normalize = (text) => {
            return text
                .toLowerCase()
                .replace(/[.,!?;:]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        const recognizedNorm = normalize(recognized);
        const expectedNorm = normalize(expected);

        // Вычисление схожести (простой алгоритм)
        const similarity = this.calculateSimilarity(recognizedNorm, expectedNorm);

        return {
            similarity,
            isMatch: similarity >= 0.7,
            recognized: recognizedNorm,
            expected: expectedNorm
        };
    }

    // Вычисление схожести строк (алгоритм Левенштейна упрощённый)
    calculateSimilarity(str1, str2) {
        // Если распознанный текст пустой - 0% схожести
        if (!str1 || str1.length === 0) {
            return 0.0;
        }

        // Если ожидаемый текст пустой - 0% схожести
        if (!str2 || str2.length === 0) {
            return 0.0;
        }

        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) {
            return 1.0;
        }

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    // Расстояние Левенштейна
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    // Освободить ресурсы
    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
    }
}

// Экспорт для использования в других модулях
window.SpeechRecognizer = SpeechRecognizer;
