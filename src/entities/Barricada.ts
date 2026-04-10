import { Entity } from './Entity';

export class Barricada extends Entity {
    vidaMax: number;
    vida: number;

    constructor(x: number, y: number) {
        super(x, y, 80); // Gran tamaño para cubrir al jugador entero
        this.vidaMax = 500;
        this.vida = 500;
    }

    override dibujar(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Dibujar un anillo defensivo tipo muro metálico/tecnológico
        const opacidad = this.vida / this.vidaMax;
        const numSegmentos = 16;
        const anguloSegmento = (Math.PI * 2) / numSegmentos;

        for (let i = 0; i < numSegmentos; i++) {
            ctx.rotate(anguloSegmento);

            // Bloque del muro
            ctx.beginPath();
            ctx.rect(this.radio - 15, -12, 30, 24);

            // Gradiente para efecto de metal realista
            const grad = ctx.createLinearGradient(this.radio - 15, -12, this.radio + 15, 12);
            grad.addColorStop(0, `rgba(80, 80, 80, ${opacidad})`);
            grad.addColorStop(0.5, `rgba(150, 150, 150, ${opacidad})`);
            grad.addColorStop(1, `rgba(40, 40, 40, ${opacidad})`);

            ctx.fillStyle = grad;
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle = `rgba(20, 20, 20, ${opacidad})`;
            ctx.stroke();

            // Remache central - Luz indicadora de estado
            ctx.beginPath();
            ctx.arc(this.radio, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = this.vida < this.vidaMax / 3 ? `rgba(231, 76, 60, ${opacidad})` : `rgba(46, 204, 113, ${opacidad})`;
            ctx.fill();
        }

        ctx.restore();
    }
}
