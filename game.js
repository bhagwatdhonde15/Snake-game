class Game {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.gridSize = 20; // 20x20 pixels per grid cell

        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('neonSnakeHighScore')) || 0;
        this.combo = 0;
        this.comboTimer = 0;

        this.baseMoveInterval = 0.15; // Seconds per move
        this.moveInterval = this.baseMoveInterval;
        this.moveTimer = 0;

        this.powerUpTimer = 0;

        this.snake = null;
        this.food = null;

        document.getElementById('high-score').innerText = this.highScore;

        // Touch controls visibility check
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.getElementById('touch-controls').classList.remove('hidden');
        }
    }

    onResize(w, h) {
        this.width = w;
        this.height = h;
    }

    start() {
        this.snake = new Snake(this);
        this.food = new Food(this);
        window.input.reset();

        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.moveInterval = this.baseMoveInterval;
        this.powerUpTimer = 0;

        this.updateHUD();
        this.state = 'PLAYING';
        if (window.particles) window.particles.clear();

        document.getElementById('new-high-score-msg').classList.add('hidden');
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('pause-screen').classList.replace('hidden', 'active');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            document.getElementById('pause-screen').classList.replace('active', 'hidden');
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        window.audio.playSound('die');

        document.getElementById('game-container').classList.add('shake');
        setTimeout(() => {
            document.getElementById('game-container').classList.remove('shake');
        }, 400);

        document.getElementById('final-score').innerText = this.score;
        document.getElementById('game-over-screen').classList.replace('hidden', 'active');

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('neonSnakeHighScore', this.highScore);
            document.getElementById('high-score').innerText = this.highScore;
            document.getElementById('new-high-score-msg').classList.remove('hidden');
            window.particles.emitConfetti(this.width, this.height);
        }
    }

    onEatFood(food) {
        // Particle effect
        const px = food.pos.x * this.gridSize + this.gridSize / 2;
        const py = food.pos.y * this.gridSize + this.gridSize / 2;
        window.particles.emit(px, py, food.color, 20, 150);

        // Apply effects based on type
        let points = 10;
        window.audio.playSound('eat');

        if (food.type === 'speed') {
            this.moveInterval = this.baseMoveInterval * 0.5; // Double speed
            this.powerUpTimer = 5; // 5 seconds
            window.audio.playSound('eat_special');
        } else if (food.type === 'invincibility') {
            this.snake.isInvincible = true;
            this.powerUpTimer = 5;
            window.audio.playSound('eat_special');
        } else if (food.type === 'bonus') {
            points = 50;
            window.audio.playSound('eat_special');
        }

        // Combo system
        this.combo++;
        this.comboTimer = 3.0; // 3 seconds to chain

        if (this.combo > 1) {
            const comboEl = document.getElementById('combo-display');
            comboEl.classList.remove('hidden');
            document.getElementById('combo-multiplier').innerText = this.combo;

            // Retrigger animation
            comboEl.style.animation = 'none';
            comboEl.offsetHeight; /* trigger reflow */
            comboEl.style.animation = null;
        }

        this.score += points * this.combo;

        // Increase base difficulty slightly
        this.baseMoveInterval = Math.max(0.05, this.baseMoveInterval - 0.002);
        if (this.powerUpTimer <= 0) {
            this.moveInterval = this.baseMoveInterval;
        }

        this.updateHUD();
        this.food.spawn();
    }

    updateHUD() {
        document.getElementById('score').innerText = this.score;
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        // Combo timer
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 0;
                document.getElementById('combo-display').classList.add('hidden');
            }
        }

        // Powerup timer
        if (this.powerUpTimer > 0) {
            this.powerUpTimer -= dt;
            if (this.powerUpTimer <= 0) {
                this.snake.isInvincible = false;
                this.moveInterval = this.baseMoveInterval;
            }
        }

        this.moveTimer += dt;

        // Visual interpolation update
        this.snake.updateVisuals(dt, this.moveTimer / this.moveInterval);

        // Logical step update
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            const direction = window.input.update();
            const alive = this.snake.update(direction);

            if (!alive) {
                this.gameOver();
            }
        }
    }

    draw() {
        if (this.state === 'MENU') return;

        if (this.food) this.food.draw(this.ctx);
        if (this.snake) this.snake.draw(this.ctx);
    }
}
