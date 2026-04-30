const audio = document.getElementById("audio");
const visualizerContainer = document.getElementById("visualizer");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const mainImage = document.getElementById("mainImage");

const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let index = 0;

// 1. GENERATE WAVEFORM BARS
const barCount = 60;
for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("span");
    visualizerContainer.appendChild(bar);
}
const bars = visualizerContainer.querySelectorAll("span");

// 2. AUDIO VISUALIZER SYNC
let audioCtx;
let analyser;
let dataArray;

function setupVisualizer() {
    if (audioCtx) return; // Only setup once

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    draw();
}

function draw() {
    requestAnimationFrame(draw);
    if (!audio.paused) {
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < barCount; i++) {
            // Map frequency data to bar height
            const barHeight = (dataArray[i] / 255) * 50; 
            bars[i].style.height = `${Math.max(2, barHeight)}px`;
        }
    } else {
        // Subtle "idle" movement when paused
        bars.forEach(bar => bar.style.height = "4px");
    }
}

// 3. PLAYBACK CONTROLS
function togglePlay() {
    if (audio.paused) {
        if (!audioCtx) setupVisualizer(); // Initialize context on first click
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}

// 4. CLICK-TO-SKIP
progressTrack.addEventListener("click", (e) => {
    if (audio.duration) {
        const ratio = e.offsetX / progressTrack.clientWidth;
        audio.currentTime = ratio * audio.duration;
    }
});

// 5. TIME UPDATES
function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

audio.addEventListener('timeupdate', () => {
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
});

audio.addEventListener('loadedmetadata', () => {
    const time = formatTime(audio.duration);
    totalTimeDisplay.textContent = time;
    document.getElementById("playlistDuration").textContent = time;
});

// 6. SLIDESHOW
function showImage() {
    mainImage.classList.add("fade-out");
    setTimeout(() => {
        mainImage.src = images[index];
        document.getElementById("playerTrackThumb").src = images[index];
        mainImage.classList.remove("fade-out");
    }, 400);
}

setInterval(() => {
    index = (index + 1) % images.length;
    showImage();
}, 5000);

// Basic Navigation
function goBack() { location.reload(); }
function nextGroup() { console.log("Coming soon overlay triggered"); }
function downloadTrack() {
    const a = document.createElement("a");
    a.href = audio.src;
    a.download = "dream_exe.mp3";
    a.click();
}
