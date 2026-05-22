const hrsEl = document.getElementById("hrs");
const minsEl = document.getElementById("mins");
const secsEl = document.getElementById("secs");
const msEl = document.getElementById("ms");
const startStopBtn = document.getElementById("start-stop-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const lapsList = document.getElementById("laps-list");
const clearLapsBtn = document.getElementById("clear-laps-btn");
const progressCircle = document.getElementById("progress-circle");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let laps = [];

// Format time utility
function formatTime(timeInMs) {
    const hrs = Math.floor(timeInMs / 3600000);
    const mins = Math.floor((timeInMs % 3600000) / 60000);
    const secs = Math.floor((timeInMs % 60000) / 1000);
    const ms = Math.floor((timeInMs % 1000) / 10);

    return {
        hrs: String(hrs).padStart(2, '0'),
        mins: String(mins).padStart(2, '0'),
        secs: String(secs).padStart(2, '0'),
        ms: String(ms).padStart(2, '0')
    };
}

function formatTimeString(timeInMs) {
    const t = formatTime(timeInMs);
    return `${t.hrs}:${t.mins}:${t.secs}.${t.ms}`;
}

function formatDiff(diffInMs) {
    const sign = diffInMs >= 0 ? "+" : "-";
    const absDiff = Math.abs(diffInMs);
    const secs = Math.floor(absDiff / 1000);
    const ms = Math.floor((absDiff % 1000) / 10);
    return `${sign}${secs}.${String(ms).padStart(2, '0')}`;
}

function updateDisplay(time) {
    const formatted = formatTime(time);
    hrsEl.textContent = formatted.hrs;
    minsEl.textContent = formatted.mins;
    secsEl.textContent = formatted.secs;
    msEl.textContent = `.${formatted.ms}`;

    // Update Circle Progress (1 minute cycle = 60000ms)
    const cycleProgress = (time % 60000) / 60000;
    const dashOffset = 283 - (283 * cycleProgress); // 283 is circle circumference
    progressCircle.style.strokeDashoffset = dashOffset;
}

function startStopTimer() {
    if (isRunning) {
        // Stop
        clearInterval(timerInterval);
        isRunning = false;
        startStopBtn.textContent = "Start";
        startStopBtn.classList.remove("stop");
        lapBtn.disabled = true;
        progressCircle.style.stroke = "var(--primary)";
    } else {
        // Start
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay(elapsedTime);
        }, 10); // Update every 10ms for smooth UI
        isRunning = true;
        startStopBtn.textContent = "Stop";
        startStopBtn.classList.add("stop");
        lapBtn.disabled = false;
        progressCircle.style.stroke = "var(--danger)";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    updateDisplay(elapsedTime);
    
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove("stop");
    lapBtn.disabled = true;
    progressCircle.style.stroke = "var(--primary)";
    progressCircle.style.strokeDashoffset = 283;
}

function recordLap() {
    if (!isRunning) return;

    const currentLapTime = elapsedTime;
    const prevLapTime = laps.length > 0 ? laps[0].time : 0;
    const splitTime = currentLapTime - prevLapTime;
    
    laps.unshift({
        index: laps.length + 1,
        time: currentLapTime,
        split: splitTime
    });

    renderLaps();
}

function renderLaps() {
    if (laps.length === 0) {
        lapsList.innerHTML = `<div class="empty-state">No laps recorded yet</div>`;
        clearLapsBtn.classList.add("hidden");
        return;
    }

    clearLapsBtn.classList.remove("hidden");
    lapsList.innerHTML = "";

    laps.forEach((lap, i) => {
        const el = document.createElement("div");
        el.className = "lap-item";
        
        // Calculate diff with previous lap in the list (which is chronologically the previous lap)
        // Since array is unshifted, lap[i] is current, lap[i+1] is previous
        let diffHtml = "";
        if (i < laps.length - 1) {
            const prevLapSplit = laps[i + 1].split;
            const currentSplit = lap.split;
            const diff = currentSplit - prevLapSplit;
            
            const diffClass = diff > 0 ? 'positive' : (diff < 0 ? 'negative' : '');
            diffHtml = `<div class="lap-diff ${diffClass}">${formatDiff(diff)}</div>`;
        } else {
            // First lap
            diffHtml = `<div class="lap-diff">--</div>`;
        }

        el.innerHTML = `
            <div class="lap-index">Lap ${lap.index}</div>
            <div class="lap-time">${formatTimeString(lap.time)}</div>
            ${diffHtml}
        `;
        lapsList.appendChild(el);
    });
}

function clearLaps() {
    laps = [];
    renderLaps();
}

startStopBtn.addEventListener("click", startStopTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
clearLapsBtn.addEventListener("click", clearLaps);

// Init Display
updateDisplay(0);
