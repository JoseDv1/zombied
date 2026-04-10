export const inputState = {
    teclas: {
        w: false,
        a: false,
        s: false,
        d: false
    },
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
};

export function setupInput(callbacks: { onDisparar: () => void, onE: () => void, onQ: () => void }) {
    window.addEventListener('mousemove', (e) => {
        inputState.mouseX = e.clientX;
        inputState.mouseY = e.clientY;
    });

    window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'arrowup') inputState.teclas.w = true;
        if (k === 'a' || e.key === 'arrowleft') inputState.teclas.a = true;
        if (k === 's' || e.key === 'arrowdown') inputState.teclas.s = true;
        if (k === 'd' || e.key === 'arrowright') inputState.teclas.d = true;

        if (k === 'e') callbacks.onE();
        if (k === 'q') callbacks.onQ();
    });

    window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'arrowup') inputState.teclas.w = false;
        if (k === 'a' || e.key === 'arrowleft') inputState.teclas.a = false;
        if (k === 's' || e.key === 'arrowdown') inputState.teclas.s = false;
        if (k === 'd' || e.key === 'arrowright') inputState.teclas.d = false;
    });

    window.addEventListener('mousedown', () => {
        callbacks.onDisparar();
    });
}
