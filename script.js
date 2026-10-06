// Epochurian BBC Long-Read Scrollytelling Engine

document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth Scroll for Anchor Links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 2. DOM Elements
    const header = document.querySelector('.site-header');
    const progressBar = document.getElementById('progressBar');
    const heroBg = document.querySelector('.hero-bg');
    const scrollySection = document.querySelector('.scrollytelling-section');
    const scrollyBgs = document.querySelectorAll('.scrolly-bg');
    const scrollyCards = document.querySelectorAll('.scrolly-card');
    const totalScrollyStages = scrollyBgs.length;

    let currentStageIndex = -1;
    let ticking = false;

    // 3. Scroll Handler (Optimized with requestAnimationFrame)
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const totalDocHeight = document.documentElement.scrollHeight - windowHeight;

        // A. Top Progress Bar
        if (progressBar && totalDocHeight > 0) {
            const scrollPercentage = Math.min(100, Math.max(0, (scrollY / totalDocHeight) * 100));
            progressBar.style.width = `${scrollPercentage}%`;
        }

        // B. Editorial Header Transparency
        if (header) {
            if (scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // C. Hero Parallax & Ken Burns Zoom
        if (heroBg && scrollY <= windowHeight) {
            const progress = scrollY / windowHeight;
            const scale = 1 + progress * 0.12;
            const translateY = progress * 40;
            heroBg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }

        // D. Sticky Scrollytelling Section Engine (Feasts)
        if (scrollySection && totalScrollyStages > 0) {
            const rect = scrollySection.getBoundingClientRect();
            const sectionHeight = rect.height - windowHeight;
            
            if (rect.top <= 0 && rect.bottom >= windowHeight) {
                // Currently pinned inside the scrollytelling viewport
                const scrollProgress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
                let targetStage = Math.floor(scrollProgress * totalScrollyStages);
                if (targetStage >= totalScrollyStages) targetStage = totalScrollyStages - 1;

                if (targetStage !== currentStageIndex) {
                    currentStageIndex = targetStage;
                    updateScrollyStage(targetStage);
                }
            } else if (rect.top > 0) {
                // Above scrollytelling section
                if (currentStageIndex !== 0) {
                    currentStageIndex = 0;
                    updateScrollyStage(0);
                }
            } else if (rect.bottom < windowHeight) {
                // Below scrollytelling section
                const lastStage = totalScrollyStages - 1;
                if (currentStageIndex !== lastStage) {
                    currentStageIndex = lastStage;
                    updateScrollyStage(lastStage);
                }
            }
        }

        // E. Chef Split Section Pinned Photo Transition
        const chefBlock2 = document.querySelector('.chef-text-block-2');
        const transitionImg = document.querySelector('.chef-img-transition');
        const baseImg = document.querySelector('.chef-img-base');
        
        if (chefBlock2 && transitionImg) {
            const rect = chefBlock2.getBoundingClientRect();
            // When paragraph 3 enters view (top of block 2 reaches 65% of viewport height), transition photo
            if (rect.top < windowHeight * 0.65) {
                transitionImg.classList.add('active');
                if (baseImg) baseImg.classList.remove('active');
            } else {
                transitionImg.classList.remove('active');
                if (baseImg) baseImg.classList.add('active');
            }
        }

        ticking = false;
    };

    // Helper: Update Active Stage for Pinned Photos & Floating Cards
    function updateScrollyStage(stageIndex) {
        scrollyBgs.forEach((bg, index) => {
            if (index === stageIndex) {
                bg.classList.add('active');
            } else {
                bg.classList.remove('active');
            }
        });

        scrollyCards.forEach((card, index) => {
            if (index === stageIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });

    handleScroll(); // Initial run

    // 4. Reveal Animations Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Scroll Zoom Effect on Media Images
    const scrollZoomContainers = document.querySelectorAll('.scroll-zoom');
    const zoomObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const img = entry.target.querySelector('img');
            if (img) {
                if (entry.isIntersecting) {
                    img.style.transform = 'scale(1.05)';
                } else {
                    img.style.transform = 'scale(1)';
                }
            }
        });
    }, {
        threshold: 0.3
    });

    scrollZoomContainers.forEach(container => zoomObserver.observe(container));
});
