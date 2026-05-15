// Entry point
document.addEventListener('DOMContentLoaded', () => {
    // Setup Canvas
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');

    // Make canvas full size of container
    function resizeCanvas() {
        const container = document.getElementById('game-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        bgCanvas.width = container.clientWidth;
        bgCanvas.height = container.clientHeight;

        if (window.game) {
            window.game.onResize(canvas.width, canvas.height);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial size

    // Initialize Game Systems
    window.audio = new AudioSystem();
    window.input = new InputSystem();
    window.game = new Game(ctx, canvas.width, canvas.height);
    window.particles = new ParticleSystem(ctx);

    // Setup UI bindings
    document.getElementById('start-btn').addEventListener('click', () => {
        audio.init(); // Must initialize audio on user interaction
        audio.playSound('start');
        document.getElementById('start-screen').classList.replace('active', 'hidden');
        game.start();
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        audio.playSound('start');
        document.getElementById('game-over-screen').classList.replace('active', 'hidden');
        game.start();
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
        audio.playSound('blip');
        document.getElementById('pause-screen').classList.replace('active', 'hidden');
        game.togglePause();
    });

    // Draw background grid
    function drawBackground() {
        bgCtx.fillStyle = '#050510';
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

        bgCtx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        bgCtx.lineWidth = 1;

        const gridSize = 30; // Matches game cell size roughly
        for (let x = 0; x <= bgCanvas.width; x += gridSize) {
            bgCtx.beginPath();
            bgCtx.moveTo(x, 0);
            bgCtx.lineTo(x, bgCanvas.height);
            bgCtx.stroke();
        }
        for (let y = 0; y <= bgCanvas.height; y += gridSize) {
            bgCtx.beginPath();
            bgCtx.moveTo(0, y);
            bgCtx.lineTo(bgCanvas.width, y);
            bgCtx.stroke();
        }
    }

    drawBackground();

    // Main Game Loop
    let lastTime = performance.now();

    function gameLoop(currentTime) {
        const dt = (currentTime - lastTime) / 1000; // Delta time in seconds
        lastTime = currentTime;

        // Clear main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (window.game) {
            window.game.update(dt);
            window.game.draw();
        }

        if (window.particles) {
            window.particles.update(dt);
            window.particles.draw();
        }

        requestAnimationFrame(gameLoop);
    }

    // Start loop
    requestAnimationFrame(gameLoop);
});
