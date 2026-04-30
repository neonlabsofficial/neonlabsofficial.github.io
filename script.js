/**
 * Neon Labs - Interactive Media Player
 */

// 1. Data & State
const images = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png"];
let index = 0;

// Persistent Storage
let likes = JSON.parse(localStorage.getItem("likes")) || new Array(images.length).fill(0);
let likedState = JSON.parse(localStorage.getItem("liked")) || new Array(images.length).fill(false);

// Selectors
const mainImage = document.getElementById("mainImage");
const heartIcon = document.getElementById("heartIcon");
const heartCount = document.getElementById("heartCount");
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");

/**
 * 2. Image Gallery Logic
 */
function showImage() {
    // Apply fade effect
    mainImage.classList.add("fade-out");

    setTimeout(() => {
        mainImage.src = images[index];
        updateHeartUI();
        mainImage.classList.remove("fade-out");
    }, 150);
}

function nextImage() {
    index = (index + 1) % images.length;
    showImage();
}

// Auto-advance slideshow
let slideInterval = setInterval(nextImage, 4000);

/**
 * 3. Like System
 */
function likeImage() {
    likedState[index] = !likedState[index];
    likes[index] = likedState[index] ? likes[index] + 1 : likes[index] - 1;

    // Save to LocalStorage
    localStorage.setItem("likes", JSON.stringify(likes));
    localStorage.setItem("liked", JSON.stringify(likedState));

    updateHeartUI();
}

function updateHeartUI() {
    heartCount.textContent = likes[index];
    
    if (likedState[index]) {
        heartIcon.textContent = "♥";
        heartIcon.classList.add("liked");
    } else {
        heartIcon.textContent = "♡";
        heartIcon.classList.remove("liked");
    }
}

/**
 * 4. Music Player Logic
 */
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
}

function downloadTrack() {
    const link = document.createElement("a");
    link.href = "dream.exe.mp3";
    link.download = "dream.exe.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 5. Navigation Logic
 */
function nextGroup() {
    // Instead of destroying the body, we'll use a cleaner redirect or overlay
    // For now, let's keep your "Coming Soon" logic but make it a bit cleaner
    const overlay = document.createElement("div");
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:black; color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999;";
    overlay.innerHTML = `
        <h1 style="font-size:60px; font-family:sans-serif;">Coming Soon</h1>
        <button onclick="location.reload()" style="background:none; border:1px solid white; color:white; padding:10px 20px; cursor:pointer;">Go Back</button>
    `;
    document.body.appendChild(overlay);
}

function goBack() {
    location.reload();
}

// Initial UI Load
updateHeartUI();
