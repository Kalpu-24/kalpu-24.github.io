if (window.matchMedia("(hover: none)").matches) {
  $(".TeleBut").css({filter: 'grayscale(0%)'});
  $(".playBut").css({filter: 'grayscale(0%)'});
  $(".mainImage").css({filter: 'grayscale(0%)'});
  $(".theImage").css({filter: 'grayscale(0%)'});
  $(".contactButton").css({filter: 'grayscale(0%)'});
  $(".itchBut").css({filter: 'grayscale(0%)'});
  $(".disablebut").css({filter: 'grayscale(100%)'});
}

$(".contactbut").on("click", ()=>scrollToSection(".contact"));
$(".contactbut2").on("click", ()=>scrollToSection(".contact"));
$(".workMenuItem").on("click", ()=>{
  scrollToSection(".projects");
  menuButton.classList.remove('open');
  placeholder.classList.remove('active');
});
$(".aboutMenuItem").on("click", ()=>{
  scrollToSection(".about");
  menuButton.classList.remove('open');
  placeholder.classList.remove('active');
});
$(".contactMenuItem").on("click", ()=>{
  scrollToSection(".contact");
  menuButton.classList.remove('open');
  placeholder.classList.remove('active');
});
$(".title").on("click", scrollToTop);
jQuery(document).ready(function () {
    var mouseX = 0,
        mouseY = 0;
    var xp = 0,
        yp = 0;
    var circleSize = 24;
    const hoverables = document.querySelectorAll(".hoverable");
    const mailhoverable = document.querySelectorAll(".mailhoverable");
    // if mobile and width smaller than 768px, return
    // if hover is not supported, return
    if (window.matchMedia("(hover: none)").matches) return;
    $("#circle").fadeIn(1000);

    $(document).mousemove(function (e) {
        mouseX = e.pageX - 12;
        mouseY = e.pageY - 12;
    });

    for (let i = 0; i < hoverables.length; i++) {
        hoverables[i].addEventListener("mouseenter", (e) => {
            $("#circle").css({ transform: "scale(2.5)" });
        });
        hoverables[i].addEventListener("mouseleave", (e) => {
            $("#circle").css({ transform: "scale(1)" });
        });
    }
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
});


const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu'); // or your `.menu` container
const placeholder = document.querySelector('.menuplaceholder');

menuButton.addEventListener('click', (e) => {
  e.stopPropagation(); // prevent the click from bubbling up
  menuButton.classList.toggle('open');
  placeholder.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  const isClickInsideMenu = menu.contains(e.target);
  const isClickOnButton = menuButton.contains(e.target);

  if (!isClickInsideMenu && !isClickOnButton) {
    menuButton.classList.remove('open');
    placeholder.classList.remove('active');
  }
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
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

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