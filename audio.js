class AudioSystem {
    constructor() {
        this.audioCtx = null;
        this.initialized = false;
        this.masterGain = null;
    }

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.3; // Adjust volume
        this.masterGain.connect(this.audioCtx.destination);
        this.initialized = true;
    }

    playSound(type) {
        if (!this.initialized || !this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        const now = this.audioCtx.currentTime;

        switch (type) {
            case 'start':
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gainNode.gain.setValueAtTime(1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'eat':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gainNode.gain.setValueAtTime(1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'eat_special':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
                osc.frequency.linearRampToValueAtTime(1600, now + 0.2);
                gainNode.gain.setValueAtTime(1, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'die':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
                gainNode.gain.setValueAtTime(1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'blip':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                gainNode.gain.setValueAtTime(0.5, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
        }
    }
}
