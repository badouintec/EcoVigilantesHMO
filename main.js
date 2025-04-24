// Configuración del sistema mejorada
const CONFIG = {
    HERMOSILLO_COORDS: [29.0892, -110.9613],
    INITIAL_ZOOM: 13,
    PUNTOS_POR_REPORTE: 10,
    PUNTOS_POR_VERIFICACION: 5,
    PUNTOS_POR_COMENTARIO: 2,
    PUNTOS_POR_RETO: 50,
    PUNTOS_POR_RACHA: 20,
    NIVELES: {
        NOVATO: { puntos: 0, icono: '🌱', color: '#8BC34A', nombre: 'Novato Eco' },
        GUARDIAN: { puntos: 100, icono: '🛡️', color: '#4CAF50', nombre: 'Guardián Verde' },
        MAESTRO: { puntos: 500, icono: '🌳', color: '#2E7D32', nombre: 'Maestro Ambiental' },
        LEGENDARIO: { puntos: 1000, icono: '🌟', color: '#FFD700', nombre: 'Leyenda Ecológica' }
    },
    RETOS: {
        RETO_SIN_BASURA: {
            nombre: '#RetoSinBasura',
            descripcion: 'Reporta 10 casos de basura en la ciudad',
            meta: 10,
            recompensa: 50,
            icono: '🗑️'
        },
        ADOPTA_ARBOL: {
            nombre: '#AdoptaUnÁrbol',
            descripcion: 'Adopta y monitorea un árbol por un mes',
            meta: 1,
            recompensa: 100,
            icono: '🌳'
        },
        GUARDIAN_AGUA: {
            nombre: '#GuardianDelAgua',
            descripcion: 'Reporta 5 casos de desperdicio de agua',
            meta: 5,
            recompensa: 75,
            icono: '💧'
        },
        PROTECTOR_FAUNA: {
            nombre: '#ProtectorDeFauna',
            descripcion: 'Ayuda a 3 animales en situación de riesgo',
            meta: 3,
            recompensa: 150,
            icono: '🦊'
        }
    },
    LOGROS: {
        PRIMER_REPORTE: {
            nombre: 'Primer Reporte',
            descripcion: 'Has realizado tu primer reporte',
            recompensa: 20,
            icono: '🎯'
        },
        VERIFICADOR: {
            nombre: 'Verificador',
            descripcion: 'Has verificado 10 reportes',
            recompensa: 30,
            icono: '✅'
        },
        ECO_GUARDIAN: {
            nombre: 'EcoGuardian',
            descripcion: 'Has alcanzado el nivel Guardian',
            recompensa: 50,
            icono: '🛡️'
        },
        COMUNIDAD_ACTIVA: {
            nombre: 'Comunidad Activa',
            descripcion: 'Has participado en 50 interacciones',
            recompensa: 100,
            icono: '👥'
        }
    },
    AREAS_PROTEGIDAS: [
        { nombre: 'Parque Madero', coordenadas: [29.0892, -110.9613], tipo: 'Parque Urbano' },
        { nombre: 'Cerro de la Campana', coordenadas: [29.0922, -110.9613], tipo: 'Área Natural' },
        { nombre: 'Río Sonora', coordenadas: [29.0952, -110.9613], tipo: 'Cuerpo de Agua' },
        { nombre: 'Bosque de la Ciudad', coordenadas: [29.0882, -110.9603], tipo: 'Bosque Urbano' }
    ]
};

// Variables globales
let map;
let reportes = [];
let usuarios = [];
let usuarioActual = null;
let baseLayers = {};
let heatmapLayers = {};

// Variables globales para las gráficas
let reportTypesChart = null;
let monthlyTrendChart = null;

// Datos simulados mejorados y más realistas
const datosSimulados = {
    reportes: [
        {
            id: 1,
            tipo: "basura",
            coordenadas: [29.0892, -110.9613],
            descripcion: "Acumulación de basura en el parque Madero, principalmente plásticos y desechos orgánicos",
            usuario: "Juan Pérez",
            fecha: "2024-03-15T10:30:00",
            verificaciones: ["María López", "Carlos Ruiz"],
            comentarios: [
                {
                    usuario: "María López",
                    texto: "Ya se reportó a servicios municipales, se espera recolección en las próximas horas",
                    fecha: "2024-03-15T11:00:00"
                },
                {
                    usuario: "Carlos Ruiz",
                    texto: "He verificado el área, la situación persiste pero se ha reducido la acumulación",
                    fecha: "2024-03-15T14:30:00"
                }
            ],
            severidad: 2,
            estado: "En proceso",
            fotos: ["basura1.jpg", "basura2.jpg"]
        },
        {
            id: 2,
            tipo: "fuego",
            coordenadas: [29.0922, -110.9613],
            descripcion: "Posible incendio forestal en Cerro de la Campana, humo visible desde el centro",
            usuario: "Ana Martínez",
            fecha: "2024-03-14T15:45:00",
            verificaciones: ["Pedro Sánchez", "Laura García"],
            comentarios: [
                {
                    usuario: "Pedro Sánchez",
                    texto: "Bomberos en camino, se recomienda evitar la zona",
                    fecha: "2024-03-14T16:00:00"
                },
                {
                    usuario: "Laura García",
                    texto: "El incendio ha sido controlado, bomberos realizando labores de enfriamiento",
                    fecha: "2024-03-14T18:30:00"
                }
            ],
            severidad: 3,
            estado: "Resuelto",
            fotos: ["incendio1.jpg", "incendio2.jpg"]
        },
        {
            id: 3,
            tipo: "planta",
            coordenadas: [29.0952, -110.9613],
            descripcion: "Árbol enfermo en el Bosque de la Ciudad, necesita atención especializada",
            usuario: "Roberto Torres",
            fecha: "2024-03-13T09:15:00",
            verificaciones: ["María López"],
            comentarios: [
                {
                    usuario: "María López",
                    texto: "Se ha contactado con el departamento de parques para evaluación",
                    fecha: "2024-03-13T10:00:00"
                }
            ],
            severidad: 1,
            estado: "En evaluación",
            fotos: ["arbol1.jpg"]
        },
        {
            id: 4,
            tipo: "agua",
            coordenadas: [29.0882, -110.9603],
            descripcion: "Fuga de agua en tubería principal, desperdicio significativo",
            usuario: "Carlos Ruiz",
            fecha: "2024-03-12T08:30:00",
            verificaciones: ["Ana Martínez"],
            comentarios: [
                {
                    usuario: "Ana Martínez",
                    texto: "Reportado a la Comisión Estatal del Agua, en espera de respuesta",
                    fecha: "2024-03-12T09:00:00"
                }
            ],
            severidad: 2,
            estado: "En proceso",
            fotos: ["agua1.jpg", "agua2.jpg"]
        }
    ],
    usuarios: [
        {
            nombre: "Juan Pérez",
            puntos: 150,
            nivel: "GUARDIAN",
            reportes: [1],
            verificaciones: [2, 3],
            retos: [
                { nombre: "#RetoSinBasura", completado: false, progreso: 3 },
                { nombre: "#AdoptaUnÁrbol", completado: false, progreso: 5 },
                { nombre: "#GuardianDelAgua", completado: false, progreso: 2 }
            ],
            logros: ["PRIMER_REPORTE", "VERIFICADOR"],
            racha: 5,
            ultimaActividad: "2024-03-15T14:30:00",
            foto: "usuario1.jpg"
        },
        {
            nombre: "Ana Martínez",
            puntos: 280,
            nivel: "MAESTRO",
            reportes: [2],
            verificaciones: [1, 4],
            retos: [
                { nombre: "#RetoSinBasura", completado: true, progreso: 10 },
                { nombre: "#AdoptaUnÁrbol", completado: true, progreso: 1 },
                { nombre: "#ProtectorDeFauna", completado: false, progreso: 2 }
            ],
            logros: ["PRIMER_REPORTE", "VERIFICADOR", "ECO_GUARDIAN"],
            racha: 12,
            ultimaActividad: "2024-03-14T18:30:00",
            foto: "usuario2.jpg"
        }
    ]
};

// Cargar datos simulados
function cargarDatosSimulados() {
    reportes = datosSimulados.reportes;
    usuarios = datosSimulados.usuarios;
    usuarioActual = usuarios[0];
    actualizarEstadisticas();
    actualizarMapa();
}

// Inicialización del mapa
function initMap() {
    // Verificar si el elemento del mapa existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Elemento del mapa no encontrado');
        return;
    }

    // Inicializar el mapa
    map = L.map('map', {
        zoomControl: true,
        maxZoom: 18,
        minZoom: 10,
        preferCanvas: true
    }).setView(CONFIG.HERMOSILLO_COORDS, CONFIG.INITIAL_ZOOM);

    // Capas base
    baseLayers = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }),
        "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 19
        }),
        "Terreno": L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
            attribution: 'Map tiles by Stamen Design',
            maxZoom: 18
        })
    };

    // Añadir capa base por defecto
    baseLayers["OpenStreetMap"].addTo(map);

    // Añadir control de capas
    L.control.layers(baseLayers).addTo(map);

    // Añadir marcadores de áreas protegidas
    CONFIG.AREAS_PROTEGIDAS.forEach(area => {
        L.marker(area.coordenadas)
            .bindPopup(`<b>${area.nombre}</b><br>${area.tipo}`)
            .addTo(map);
    });

    // Añadir marcadores de reportes
    actualizarMapa();
}

// Función para agregar marcadores de reporte mejorada
function addReportMarker(reporte) {
    const iconosReporte = {
        basura: L.divIcon({
            className: 'report-icon basura',
            html: '🗑️',
            iconSize: [30, 30],
            popupAnchor: [0, -15]
        }),
        fuego: L.divIcon({
            className: 'report-icon fuego',
            html: '🔥',
            iconSize: [30, 30],
            popupAnchor: [0, -15]
        }),
        planta: L.divIcon({
            className: 'report-icon planta',
            html: '🌱',
            iconSize: [30, 30],
            popupAnchor: [0, -15]
        }),
        agua: L.divIcon({
            className: 'report-icon agua',
            html: '💧',
            iconSize: [30, 30],
            popupAnchor: [0, -15]
        })
    };

    const marker = L.marker(reporte.coordenadas, {
        icon: iconosReporte[reporte.tipo],
        riseOnHover: true
    });

    const popupContent = `
        <div class="report-popup">
            <div class="report-header">
                <h3>Reporte de ${reporte.tipo}</h3>
                <span class="severity-badge">Severidad: ${reporte.severidad}</span>
            </div>
            <p>${reporte.descripcion}</p>
            <div class="report-actions">
                <button class="verify-btn" onclick="verificarReporte(${reporte.id})">
                    <i class="fas fa-check"></i> Verificar
                </button>
                <button class="comment-btn" onclick="mostrarFormularioComentario(${reporte.id})">
                    <i class="fas fa-comment"></i> Comentar
                </button>
            </div>
            <div class="comments-section" id="comments-${reporte.id}">
                ${reporte.comentarios.map(c => `
                    <div class="comment">
                        <div class="comment-header">
                            <span>${c.usuario}</span>
                            <span>${new Date(c.fecha).toLocaleDateString()}</span>
                        </div>
                        <div class="comment-content">${c.texto}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });

    // Efecto de animación al hacer hover
    marker.on('mouseover', function() {
        this.openPopup();
        this.setIcon(L.divIcon({
            className: 'report-icon ' + reporte.tipo + ' pulse',
            html: iconosReporte[reporte.tipo].options.html,
            iconSize: [35, 35],
            popupAnchor: [0, -15]
        }));
    });

    marker.on('mouseout', function() {
        this.setIcon(iconosReporte[reporte.tipo]);
    });

    marker.addTo(map);
    return marker;
}

// Función para actualizar el mapa
function actualizarMapa() {
    // Limpiar marcadores existentes
    Object.values(heatmapLayers).forEach(layer => layer.clearLayers());

    // Agregar nuevos marcadores
    reportes.forEach(reporte => {
        const marker = addReportMarker(reporte);
        heatmapLayers[`Reportes de ${reporte.tipo.charAt(0).toUpperCase() + reporte.tipo.slice(1)}`].addLayer(marker);
    });
}

// Función para mostrar el formulario de nuevo reporte mejorada
function mostrarFormularioReporte() {
    const tiposReporte = [
        { id: 1, nombre: 'Basura', icono: '🗑️' },
        { id: 2, nombre: 'Fuego', icono: '🔥' },
        { id: 3, nombre: 'Planta', icono: '🌱' },
        { id: 4, nombre: 'Agua', icono: '💧' }
    ];
    
    const tipoSeleccionado = prompt(
        'Selecciona el tipo de reporte:\n' +
        tiposReporte.map(t => `${t.id}. ${t.icono} ${t.nombre}`).join('\n')
    );
    
    if (!tipoSeleccionado || tipoSeleccionado < 1 || tipoSeleccionado > 4) {
        mostrarNotificacion('Tipo de reporte inválido', 'error');
        return;
    }

    const descripcion = prompt('Describe el problema con detalle:');
    if (!descripcion) {
        mostrarNotificacion('La descripción es requerida', 'error');
        return;
    }

    const severidad = prompt('Nivel de severidad (1-3):\n1. Baja\n2. Media\n3. Alta');
    if (!severidad || severidad < 1 || severidad > 3) {
        mostrarNotificacion('Severidad inválida', 'error');
        return;
    }

    const lat = CONFIG.HERMOSILLO_COORDS[0] + (Math.random() - 0.5) * 0.1;
    const lng = CONFIG.HERMOSILLO_COORDS[1] + (Math.random() - 0.5) * 0.1;

    const nuevoReporte = {
        id: reportes.length + 1,
        tipo: tiposReporte[tipoSeleccionado - 1].nombre.toLowerCase(),
        coordenadas: [lat, lng],
        descripcion,
        usuario: usuarioActual.nombre,
        fecha: new Date().toISOString(),
        verificaciones: [],
        comentarios: [],
        severidad: parseInt(severidad),
        estado: "Nuevo",
        fotos: []
    };

    reportes.push(nuevoReporte);
    usuarioActual.puntos += CONFIG.PUNTOS_POR_REPORTE;
    
    // Verificar si se completó algún reto
    const retoSinBasura = usuarioActual.retos.find(r => r.nombre === '#RetoSinBasura');
    if (retoSinBasura && nuevoReporte.tipo === 'basura') {
        retoSinBasura.progreso++;
        if (retoSinBasura.progreso >= CONFIG.RETOS.RETO_SIN_BASURA.meta) {
            retoSinBasura.completado = true;
            usuarioActual.puntos += CONFIG.RETOS.RETO_SIN_BASURA.recompensa;
            mostrarNotificacion(`¡Reto completado! #RetoSinBasura +${CONFIG.RETOS.RETO_SIN_BASURA.recompensa} puntos`, 'success');
        }
    }

    actualizarEstadisticas();
    actualizarMapa();
    mostrarNotificacion('¡Reporte agregado! +10 puntos', 'success');
}

// Función para verificar un reporte
function verificarReporte(id) {
    const reporte = reportes.find(r => r.id === id);
    if (reporte && !reporte.verificaciones.includes(usuarioActual.nombre)) {
        reporte.verificaciones.push(usuarioActual.nombre);
        usuarioActual.puntos += CONFIG.PUNTOS_POR_VERIFICACION;
        actualizarEstadisticas();
        actualizarMapa();
        mostrarNotificacion('¡Reporte verificado! +5 puntos', 'success');
    }
}

// Función para agregar un comentario
function agregarComentario(id, texto) {
    const reporte = reportes.find(r => r.id === id);
    if (reporte) {
        reporte.comentarios.push({
            usuario: usuarioActual.nombre,
            texto,
            fecha: new Date().toISOString()
        });
        usuarioActual.puntos += CONFIG.PUNTOS_POR_COMENTARIO;
        actualizarEstadisticas();
        actualizarMapa();
        mostrarNotificacion('¡Comentario agregado! +2 puntos', 'info');
    }
}

// Función para mostrar el formulario de comentario
function mostrarFormularioComentario(id) {
    const texto = prompt('Ingresa tu comentario:');
    if (texto) {
        agregarComentario(id, texto);
    }
}

// Función para animar números
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Función para mostrar notificaciones mejorada
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.innerHTML = `
        <div class="notification-content">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 
                           tipo === 'error' ? 'fa-exclamation-circle' : 
                           'fa-info-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;

    document.body.appendChild(notificacion);
    
    // Animación de entrada
    notificacion.style.animation = 'slideIn 0.3s ease-out';
    
    // Eliminar después de 3 segundos con animación de salida
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// Función para actualizar estadísticas mejorada
function actualizarEstadisticas() {
    // Actualizar KPIs con animación
    const totalReports = reportes.length;
    const activeUsers = new Set(reportes.map(r => r.usuario)).size;
    const protectedAreas = Math.floor(reportes.length / 10);
    const completedChallenges = usuarioActual.retos.filter(r => r.completado).length;

    // Animación de conteo para cada KPI
    animateValue(document.getElementById('totalReportsKPI'), 0, totalReports, 1000);
    animateValue(document.getElementById('activeUsersKPI'), 0, activeUsers, 1000);
    animateValue(document.getElementById('protectedAreasKPI'), 0, protectedAreas, 1000);
    animateValue(document.getElementById('completedChallengesKPI'), 0, completedChallenges, 1000);

    // Actualizar estadísticas de usuario con efectos visuales
    const userLevelElement = document.getElementById('userLevel');
    userLevelElement.textContent = CONFIG.NIVELES[usuarioActual.nivel].icono;
    userLevelElement.style.animation = 'pulse 1s ease-in-out';

    animateValue(document.getElementById('userPoints'), 0, usuarioActual.puntos, 1000);
    animateValue(document.getElementById('userReports'), 0, usuarioActual.reportes.length, 1000);
    animateValue(document.getElementById('userVerifications'), 0, usuarioActual.verificaciones.length, 1000);

    // Actualizar estadísticas en tiempo real
    document.getElementById('totalReports').textContent = totalReports;
    document.getElementById('activeUsers').textContent = activeUsers;

    // Actualizar progreso de retos con animación
    const retoSinBasura = usuarioActual.retos.find(r => r.nombre === '#RetoSinBasura');
    const adoptaArbol = usuarioActual.retos.find(r => r.nombre === '#AdoptaUnÁrbol');

    if (retoSinBasura) {
        const progress = (retoSinBasura.progreso / CONFIG.RETOS.RETO_SIN_BASURA.meta) * 100;
        const progressBar = document.querySelector('.challenge-item:nth-child(1) .progress');
        progressBar.style.width = `${progress}%`;
        progressBar.style.transition = 'width 1s ease-in-out';
    }

    if (adoptaArbol) {
        const progress = (adoptaArbol.progreso / CONFIG.RETOS.ADOPTA_ARBOL.meta) * 100;
        const progressBar = document.querySelector('.challenge-item:nth-child(2) .progress');
        progressBar.style.width = `${progress}%`;
        progressBar.style.transition = 'width 1s ease-in-out';
    }

    // Actualizar gráficas
    updateCharts();
}

// Inicialización de las gráficas
function initCharts() {
    // Gráfica de tipos de reportes
    const reportTypesCtx = document.getElementById('reportTypesChart').getContext('2d');
    reportTypesChart = new Chart(reportTypesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Basura', 'Fuego', 'Plantas', 'Agua'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(33, 150, 243, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(33, 150, 243, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfica de tendencia mensual
    const monthlyTrendCtx = document.getElementById('monthlyTrendChart').getContext('2d');
    monthlyTrendChart = new Chart(monthlyTrendCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Reportes',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Actualización de las gráficas
function updateCharts() {
    if (!reportTypesChart || !monthlyTrendChart) return;

    // Actualizar gráfica de tipos de reportes
    const reportTypes = reportes.reduce((acc, reporte) => {
        acc[reporte.tipo] = (acc[reporte.tipo] || 0) + 1;
        return acc;
    }, {});

    reportTypesChart.data.datasets[0].data = [
        reportTypes.basura || 0,
        reportTypes.fuego || 0,
        reportTypes.planta || 0,
        reportTypes.agua || 0
    ];
    reportTypesChart.update();

    // Actualizar gráfica de tendencia mensual
    const monthlyData = reportes.reduce((acc, reporte) => {
        const month = new Date(reporte.fecha).getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    monthlyTrendChart.data.datasets[0].data = Array(6).fill(0).map((_, i) => monthlyData[i] || 0);
    monthlyTrendChart.update();
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initCharts();
    cargarDatosSimulados();
    
    // Inicializar AOS con configuración mejorada
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    // Agregar event listeners mejorados
    document.getElementById('addReportBtn')?.addEventListener('click', mostrarFormularioReporte);
    
    // Inicializar KPIs con valores iniciales
    actualizarEstadisticas();

    // Agregar efecto de parallax al scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-section, .impact-section, .kpi-section');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.backgroundPositionY = (scrolled * speed) + 'px';
        });
    });
}); 