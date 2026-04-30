/**
 * Neon Labs - Interactive Media Player Widget
 */

// --- STATE MANAGEMENT ---
const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let currentIndex = 0;

// Like system state (Persistent)
let likes = JSON.parse(localStorage.getItem("likes")) || new Array(images.length).fill(0);
let likedState = JSON.parse(localStorage.getItem("liked")) || new Array(images.length).fill(false);

// --- SELECTORS ---
// Page-level elements
const mainImage = document.getElementById("mainImage");
const heartIcon = document.getElementById("heartIcon");
const heartCount = document.getElementById("heartCount");

// Player Widget elements
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const playerThumb = document.getElementById("playerTrackThumb"); // Smaller thumbnail

// Playlist logic would go here, currently hardcoded for display

// --- CORE FUNCTIONS ---

// 1. Image Slideshow / Update View
function updateView() {
    // 1. Update the large background image (Retained functionality)
    mainImage.classList.add("fade-out");
    setTimeout(() => {
        mainImage.src = images[currentIndex];
        mainImage.classList.remove("fade-out");
    }, 150);

    // 2. Update the small image thumbnail in the player widget (New detail)
    playerThumb.src = images[currentIndex];

    // 3. Update the Like UI for the current image
    updateHeartUI();
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateView();
}
// Auto-advance slideshow (Original functionality)
let slideInterval = setInterval(nextImage, 4000);

// 2. Like System (Persistent)
function likeImage() {
    likedState[currentIndex] = !likedState[currentIndex];
    likes[currentIndex] = likedState[currentIndex] ? likes[currentIndex] + 1 : likes[currentIndex] - 1;

    // Save to LocalStorage
    localStorage.setItem("likes", JSON.stringify(likes));
    localStorage.setItem("liked", JSON.stringify(likedState));

    updateHeartUI();
}

function updateHeartUI() {
    heartCount.textContent = likes[currentIndex];
    if (likedState[currentIndex]) {
        heartIcon.textContent = "♥";
        heartIcon.classList.add("liked");
    } else {
        heartIcon.textContent = "♡";
        heartIcon.classList.remove("liked");
    }
}

// 3. Navigation System (Retained functionality)
function nextGroup() {
    // Smoother "Coming Soon" approach
    const overlay = document.createElement("div");
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:black; color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999; font-family:sans-serif;";
    overlay.innerHTML = `
        <h1 style="font-size:60px; text-transform:uppercase; color:#ff00ff; text-shadow:0 0 15px #ff00ff;">Coming Soon</h1>
        <p style="margin:20px 0 40px; color:rgba(255,255,255,0.6);">Stay tuned for the next Neon Labs release.</p>
        <button onclick="location.reload()" style="background:none; border:2.5px solid #ff00ff; color:#ff00ff; text-transform:uppercase; font-weight:bold; padding:15px 30px; border-radius:10px; cursor:pointer; font-size:16px;">Back to Player</button>
    `;
    document.body.appendChild(overlay);
}
function goBack() { location.reload(); }

// 4. Audio Playback (Detailed with Time Tracking)
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸"; // Change to Pause
    } else {
        audio.pause();
        playBtn.textContent = "▶"; // Change back to Play
    }
}

// Utility: Format seconds to M:SS (e.g., 83s -> 1:23)
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = `0${sec}`; // Add leading zero
    return `${min}:${sec}`;
}

// Update time display and progress bar as the music plays
audio.addEventListener('timeupdate', () => {
    // 1. Update text displays (e.g., 1:23)
    if (!isNaN(audio.currentTime)) {
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
    // Update total time only once it's known
    if (!isNaN(audio.duration)) {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }

    // 2. Update progress bar (Retained functionality)
    if (audio.duration) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percentage + '%';
    }
});

// Reset UI when audio finishes
audio.addEventListener('ended', () => {
    playBtn.textContent = "▶";
    progressBar.style.width = '0%';
    currentTimeDisplay.textContent = formatTime(0);
});

// 5. Download Track (Retained safety download)
function downloadTrack() {
    const link = document.createElement("a");
    link.href = audio.src;
    link.download = audio.src.split('/').pop() || 'NeonLabs_dream_exe.mp3'; // Attempt a dynamic filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- INITIALIZATION ---
// Ensure UI is accurate for the first image
updateView(); 
// Try to populate total duration text early (if metadata loads fast)
audio.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audio.duration);
});
