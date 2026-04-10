export const inputState = {
    teclas: {
        w: false,
        a: false,
        s: false,
        d: false
    },
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    joystickMove: { x: 0, y: 0 },
    joystickAim: { x: 0, y: 0, active: false }
};

function setupJoystick(
    zoneId: string, 
    padId: string, 
    knobId: string, 
    onMove: (dx: number, dy: number, active: boolean) => void
) {
    const zone = document.getElementById(zoneId);
    const pad = document.getElementById(padId);
    const knob = document.getElementById(knobId);
    if (!zone || !pad || !knob) return;

    let activeTouchId: number | null = null;
    const maxDist = 40;

    zone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (activeTouchId === null) {
                const touch = e.changedTouches[i] as Touch;
                activeTouchId = touch.identifier;
                
                pad.style.display = 'block';
                pad.style.left = touch.clientX + 'px';
                pad.style.top = touch.clientY + 'px';
                knob.style.transform = `translate(-50%, -50%)`;
                
                (zone as any).startX = touch.clientX;
                (zone as any).startY = touch.clientY;
                onMove(0, 0, true);
                break;
            }
        }
    }, {passive: false});

    zone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (activeTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i] as Touch;
            if (touch.identifier === activeTouchId) {
                let dx = touch.clientX - (zone as any).startX;
                let dy = touch.clientY - (zone as any).startY;
                const dist = Math.hypot(dx, dy);
                
                if (dist > maxDist) {
                    dx = (dx / dist) * maxDist;
                    dy = (dy / dist) * maxDist;
                }
                
                knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
                onMove(dx / maxDist, dy / maxDist, true);
                break;
            }
        }
    }, {passive: false});

    const endTouch = (e: TouchEvent) => {
        e.preventDefault();
        if (activeTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i] as Touch;
            if (touch.identifier === activeTouchId) {
                activeTouchId = null;
                pad.style.display = 'none';
                onMove(0, 0, false);
                break;
            }
        }
    };

    zone.addEventListener('touchend', endTouch, {passive: false});
    zone.addEventListener('touchcancel', endTouch, {passive: false});
}

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

    // Configurar controles móviles
    setupJoystick('joystickLeftZone', 'joystickLeftPad', 'joystickLeftKnob', (dx, dy, active) => {
        inputState.joystickMove.x = active ? dx : 0;
        inputState.joystickMove.y = active ? dy : 0;
    });

    setupJoystick('joystickRightZone', 'joystickRightPad', 'joystickRightKnob', (dx, dy, active) => {
        inputState.joystickAim.x = dx;
        inputState.joystickAim.y = dy;
        inputState.joystickAim.active = active;
    });

    document.getElementById('btnMobileE')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        callbacks.onE();
    }, {passive: false});

    document.getElementById('btnMobileQ')?.addEventListener('touchstart', (e) => {
        e.preventDefault();
        callbacks.onQ();
    }, {passive: false});
}
