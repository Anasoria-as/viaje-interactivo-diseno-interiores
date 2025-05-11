// === GSAP Scroll Horizontal ===
gsap.registerPlugin(ScrollTrigger);
const sections = gsap.utils.toArray(".panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: {
      snapTo: 1 / (sections.length - 1),
      duration: 0.6,
      ease: "power1.inOut"
    },
    end: () => "+=" + document.querySelector(".container").offsetWidth
  }
});


// === ANIMACIÓN DE INCLINACIÓN LAMP
let lastScrollY = window.scrollY;
let scrollTimeout;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  const direction = currentScrollY > lastScrollY ? "right" : "left";
  lastScrollY = currentScrollY;

  const lamps = document.querySelectorAll(".lamp");

  // Rotación según dirección
  lamps.forEach(lamp => {
    if (direction === "right") {
      lamp.style.transform = "rotateZ(-5deg)";
    } else {
      lamp.style.transform = "rotateZ(5deg)";
    }
  });

  // Resetear si no se hace scroll
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    lamps.forEach(lamp => {
      lamp.style.transform = "rotateZ(0deg)";
    });
  }, 150);
});


// === POPUP SECCIONES ===
const sectionTwo = document.querySelector('.two');
const sectionThree = document.querySelector('.three');
const sectionFour = document.querySelector('.four');
const closeBtns = document.querySelectorAll('.close-btn');

// === IDS ===
const timelinePopupIds = [
  'popup-1950', 'popup-1960', 'popup-1970',
  'popup-1980', 'popup-1990', 'popup-2020', 'popup-futuro'
];

const decoPopupIds = [
  'popup-dopamine', 'popup-dopamine-collage',
  'popup-japandi', 'popup-japandi-collage',
  'popup-nordico', 'popup-nordico-collage'
];

const classicPopupIds = [
  'popup-panton', 'popup-tulip', 'popup-wire'
];

const allPopups = [
  ...timelinePopupIds, ...decoPopupIds, ...classicPopupIds
].map(id => document.getElementById(id));

// === FUNCIONES POPUP ===
function openPopup(popup) {
  popup.classList.remove('hidden', 'hiding', 'zoom-out');
  popup.classList.add('show', 'zoom-in');

  const content = popup.querySelector('.popup-content-one') || popup.querySelector('.popup-content-two');
  if (content) {
    content.addEventListener('animationend', () => {
      popup.classList.remove('zoom-in');
    }, { once: true });
  }
}

function closePopup(popup) {
  popup.classList.remove('zoom-in');
  popup.classList.add('zoom-out');

  const content = popup.querySelector('.popup-content-one') || popup.querySelector('.popup-content-two');
  if (content) {
    content.addEventListener('animationend', () => {
      popup.classList.remove('show', 'zoom-out');
      popup.classList.add('hidden');
    }, { once: true });
  }
}

function transitionTo(current, nextId, direction) {
  const next = document.getElementById(nextId);

  current.classList.remove('show');
  next.classList.remove('hidden');
  next.classList.add('show', direction === 'right' ? 'slide-in-right' : 'slide-in-left');

  const content = next.querySelector('.popup-content-one') || next.querySelector('.popup-content-two');
  if (content) {
    content.addEventListener('animationend', () => {
      next.classList.remove('slide-in-right', 'slide-in-left');
      allPopups.forEach(p => {
        if (p !== next && p !== current) p.classList.add('hidden');
      });
    }, { once: true });
  }
}

// === EVENTOS DE APERTURA ===
sectionTwo.addEventListener('click', () => {
  const popup = document.getElementById('popup-1980');
  if (!popup.classList.contains('show')) openPopup(popup);
});

sectionThree.addEventListener('click', () => {
  const popup = document.getElementById('popup-dopamine');
  if (!popup.classList.contains('show')) openPopup(popup);
});

sectionFour.addEventListener('click', () => {
  const popup = document.getElementById('popup-panton');
  if (!popup.classList.contains('show')) openPopup(popup);
});

// === BOTONES CIERRE ===
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const popup = btn.closest('.popup-overlay');
    if (popup) closePopup(popup);
  });
});

allPopups.forEach(p => {
  p.addEventListener('click', e => {
    if (e.target === p) closePopup(p);
  });
});

// === FUNCIÓN CARRUSEL ===
function setupCarousel(ids) {
  ids.forEach((id, index) => {
    const popup = document.getElementById(id);
    const right = popup.querySelector('.arrow-right');
    const left = popup.querySelector('.arrow-left');

    if (right) {
      right.addEventListener('click', e => {
        e.stopPropagation();
        const nextId = ids[(index + 1) % ids.length];
        transitionTo(popup, nextId, 'right');
      });
    }

    if (left) {
      left.addEventListener('click', e => {
        e.stopPropagation();
        const prevId = ids[(index - 1 + ids.length) % ids.length];
        transitionTo(popup, prevId, 'left');
      });
    }
  });
}

// === CARRUSELES ===
setupCarousel(timelinePopupIds);
setupCarousel(decoPopupIds);
setupCarousel(classicPopupIds);


// === CURSOR ===
let lastX = 0;
  let currentCursor = "right";

  window.addEventListener("mousemove", (e) => {
    const deltaX = e.clientX - lastX;

    if (deltaX < -5 && currentCursor !== "left") {
      document.body.style.cursor = 'url("assets/svg/cursor-izq.png") 0 0, auto';
      currentCursor = "left";
    } else if (deltaX > 5 && currentCursor !== "right") {
      document.body.style.cursor = 'url("assets/svg/cursor-dch.png") 0 0, auto';
      currentCursor = "right";
    }

    lastX = e.clientX;
  });

  
  let currentScrollCursor = "";

window.addEventListener("wheel", (e) => {
  if (e.deltaY < -5 && currentScrollCursor !== "left") {
    // Scroll hacia ARRIBA → la web va hacia la derecha → flecha izquierda
    document.body.style.cursor = 'url("assets/svg/cursor-izq.png") 0 0, auto';
    currentScrollCursor = "left";
  } else if (e.deltaY > 5 && currentScrollCursor !== "right") {
    // Scroll hacia ABAJO → la web va hacia la izquierda → flecha derecha
    document.body.style.cursor = 'url("assets/svg/cursor-dch.png") 0 0, auto';
    currentScrollCursor = "right";
  }
});
