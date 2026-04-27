// Система прогресса и разблокировки

class ProgressSystem {
    constructor() {
        this.storage = new StorageManager();
        this.progress = this.load();
    }

    load() {
        return this.storage.load('progress', {
            playerLevel: 1,
            totalXP: 0,
            unlockedModules: ['demo-mode'], // Демо всегда открыт
            moduleProgress: {
                'combined-tongue-twisters': { unlocked: true, stars: 0, bestAccuracy: 0, completed: false },
                'combined-voicing': { unlocked: false, stars: 0, bestAccuracy: 0, completed: false },
                'speed-reading': { unlocked: false, stars: 0, bestAccuracy: 0, completed: false },
                'sound-improvement': { unlocked: false, stars: 0, bestAccuracy: 0, completed: false }
            }
        });
    }

    save() {
        this.storage.save('progress', this.progress);
    }

    // Получить уровень игрока
    getPlayerLevel() {
        return this.progress.playerLevel;
    }

    // Получить XP
    getTotalXP() {
        return this.progress.totalXP;
    }

    // XP для следующего уровня
    getXPForNextLevel() {
        return this.progress.playerLevel * 100;
    }

    // Прогресс до следующего уровня (0-1)
    getLevelProgress() {
        const currentLevelXP = (this.progress.playerLevel - 1) * 100;
        const nextLevelXP = this.progress.playerLevel * 100;
        const xpInCurrentLevel = this.progress.totalXP - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;
        return Math.min(xpInCurrentLevel / xpNeeded, 1);
    }

    // Добавить XP
    addXP(amount) {
        this.progress.totalXP += amount;

        // Проверить повышение уровня
        const leveledUp = this.checkLevelUp();

        this.save();
        return leveledUp;
    }

    // Проверить повышение уровня
    checkLevelUp() {
        const xpNeeded = this.getXPForNextLevel();
        if (this.progress.totalXP >= xpNeeded) {
            this.progress.playerLevel++;
            this.unlockNextModule();
            return true;
        }
        return false;
    }

    // Разблокировать следующий модуль
    unlockNextModule() {
        const modules = [
            'combined-tongue-twisters',
            'combined-voicing',
            'speed-reading',
            'sound-improvement'
        ];

        for (const moduleId of modules) {
            if (!this.progress.moduleProgress[moduleId].unlocked) {
                this.progress.moduleProgress[moduleId].unlocked = true;
                this.progress.unlockedModules.push(moduleId);
                return moduleId;
            }
        }
        return null;
    }

    // Проверить, разблокирован ли модуль
    isModuleUnlocked(moduleId) {
        if (moduleId === 'demo-mode') return true;
        return this.progress.moduleProgress[moduleId]?.unlocked || false;
    }

    // Обновить прогресс модуля
    updateModuleProgress(moduleId, stars, accuracy) {
        if (!this.progress.moduleProgress[moduleId]) return;

        const module = this.progress.moduleProgress[moduleId];
        module.stars = Math.max(module.stars, stars);
        module.bestAccuracy = Math.max(module.bestAccuracy, accuracy);

        // Считать завершённым если получено хотя бы 50% звёзд
        const maxStars = this.getModuleMaxStars(moduleId);
        if (stars >= maxStars * 0.5) {
            module.completed = true;
        }

        this.save();
    }

    // Получить максимум звёзд для модуля
    getModuleMaxStars(moduleId) {
        const level = getLevelById(moduleId);
        return level ? level.tasks.length * 3 : 0;
    }

    // Получить прогресс модуля
    getModuleProgress(moduleId) {
        return this.progress.moduleProgress[moduleId] || null;
    }

    // Получить все разблокированные модули
    getUnlockedModules() {
        return this.progress.unlockedModules;
    }

    // Получить процент общего прогресса
    getTotalProgress() {
        const modules = Object.values(this.progress.moduleProgress);
        const completed = modules.filter(m => m.completed).length;
        return Math.round((completed / modules.length) * 100);
    }

    // Сбросить прогресс
    reset() {
        this.progress = {
            playerLevel: 1,
            totalXP: 0,
            unlockedModules: ['demo-mode'],
            moduleProgress: {
                'combined-tongue-twisters': { unlocked: true, stars: 0, bestAccuracy: 0, completed: false },
                'combined-voicing': { unlocked: false, stars: 0, bestAccuracy: 0, completed: false },
                'speed-reading': { unlocked: false, stars: 0, bestAccuracy: 0, completed: false },
                'sound-improvement': { unlocked: false, stars: 0, bestAccuracy: 0, completed: false }
            }
        };
        this.save();
    }

    // Рассчитать XP за игру
    calculateXP(stars, accuracy, tasksCompleted) {
        let xp = 0;

        // Базовый XP за звёзды
        xp += stars * 10;

        // Бонус за точность
        if (accuracy >= 95) xp += 20;
        else if (accuracy >= 85) xp += 10;
        else if (accuracy >= 75) xp += 5;

        // Бонус за завершённые задания
        xp += tasksCompleted * 5;

        return xp;
    }
}

// Система наград
class RewardSystem {
    constructor() {
        this.rewards = {
            levelUp: {
                title: 'Новый уровень!',
                description: 'Ты повысил свой уровень!',
                icon: '🎉'
            },
            moduleUnlocked: {
                title: 'Новый модуль открыт!',
                description: 'Теперь доступен новый модуль!',
                icon: '🔓'
            },
            moduleCompleted: {
                title: 'Модуль пройден!',
                description: 'Ты завершил модуль!',
                icon: '✅'
            },
            perfectScore: {
                title: 'Идеальный результат!',
                description: 'Все задания на 3 звезды!',
                icon: '⭐'
            }
        };
    }

    show(rewardType, extraData = {}) {
        const reward = this.rewards[rewardType];
        if (!reward) return;

        const modal = this.createRewardModal(reward, extraData);
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.classList.add('active');
        }, 100);

        setTimeout(() => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }, 3000);
    }

    createRewardModal(reward, extraData) {
        const modal = document.createElement('div');
        modal.className = 'reward-modal';

        let description = reward.description;
        if (extraData.level) {
            description = `Теперь ты ${extraData.level} уровня!`;
        }
        if (extraData.moduleName) {
            description = `Открыт модуль: ${extraData.moduleName}`;
        }

        modal.innerHTML = `
            <div class="reward-content">
                <div class="reward-icon">${reward.icon}</div>
                <div class="reward-title">${reward.title}</div>
                <div class="reward-description">${description}</div>
            </div>
        `;

        return modal;
    }
}
