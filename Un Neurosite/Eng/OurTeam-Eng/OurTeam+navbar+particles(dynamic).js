// === TEAM NAVIGATION ===
function initTeamNavigation() {
    const navLinks = document.querySelectorAll('.team-nav-link');
    const teamSections = document.querySelectorAll('.team-section');
    const titleImages = document.querySelectorAll('.page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Hide all team sections
            teamSections.forEach(section => section.style.display = 'none');

            // Hide all title images
            titleImages.forEach(img => img.style.display = 'none');

            // Show the selected section and title image
            const category = this.getAttribute('data-category');
            const targetSection = document.getElementById(category + '-section');
            const targetTitle = document.getElementById(category + '-title');

            if (targetSection) targetSection.style.display = 'block';
            if (targetTitle) targetTitle.style.display = 'block';

            updateTeamParticles();
        });
    });
}

// === UTILITIES ===
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// === INITIALIZE EVERYTHING ===
document.addEventListener('DOMContentLoaded', function() {
    initTeamNavigation();
    updateTeamParticles();
});

// === NAVBAR + LANGUAGE BUTTON ===
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close when clicking a nav link
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // === Floating language button identical to Home ===
    const nav = document.querySelector('.navbar');
    const ul = document.querySelector('.navbar ul');
    const langLi = document.querySelector('.language-switcher');
    const langBtn = document.getElementById('langBtn');

    if (nav && ul && langLi && langBtn) {
        const btnPlaceholder = document.createComment('lang-btn-slot');
        if (langBtn.parentElement === langLi) langLi.insertBefore(btnPlaceholder, langBtn);

        const floatId = 'lang-float';
        let floatContainer = document.getElementById(floatId);
        if (!floatContainer) {
            floatContainer = document.createElement('div');
            floatContainer.id = floatId;
            Object.assign(floatContainer.style, {
                position: 'fixed',
                top: '20px',
                right: '15px',
                zIndex: '2000',
                display: 'none',
                margin: '0',
                padding: '0'
            });
            document.body.appendChild(floatContainer);
        }

        const placeLang = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (isMobile) {
                if (langBtn.parentElement !== floatContainer)
                    floatContainer.appendChild(langBtn);
                floatContainer.style.display = 'block';
                langBtn.style.fontSize = '14px';
                langBtn.style.padding = '6px 12px';
            } else {
                if (btnPlaceholder.parentNode && langBtn.parentElement !== langLi)
                    langLi.insertBefore(langBtn, btnPlaceholder);
                floatContainer.style.display = 'none';
                langBtn.style.fontSize = '';
                langBtn.style.padding = '';
            }
        };

        placeLang();
        window.addEventListener('resize', placeLang);
        window.addEventListener('orientationchange', placeLang);
    }

    // Fade-in observer (if used)
    const images = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    images.forEach(image => observer.observe(image));

    updateTeamParticles();
    window.addEventListener('resize', debounce(updateTeamParticles, 150));

    // Language detection
    const currentPath = window.location.pathname;
    if (currentPath.includes('/Eng/')) {
        currentLanguage = 'EN';
        const t = document.querySelector('.lang-text');
        if (t) t.textContent = 'EN';
    } else {
        currentLanguage = 'RO';
        const t = document.querySelector('.lang-text');
        if (t) t.textContent = 'RO';
    }
});

// === PARTICLE SYSTEM (unchanged) ===
const PARTICLE_COUNT = 120;
const PARTICLE_MIN_SIZE = 2.5;
const PARTICLE_MAX_SIZE = 6;
const PARTICLE_MIN_SPEED = 0.2;
const PARTICLE_MAX_SPEED = 0.7;
let particlesAnimationFrameId = null;

function createFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    const containerHeight = document.body.scrollHeight;
    const containerWidth = particlesContainer.offsetWidth;
    const area = containerHeight * containerWidth;
    const density = 0.1;
    const particleCount = Math.max(30, Math.min(300, Math.floor(containerHeight * density)));
    const baseSpeed = 60;
    const travelDistance = containerHeight * 1.05;
    const minDuration = travelDistance / baseSpeed;
    const maxDuration = minDuration * 2;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE) + PARTICLE_MIN_SIZE;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        const duration = minDuration + Math.random() * (maxDuration - minDuration);
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = (-Math.random() * (minDuration + Math.random() * (maxDuration - minDuration))) + 's';
        particlesContainer.appendChild(particle);
    }
}

const MAX_PARTICLES = 300;
let particlesInitialized = false;

function createOrUpdateParticles(particleCount) {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    if (!particlesInitialized) {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particlesContainer.appendChild(particle);
        }
        particlesInitialized = true;
    }

    const height = particlesContainer.offsetHeight;
    const baseSpeed = 60;
    const travelDistance = height * 1.05;
    const minDuration = travelDistance / baseSpeed;
    const maxDuration = minDuration * 2;

    const allParticles = Array.from(particlesContainer.children);
    for (let i = 0; i < MAX_PARTICLES; i++) {
        const particle = allParticles[i];
        if (i < particleCount) {
            particle.style.display = '';
            particle.style.opacity = '1';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = (-Math.random() * (minDuration + Math.random() * (maxDuration - minDuration))) + 's';
            const duration = minDuration + Math.random() * (maxDuration - minDuration);
            particle.style.animationDuration = duration + 's';
            const size = Math.random() * 3 + 2.5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
        } else {
            particle.style.display = 'none';
        }
    }
}

function updateParticlesForHeight() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const height = particlesContainer.offsetHeight;
    const density = 0.1;
    const particleCount = Math.max(30, Math.min(300, Math.floor(height * density)));
    createOrUpdateParticles(particleCount);
}

window.updateParticlesForHeight = updateParticlesForHeight;

function updateTeamParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const density = 0.1;
    const particleCount = Math.max(30, Math.min(MAX_PARTICLES, Math.floor(particlesContainer.offsetHeight * density)));
    createOrUpdateParticles(particleCount);
}

// === LANGUAGE SWITCHING ===
let currentLanguage = 'RO';
const languagePaths = {
    'Home.html': { ro: '/Un Neurosite/Ro/Home-Ro/Home.html', eng: '/Un Neurosite/Eng/Home-Eng/Home.html' },
    'OurStory.html': { ro: '/Un Neurosite/Ro/OurStory-ro/OurStory.html', eng: '/Un Neurosite/Eng/OurStory-Eng/OurStory.html' },
    'OurTeam.html': { ro: '/Un Neurosite/Ro/OurTeam-Ro/OurTeam.html', eng: '/Un Neurosite/Eng/OurTeam-Eng/OurTeam.html' },
    'Events.html': { ro: '/Un Neurosite/Ro/Events-Ro/Events.html', eng: '/Un Neurosite/Eng/Events-Eng/Events.html' },
    'Sponsors.html': { ro: '/Un Neurosite/Ro/Sponors-Ro/Sponsors.html', eng: '/Un Neurosite/Eng/Sponors-Eng/Sponsors.html' },
    'Contact.html': { ro: '/Un Neurosite/Ro/ContactUs-Ro/Contact.html', eng: '/Un Neurosite/Eng/ContactUs-Eng/Contact.html' }
};

function toggleLanguage() {
    const langBtn = document.getElementById('langBtn');
    const langText = document.querySelector('.lang-text');
    if (!langBtn || !langText) return;

    langText.classList.add('changing');
    langBtn.classList.add('active');

    setTimeout(() => {
        currentLanguage = currentLanguage === 'RO' ? 'EN' : 'RO';
        langText.textContent = currentLanguage;
        langText.classList.remove('changing');

        const currentPage = window.location.pathname.split('/').pop();
        if (languagePaths[currentPage]) {
            const targetPath = languagePaths[currentPage][currentLanguage === 'RO' ? 'ro' : 'eng'];
            window.location.href = targetPath;
        }
    }, 300);

    setTimeout(() => {
        langBtn.classList.remove('active');
    }, 2000);
}
