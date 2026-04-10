export abstract class Entity {
    x: number;
    y: number;
    radio: number;

    constructor(x: number, y: number, radio: number) {
        this.x = x;
        this.y = y;
        this.radio = radio;
    }

    abstract dibujar(ctx: CanvasRenderingContext2D, ...args: any[]): void;
    
    // Lo hacemos opcional (o con una implementación vacía) ya que Barricada no lo usa actualmente
    actualizar?(ctx: CanvasRenderingContext2D, ...args: any[]): void;
}
