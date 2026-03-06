document.addEventListener('DOMContentLoaded', () => {
    // Determine if mobile (disable heavy JS effects on small screens)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // --- INITIAL REVEAL ---
    setTimeout(() => {
        document.querySelector('.hero-experimental').classList.add('loaded');
    }, 100);

    // --- CUSTOM CURSOR ---
    if (!isMobile) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            // Delay for smooth follow effect
            setTimeout(() => {
                cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }, 80);
        });

        const hoverTargets = document.querySelectorAll('.hover-target, a, button');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.style.width = '0px';
                cursorFollower.style.width = '80px';
                cursorFollower.style.height = '80px';
                cursorFollower.style.background = 'rgba(255, 255, 255, 0.1)';
                cursorFollower.style.borderColor = 'transparent';
                cursorFollower.style.mixBlendMode = 'difference';
            });
            target.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
                cursorFollower.style.background = 'transparent';
                cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                cursorFollower.style.mixBlendMode = 'normal';
            });
        });
    }

    // --- MENU TOGGLE ---
    const menuToggle = document.getElementById('menuToggle');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
        body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });

    // --- INTERSECTION OBSERVER FOR REVEALS ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealElements = document.querySelectorAll('.reveal-fade');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- PARALLAX BACKGROUND TEXT & IMAGES ---
    if (!isMobile) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Text parallax
            const hugeText = document.querySelector('.huge-bg-text');
            if (hugeText) {
                const speed = hugeText.getAttribute('data-speed');
                hugeText.style.transform = `translateY(${scrollY * speed}px)`;
            }

            // Image Parallax slightly
            const parallaxImg = document.querySelector('.parallax-img img');
            if (parallaxImg) {
                const rect = parallaxImg.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    parallaxImg.style.transform = `translateY(${(-10 + rect.top * 0.05)}%) scale(1.05)`;
                }
            }
        });
    }

    // --- HORIZONTAL SCROLL SECTION ---
    const solutionsSection = document.getElementById('solutions');
    const stickyWrapper = document.querySelector('.sticky-wrapper');
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');

    if (!isMobile && solutionsSection && horizontalContainer) {
        // Calculate the total width to scroll
        const setupHorizontalScroll = () => {
            const scrollWidth = horizontalContainer.scrollWidth - window.innerWidth + 100; // added padding
            solutionsSection.style.height = `${scrollWidth + window.innerHeight}px`;

            window.addEventListener('scroll', () => {
                const sectionTop = solutionsSection.getBoundingClientRect().top;

                if (sectionTop <= 0 && sectionTop >= -scrollWidth) {
                    horizontalContainer.style.transform = `translateX(${sectionTop}px)`;
                } else if (sectionTop > 0) {
                    horizontalContainer.style.transform = `translateX(0px)`;
                } else {
                    horizontalContainer.style.transform = `translateX(-${scrollWidth}px)`;
                }
            });
        };

        // Run after fonts/images load
        setTimeout(setupHorizontalScroll, 500);
        window.addEventListener('resize', setupHorizontalScroll);
    }

    // --- SERVICES ACCORDION HOVER IMAGE REVEAL ---
    if (!isMobile) {
        const accordionItems = document.querySelectorAll('.accordion-item');
        const previewEl = document.querySelector('.accordion-image-preview');

        accordionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const imgUrl = item.getAttribute('data-img');
                previewEl.style.backgroundImage = `url('${imgUrl}')`;
                previewEl.style.opacity = '1';

                accordionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });

            item.addEventListener('mousemove', (e) => {
                // Fixed position follower
                previewEl.style.left = `${e.clientX}px`;
                previewEl.style.top = `${e.clientY}px`;
            });

            item.addEventListener('mouseleave', () => {
                previewEl.style.opacity = '0';
                item.classList.remove('active');
            });
        });
    }

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Form submission 
    const contactForm = document.querySelector('.minimal-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Request submitted. We will be in touch shortly.');
            contactForm.reset();
        });
    }
});
