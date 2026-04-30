const audio = document.getElementById("audio");
const visualizer = document.getElementById("visualizer");
const mainImage = document.getElementById("mainImage");

const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let index = 0;

// FIXED DATA
const manualStartingPoints = {
    "img1.png": 1142, "img2.png": 1085, "img3.png": 1197, 
    "img4.png": 1023, "img5.png": 1115, "song_dream.exe": 1168
};

function getLikes(key, start) {
    const s = localStorage.getItem(key);
    return s ? parseInt(s) : (localStorage.setItem(key, start), start);
}

function hasLiked(id) { return localStorage.getItem(`voted_${id}`) === "true"; }

// LIKES LOGIC
function likeImage() {
    const img = images[index];
    if (hasLiked(img)) return;
    let count = getLikes(`like_img_${img}`, manualStartingPoints[img]) + 1;
    localStorage.setItem(`like_img_${img}`, count);
    localStorage.setItem(`voted_${img}`, "true");
    updateUI();
}

function likeSong(id) {
    if (hasLiked(id)) return;
    let count = getLikes(`like_song_${id}`, manualStartingPoints[`song_${id}`]) + 1;
    localStorage.setItem(`like_song_${id}`, count);
    localStorage.setItem(`voted_${id}`, "true");
    document.getElementById(`count-${id}`).textContent = count.toLocaleString();
    document.getElementById(`heart-${id}`).className = "fas fa-heart liked";
}

function updateUI() {
    const img = images[index];
    const count = getLikes(`like_img_${img}`, manualStartingPoints[img]);
    document.getElementById("imageHeartCount").textContent = count.toLocaleString();
    document.getElementById("imageHeartIcon").innerHTML = hasLiked(img) ? '<i class="fas fa-heart liked"></i>' : '<i class="far fa-heart"></i>';
}

// VISUALIZER (HIGH SENSITIVITY)
const barCount = 50;
for(let i=0; i<barCount; i++) visualizer.appendChild(document.createElement("span"));
const bars = visualizer.querySelectorAll("span");

let context, analyser, src, array;
function togglePlay() {
    if (!context) {
        context = new AudioContext();
        analyser = context.createAnalyser();
        src = context.createMediaElementSource(audio);
        src.connect(analyser);
        analyser.connect(context.destination);
        array = new Uint8Array(analyser.frequencyBinCount);
        loop();
    }
    if (audio.paused) { audio.play(); document.getElementById("playBtn").textContent = "⏸"; }
    else { audio.pause(); document.getElementById("playBtn").textContent = "▶"; }
}

function loop() {
    requestAnimationFrame(loop);
    analyser.getByteFrequencyData(array);
    bars.forEach((b, i) => {
        let h = Math.pow(array[i]/255, 1.2) * 80;
        b.style.height = `${Math.max(3, h)}px`;
    });
}

// DOWNLOAD
async function downloadTrack() {
    const res = await fetch(audio.src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dream_exe.mp3";
    a.click();
}

// SLIDESHOW
setInterval(() => {
    index = (index + 1) % images.length;
    mainImage.style.opacity = 0;
    setTimeout(() => {
        mainImage.src = images[index];
        document.getElementById("playerTrackThumb").src = images[index];
        updateUI();
        mainImage.style.opacity = 1;
    }, 400);
}, 5000);

window.onload = () => {
    updateUI();
    document.getElementById("count-dream.exe").textContent = getLikes("like_song_dream.exe", 1168).toLocaleString();
};
