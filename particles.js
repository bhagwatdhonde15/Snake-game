class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
        this.confetti = [];
    }

    emit(x, y, color, count = 10, speed = 100) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * speed + speed / 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1.0,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    emitConfetti(width, height) {
        for (let i = 0; i < 100; i++) {
            this.confetti.push({
                x: Math.random() * width,
                y: -10 - Math.random() * height,
                vx: (Math.random() - 0.5) * 50,
                vy: Math.random() * 150 + 50,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rs: (Math.random() - 0.5) * 10
            });
        }
    }

    update(dt) {
        // Update regular particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * 2; // Fade out speed
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update confetti
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            let c = this.confetti[i];
            c.x += c.vx * dt;
            c.y += c.vy * dt;
            c.rotation += c.rs;
            if (c.y > window.innerHeight) {
                this.confetti.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.save();

        // Draw particles
        for (let p of this.particles) {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw confetti
        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 0;
        for (let c of this.confetti) {
            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate(c.rotation * Math.PI / 180);
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    clear() {
        this.particles = [];
        this.confetti = [];
    }
}
