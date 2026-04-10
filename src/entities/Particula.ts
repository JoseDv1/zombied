import type { Velocity } from '../state';
import { Entity } from './Entity';

export class Particula extends Entity {
    color: string;
    velocidad: Velocity;
    alpha: number;

    constructor(x: number, y: number, radio: number, color: string, velocidad: Velocity) {
        super(x, y, radio);
        this.color = color;
        this.velocidad = velocidad;
        this.alpha = 1; // Transparencia para desvanecimiento
    }

    override dibujar(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    override actualizar(ctx: CanvasRenderingContext2D) {
        this.dibujar(ctx);
        // Fricción
        this.velocidad.x *= 0.99;
        this.velocidad.y *= 0.99;
        this.x += this.velocidad.x;
        this.y += this.velocidad.y;
        this.alpha -= 0.02; // Desvanecer
    }
}
