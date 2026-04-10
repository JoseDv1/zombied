import { Projectil } from './Projectil';
import { gameState } from '../state';
import { Entity } from './Entity';

export class Enemigo extends Entity {
    color: string;
    velocidad: number;
    vida: number;
    cooldownDisparo: number;
    eliminado: boolean = false;
    explotado: boolean = false;

    constructor(x: number, y: number, radio: number, color: string, velocidad: number, vida: number) {
        super(x, y, Math.max(18, radio));
        this.color = color;
        this.velocidad = velocidad;
        this.vida = vida;
        this.cooldownDisparo = Math.random() * 60 + 60; // 1 a 2 segundos
    }

    override dibujar(ctx: CanvasRenderingContext2D, angulo: number) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angulo);

        if (this.vida < 2 && this.radio > 15) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'red';
        }

        // Cuerpo / Camisa
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radio, this.radio * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#111';
        ctx.stroke();

        // Arma
        ctx.fillStyle = '#222';
        ctx.fillRect(this.radio * 0.4, this.radio * 0.3, 20, 7);

        // Manos
        ctx.fillStyle = '#f1c27d';
        ctx.beginPath();
        ctx.arc(this.radio * 0.6, -this.radio * 0.6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.radio * 0.6, this.radio * 0.4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cabeza 
        ctx.beginPath();
        ctx.arc(0, 0, this.radio * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    override actualizar(ctx: CanvasRenderingContext2D, jugadorX: number, jugadorY: number) {
        const angulo = Math.atan2(jugadorY - this.y, jugadorX - this.x);
        this.dibujar(ctx, angulo);
        this.x += Math.cos(angulo) * this.velocidad;
        this.y += Math.sin(angulo) * this.velocidad;

        // Sistema de disparo del enemigo
        this.cooldownDisparo--;
        // Solo dispara si ya recargó y está visible en pantalla
        if (this.cooldownDisparo <= 0 && this.x > 0 && this.x < gameState.canvasWidth && this.y > 0 && this.y < gameState.canvasHeight) {
            const velocidadDeBala = 5;
            const vel = {
                x: Math.cos(angulo) * velocidadDeBala,
                y: Math.sin(angulo) * velocidadDeBala
            };
            gameState.proyectilesEnemigos.push(new Projectil(this.x, this.y, 5, '#e74c3c', vel));
            this.cooldownDisparo = Math.random() * 60 + 90; // Siguiente bala en 1.5 a 2.5 segundos
        }
    }
}
