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

document.addEventListener('DOMContentLoaded', () => {
    // === Hamburger menu functionality ===
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar ul');
    const navbar = document.querySelector('.navbar');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navbar.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navbar.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navbar.classList.remove('menu-open');
            }
        });
    }

    // === Floating language button (same as Home / OurStory / Sponsors) ===
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

    // === Contact.html: calculate area once and set fixed particle count ===
    if (window.location.pathname.includes('Contact.html')) {
        const debouncedParticleUpdate = debounce(updateContactParticles, 150);
        updateContactParticles();
        window.addEventListener('resize', debouncedParticleUpdate);
    } else {
        if (window.location.pathname.includes('Contact.html')) {
            const particlesContainer = document.getElementById('particles');
            if (particlesContainer) {
                particlesContainer.style.height = `${document.body.scrollHeight}px`;
            }
            window.addEventListener('resize', () => {
                if (particlesContainer) {
                    particlesContainer.style.height = `${document.body.scrollHeight}px`;
                }
                updateParticlesForHeight();
            });
        }
        updateParticlesForHeight();
    }

    // === Language detection ===
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

// === CONTACT FORM FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Add input focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
});

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const data = { name, email, message };
    
    fetch('contact_backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showNotification(result.message, 'success');
            e.target.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
            });
        } else {
            showNotification(result.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
            break;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// === PARTICLES (unchanged) ===
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
    const baseSpeed = 40;
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
    const particleCount = Math.max(30, Math.floor(height * density));
    createOrUpdateParticles(particleCount);
}

window.updateParticlesForHeight = updateParticlesForHeight;

function updateContactParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const area = particlesContainer.offsetHeight * window.innerWidth;
    const density = 1 / 20000;
    const particleCount = Math.max(30, Math.min(MAX_PARTICLES, Math.floor(area * density)));
    createOrUpdateParticles(particleCount);
}

// === Smooth scrolling ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === Language switching ===
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
