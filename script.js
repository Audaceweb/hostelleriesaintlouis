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

    // 2. GESTION DU MENU HAMBURGER
    if (hamburgerBtn && navBar) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navBar.classList.toggle('active');
        });

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

    // 4. ANIMATION AU SCROLL
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

    // Lancement initial des carrousels statiques
    initCarousels();
});

// Fonction globale pour initialiser/relancer les carrousels (compatible CMS)
function initCarousels() {
    const carouselContainers = document.querySelectorAll('.hotel-carousel-container');

    carouselContainers.forEach(container => {
        const slides = container.querySelectorAll('.carousel-slide');
        const dots = container.querySelectorAll('.dot');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            if (slides.length === 0) return;
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
            // Utilisation de .onclick pour écraser proprement les anciens écouteurs
            nextBtn.onclick = () => {
                nextSlide();
                resetTimer();
            };

            prevBtn.onclick = () => {
                prevSlide();
                resetTimer();
            };
        }

        dots.forEach((dot, index) => {
            dot.onclick = () => {
                showSlide(index);
                resetTimer();
            };
        });

        function startTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        container.onmouseenter = () => clearInterval(slideInterval);
        container.onmouseleave = startTimer;

        showSlide(0);
        startTimer();
    });
}

// Gestion de la newsletter
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
document.addEventListener('DOMContentLoaded', () => {
    // S'assure que la page apparaît en fondu à l'arrivée
    document.body.classList.remove('fade-out');

    // Sélectionne tous les liens du site
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Vérifie si c'est un lien interne vers une autre page (on évite les ancres #, les numéros de téléphone, les e-mails et les liens externes)
        if (
            href && 
            !href.startsWith('#') && 
            !href.startsWith('tel:') && 
            !href.startsWith('mailto:') && 
            link.getAttribute('target') !== '_blank' &&
            (href.endsWith('.html') || href === '/' || !href.includes('http'))
        ) {
            link.addEventListener('click', e => {
                e.preventDefault(); // Empêche le changement de page instantané
                document.body.classList.add('fade-out'); // Déclenche le fondu sortant

                // Attend la fin de l'animation (350 millisecondes) puis change de page
                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Supposons que ton fichier JSON contienne une liste "spa_categories"
    // (Ce code est intégré ou appelé après le chargement de ton fetch CMS global)
});

// Fonction d'injection pour les catégories de soins
function renderSpaMenu(categories) {
    const container = document.getElementById('spa-categories-container');
    if (!container || !Array.isArray(categories)) return;

    container.innerHTML = '';

    categories.forEach((cat, index) => {
        let itemsHTML = '';
        if (cat.items && Array.isArray(cat.items)) {
            cat.items.forEach(item => {
                itemsHTML += `
                    <div class="menu-item">
                        <div class="menu-item-info">
                            <span class="dish-name" style="color: #fff;">${item.name || ''}</span>
                            <small style="display:block; color:#aaa;">${item.sub || ''}</small>
                        </div>
                        <span class="dish-price" style="color: var(--color-gold);">${item.price || ''}</span>
                    </div>
                `;
            });
        }

        // Séparateur entre les catégories (sauf pour la première)
        const dividerHTML = index > 0 ? '<div class="menu-divider"><span>✦ ✦ ✦</span></div>' : '';

        const categoryHTML = `
            ${dividerHTML}
            <div class="menu-category">
                <h3 style="color: var(--color-gold); font-family: var(--font-subtitle); font-style: italic; font-size: 1.8rem; text-align: center; margin-bottom: 25px;">${cat.category_title || ''}</h3>
                ${itemsHTML}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', categoryHTML);
    });
}
