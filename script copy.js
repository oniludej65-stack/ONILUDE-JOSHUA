const STORAGE_KEY = 'jayphix-theme';
const themeToggle = document.getElementById('themeToggle');
const htmlRoot = document.documentElement;
const mobileMenu = document.getElementById('mobileMenu');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileLinks = document.querySelectorAll('.mobile-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const backToTop = document.getElementById('backToTop');
const cursorGlow = document.getElementById('cursorGlow');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');

function setTheme(theme) {
  htmlRoot.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    setTheme(saved);
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current = htmlRoot.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function openMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
}

function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
}

function updateBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function initReveals() {
  const revealed = document.querySelectorAll('.reveal, .reveal-stagger');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
  });
  revealed.forEach((section) => observer.observe(section));
}

function handleCursorGlow(event) {
  const { clientX, clientY } = event;
  cursorGlow.style.left = `${clientX}px`;
  cursorGlow.style.top = `${clientY}px`;
}

function initCursorGlow() {
  if (!cursorGlow) return;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', handleCursorGlow);
  }
}

function initTypewriter() {
  const target = document.querySelector('.typewriter-text');
  if (!target) return;

  const words = ['GRAPHIC Design,', 'Branding identity'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function updateText() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      target.textContent = currentWord.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(updateText, 1400);
        return;
      }
    } else {
      target.textContent = currentWord.slice(0, charIndex - 1);
      charIndex -= 1;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(updateText, 400);
        return;
      }
    }

    setTimeout(updateText, isDeleting ? 55 : 90);
  }

  updateText();
}

function initForm() {
  if (!contactForm) return;
  contactForm.setAttribute('action', 'https://formsubmit.co/oniludej65@gmail.com');
  contactForm.setAttribute('method', 'POST');
  contactForm.setAttribute('accept-charset', 'UTF-8');
  contactForm.setAttribute('target', '_blank');
  contactForm.addEventListener('submit', (event) => {
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    if (!name || !email) {
      event.preventDefault();
      showToast('Please enter your name and email.');
    } else {
      showToast('Your message is sending. Check email soon.');
    }
  });
}

function initImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const imageButtons = document.querySelectorAll('.project-thumb');

  if (!modal || !modalImage || !modalTitle || !modalCategory) return;

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
  }

  imageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const imageUrl = button.dataset.full;
      const title = button.dataset.title;
      const category = button.dataset.category;
      if (!imageUrl) return;
      modalImage.src = imageUrl;
      modalTitle.textContent = title;
      modalCategory.textContent = category;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

function initProjectSliders() {
  const sliders = document.querySelectorAll('.project-slider');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.project-slide'));
    const controls = slider.querySelectorAll('.project-slider-btn');
    const count = slider.querySelector('.project-slider-count');
    let activeIndex = slides.findIndex((slide) => slide.classList.contains('active'));
    let timer;

    if (!slides.length) return;
    if (activeIndex < 0) activeIndex = 0;

    function updateSlide(nextIndex) {
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === activeIndex);
      });
      if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
    }

    function startAutoPlay() {
      window.clearInterval(timer);
      timer = window.setInterval(() => updateSlide(activeIndex + 1), 3600);
    }

    controls.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const direction = button.dataset.direction === 'prev' ? -1 : 1;
        updateSlide(activeIndex + direction);
        startAutoPlay();
      });
    });

    slider.addEventListener('mouseenter', () => window.clearInterval(timer));
    slider.addEventListener('mouseleave', startAutoPlay);
    updateSlide(activeIndex);
    startAutoPlay();
  });
}

function filterProjects(filter) {
  projectCards.forEach((card) => {
    const category = card.dataset.category;
    const isVisible = filter === 'all' || category === filter;
    card.classList.toggle('hidden', !isVisible);
  });
}

function initProjectFilters() {
  if (!filterButtons.length || !projectCards.length) return;
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterProjects(button.dataset.filter);
    });
  });
  filterProjects('all');
}

function initEvents() {
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', updateBackToTop);
}

window.addEventListener("load", () => {
  document.body.classList.add('loaded');
  loadTheme();
  initEvents();
  initProjectFilters();
  initReveals();
  initCursorGlow();
  initTypewriter();
  initForm();
  initProjectSliders();
  initImageModal();
  updateBackToTop();
});
