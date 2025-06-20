$(".titlebox > .titletext").on("click", () => scrollToTop());
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,ScrollSmoother,ScrollToPlugin);
});
ScrollSmoother.create({
  smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1 // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});
$(".backbox").on("click", () => {
    history.pushState(null, null, "./../index.html");
    location.reload();
});

jQuery(document).ready(function() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projectId = urlParams.get("project");
    var rootstyle = document.documentElement.style;
    
    const pagedata = fetchJSONData(projectId);
    pagedata.then(data => {
        
        if (data.data && data.IconJson) {
            document.title = data.data.project.name + " | Portfolio";

            SetCssProperties(data);

            SetTitle(data);

            SetBanner(data);

            SetBrieftext(data);

            SetBriefNotesAndLinks(data);

            SetMetrics(data);

            SetGallery(data);

            SetReviews(data);

            $('.reviewsdiv').slick({
                arrows: true,
                infinite: true,
                loop: true,
                speed: 1000,
                focusOnSelect: true,
                centerMode: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                variableWidth: true,
                prevArrow: '<button class="button hoverable button--previous" type="button">➜</button>',
                nextArrow: '<button class="button hoverable button--next" type="button">➜</button>',
            });

            var hoverables = document.querySelectorAll(".hoverable");
            for (let i = 0; i < hoverables.length; i++) {
                hoverables[i].addEventListener("mouseenter", (e) => {
                    $("#circle").css({ transform: "scale(2.5)" });
                });
                hoverables[i].addEventListener("mouseleave", (e) => {
                    $("#circle").css({ transform: "scale(1)" });
                });
            }
        }
        else{
            var hoverables = notfound(hoverables);
        }
    }).catch(error => {
            var hoverables = notfound(hoverables);
    });

    var mouseX = 0,
        mouseY = 0;
    var xp = 0,
        yp = 0;
    var circleSize = 24;

    var mailhoverable = document.querySelectorAll(".mailhoverable");
    // if mobile and width smaller than 768px, return
    // if hover is not supported, return
    if (window.matchMedia("(hover: none)").matches) return;
    $("#circle").fadeIn(1000);

    $(document).mousemove(function (e) {
        mouseX = e.pageX - 12;
        mouseY = e.pageY - 12;
    });

    if (mailhoverable[0]) {
        mailhoverable[0].addEventListener("mouseenter", (e) => {
            //add child text to circle
            const text = document.createElement("div");
            text.classList.add("circle-text");
            text.innerHTML = "Email me ->";
            text.style.fontFamily = "Manrope";
            text.style.fontSize = "1.2rem";
            text.style.color = "#040711";
            text.style.transition = "all 0.3s cubic-bezier(0.13, 0.41, 0.11, 1.34)";

            $("#circle").css({ padding: "10px 16px" });
            $("#circle").css({ width: "14ch" });
            $("#circle").css({ height: "4.5ch" });
            $("#circle").css({ textAlign: "center" });
            $("#circle").css({ borderRadius: "104px" });
            $("#circle").css({ mixBlendMode: "normal" });
            $("#circle").append(text);
        });

        mailhoverable[0].addEventListener("mouseleave", (e) => {
            //remove all children of circle
            $("#circle").css({ padding: "0px" });
            $("#circle").css({ width: "24px" });
            $("#circle").css({ height: "24px" });
            $("#circle").css({ borderRadius: "50%" });
            $("#circle").css({ mixBlendMode: "difference" });
            $("#circle").empty();
        });
    }

    setInterval(function () {
        xp += (mouseX - xp) / 6;
        yp += (mouseY - yp) / 6;

        $("#circle").css({
            left: xp + "px",
            top: yp + "px",
        });
    }, 10);

    // Hide the circle when the cursor leaves the viewport
    $(document).mouseleave(function () {
        $("#circle").fadeOut(200);
    });

    // Show the circle again when the cursor re-enters
    $(document).mouseenter(function () {
        $("#circle").fadeIn(200);
    });

    function SetReviews(data) {
        if (!data.data.project.reviews || data.data.project.reviews.length === 0) {
            $(".reviews").remove();
            return;
        }
        $(".reviewsdiv").empty();
        data.data.project.reviews.forEach(review => {
            $(".reviewsdiv").append(`
                    <div class="reviewbox stretchBox">
                        <div class="reviewdata">
                            <div class="reviewtext">${review.text}</div>
                            <div class="reviewauthor">${review.author}</div>
                        </div>
                    </div>
                `);
        });
    }

    function SetGallery(data) {
        if (!data.data.project.gallery || data.data.project.gallery.length === 0) {
            $(".gallery").remove();
            return;
        }
        $(".gallerydiv").empty();
        data.data.project.gallery.forEach(image => {
            $(".gallerydiv").append(`
                    <li class="item stretchBox">
                        <img draggable="false" src="${image}" alt="" class="galleryimg">
                    </li>
                `);
        });
        $(".gallerydiv").append(`
                <button onclick="handleClick('previous')" class="button hoverable button--previous" type="button">➜</button>
                <button onclick="handleClick('next')" class="button hoverable button--next" type="button">➜</button>
            `);
    }

    function SetMetrics(data) {
        if (!data.data.project.metrics || data.data.project.metrics.length === 0) {
            $(".metrics").remove();
            return;
        }
        $(".metricsdiv").empty();
        data.data.project.metrics.forEach(metric => {
            $(".metricsdiv").append(`
                    <div class="metricbox stretchBox">
                        <div class="metrictitle">${metric.label}</div>
                        <div class="metricdata">${metric.value}</div>
                    </div>`);
        });
    }

    function SetBriefNotesAndLinks(data) {
        $(".briefnotes").empty();
        data.data.project.BriefNotes.forEach(note => {
            $(".briefnotes").append(`
                    <div class="briefnote stretchBox">
                        ${data.IconJson.Icons[note.imagePath]}
                        <div class="notedata">${note.text}</div>
                    </div>
                `);
        });
        data.data.project.DownloadLink.forEach(link => {
            $(".briefnotes").append(`
                    <a href="${link.link}" target="_blank">
                        <div class="briefnote stretchBox hoverable ${link.class}">
                            <img draggable="false" src="${link.imagePath}" class="noteicon" alt=""/> 
                            <div class="notedata">${link.text}</div>
                        </div>
                    </a>
                `);
        });
    }

    function SetBrieftext(data) {
        $(".brieftext").empty();
        data.data.project.BriefBoxes.forEach(box => {
            $(".brieftext").append(`
                    <div class="brieftextbox stretchBox">
                        <div class="BlockTitles">${box.title}</div>
                        <br>
                        ${box.description}
                    </div>
                `);
        });
    }

    function SetBanner(data) {
        $(".banner").empty();
        $(".banner").append(`<img draggable="false" src="${data.data.project.bannerImage}" alt="">`);
    }

    function SetTitle(data) {
        $(".titletext").empty();
        $(".titletext").text(data.data.project.name);
    }

    function SetCssProperties(data) {
        rootstyle.setProperty('--custom-bg-color', data.data.project.bgColor);
        rootstyle.setProperty('--card-bg-color', data.data.project.cardColor);
        rootstyle.setProperty('--card-text-color', data.data.project.textColor);
        rootstyle.setProperty('--card-title-color', data.data.project.titleColor);
        rootstyle.setProperty('--review-text-color', data.data.project.reviewTextColor);
        rootstyle.setProperty('--theme-font', data.data.project.themeFont);
    }

    function notfound(hoverables) {
        $("body").empty();
        $("body").append(`
                <span id="circle" class="circle"></span>
                <div class="error">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <a href="./../index.html" class="hoverable backlink">Go Back to Home</a>
                </div>
                <div class="contact">
                    <div class="contactHeading">Contact Me</div>
                    <div class="contactDesc">I'm open to new opportunities or just a friendly chat. Feel free to reach out!</div>
                    <a target="_blank" href="mailto:kalp9675@gmail.com" class="emailText">
                    <div class="mailhoverable">kalp9675@gmail.com</div>
                    </a>
                    <div class="contactButtons">
                    <a target="_blank" href="https://t.me/kalpu_24">
                        <div style="background-color: #24A1DE;" class="contactButton hoverable"><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 48 48" id="Layer_2" data-name="Layer 2"><path class="cls-1" d="M40.83,8.48c1.14,0,2,1,1.54,2.86l-5.58,26.3c-.39,1.87-1.52,2.32-3.08,1.45L20.4,29.26a.4.4,0,0,1,0-.65L35.77,14.73c.7-.62-.15-.92-1.07-.36L15.41,26.54a.46.46,0,0,1-.4.05L6.82,24C5,23.47,5,22.22,7.23,21.33L40,8.69a2.16,2.16,0,0,1,.83-.21Z"/></svg>Telegram</div>
                    </a>
                    <a target="_blank" href="https://www.linkedin.com/in/Kalpu24/">
                        <div style="background-color: #2d64bc;" class="contactButton hoverable"><svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        focusable="false"
                        >
                        <g>
                        <path
                        d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
                            ></path>
                        </g>
                        </svg>LinkedIn</div>
                    </a>
                    <a target="_blank" href="https://github.com/Kalpu-24">
                        <div style="background-color: #0e1116;" class="contactButton hoverable"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path
                            d="M16,3a13,13,0,0,0-3.46,25.53,1,1,0,1,0,.53-1.92,11,11,0,1,1,7-.4,15.85,15.85,0,0,0-.3-3.92A6.27,6.27,0,0,0,24.68,16a6.42,6.42,0,0,0-1.05-3.87,7.09,7.09,0,0,0-.4-3.36,1,1,0,0,0-1.1-.67,8,8,0,0,0-3.37,1.28A11.35,11.35,0,0,0,16,9a13.09,13.09,0,0,0-3,.43A5.74,5.74,0,0,0,9.62,8.25a1,1,0,0,0-1,.66,7.06,7.06,0,0,0-.37,3.19A7.15,7.15,0,0,0,7.2,16a6.66,6.66,0,0,0,5,6.28,7.43,7.43,0,0,0-.15.79c-1,.06-1.58-.55-2.32-1.48a3.45,3.45,0,0,0-1.94-1.53,1,1,0,0,0-1.15.76A1,1,0,0,0,7.35,22c.16,0,.55.52.77.81a4.74,4.74,0,0,0,3.75,2.25,4.83,4.83,0,0,0,1.3-.18h0a1,1,0,0,0,.29-.14l0,0a.72.72,0,0,0,.18-.21.34.34,0,0,0,.08-.09.85.85,0,0,0,.06-.17,1.52,1.52,0,0,0,.06-.2v0a4.11,4.11,0,0,1,.46-1.91,1,1,0,0,0-.76-1.65A4.6,4.6,0,0,1,9.2,16a4.84,4.84,0,0,1,.87-3,1,1,0,0,0,.24-.83,5,5,0,0,1,0-1.85,3.59,3.59,0,0,1,1.74.92,1,1,0,0,0,1,.23A12.49,12.49,0,0,1,16,11a9.91,9.91,0,0,1,2.65.43,1,1,0,0,0,1-.18,5,5,0,0,1,2-1,4.11,4.11,0,0,1,0,1.91,1.05,1.05,0,0,0,.32,1A4,4,0,0,1,22.68,16a4.29,4.29,0,0,1-4.41,4.46,1,1,0,0,0-.94.65,1,1,0,0,0,.28,1.11c.59.51.5,4,.47,5.36a1,1,0,0,0,.38.81,1,1,0,0,0,.62.21,1.07,1.07,0,0,0,.25,0A13,13,0,0,0,16,3Z"
                            />
                        </g>
                        </svg>GitHub</div>
                    </a>
                    </div>
                    <div class="copyright">©Kalp Shah 2025, All rights reserved</div>
                </div>
            `);
        rootstyle.setProperty('--custom-bg-color', "#eeeef2");
        rootstyle.setProperty('--card-bg-color', "#fff");
        rootstyle.setProperty('--card-text-color', "#040711");
        var hoverables = document.querySelectorAll(".hoverable");
        for (let i = 0; i < hoverables.length; i++) {
            hoverables[i].addEventListener("mouseenter", (e) => {
                $("#circle").css({ transform: "scale(2.5)" });
            });
            hoverables[i].addEventListener("mouseleave", (e) => {
                $("#circle").css({ transform: "scale(1)" });
            });
        }
    var mailhoverable = document.querySelectorAll(".mailhoverable");

        if (mailhoverable[0]) {
        mailhoverable[0].addEventListener("mouseenter", (e) => {
            //add child text to circle
            const text = document.createElement("div");
            text.classList.add("circle-text");
            text.innerHTML = "Email me ->";
            text.style.fontFamily = "Manrope";
            text.style.fontSize = "1.2rem";
            text.style.color = "#040711";
            text.style.transition = "all 0.3s cubic-bezier(0.13, 0.41, 0.11, 1.34)";

            $("#circle").css({ padding: "10px 16px" });
            $("#circle").css({ width: "14ch" });
            $("#circle").css({ height: "4.5ch" });
            $("#circle").css({ textAlign: "center" });
            $("#circle").css({ borderRadius: "104px" });
            $("#circle").css({ mixBlendMode: "normal" });
            $("#circle").append(text);
        });

        mailhoverable[0].addEventListener("mouseleave", (e) => {
            //remove all children of circle
            $("#circle").css({ padding: "0px" });
            $("#circle").css({ width: "24px" });
            $("#circle").css({ height: "24px" });
            $("#circle").css({ borderRadius: "50%" });
            $("#circle").css({ mixBlendMode: "difference" });
            $("#circle").empty();
        });
    }
        return hoverables;
    }



document.onscroll = function() {
    $(".stretch").css({transform: "translate(-50%, 0%) scaleX(0.97)"});
    $(".stretchBox").css({transform: "scaleX(0.97)"});
};

document.ontouchmove = function() {
    $(".stretch").css({transform: "translate(-50%, 0%) scaleX(0.97)"});
    $(".stretchBox").css({transform: "scaleX(0.97)"});
};

document.onscrollend = function() {
    $(".stretch").css({transform: "translate(-50%, 0%) scaleX(1)"});
    $(".stretchBox").css({transform: "scaleX(1)"});
};

document.ontouchend = function() {
    $(".stretch").css({transform: "translate(-50%, 0%) scaleX(1)"});
    $(".stretchBox").css({transform: "scaleX(1)"});
};
});

// Debounce function using requestAnimationFrame
const debounce = (fn) => {
    let frame;
    return (...params) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            fn(...params);
        });
    };
};

// Store scrollY in <html data-scroll="...">
const storeScroll = () => {
    document.documentElement.dataset.scroll = window.scrollY;
};

// Listen to scroll with performance optimization
document.addEventListener("scroll", debounce(storeScroll), { passive: true });

// Set initial scroll position
storeScroll();

function scrollToSection(section) {
    const target = document.querySelector(section);
    if (target) {
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function handleClick(direction) {
    const list = document.querySelector(".gallerydiv");
    const item = document.querySelector(".item");
    const itemWidth = item.offsetWidth;
    if (direction === "previous") {
        list.scrollBy({ left: -itemWidth, behavior: "smooth" });
    } else {
        list.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
}

async function fetchJSONData(filename) {
    const response = await fetch("./../data/" + filename +".json");
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const iconres = await fetch("./../data/icon.json");
    if (!iconres.ok) {
        throw new Error(`HTTP error! Status: ${iconres.status}`);
    }
    IconJson = await iconres.json();
    return { data, IconJson };
}