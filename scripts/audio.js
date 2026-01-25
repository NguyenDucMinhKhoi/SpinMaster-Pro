// Audio Management Module
class AudioManager {
    constructor() {
        this.tickSound = null;
        this.applauseSound = null;
        this.tickInterval = null;
        this.isMuted = false;
    }

    init() {
        this.tickSound = document.getElementById('tickSound');
        this.applauseSound = document.getElementById('applauseSound');
    }

    playTickingSound() {
        if (this.isMuted) return;

        let speed = 50;
        let duration = 0;

        this.tickInterval = setInterval(() => {
            if (this.tickSound) {
                this.tickSound.currentTime = 0;
                this.tickSound.volume = 0.3;
                this.tickSound.play();
            }
            duration += speed;

            if (duration > 3500) {
                clearInterval(this.tickInterval);
                speed = 250;
                this.tickInterval = setInterval(() => {
                    if (this.tickSound) {
                        this.tickSound.currentTime = 0;
                        this.tickSound.volume = 0.3;
                        this.tickSound.play();
                    }
                }, speed);
            }
        }, speed);

        setTimeout(() => {
            this.stopTicking();
        }, 4900);
    }

    stopTicking() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }

    playApplause() {
        if (this.isMuted || !this.applauseSound) return;
        this.applauseSound.currentTime = 0;
        this.applauseSound.volume = 0.5;
        this.applauseSound.play();
    }

    stopApplause() {
        if (this.applauseSound) {
            this.applauseSound.pause();
            this.applauseSound.currentTime = 0;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

// Export
window.AudioManager = AudioManager;
