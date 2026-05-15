class Snake {
    constructor(game) {
        this.game = game;
        this.gridSize = game.gridSize;
        this.body = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        // For smooth animation
        this.visualBody = this.body.map(seg => ({ x: seg.x * this.gridSize, y: seg.y * this.gridSize }));
        this.color = '#00ffcc';
        this.isInvincible = false;
    }

    update(direction) {
        const head = { ...this.body[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Wall collision
        const cols = Math.floor(this.game.width / this.gridSize);
        const rows = Math.floor(this.game.height / this.gridSize);

        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            if (this.isInvincible) {
                // Wrap around if invincible
                if (head.x < 0) head.x = cols - 1;
                if (head.x >= cols) head.x = 0;
                if (head.y < 0) head.y = rows - 1;
                if (head.y >= rows) head.y = 0;
            } else {
                return false; // Die
            }
        }

        // Self collision
        for (let i = 0; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                if (!this.isInvincible) {
                    return false; // Die
                }
            }
        }

        this.body.unshift(head);

        // Check food collision
        if (head.x === this.game.food.pos.x && head.y === this.game.food.pos.y) {
            this.game.onEatFood(this.game.food);
            // Don't pop tail if we ate
        } else {
            this.body.pop();
        }

        return true; // Alive
    }

    updateVisuals(dt, moveProgress) {
        // Interpolate visual positions towards logical positions for smoothness
        for (let i = 0; i < this.body.length; i++) {
            const targetX = this.body[i].x * this.gridSize;
            const targetY = this.body[i].y * this.gridSize;

            if (i >= this.visualBody.length) {
                this.visualBody.push({ x: targetX, y: targetY });
            } else {
                // Smooth interpolation (lerp)
                this.visualBody[i].x += (targetX - this.visualBody[i].x) * (dt * 15);
                this.visualBody[i].y += (targetY - this.visualBody[i].y) * (dt * 15);
            }
        }

        // Remove extra visual segments
        while (this.visualBody.length > this.body.length) {
            this.visualBody.pop();
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.isInvincible ? '#9900ff' : this.color;
        ctx.lineWidth = this.gridSize * 0.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw body connections
        if (this.visualBody.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.visualBody[0].x + this.gridSize / 2, this.visualBody[0].y + this.gridSize / 2);
            for (let i = 1; i < this.visualBody.length; i++) {
                // Don't draw lines across the screen if wrapped around
                const dx = Math.abs(this.visualBody[i].x - this.visualBody[i - 1].x);
                const dy = Math.abs(this.visualBody[i].y - this.visualBody[i - 1].y);
                if (dx > this.gridSize * 2 || dy > this.gridSize * 2) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.visualBody[i].x + this.gridSize / 2, this.visualBody[i].y + this.gridSize / 2);
                } else {
                    ctx.lineTo(this.visualBody[i].x + this.gridSize / 2, this.visualBody[i].y + this.gridSize / 2);
                }
            }

            // Gradient based on invincibility
            if (this.isInvincible) {
                ctx.strokeStyle = '#9900ff';
            } else {
                let gradient = ctx.createLinearGradient(
                    this.visualBody[0].x, this.visualBody[0].y,
                    this.visualBody[this.visualBody.length - 1].x, this.visualBody[this.visualBody.length - 1].y
                );
                gradient.addColorStop(0, '#00ffff');
                gradient.addColorStop(1, '#0055ff');
                ctx.strokeStyle = gradient;
            }

            ctx.stroke();
        }

        // Draw head
        if (this.visualBody.length > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.visualBody[0].x + this.gridSize / 2, this.visualBody[0].y + this.gridSize / 2, this.gridSize * 0.45, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
