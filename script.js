const audio = document.getElementById("audio");
const visualizer = document.getElementById("visualizer");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const mainImage = document.getElementById("mainImage");

const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let index = 0;

// WAVEFORM GENERATION
const barCount = 50;
for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("span");
    visualizer.appendChild(bar);
}
const bars = visualizer.querySelectorAll("span");

// VISUALIZER SYNC LOGIC
let audioCtx, analyser, dataArray;

function initVisualizer() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    renderFrame();
}

function renderFrame() {
    requestAnimationFrame(renderFrame);
    if (!audio.paused) {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < barCount; i++) {
            const h = (dataArray[i] / 255) * 40;
            bars[i].style.height = `${Math.max(2, h)}px`;
        }
    } else {
        bars.forEach(b => b.style.height = "2px");
    }
}

// CONTROLS
function togglePlay() {
    if (audio.paused) {
        initVisualizer();
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}

progressTrack.addEventListener("click", (e) => {
    if (audio.duration) {
        audio.currentTime = (e.offsetX / progressTrack.clientWidth) * audio.duration;
    }
});

// TIME SYNC
function format(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
}

audio.addEventListener('timeupdate', () => {
    currentTimeDisplay.textContent = format(audio.currentTime);
    progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
});

audio.addEventListener('loadedmetadata', () => {
    const t = format(audio.duration);
    totalTimeDisplay.textContent = t;
    document.getElementById("playlistDuration").textContent = t;
});

// SLIDESHOW
function updateGallery() {
    mainImage.classList.add("fade-out");
    setTimeout(() => {
        mainImage.src = images[index];
        document.getElementById("playerTrackThumb").src = images[index];
        mainImage.classList.remove("fade-out");
    }, 400);
}

setInterval(() => {
    index = (index + 1) % images.length;
    updateGallery();
}, 5000);

// NAV & LIKES
function likeImage() { /* Add like logic here if needed */ }
function goBack() { location.reload(); }
function nextGroup() { console.log("Coming Soon"); }
function downloadTrack() {
    const a = document.createElement("a");
    a.href = audio.src;
    a.download = "dream_exe.mp3";
    a.click();
}
