import './style.css';
import { gameState } from './state';
import { setupInput, inputState } from './input';
import { Jugador } from './entities/Jugador';
import { Enemigo } from './entities/Enemigo';
import { Projectil } from './entities/Projectil';
import { Particula } from './entities/Particula';
import { Barricada } from './entities/Barricada';
import { Explosion } from './entities/Explosion';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const scoreElement = document.getElementById('score')!;
const gameOverElement = document.getElementById('gameOver')!;
const finalScoreElement = document.getElementById('finalScore')!;
const restartButton = document.getElementById('restartButton')!;
const playerNameInput = document.getElementById('playerName') as HTMLInputElement;
const saveScoreButton = document.getElementById('saveScoreButton') as HTMLButtonElement;
const nameInputSection = document.getElementById('nameInputSection')!;
const leaderboardSection = document.getElementById('leaderboardSection')!;
const leaderboardList = document.getElementById('leaderboardList')!;

let idAnimacion: number;
let spawnInterval: number;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameState.canvasWidth = window.innerWidth;
    gameState.canvasHeight = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function crearExplosion(x: number, y: number) {
    gameState.explosiones.push(new Explosion(x, y));
    gameState.enemigos.forEach(e => e.explotado = false);
}

setupInput({
    onDisparar: () => {
        if (gameState.isGameOver || !gameState.jugador) return;

        const angulo = Math.atan2(inputState.mouseY - gameState.jugador.y, inputState.mouseX - gameState.jugador.x);
        const velocidadDeBala = 12;
        const velocidad = {
            x: Math.cos(angulo) * velocidadDeBala,
            y: Math.sin(angulo) * velocidadDeBala
        };

        gameState.proyectiles.push(new Projectil(gameState.jugador.x, gameState.jugador.y, 6, '#f1c40f', velocidad));
    },
    onE: () => {
        if (gameState.cooldownE <= 0 && !gameState.isGameOver && gameState.jugador) {
            gameState.cooldownE = 10;
            crearExplosion(gameState.jugador.x, gameState.jugador.y);
        }
    },
    onQ: () => {
        if (gameState.cooldownQ <= 0 && !gameState.isGameOver && gameState.jugador) {
            gameState.cooldownQ = 7;
            gameState.barricadas.push(new Barricada(gameState.jugador.x, gameState.jugador.y));
        }
    }
});

function crearSangre(x: number, y: number, color: string) {
    for (let i = 0; i < 8; i++) {
        gameState.particulas.push(new Particula(x, y, Math.random() * 3, color, {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6)
        }));
    }
}

function dibujarFondo() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(52, 73, 94, 0.5)';
    ctx.lineWidth = 2;
    const gridSize = 60;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
}

function spawnEnemigos() {
    spawnInterval = window.setInterval(() => {
        if (gameState.isGameOver) return;
        const radio = Math.random() * (25 - 15) + 15;
        let x, y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radio : canvas.width + radio;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radio : canvas.height + radio;
        }

        const color = `hsl(${Math.random() * 20}, 70%, 40%)`;

        const extraSpeed = Math.min(gameState.puntuacion / 1000, 2);
        const velocidad = (Math.random() * 1.5) + 0.5 + extraSpeed;

        const vida = radio > 22 ? 2 : 1;

        gameState.enemigos.push(new Enemigo(x, y, radio, color, velocidad, vida));
    }, 1000);
}

function endGame() {
    gameState.isGameOver = true;
    cancelAnimationFrame(idAnimacion);
    clearInterval(spawnInterval);
    finalScoreElement.innerHTML = gameState.puntuacion.toString();
    gameOverElement.style.display = 'block';
    nameInputSection.style.display = 'block';
    playerNameInput.value = '';
    setTimeout(() => playerNameInput.focus(), 100);
    fetchLeaderboard();
}

function animar() {
    if (gameState.isGameOver) return;
    idAnimacion = requestAnimationFrame(animar);

    dibujarFondo();

    if (gameState.jugador) {
        gameState.jugador.actualizar(ctx);
    }

    gameState.explosiones.forEach(e => e.actualizar(ctx));
    gameState.barricadas.forEach(b => b.dibujar(ctx));

    gameState.particulas.forEach((particula, index) => {
        if (particula.alpha <= 0) {
            gameState.particulas.splice(index, 1);
        } else {
            particula.actualizar(ctx);
        }
    });

    gameState.proyectiles.forEach((proyectil) => {
        proyectil.actualizar(ctx);
        if (proyectil.x + proyectil.radio < 0 || proyectil.x - proyectil.radio > canvas.width ||
            proyectil.y + proyectil.radio < 0 || proyectil.y - proyectil.radio > canvas.height) {
            proyectil.eliminar = true;
        }
    });

    gameState.proyectilesEnemigos.forEach((proyectil) => {
        proyectil.actualizar(ctx);
        if (proyectil.x + proyectil.radio < 0 || proyectil.x - proyectil.radio > canvas.width ||
            proyectil.y + proyectil.radio < 0 || proyectil.y - proyectil.radio > canvas.height) {
            proyectil.eliminar = true;
        }

        gameState.barricadas.forEach(b => {
            if (Math.hypot(proyectil.x - b.x, proyectil.y - b.y) < proyectil.radio + b.radio) {
                proyectil.eliminar = true;
                b.vida -= 15;
            }
        });

        if (gameState.jugador && Math.hypot(proyectil.x - gameState.jugador.x, proyectil.y - gameState.jugador.y) < proyectil.radio + gameState.jugador.radio) {
            endGame();
        }
    });

    gameState.enemigos.forEach((enemigo) => {
        if (gameState.jugador) {
            enemigo.actualizar(ctx, gameState.jugador.x, gameState.jugador.y);
        }

        gameState.barricadas.forEach(b => {
            const distB = Math.hypot(enemigo.x - b.x, enemigo.y - b.y);
            if (distB < enemigo.radio + b.radio) {
                b.vida -= 1;
                const ang = Math.atan2(enemigo.y - b.y, enemigo.x - b.x);
                enemigo.x = b.x + Math.cos(ang) * (b.radio + enemigo.radio);
                enemigo.y = b.y + Math.sin(ang) * (b.radio + enemigo.radio);
            }
        });

        if (gameState.jugador) {
            const distJugador = Math.hypot(gameState.jugador.x - enemigo.x, gameState.jugador.y - enemigo.y);
            if (distJugador - enemigo.radio - gameState.jugador.radio < 1) {
                endGame();
            }
        }

        gameState.proyectiles.forEach((proyectil) => {
            if (proyectil.eliminar) return;
            const distBala = Math.hypot(proyectil.x - enemigo.x, proyectil.y - enemigo.y);

            if (distBala - enemigo.radio - proyectil.radio < 1) {
                enemigo.vida -= 1;
                proyectil.eliminar = true;
                if (enemigo.vida > 0) {
                    enemigo.radio -= 5;
                    crearSangre(enemigo.x, enemigo.y, '#e74c3c');
                }
            }
        });

        if (enemigo.vida <= 0 && !enemigo.eliminado) {
            enemigo.eliminado = true;
            crearSangre(enemigo.x, enemigo.y, '#e74c3c');
            gameState.puntuacion += 100;
            scoreElement.innerHTML = gameState.puntuacion.toString();
        }
    });

    if (gameState.cooldownE > 0) gameState.cooldownE -= 1 / 60;
    if (gameState.cooldownQ > 0) gameState.cooldownQ -= 1 / 60;
    
    document.getElementById('cooldownE')!.innerText = gameState.cooldownE > 0 ? Math.ceil(gameState.cooldownE) + 's' : '¡Listo!';
    document.getElementById('cooldownQ')!.innerText = gameState.cooldownQ > 0 ? Math.ceil(gameState.cooldownQ) + 's' : '¡Listo!';

    gameState.proyectiles = gameState.proyectiles.filter(p => !p.eliminar);
    gameState.proyectilesEnemigos = gameState.proyectilesEnemigos.filter(p => !p.eliminar);
    gameState.enemigos = gameState.enemigos.filter(e => !e.eliminado);
    gameState.barricadas = gameState.barricadas.filter(b => b.vida > 0);
    gameState.explosiones = gameState.explosiones.filter(e => e.activa);
}

function startGame() {
    gameState.jugador = new Jugador(canvas.width / 2, canvas.height / 2, 20, '#3498db');
    gameState.proyectiles = [];
    gameState.proyectilesEnemigos = [];
    gameState.enemigos = [];
    gameState.particulas = [];
    gameState.barricadas = [];
    gameState.explosiones = [];
    gameState.cooldownE = 0;
    gameState.cooldownQ = 0;
    gameState.puntuacion = 0;
    gameState.isGameOver = false;

    scoreElement.innerHTML = gameState.puntuacion.toString();
    gameOverElement.style.display = 'none';

    clearInterval(spawnInterval);
    spawnEnemigos();
    animar();
}

restartButton.addEventListener('click', startGame);

async function fetchLeaderboard() {
    try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
            const scores = await res.json();
            renderLeaderboard(scores);
        }
    } catch(e) {
        console.error("Error fetching leaderboard", e);
    }
}

function renderLeaderboard(scores: any[]) {
    leaderboardList.innerHTML = scores.map((s, i) => 
        `<li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <b>${i + 1}. ${s.name}</b>: <span style="float: right; color: #f1c40f;">${s.score}</span>
        </li>`
    ).join('');
    leaderboardSection.style.display = 'block';
}

saveScoreButton.addEventListener('click', async () => {
    const name = playerNameInput.value.trim();
    if (!name) return;
    saveScoreButton.disabled = true;
    try {
        const res = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score: gameState.puntuacion })
        });
        if (res.ok) {
            const scores = await res.json();
            renderLeaderboard(scores);
            nameInputSection.style.display = 'none';
        }
    } catch(e) {
        console.error("Error saving score", e);
    } finally {
        saveScoreButton.disabled = false;
    }
});

startGame();
