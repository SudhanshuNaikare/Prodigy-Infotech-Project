class Stopwatch {
    constructor() {
        this.display = document.querySelector('.time-display');
        this.lapTimesContainer = document.querySelector('.lap-times');
        this.startBtn = document.getElementById('start');
        this.pauseBtn = document.getElementById('pause');
        this.resetBtn = document.getElementById('reset');
        this.lapBtn = document.getElementById('lap');

        this.startTime = 0;
        this.elapsedTime = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.lapCount = 0;
        this.lastLapTime = 0;

        this.initialize();
    }

    initialize() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.lap());

        this.updateDisplay();
    }

    formatTime(ms) {
        const date = new Date(ms);
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }

    updateDisplay() {
        this.display.textContent = this.formatTime(this.elapsedTime);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.intervalId = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }, 10);
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'block';
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.startBtn.style.display = 'block';
            this.pauseBtn.style.display = 'none';
        }
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.lastLapTime = 0;
        this.lapCount = 0;
        this.updateDisplay();
        this.lapTimesContainer.innerHTML = '';
    }

    lap() {
        if (this.isRunning) {
            this.lapCount++;
            const currentLapTime = this.elapsedTime - this.lastLapTime;
            this.lastLapTime = this.elapsedTime;

            const lapElement = document.createElement('div');
            lapElement.className = 'lap-time';
            lapElement.innerHTML = `
                <span>Lap ${this.lapCount}</span>
                <span>${this.formatTime(currentLapTime)}</span>
            `;

            this.lapTimesContainer.insertBefore(lapElement, this.lapTimesContainer.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
}); 