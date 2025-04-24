// Coordenadas de Hermosillo
const HERMOSILLO_COORDS = [29.0892, -110.9613];
const INITIAL_ZOOM = 13;

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

// Inicialización del mapa
const map = L.map('map').setView(HERMOSILLO_COORDS, INITIAL_ZOOM);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Estado de la aplicación
let reportCount = 0;
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

// Reportes iniciales simulados
const initialReports = [
    {
        coords: [29.0892, -110.9613],
        type: 'basura',
        description: 'Acumulación de basura en parque'
    },
    {
        coords: [29.0992, -110.9713],
        type: 'fuego',
        description: 'Quema ilegal de basura'
    },
    {
        coords: [29.0792, -110.9513],
        type: 'planta',
        description: 'Árbol enfermo necesita atención'
    }
];

// Función para agregar un marcador al mapa
function addReportMarker(coords, type, description) {
    const marker = L.marker(coords, {
        icon: reportIcons[type]
    }).addTo(map);

    marker.bindPopup(`
        <div class="report-popup">
            <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <p>${description}</p>
            <small>Reportado: ${new Date().toLocaleDateString()}</small>
        </div>
    `);

    return marker;
}

// Función para actualizar el contador de reportes
function updateReportCount() {
    document.getElementById('totalReports').textContent = reportCount;
}

// Función para mostrar notificación de puntos
function showPointsNotification(points) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.innerHTML = `
        <i class="fas fa-star"></i>
        ¡Has ganado ${points} puntos como EcoVigilante!
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Función para actualizar el ranking
function updateRanking() {
    const rankingContainer = document.getElementById('userRanking');
    rankingContainer.innerHTML = `
        <div class="ranking-item">
            <span>Usuario Actual</span>
            <span>${userPoints} pts</span>
        </div>
    `;
}

// Agregar reportes iniciales
initialReports.forEach(report => {
    addReportMarker(report.coords, report.type, report.description);
    reportCount++;
});

// Evento para el botón de reportar
document.getElementById('reportButton').addEventListener('click', () => {
    // Simular coordenadas aleatorias cerca de Hermosillo
    const randomLat = HERMOSILLO_COORDS[0] + (Math.random() - 0.5) * 0.1;
    const randomLng = HERMOSILLO_COORDS[1] + (Math.random() - 0.5) * 0.1;
    
    const reportTypes = ['basura', 'fuego', 'planta', 'agua'];
    const randomType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
    
    addReportMarker(
        [randomLat, randomLng],
        randomType,
        `Reporte automático #${reportCount + 1}`
    );
    
    reportCount++;
    userPoints += 10;
    localStorage.setItem('userPoints', userPoints);
    
    updateReportCount();
    updateRanking();
    showPointsNotification(10);
});

// Inicializar la UI
updateReportCount();
updateRanking(); 