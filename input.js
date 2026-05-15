class InputSystem {
    constructor() {
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.setupKeyboard();
        this.setupTouch();
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
                    break;
                case 'Escape':
                case 'p':
                case 'P':
                    if (window.game) window.game.togglePause();
                    break;
            }
        });
    }

    setupTouch() {
        const container = document.getElementById('game-container');

        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(this.touchStartX, this.touchStartY, touchEndX, touchEndY);
        }, { passive: true });

        // Optional D-pad controls for mobile
        const dirBtns = document.querySelectorAll('.dir-btn');
        dirBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dir = e.target.getAttribute('data-dir');
                switch (dir) {
                    case 'UP': if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 }; break;
                    case 'DOWN': if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 }; break;
                    case 'LEFT': if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 }; break;
                    case 'RIGHT': if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 }; break;
                }
            });
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const threshold = 30; // minimum swipe distance

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && this.direction.x !== -1) {
                    this.nextDirection = { x: 1, y: 0 }; // Right
                } else if (diffX < 0 && this.direction.x !== 1) {
                    this.nextDirection = { x: -1, y: 0 }; // Left
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0 && this.direction.y !== -1) {
                    this.nextDirection = { x: 0, y: 1 }; // Down
                } else if (diffY < 0 && this.direction.y !== 1) {
                    this.nextDirection = { x: 0, y: -1 }; // Up
                }
            }
        }
    }

    update() {
        this.direction = { ...this.nextDirection };
        return this.direction;
    }

    reset() {
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
    }
}
