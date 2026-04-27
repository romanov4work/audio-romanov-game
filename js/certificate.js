// Система сертификатов

class CertificateSystem {
    constructor() {
        this.storage = new StorageManager();
        this.playerStats = new PlayerStats();
        this.progressSystem = new ProgressSystem();
    }

    // Проверить, заслужил ли игрок сертификат
    checkCertificateEligibility() {
        const stats = this.playerStats.getStats();
        const progress = this.progressSystem.progress;

        const certificates = [];

        // Сертификат "Начинающий диктор"
        if (stats.totalGames >= 5 && !this.hasCertificate('beginner')) {
            certificates.push({
                id: 'beginner',
                title: 'Начинающий диктор',
                description: 'Сыграл 5 игр',
                icon: '🎤',
                level: 'bronze'
            });
        }

        // Сертификат "Мастер скороговорок"
        if (this.getModuleAccuracy('combined-tongue-twisters') >= 80 && !this.hasCertificate('tongue-master')) {
            certificates.push({
                id: 'tongue-master',
                title: 'Мастер скороговорок',
                description: 'Точность 80%+ в скороговорках',
                icon: '👅',
                level: 'silver'
            });
        }

        // Сертификат "Актёр озвучки"
        if (this.getModuleAccuracy('combined-voicing') >= 80 && !this.hasCertificate('voice-actor')) {
            certificates.push({
                id: 'voice-actor',
                title: 'Актёр озвучки',
                description: 'Точность 80%+ в озвучке',
                icon: '🎭',
                level: 'silver'
            });
        }

        // Сертификат "Скорочитатель"
        if (this.getModuleAccuracy('speed-reading') >= 80 && !this.hasCertificate('speed-reader')) {
            certificates.push({
                id: 'speed-reader',
                title: 'Скорочитатель',
                description: 'Точность 80%+ в скорочтении',
                icon: '⚡',
                level: 'silver'
            });
        }

        // Сертификат "Мастер дикции"
        if (stats.bestAccuracy >= 90 && stats.totalGames >= 20 && !this.hasCertificate('diction-master')) {
            certificates.push({
                id: 'diction-master',
                title: 'Мастер дикции',
                description: 'Точность 90%+ и 20 игр',
                icon: '🏆',
                level: 'gold'
            });
        }

        // Сертификат "Упорный ученик"
        if (stats.totalGames >= 50 && !this.hasCertificate('persistent')) {
            certificates.push({
                id: 'persistent',
                title: 'Упорный ученик',
                description: 'Сыграл 50 игр',
                icon: '💪',
                level: 'gold'
            });
        }

        // Сертификат "Идеальное произношение"
        if (stats.bestAccuracy === 100 && !this.hasCertificate('perfect')) {
            certificates.push({
                id: 'perfect',
                title: 'Идеальное произношение',
                description: 'Достигнута точность 100%',
                icon: '⭐',
                level: 'platinum'
            });
        }

        return certificates;
    }

    // Проверить, есть ли уже сертификат
    hasCertificate(id) {
        const earned = this.storage.load('certificates', []);
        return earned.some(cert => cert.id === id);
    }

    // Получить точность модуля
    getModuleAccuracy(moduleId) {
        const progress = this.progressSystem.getModuleProgress(moduleId);
        return progress?.bestAccuracy || 0;
    }

    // Выдать сертификат
    awardCertificate(certificate) {
        const earned = this.storage.load('certificates', []);
        earned.push({
            ...certificate,
            earnedDate: new Date().toISOString()
        });
        this.storage.save('certificates', earned);
    }

    // Получить все заработанные сертификаты
    getEarnedCertificates() {
        return this.storage.load('certificates', []);
    }

    // Сгенерировать HTML сертификата для печати
    generateCertificateHTML(certificate, playerName = 'Юный диктор') {
        const date = new Date(certificate.earnedDate);
        const dateStr = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const levelColors = {
            bronze: '#CD7F32',
            silver: '#C0C0C0',
            gold: '#FFD700',
            platinum: '#E5E4E2'
        };

        const levelNames = {
            bronze: 'Бронзовый',
            silver: 'Серебряный',
            gold: 'Золотой',
            platinum: 'Платиновый'
        };

        return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Сертификат - ${certificate.title}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
            background: white;
        }

        .certificate {
            width: 297mm;
            height: 210mm;
            padding: 40mm;
            box-sizing: border-box;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border: 20px solid ${levelColors[certificate.level]};
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .certificate::before {
            content: '';
            position: absolute;
            top: 30px;
            left: 30px;
            right: 30px;
            bottom: 30px;
            border: 3px solid ${levelColors[certificate.level]};
            opacity: 0.3;
        }

        .certificate-header {
            font-size: 24px;
            color: #666;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

        .certificate-title {
            font-size: 72px;
            color: ${levelColors[certificate.level]};
            margin: 20px 0;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .certificate-icon {
            font-size: 120px;
            margin: 30px 0;
        }

        .certificate-awarded {
            font-size: 28px;
            color: #333;
            margin: 20px 0;
        }

        .certificate-name {
            font-size: 48px;
            color: #FF8B3D;
            font-weight: bold;
            margin: 20px 0;
            padding: 10px 40px;
            border-bottom: 3px solid ${levelColors[certificate.level]};
        }

        .certificate-description {
            font-size: 24px;
            color: #666;
            margin: 30px 0;
            font-style: italic;
        }

        .certificate-level {
            font-size: 20px;
            color: ${levelColors[certificate.level]};
            font-weight: bold;
            margin: 20px 0;
            text-transform: uppercase;
        }

        .certificate-footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 600px;
        }

        .certificate-date,
        .certificate-signature {
            font-size: 18px;
            color: #666;
        }

        .certificate-signature {
            border-top: 2px solid #333;
            padding-top: 10px;
        }

        .certificate-logo {
            position: absolute;
            top: 40px;
            right: 40px;
            font-size: 48px;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="certificate-logo">🎬</div>

        <div class="certificate-header">Учи.ру представляет</div>

        <div class="certificate-title">Сертификат</div>

        <div class="certificate-level">${levelNames[certificate.level]} уровень</div>

        <div class="certificate-icon">${certificate.icon}</div>

        <div class="certificate-awarded">Награждается</div>

        <div class="certificate-name">${playerName}</div>

        <div class="certificate-description">
            За достижение "${certificate.title}"<br>
            ${certificate.description}
        </div>

        <div class="certificate-footer">
            <div class="certificate-date">
                Дата: ${dateStr}
            </div>
            <div class="certificate-signature">
                Озвучиваем Мультики
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    // Показать модальное окно с сертификатом
    showCertificateModal(certificate) {
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="certificate-modal-content">
                <button class="certificate-modal-close">×</button>
                <div class="certificate-preview">
                    <div class="certificate-icon-large">${certificate.icon}</div>
                    <h2 class="certificate-modal-title">${certificate.title}</h2>
                    <p class="certificate-modal-description">${certificate.description}</p>
                    <div class="certificate-level-badge ${certificate.level}">
                        ${this.getLevelName(certificate.level)}
                    </div>
                </div>
                <div class="certificate-actions">
                    <button class="btn btn-primary" id="print-certificate">
                        🖨️ Распечатать сертификат
                    </button>
                    <button class="btn btn-secondary" id="view-all-certificates">
                        📜 Все сертификаты
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('active'), 100);

        modal.querySelector('.certificate-modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        modal.querySelector('#print-certificate').addEventListener('click', () => {
            this.printCertificate(certificate);
        });

        modal.querySelector('#view-all-certificates').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
            this.showAllCertificates();
        });
    }

    // Получить название уровня
    getLevelName(level) {
        const names = {
            bronze: 'Бронзовый',
            silver: 'Серебряный',
            gold: 'Золотой',
            platinum: 'Платиновый'
        };
        return names[level] || level;
    }

    // Распечатать сертификат
    printCertificate(certificate) {
        const playerName = this.storage.load('playerName', 'Юный диктор');
        const html = this.generateCertificateHTML(certificate, playerName);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // Показать все сертификаты
    showAllCertificates() {
        const earned = this.getEarnedCertificates();

        const modal = document.createElement('div');
        modal.className = 'certificates-gallery-modal';
        modal.innerHTML = `
            <div class="certificates-gallery-content">
                <div class="certificates-gallery-header">
                    <h2>📜 Мои сертификаты</h2>
                    <button class="certificates-gallery-close">×</button>
                </div>
                <div class="certificates-gallery-grid">
                    ${earned.length > 0 ? earned.map(cert => `
                        <div class="certificate-card ${cert.level}" data-cert-id="${cert.id}">
                            <div class="certificate-card-icon">${cert.icon}</div>
                            <div class="certificate-card-title">${cert.title}</div>
                            <div class="certificate-card-description">${cert.description}</div>
                            <div class="certificate-card-date">
                                ${new Date(cert.earnedDate).toLocaleDateString('ru-RU')}
                            </div>
                            <button class="btn btn-small print-cert-btn" data-cert-id="${cert.id}">
                                🖨️ Печать
                            </button>
                        </div>
                    `).join('') : '<p class="no-certificates">Пока нет сертификатов. Продолжай играть!</p>'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('active'), 100);

        modal.querySelector('.certificates-gallery-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        modal.querySelectorAll('.print-cert-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const certId = e.target.dataset.certId;
                const cert = earned.find(c => c.id === certId);
                if (cert) {
                    this.printCertificate(cert);
                }
            });
        });
    }
}
