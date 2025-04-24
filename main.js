// Configuración avanzada del sistema
const CONFIG = {
    HERMOSILLO_COORDS: [29.0892, -110.9613],
    INITIAL_ZOOM: 13,
    POINTS: {
        REPORT: 10,
        VERIFICATION: 20,
        COMMENT: 5,
        CHALLENGE_COMPLETION: 50,
        DAILY_STREAK: 15
    },
    LEVELS: {
        NOVATO: { min: 0, max: 100, icon: '🌱', color: '#8BC34A' },
        GUARDIAN: { min: 101, max: 500, icon: '🌿', color: '#4CAF50' },
        MAESTRO: { min: 501, max: Infinity, icon: '🌳', color: '#2E7D32' }
    },
    CHALLENGES: {
        RETO_SIN_BASURA: {
            id: 'sin_basura',
            name: '#RetoSinBasura',
            description: 'Reporta 10 acumulaciones de basura',
            target: 10,
            type: 'basura',
            reward: 100
        },
        ADOPTA_ARBOL: {
            id: 'adopta_arbol',
            name: '#AdoptaUnÁrbol',
            description: 'Reporta 5 árboles que necesiten cuidado',
            target: 5,
            type: 'planta',
            reward: 150
        }
    },
    ACHIEVEMENTS: {
        PRIMER_REPORTE: {
            id: 'primer_reporte',
            name: 'Primer Reporte',
            description: 'Realiza tu primer reporte ambiental',
            icon: '🏆'
        },
        VERIFICADOR: {
            id: 'verificador',
            name: 'Verificador Experto',
            description: 'Verifica 10 reportes',
            icon: '🔍',
            target: 10
        },
        ECO_GUARDIAN: {
            id: 'eco_guardian',
            name: 'Eco Guardián',
            description: 'Alcanza el nivel Guardián',
            icon: '🛡️'
        }
    }
};

// Clase para manejar los reportes
class Reporte {
    constructor(coords, type, description, userId, photoUrl = null) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.coords = coords;
        this.type = type;
        this.description = description;
        this.userId = userId;
        this.timestamp = new Date();
        this.status = 'pendiente';
        this.verifications = 0;
        this.comments = [];
        this.photoUrl = photoUrl;
        this.severity = this.calcularSeveridad();
    }

    calcularSeveridad() {
        const severidades = {
            basura: Math.floor(Math.random() * 3) + 1,
            fuego: Math.floor(Math.random() * 5) + 1,
            planta: Math.floor(Math.random() * 3) + 1,
            agua: Math.floor(Math.random() * 4) + 1
        };
        return severidades[this.type];
    }

    verificar(userId) {
        if (!this.verificaciones.includes(userId)) {
            this.verifications++;
            this.verificaciones.push(userId);
            if (this.verifications >= 3) {
                this.status = 'verificado';
                this.fechaVerificacion = new Date();
            }
            return true;
        }
        return false;
    }

    agregarComentario(userId, text) {
        this.comments.push({
            userId,
            text,
            timestamp: new Date(),
            likes: 0
        });
    }

    likeComentario(commentIndex) {
        if (this.comments[commentIndex]) {
            this.comments[commentIndex].likes++;
        }
    }
}

// Clase para manejar usuarios
class Usuario {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.puntos = parseInt(localStorage.getItem(`user_${id}_points`)) || 0;
        this.reportes = JSON.parse(localStorage.getItem(`user_${id}_reports`)) || [];
        this.verificaciones = JSON.parse(localStorage.getItem(`user_${id}_verifications`)) || [];
        this.achievements = JSON.parse(localStorage.getItem(`user_${id}_achievements`)) || [];
        this.challenges = JSON.parse(localStorage.getItem(`user_${id}_challenges`)) || this.inicializarChallenges();
        this.streak = JSON.parse(localStorage.getItem(`user_${id}_streak`)) || { count: 0, lastDate: null };
        this.nivel = this.calcularNivel();
    }

    inicializarChallenges() {
        return Object.keys(CONFIG.CHALLENGES).map(key => ({
            ...CONFIG.CHALLENGES[key],
            progress: 0,
            completed: false
        }));
    }

    calcularNivel() {
        if (this.puntos <= CONFIG.LEVELS.NOVATO.max) return 'NOVATO';
        if (this.puntos <= CONFIG.LEVELS.GUARDIAN.max) return 'GUARDIAN';
        return 'MAESTRO';
    }

    agregarPuntos(puntos, razon) {
        const oldNivel = this.nivel;
        this.puntos += puntos;
        this.nivel = this.calcularNivel();
        localStorage.setItem(`user_${id}_points`, this.puntos);
        
        if (oldNivel !== this.nivel) {
            this.desbloquearAchievement('ECO_GUARDIAN');
            Notificacion.mostrar(`¡Felicidades! Has alcanzado el nivel ${this.nivel}`, 'success');
        }
        
        this.actualizarStreak();
        return this.nivel;
    }

    actualizarStreak() {
        const hoy = new Date().toDateString();
        if (this.streak.lastDate !== hoy) {
            const ayer = new Date();
            ayer.setDate(ayer.getDate() - 1);
            if (this.streak.lastDate === ayer.toDateString()) {
                this.streak.count++;
            } else {
                this.streak.count = 1;
            }
            this.streak.lastDate = hoy;
            localStorage.setItem(`user_${id}_streak`, JSON.stringify(this.streak));
            
            if (this.streak.count > 0) {
                this.agregarPuntos(CONFIG.POINTS.DAILY_STREAK, 'Racha diaria');
            }
        }
    }

    desbloquearAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            localStorage.setItem(`user_${id}_achievements`, JSON.stringify(this.achievements));
            const achievement = CONFIG.ACHIEVEMENTS[achievementId];
            Notificacion.mostrar(`¡Logro desbloqueado! ${achievement.icon} ${achievement.name}`, 'success');
        }
    }

    actualizarChallenge(challengeId, progress) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge && !challenge.completed) {
            challenge.progress = progress;
            if (challenge.progress >= challenge.target) {
                challenge.completed = true;
                this.agregarPuntos(challenge.reward, `Completar reto ${challenge.name}`);
            }
            localStorage.setItem(`user_${id}_challenges`, JSON.stringify(this.challenges));
        }
    }
}

// Sistema de notificaciones mejorado
class Notificacion {
    static mostrar(mensaje, tipo = 'info', duracion = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification fade-in ${tipo}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getIcon(tipo)}"></i>
            <div class="notification-content">${mensaje}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, duracion);
    }

    static getIcon(tipo) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-circle',
            error: 'times-circle',
            achievement: 'trophy',
            challenge: 'flag-checkered'
        };
        return icons[tipo] || 'info-circle';
    }
}

// Íconos personalizados para diferentes tipos de reportes
const reportIcons = {
    basura: L.divIcon({
        className: 'custom-icon',
        html: '<i class="fas fa-trash" style="color: #2E7D32; font-size: 24px;"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    }),
    fuego: L.divIcon({
        className: 'custom-icon',
        html: '<i class="fas fa-fire" style="color: #FF5722; font-size: 24px;"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    }),
    planta: L.divIcon({
        className: 'custom-icon',
        html: '<i class="fas fa-leaf" style="color: #4CAF50; font-size: 24px;"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    }),
    agua: L.divIcon({
        className: 'custom-icon',
        html: '<i class="fas fa-tint" style="color: #2196F3; font-size: 24px;"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    })
};

// Inicialización del mapa con más opciones
const map = L.map('map', {
    zoomControl: true,
    maxZoom: 18,
    minZoom: 10
}).setView(CONFIG.HERMOSILLO_COORDS, CONFIG.INITIAL_ZOOM);

// Capas base
const baseLayers = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    "Terreno": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')
};

// Agregar la capa base por defecto
baseLayers["OpenStreetMap"].addTo(map);

// Capas de calor
const heatLayers = {
    "Reportes de Basura": L.layerGroup(),
    "Reportes de Fuego": L.layerGroup(),
    "Reportes de Plantas": L.layerGroup(),
    "Reportes de Agua": L.layerGroup()
};

// Agregar controles de capas
L.control.layers(baseLayers, heatLayers).addTo(map);

// Estado de la aplicación
let reportCount = 0;
let currentUser = new Usuario('user_' + Math.random().toString(36).substr(2, 9), 'Usuario Anónimo');
let activeReports = new Map();
let heatMapData = {
    basura: [],
    fuego: [],
    planta: [],
    agua: []
};

// Reportes iniciales simulados
const initialReports = [
    {
        coords: [29.0892, -110.9613],
        type: 'basura',
        description: 'Acumulación de basura en parque',
        userId: 'system'
    },
    {
        coords: [29.0992, -110.9713],
        type: 'fuego',
        description: 'Quema ilegal de basura',
        userId: 'system'
    },
    {
        coords: [29.0792, -110.9513],
        type: 'planta',
        description: 'Árbol enfermo necesita atención',
        userId: 'system'
    }
];

// Función para agregar un marcador al mapa
function addReportMarker(reporte) {
    const marker = L.marker(reporte.coords, {
        icon: reportIcons[reporte.type],
        riseOnHover: true
    }).addTo(map);

    const popupContent = `
        <div class="report-popup">
            <div class="report-header">
                <h3>${reporte.type.charAt(0).toUpperCase() + reporte.type.slice(1)}</h3>
                <span class="severity-badge">Severidad: ${'⚠️'.repeat(reporte.severity)}</span>
            </div>
            <p>${reporte.description}</p>
            <small>Reportado: ${reporte.timestamp.toLocaleDateString()}</small>
            ${reporte.photoUrl ? `<img src="${reporte.photoUrl}" alt="Foto del reporte" class="report-photo">` : ''}
            <div class="report-actions">
                <button onclick="verificarReporte('${reporte.id}')" class="verify-btn">
                    <i class="fas fa-check"></i> Verificar (${reporte.verifications}/3)
                </button>
                <button onclick="mostrarComentarios('${reporte.id}')" class="comment-btn">
                    <i class="fas fa-comment"></i> Comentar
                </button>
            </div>
            <div id="comments-${reporte.id}" class="comments-section"></div>
        </div>
    `;

    marker.bindPopup(popupContent);
    activeReports.set(reporte.id, { marker, reporte });
    
    // Actualizar mapa de calor
    heatMapData[reporte.type].push(reporte.coords);
    updateHeatMap(reporte.type);
    
    return marker;
}

// Función para verificar un reporte
function verificarReporte(reportId) {
    const reportData = activeReports.get(reportId);
    if (reportData) {
        if (reportData.reporte.verificar(currentUser.id)) {
            currentUser.agregarPuntos(CONFIG.POINTS.VERIFICATION, 'Reporte verificado');
            updateRanking();
        }
    }
}

// Función para mostrar comentarios
function mostrarComentarios(reportId) {
    const reportData = activeReports.get(reportId);
    if (reportData) {
        const commentsSection = document.getElementById(`comments-${reportId}`);
        const commentForm = `
            <div class="comment-form">
                <textarea placeholder="Escribe tu comentario..."></textarea>
                <button onclick="agregarComentario('${reportId}')">Enviar</button>
            </div>
        `;
        commentsSection.innerHTML = commentForm;
    }
}

// Función para agregar un comentario
function agregarComentario(reportId) {
    const reportData = activeReports.get(reportId);
    if (reportData) {
        const textarea = document.querySelector(`#comments-${reportId} textarea`);
        if (textarea.value.trim()) {
            reportData.reporte.agregarComentario(currentUser.id, textarea.value);
            textarea.value = '';
            Notificacion.mostrar('Comentario agregado', 'success');
        }
    }
}

// Función para actualizar el contador de reportes
function updateReportCount() {
    document.getElementById('totalReports').textContent = reportCount;
}

// Función para actualizar el ranking
function updateRanking() {
    const rankingContainer = document.getElementById('userRanking');
    const nivel = CONFIG.LEVELS[currentUser.nivel];
    rankingContainer.innerHTML = `
        <div class="ranking-item">
            <span>${currentUser.nombre}</span>
            <span class="level-badge">${nivel.icon} ${currentUser.nivel}</span>
            <span class="points">${currentUser.puntos} pts</span>
        </div>
    `;
}

// Evento para el botón de reportar
document.getElementById('reportButton').addEventListener('click', () => {
    const randomLat = CONFIG.HERMOSILLO_COORDS[0] + (Math.random() - 0.5) * 0.1;
    const randomLng = CONFIG.HERMOSILLO_COORDS[1] + (Math.random() - 0.5) * 0.1;
    
    const reportTypes = ['basura', 'fuego', 'planta', 'agua'];
    const randomType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
    
    const nuevoReporte = new Reporte(
        [randomLat, randomLng],
        randomType,
        `Reporte automático #${reportCount + 1}`,
        currentUser.id
    );
    
    addReportMarker(nuevoReporte);
    currentUser.agregarReporte(nuevoReporte);
    reportCount++;
    
    const nuevoNivel = currentUser.agregarPuntos(CONFIG.POINTS.REPORT, 'Reporte automático');
    if (nuevoNivel !== currentUser.nivel) {
        Notificacion.mostrar(`¡Felicidades! Has alcanzado el nivel ${nuevoNivel}`, 'success');
    }
    
    updateReportCount();
    updateRanking();
    Notificacion.mostrar(`+${CONFIG.POINTS.REPORT} puntos por tu reporte`, 'success');
});

// Agregar reportes iniciales
initialReports.forEach(reportData => {
    const reporte = new Reporte(
        reportData.coords,
        reportData.type,
        reportData.description,
        reportData.userId
    );
    addReportMarker(reporte);
    reportCount++;
});

// Inicializar la UI
updateReportCount();
updateRanking();

// Función para actualizar el mapa de calor
function updateHeatMap(type) {
    const layer = heatLayers[`Reportes de ${type.charAt(0).toUpperCase() + type.slice(1)}`];
    layer.clearLayers();
    
    if (heatMapData[type].length > 0) {
        const heat = L.heatLayer(heatMapData[type], {
            radius: 25,
            blur: 15,
            maxZoom: 15
        });
        layer.addLayer(heat);
    }
} 