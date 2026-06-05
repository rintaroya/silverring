const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("mobileOverlay");
const header = document.getElementById("header");

function openMenu() {
    document.body.classList.add("menu-open");
}

function closeMenu() {
    document.body.classList.remove("menu-open");
}

burger?.addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
});

overlay?.addEventListener("click", closeMenu);

mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("touchstart", (e) => {
    if (!document.body.classList.contains("menu-open")) return;

    const isInsideMenu = mobileMenu.contains(e.target);
    const isBurger = burger.contains(e.target);

    if (!isInsideMenu && !isBurger) {
        closeMenu();
    }
});

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav__link, .mobile-menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
        link.classList.add("active");
    }
});

document.querySelectorAll(".gallery").forEach(gallery => {
    const track = gallery.querySelector(".gallery-track");

    const slidesCount = track.children.length;

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "gallery-dots";

    const dots = [];

    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dotsWrap.appendChild(dot);
        dots.push(dot);
    }

    gallery.appendChild(dotsWrap);

    let index = 0;

    const getWidth = () => gallery.offsetWidth;

    function render() {
        track.style.transform = `translateX(${-index * getWidth()}px)`;
    }

    function updateDots() {
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function snap() {
        track.style.transition = "transform 0.35s ease";
        render();
        updateDots();
    }

    let startX = 0;
    let isTouching = false;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    if (isMobile) {
        gallery.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isTouching = true;
            track.style.transition = "none";
        });

        gallery.addEventListener("touchmove", (e) => {
            if (!isTouching) return;

            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;

            track.style.transform =
                `translateX(${-index * getWidth() + diff}px)`;
        });

        gallery.addEventListener("touchend", (e) => {
            isTouching = false;

            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;

            const threshold = getWidth() * 0.2;

            if (diff < -threshold && index < slidesCount - 1) index++;
            if (diff > threshold && index > 0) index--;

            snap();
        });
    }

    else {
        gallery.addEventListener("click", () => {
            index = (index + 1) % slidesCount;
            snap();
        });
    }

    updateDots();
    render();
});


document.querySelectorAll(".day").forEach(day => {

    const cards = Array.from(day.querySelectorAll(".attraction-card"));

    const validCards = cards.filter(c => c.offsetParent !== null);

    validCards.forEach(c => c.classList.remove("last-center"));

    if (validCards.length % 2 === 1) {
        const last = validCards[validCards.length - 1];
        last.classList.add("last-center");
    }
});

const pricePerPerson = 23200;

const totalPrice = document.getElementById("totalPrice");

const toggle = document.getElementById("toggleDates");
const list = document.getElementById("datesList");

let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
    const current = window.scrollY;

    const header = document.getElementById("header");
    if (!header) return;

    document.body.classList.toggle("scrolled", current > 10);

    const goingDown = current > lastScroll;
    const goingUp = current < lastScroll;

    if (current < 10) {
        header.classList.remove("hidden");
        lastScroll = current;
        return;
    }

    if (goingDown && current > 80) {
        header.classList.add("hidden");
    }

    if (goingUp) {
        header.classList.remove("hidden");
    }

    lastScroll = current;
}, { passive: true });