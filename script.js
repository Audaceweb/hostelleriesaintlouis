document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navBar = document.getElementById('nav-bar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // 1. GESTION DU SCROLL POUR LE HEADER ET LE LOGO
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. GESTION DU MENU HAMBURGER (Animation croix + flou)
    if (hamburgerBtn && navBar) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navBar.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                navBar.classList.remove('active');
            });
        });
    }

    // 3. GESTION DU LIEN ACTIF
    const currentPath = window.location.pathname.split("/").pop();
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 4. ANIMATION AU SCROLL (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. GESTION MULTI-CARROUSELS 5 ÉTOILES (Fonctionne pour toutes les pages)
    const carouselContainers = document.querySelectorAll('.hotel-carousel-container');

    carouselContainers.forEach(container => {
        const slides = container.querySelectorAll('.carousel-slide');
        const dots = container.querySelectorAll('.dot');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetTimer();
            });
        });

        function startTimer() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', startTimer);

        // Lancement initial du carrousel
        startTimer();
    });
});
const newsletterForm = document.getElementById('newsletter-form');
const newsletterMsg = document.getElementById('newsletter-msg');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        newsletterMsg.textContent = 'Envoi en cours...';
        try {
            const res = await fetch(newsletterForm.action, {
                method: 'POST',
                body: new FormData(newsletterForm)
            });
            const data = await res.json();
            if (data.success) {
                newsletterMsg.textContent = 'Merci, votre inscription est bien enregistrée !';
                newsletterForm.reset();
            } else {
                newsletterMsg.textContent = data.message || 'Une erreur est survenue, merci de réessayer.';
            }
        } catch (err) {
            newsletterMsg.textContent = 'Une erreur est survenue, merci de réessayer.';
        }
    });
}