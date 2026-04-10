import { inputState } from '../input';
import { gameState } from '../state';
import { Entity } from './Entity';

export class Jugador extends Entity {
    color: string;
    velocidad: number;

    constructor(x: number, y: number, radio: number, color: string) {
        super(x, y, radio);
        this.color = color;
        this.velocidad = 6;
    }

    override dibujar(ctx: CanvasRenderingContext2D) {
        // Calcular ángulo hacia el mouse
        const anguloMouse = Math.atan2(inputState.mouseY - this.y, inputState.mouseX - this.x);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(anguloMouse);

        // Dibujar el cuerpo (espalda/hombros)
        ctx.fillStyle = '#2980b9'; // Camisa
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radio, this.radio * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1a5276';
        ctx.stroke();

        // Pistola
        ctx.fillStyle = '#111';
        ctx.fillRect(this.radio * 0.4, this.radio * 0.3, 22, 8); // Arma lado derecho

        // Manos (sosteniendo el arma)
        ctx.fillStyle = '#f1c27d'; // Color de piel

        // Mano izquierda
        ctx.beginPath();
        ctx.arc(this.radio * 0.6, -this.radio * 0.6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Mano derecha
        ctx.beginPath();
        ctx.arc(this.radio * 0.6, this.radio * 0.4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cabeza verde / ocre (Aquí usamos piel)
        ctx.beginPath();
        ctx.arc(0, 0, this.radio * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    override actualizar(ctx: CanvasRenderingContext2D) {
        this.dibujar(ctx);
        // Movimiento (bloquear para no salir de pantalla)
        if (inputState.teclas.w && this.y - this.radio > 0) this.y -= this.velocidad;
        if (inputState.teclas.s && this.y + this.radio < gameState.canvasHeight) this.y += this.velocidad;
        if (inputState.teclas.a && this.x - this.radio > 0) this.x -= this.velocidad;
        if (inputState.teclas.d && this.x + this.radio < gameState.canvasWidth) this.x += this.velocidad;
    }
}
