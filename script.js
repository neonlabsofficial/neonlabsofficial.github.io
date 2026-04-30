const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const mainImage = document.getElementById("mainImage");
const playerThumb = document.getElementById("playerTrackThumb");

const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let index = 0;

// 1. CLICK-TO-SKIP LOGIC
progressTrack.addEventListener("click", (e) => {
    if (audio.duration) {
        const trackWidth = progressTrack.clientWidth;
        const clickX = e.offsetX;
        const durationRatio = clickX / trackWidth;
        audio.currentTime = durationRatio * audio.duration;
    }
});

// 2. PLAY / PAUSE
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}

// 3. TIME FORMATTING (0:00)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
}

// 4. SYNC PROGRESS & TEXT
audio.addEventListener('timeupdate', () => {
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    if (audio.duration) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percentage + '%';
    }
});

audio.addEventListener('loadedmetadata', () => {
    const total = formatTime(audio.duration);
    totalTimeDisplay.textContent = total;
    document.getElementById("playlistDuration").textContent = total;
});

// 5. SLIDESHOW LOGIC
function showImage() {
    mainImage.classList.add("fade-out");
    setTimeout(() => {
        mainImage.src = images[index];
        playerThumb.src = images[index];
        mainImage.classList.remove("fade-out");
    }, 150);
}

setInterval(() => {
    index = (index + 1) % images.length;
    showImage();
}, 4000);

// Placeholder navigation
function nextGroup() { console.log("Next group triggered"); }
function goBack() { location.reload(); }

function downloadTrack() {
    const link = document.createElement("a");
    link.href = audio.src;
    link.download = "dream_exe.mp3";
    link.click();
}
