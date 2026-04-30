let images = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png"
];

let index = 0;

// Load saved likes
let likes = JSON.parse(localStorage.getItem("likes")) || [0,0,0,0,0];
let likedState = JSON.parse(localStorage.getItem("liked")) || [false,false,false,false,false];

function showImage() {
    const img = document.getElementById("mainImage");

    img.classList.add("fade");

    setTimeout(() => {
        img.src = images[index];
        img.classList.remove("fade");
        updateHeartUI();
    }, 150);
}

function nextImage() {
    const img = document.getElementById("mainImage");

    img.classList.add("fade");

    setTimeout(() => {
        index = (index + 1) % images.length;
        showImage();
    }, 150);
}

setInterval(nextImage, 4000);

// ❤️ LIKE SYSTEM
function likeImage() {
    if (!likedState[index]) {
        likes[index]++;
        likedState[index] = true;
    } else {
        likes[index]--;
        likedState[index] = false;
    }

    localStorage.setItem("likes", JSON.stringify(likes));
    localStorage.setItem("liked", JSON.stringify(likedState));

    updateHeartUI();
}

function updateHeartUI() {
    let heart = document.getElementById("heartIcon");
    let count = document.getElementById("heartCount");

    count.textContent = likes[index];

    if (likedState[index]) {
        heart.textContent = "♥";
        heart.classList.add("liked");
    } else {
        heart.textContent = "♡";
        heart.classList.remove("liked");
    }
}

// 👉 RIGHT ARROW
function nextGroup() {
    document.body.innerHTML = `
        <button class="nav-arrow left" onclick="goBack()">❮</button>

        <div style="background:black; color:white; height:100vh; display:flex; justify-content:center; align-items:center;">
            <h1 style="font-size:60px;">Coming Soon</h1>
        </div>
    `;
}

// 👉 LEFT ARROW
function goBack() {
    location.reload();
}

// INIT
showImage();
