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

var changedRecently = false;

window.addEventListener("scroll", (event) => {
    const logo = document.querySelector('#horizontalLogo');
    let scroll = document.documentElement.scrollTop;
    if(changedRecently) return;
    if(scroll == 0) {
        const expectedWidth = (document.body.clientWidth - 20 > 604 ? 604 : document.body.clientWidth - 20);
        if(logo.height != 39/151*expectedWidth) {
            logo.width = 604;
            logo.height = 39/151*expectedWidth;
            console.log(expectedWidth)
            changedRecently = true;
            setTimeout(() => {
                changedRecently = false;
                if(document.documentElement.scrollTop < 20) window.scrollTo(0, 0);
            }, 300);
        }
    } else {
        if(logo.height != 50) {
            logo.height = 50;
            logo.width = 151/39*50;
            changedRecently = true;
            setTimeout(() => {
                changedRecently = false;
                if(document.documentElement.scrollTop < 10) window.scroll(0, 10);
            }, 300);
        }
    }
});

const logo = document.querySelector('#horizontalLogo');
logo.height = 39/151*logo.clientWidth;