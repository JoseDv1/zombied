import type { Velocity } from '../state';
import { Entity } from './Entity';

export class Projectil extends Entity {
    color: string;
    velocidad: Velocity;
    eliminar: boolean = false;

    constructor(x: number, y: number, radio: number, color: string, velocidad: Velocity) {
        super(x, y, radio);
        this.color = color;
        this.velocidad = velocidad;
    }

    override dibujar(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
    }

    override actualizar(ctx: CanvasRenderingContext2D) {
        this.dibujar(ctx);
        this.x += this.velocidad.x;
        this.y += this.velocidad.y;
    }
}
