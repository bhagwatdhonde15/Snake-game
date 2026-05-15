class Food {
    constructor(game) {
        this.game = game;
        this.gridSize = game.gridSize;
        this.pos = { x: 0, y: 0 };
        this.type = 'normal'; // normal, speed, bonus, invincibility
        this.color = '#ff0055';
        this.spawn();
    }

    spawn() {
        const cols = Math.floor(this.game.width / this.gridSize);
        const rows = Math.floor(this.game.height / this.gridSize);

        let valid = false;
        while (!valid) {
            this.pos.x = Math.floor(Math.random() * cols);
            this.pos.y = Math.floor(Math.random() * rows);

            // Ensure food doesn't spawn on snake
            valid = true;
            for (let segment of this.game.snake.body) {
                if (segment.x === this.pos.x && segment.y === this.pos.y) {
                    valid = false;
                    break;
                }
            }
        }

        // Determine food type based on chance
        const rand = Math.random();
        if (rand < 0.05) {
            this.type = 'invincibility';
            this.color = '#9900ff'; // Purple
        } else if (rand < 0.15) {
            this.type = 'bonus';
            this.color = '#ffff00'; // Yellow
        } else if (rand < 0.25) {
            this.type = 'speed';
            this.color = '#00ffff'; // Cyan
        } else {
            this.type = 'normal';
            this.color = '#ff0055'; // Pinkish red
        }
    }

    draw(ctx) {
        const x = this.pos.x * this.gridSize;
        const y = this.pos.y * this.gridSize;
        const center = this.gridSize / 2;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        // Pulsing effect
        const pulse = Math.sin(performance.now() / 200) * 2;
        const size = (this.gridSize / 2) - 2 + pulse;

        ctx.beginPath();
        ctx.arc(x + center, y + center, Math.max(2, size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
