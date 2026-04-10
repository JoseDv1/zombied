// Definimos interfaces para evitar dependencias circulares con las clases
export interface Point {
    x: number;
    y: number;
}
export interface Velocity {
    x: number;
    y: number;
}

export const gameState = {
    jugador: null as any,
    proyectiles: [] as any[],
    proyectilesEnemigos: [] as any[],
    enemigos: [] as any[],
    particulas: [] as any[],
    barricadas: [] as any[],
    explosiones: [] as any[],
    cooldownE: 0,
    cooldownQ: 0,
    cooldownFuego: 0,
    puntuacion: 0,
    isGameOver: false,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    mostrarPuntajeFinal: () => {},
    activarGameOverUI: () => {}
};
