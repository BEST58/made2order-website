// Scroll Observer (for animations)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            if(!entry.target.classList.contains("show")) entry.target.classList.add("show")
        } else {
            if(entry.target.classList.contains("show")) entry.target.classList.remove("show")
        }
    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach(ele => observer.observe(ele));


window.addEventListener("resize", sizeVideos)

function sizeVideos() {
    // IFrame/Video auto height:
    const videos = document.querySelectorAll(".video")
    videos.forEach(ele => {
        ele.style.height = ele.clientWidth / 16 * 9 + "px"
    })
}

sizeVideos();