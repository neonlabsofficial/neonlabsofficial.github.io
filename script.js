let images = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png"
];

let index = 0;

function showImage() {
    document.getElementById("mainImage").src = images[index];
}

function nextImage() {
    index++;
    if (index > 4) index = 0;
    showImage();
}

function prevImage() {
    index--;
    if (index < 0) index = 4;
    showImage();
}

// Auto change every 4 seconds
setInterval(nextImage, 4000);

// Like toggle
function likeImage() {
    let heart = document.querySelector(".heart");
    heart.textContent = heart.textContent === "♡" ? "♥" : "♡";
}
