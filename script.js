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
                const scrollProgress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
                let targetStage = Math.floor(scrollProgress * totalScrollyStages);
                if (targetStage >= totalScrollyStages) targetStage = totalScrollyStages - 1;

                if (targetStage !== currentStageIndex) {
                    currentStageIndex = targetStage;
                    updateScrollyStage(targetStage);
                }
            } else if (rect.top > 0) {
                if (currentStageIndex !== 0) {
                    currentStageIndex = 0;
                    updateScrollyStage(0);
                }
            } else if (rect.bottom < windowHeight) {
                const lastStage = totalScrollyStages - 1;
                if (currentStageIndex !== lastStage) {
                    currentStageIndex = lastStage;
                    updateScrollyStage(lastStage);
                }
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

    // 5. Chef Section Internal Scroll & Image Transition with Wheel Interception
    const chefSection = document.getElementById('chef');
    const chefTextScroll = document.getElementById('chefTextScroll');
    const baseImg = document.querySelector('.chef-img-base');
    const transitionImg = document.querySelector('.chef-img-transition');

    if (chefSection && chefTextScroll && baseImg && transitionImg) {
        chefTextScroll.addEventListener('scroll', () => {
            const scrollTop = chefTextScroll.scrollTop;
            const scrollHeight = chefTextScroll.scrollHeight - chefTextScroll.clientHeight;
            const scrollFraction = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

            if (scrollFraction > 0.4) {
                baseImg.classList.remove('active');
                transitionImg.classList.add('active');
            } else {
                baseImg.classList.add('active');
                transitionImg.classList.remove('active');
            }
        });

        // Intercept wheel events so the user naturally scrolls the internal box 
        // until it hits the top/bottom, then allows the page to continue scrolling.
        chefSection.addEventListener('wheel', (e) => {
            const scrollTop = chefTextScroll.scrollTop;
            const scrollHeight = chefTextScroll.scrollHeight - chefTextScroll.clientHeight;
            
            const isAtTop = scrollTop <= 0;
            const isAtBottom = Math.abs(scrollHeight - scrollTop) <= 1;

            if (e.deltaY > 0 && !isAtBottom) {
                // Scrolling down and text hasn't reached the end yet
                chefTextScroll.scrollTop += e.deltaY;
                e.preventDefault();
            } else if (e.deltaY < 0 && !isAtTop) {
                // Scrolling up and text hasn't reached the top yet
                chefTextScroll.scrollTop += e.deltaY;
                e.preventDefault();
            }
            // Otherwise, let the page scroll normally when at the boundaries!
        }, { passive: false });
    }
});
