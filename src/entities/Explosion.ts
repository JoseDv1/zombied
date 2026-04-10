import { gameState } from '../state';
import { Entity } from './Entity';

export class Explosion extends Entity {
    radioMax: number;
    activa: boolean;

    constructor(x: number, y: number) {
        super(x, y, 10);
        this.radioMax = 300;
        this.activa = true;
    }

    override dibujar(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 76, 60, ${1 - this.radio / this.radioMax})`;
        ctx.fill();
        ctx.restore();
    }

    override actualizar(ctx: CanvasRenderingContext2D) {
        this.dibujar(ctx);
        this.radio += 15; // Expansión rápida

        // Dañar enemigos
        gameState.enemigos.forEach((e) => {
            const dist = Math.hypot(e.x - this.x, e.y - this.y);
            if (dist < this.radio + e.radio && dist > this.radio - 30) {
                if (!e.explotado) {
                    e.vida -= 5; // Mucho daño
                    e.explotado = true;
                }
            }
        });

        if (this.radio >= this.radioMax) this.activa = false;
    }
}
