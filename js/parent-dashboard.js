// Родительская статистика

class ParentDashboard {
    constructor() {
        this.storage = new StorageManager();
        this.playerStats = new PlayerStats();
        this.progressSystem = new ProgressSystem();
    }

    // Получить полную статистику
    getFullStats() {
        const stats = this.playerStats.getStats();
        const progress = this.progressSystem.progress;

        return {
            // Общая информация
            playerLevel: progress.playerLevel,
            totalXP: progress.totalXP,
            totalGames: stats.totalGames,
            totalStars: stats.totalStars,

            // Прогресс по модулям
            modules: this.getModulesStats(),

            // Временная статистика
            timeStats: this.getTimeStats(),

            // Сильные и слабые стороны
            strengths: this.getStrengths(),
            weaknesses: this.getWeaknesses(),

            // Рекомендации
            recommendations: this.getRecommendations(),

            // История занятий
            history: this.getHistory()
        };
    }

    // Статистика по модулям
    getModulesStats() {
        const modules = [
            { id: 'combined-tongue-twisters', name: 'Скороговорки и слова', icon: '👅' },
            { id: 'combined-voicing', name: 'Озвучка и дыхание', icon: '🎭' },
            { id: 'speed-reading', name: 'Скорочтение', icon: '⚡' },
            { id: 'sound-improvement', name: 'Как улучшить звуки', icon: '🗣️' }
        ];

        return modules.map(module => {
            const progress = this.progressSystem.getModuleProgress(module.id);
            const levelStats = this.playerStats.stats.levelStats[module.id] || {};

            return {
                id: module.id,
                name: module.name,
                icon: module.icon,
                unlocked: progress?.unlocked || false,
                completed: progress?.completed || false,
                stars: progress?.stars || 0,
                bestAccuracy: progress?.bestAccuracy || 0,
                plays: levelStats.plays || 0
            };
        });
    }

    // Временная статистика
    getTimeStats() {
        const sessions = this.storage.load('sessions', []);

        const today = new Date().toDateString();
        const thisWeek = this.getWeekStart();

        const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
        const weekSessions = sessions.filter(s => new Date(s.date) >= thisWeek);

        return {
            totalSessions: sessions.length,
            todaySessions: todaySessions.length,
            weekSessions: weekSessions.length,
            averageSessionTime: this.calculateAverageTime(sessions),
            totalTime: this.calculateTotalTime(sessions),
            lastSession: sessions.length > 0 ? sessions[sessions.length - 1].date : null,
            streak: this.calculateStreak(sessions)
        };
    }

    // Сильные стороны
    getStrengths() {
        const stats = this.playerStats.stats;
        const strengths = [];

        if (stats.bestAccuracy >= 90) {
            strengths.push({
                title: 'Отличное произношение',
                description: `Точность ${stats.bestAccuracy}%`,
                icon: '🎯'
            });
        }

        if (stats.maxCombo >= 5) {
            strengths.push({
                title: 'Стабильность',
                description: `Комбо до ${stats.maxCombo}`,
                icon: '🔥'
            });
        }

        if (stats.totalGames >= 10) {
            strengths.push({
                title: 'Упорство',
                description: `${stats.totalGames} игр сыграно`,
                icon: '💪'
            });
        }

        return strengths;
    }

    // Слабые стороны
    getWeaknesses() {
        const modules = this.getModulesStats();
        const weaknesses = [];

        modules.forEach(module => {
            if (module.unlocked && module.bestAccuracy < 70 && module.plays > 0) {
                weaknesses.push({
                    title: module.name,
                    description: `Точность ${module.bestAccuracy}%`,
                    icon: module.icon,
                    recommendation: 'Нужно больше практики'
                });
            }
        });

        return weaknesses;
    }

    // Рекомендации
    getRecommendations() {
        const recommendations = [];
        const stats = this.playerStats.stats;
        const timeStats = this.getTimeStats();

        // Рекомендация по регулярности
        if (timeStats.streak < 3) {
            recommendations.push({
                title: 'Занимайтесь регулярно',
                description: 'Рекомендуем заниматься каждый день по 10-15 минут',
                priority: 'high',
                icon: '📅'
            });
        }

        // Рекомендация по точности
        if (stats.bestAccuracy < 80) {
            recommendations.push({
                title: 'Работайте над произношением',
                description: 'Говорите медленнее и чётче',
                priority: 'medium',
                icon: '🎤'
            });
        }

        // Рекомендация по разнообразию
        const modules = this.getModulesStats();
        const playedModules = modules.filter(m => m.plays > 0).length;
        if (playedModules < 2) {
            recommendations.push({
                title: 'Попробуйте разные модули',
                description: 'Разнообразие помогает развивать разные навыки',
                priority: 'low',
                icon: '🎯'
            });
        }

        return recommendations;
    }

    // История занятий
    getHistory() {
        const sessions = this.storage.load('sessions', []);
        return sessions.slice(-10).reverse(); // Последние 10 сессий
    }

    // Сохранить сессию
    saveSession(moduleId, duration, stars, accuracy) {
        const sessions = this.storage.load('sessions', []);
        sessions.push({
            date: new Date().toISOString(),
            moduleId,
            duration,
            stars,
            accuracy
        });
        this.storage.save('sessions', sessions);
    }

    // Вспомогательные функции
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
    }

    calculateAverageTime(sessions) {
        if (sessions.length === 0) return 0;
        const total = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        return Math.round(total / sessions.length);
    }

    calculateTotalTime(sessions) {
        return sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    }

    calculateStreak(sessions) {
        if (sessions.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toDateString();

            const hasSession = sessions.some(s =>
                new Date(s.date).toDateString() === dateStr
            );

            if (hasSession) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return streak;
    }

    // Экспорт статистики в PDF/CSV
    exportStats(format = 'pdf') {
        const stats = this.getFullStats();

        if (format === 'csv') {
            return this.exportToCSV(stats);
        } else {
            return this.exportToPDF(stats);
        }
    }

    exportToCSV(stats) {
        let csv = 'Модуль,Игр сыграно,Звёзды,Точность\n';

        stats.modules.forEach(module => {
            csv += `${module.name},${module.plays},${module.stars},${module.bestAccuracy}%\n`;
        });

        return csv;
    }

    exportToPDF(stats) {
        // Для PDF нужна библиотека, пока возвращаем HTML для печати
        return this.generatePrintableHTML(stats);
    }

    generatePrintableHTML(stats) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Статистика - Озвучиваем Мультики</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #FF8B3D; }
        .stat { margin: 20px 0; }
        .module { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
        @media print { button { display: none; } }
    </style>
</head>
<body>
    <h1>📊 Статистика ребёнка</h1>
    <div class="stat"><strong>Уровень:</strong> ${stats.playerLevel}</div>
    <div class="stat"><strong>Всего игр:</strong> ${stats.totalGames}</div>
    <div class="stat"><strong>Всего звёзд:</strong> ${stats.totalStars}</div>
    <div class="stat"><strong>Лучшая точность:</strong> ${stats.modules.reduce((max, m) => Math.max(max, m.bestAccuracy), 0)}%</div>

    <h2>Модули</h2>
    ${stats.modules.map(m => `
        <div class="module">
            <strong>${m.icon} ${m.name}</strong><br>
            Игр: ${m.plays} | Звёзды: ${m.stars} | Точность: ${m.bestAccuracy}%
        </div>
    `).join('')}

    <button onclick="window.print()">Печать</button>
</body>
</html>
        `;
    }
}
