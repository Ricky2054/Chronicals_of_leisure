// Debug system for Chronicle of the Ledger
class DebugLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 50;
        this.debugElement = document.getElementById('debugLogs');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message,
            type
        };
        
        this.logs.push(logEntry);
        
        // Keep only the last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        this.updateDisplay();
        console.log(`[${timestamp}] ${message}`);
    }

    error(message) {
        this.log(message, 'error');
        console.error(message);
    }

    warning(message) {
        this.log(message, 'warning');
        console.warn(message);
    }

    updateDisplay() {
        if (!this.debugElement) return;
        
        this.debugElement.innerHTML = '';
        
        this.logs.slice(-10).forEach(log => {
            const logDiv = document.createElement('div');
            logDiv.className = `debug-${log.type}`;
            logDiv.textContent = `[${log.timestamp}] ${log.message}`;
            this.debugElement.appendChild(logDiv);
        });
    }

    clear() {
        this.logs = [];
        this.updateDisplay();
    }
}

// Global debug instance
window.debug = new DebugLogger();

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.frameTime = 0;
    }

    update(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        this.frameTime = currentTime - this.lastTime;
    }

    getStats() {
        return {
            fps: this.fps,
            frameTime: this.frameTime
        };
    }
}

window.performanceMonitor = new PerformanceMonitor();
