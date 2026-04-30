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
    document.getElementById("mainImage").src = images[index];
    updateHeartUI();
}

function nextImage() {
    index = (index + 1) % images.length;
    showImage();
}

// Auto slideshow
setInterval(nextImage, 4000);

// LIKE SYSTEM
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

// TEMP NEXT GROUP
function nextGroup() {
    document.body.innerHTML = "<h1 style='color:white; margin-top:40vh;'>Coming Soon</h1>";
}

// INIT
showImage();
