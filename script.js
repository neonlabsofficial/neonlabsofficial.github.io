const audio = document.getElementById("audio");
const visualizer = document.getElementById("visualizer");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const mainImage = document.getElementById("mainImage");

const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let index = 0;

// MANUAL CHOSEN NUMBERS
const manualStartingPoints = {
    "img1.png": 1142, "img2.png": 1085, "img3.png": 1197, 
    "img4.png": 1023, "img5.png": 1115, "song_dream.exe": 1168
};

// STORAGE LOGIC
function getPersistentLikes(key, manualStart) {
    const saved = localStorage.getItem(key);
    if (saved !== null) return parseInt(saved);
    localStorage.setItem(key, manualStart);
    return manualStart;
}

const imageLikes = {};
images.forEach(img => { imageLikes[img] = getPersistentLikes(`like_img_${img}`, manualStartingPoints[img]); });
const songLikes = { "dream.exe": getPersistentLikes("like_song_dream.exe", manualStartingPoints["song_dream.exe"]) };

// LIKES UI
function likeImage() {
    const currentImg = images[index];
    imageLikes[currentImg]++;
    localStorage.setItem(`like_img_${currentImg}`, imageLikes[currentImg]);
    updateImageHeartUI();
}

function likeSong(title) {
    if (songLikes[title] !== undefined) {
        songLikes[title]++;
        localStorage.setItem(`like_song_${title}`, songLikes[title]);
        document.getElementById(`count-${title}`).textContent = songLikes[title].toLocaleString();
        document.getElementById(`heart-${title}`).classList.add('fas', 'liked');
    }
}

function updateImageHeartUI() {
    const currentImg = images[index];
    document.getElementById("imageHeartCount").textContent = imageLikes[currentImg].toLocaleString();
    const icon = document.querySelector("#imageHeartIcon i");
    icon.classList.add('fas', 'liked');
}

// WAVEFORM GENERATION
const barCount = 50;
for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("span");
    visualizer.appendChild(bar);
}
const bars = visualizer.querySelectorAll("span");

// VISUALIZER SAFETY LOGIC
let audioCtx, analyser, dataArray;
function initVisualizer() {
    try {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        renderFrame();
    } catch(e) { console.warn("Visualizer failed to start - non-critical error."); }
}

function renderFrame() {
    requestAnimationFrame(renderFrame);
    if (!audio.paused && analyser) {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < barCount; i++) {
            const h = (dataArray[i] / 255) * 40;
            bars[i].style.height = `${Math.max(2, h)}px`;
        }
    } else {
        bars.forEach(b => b.style.height = "2px");
    }
}

// CORE FUNCTIONS
window.onload = () => {
    updateImageHeartUI();
    const songCountEl = document.getElementById("count-dream.exe");
    if (songCountEl) songCountEl.textContent = songLikes["dream.exe"].toLocaleString();
};

function togglePlay() {
    if (audio.paused) {
        initVisualizer();
        audio.play().catch(e => console.log("Click play again to start audio context"));
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}

progressTrack.addEventListener("click", (e) => {
    if (audio.duration) audio.currentTime = (e.offsetX / progressTrack.clientWidth) * audio.duration;
});

function format(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
}

audio.addEventListener('timeupdate', () => {
    document.getElementById("currentTime").textContent = format(audio.currentTime);
    progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
});

audio.addEventListener('loadedmetadata', () => {
    const t = format(audio.duration);
    document.getElementById("totalTime").textContent = t;
    document.getElementById("playlistDuration").textContent = t;
});

setInterval(() => {
    index = (index + 1) % images.length;
    mainImage.classList.add("fade-out");
    setTimeout(() => {
        mainImage.src = images[index];
        document.getElementById("playerTrackThumb").src = images[index];
        updateImageHeartUI(); 
        mainImage.classList.remove("fade-out");
    }, 400);
}, 5000);

function goBack() { location.reload(); }
function nextGroup() { alert("Coming Soon!"); }
function downloadTrack() {
    const a = document.createElement("a");
    a.href = audio.src;
    a.download = "dream_exe.mp3";
    a.click();
}
