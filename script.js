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
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');

    const isTabletOrMobile = window.matchMedia("(max-width: 1024px)").matches;

    if (!isTabletOrMobile && solutionsSection && horizontalContainer) {
        let scrollWidth = 0;
        let animationFrameId = null;

        const updateDimensions = () => {
            // Calculate the total scrollable width
            const containerWidth = horizontalContainer.scrollWidth;
            scrollWidth = containerWidth - window.innerWidth;

            if (scrollWidth > 0) {
                // Set the section height to control the scroll duration
                // The + window.innerHeight ensures there's enough room to scroll
                solutionsSection.style.height = `${scrollWidth + window.innerHeight}px`;
            }
        };

        const onScroll = () => {
            if (animationFrameId) return;

            animationFrameId = requestAnimationFrame(() => {
                const sectionRect = solutionsSection.getBoundingClientRect();
                const sectionTop = sectionRect.top;
                const sectionHeight = sectionRect.height;
                const scrollRange = sectionHeight - window.innerHeight;

                // Calculate percentage of scroll within the section
                // Only act if the section is active/pinned
                if (scrollRange > 0) {
                    let scrollProgress = -sectionTop / scrollRange;
                    scrollProgress = Math.max(0, Math.min(1, scrollProgress));

                    const translateX = scrollProgress * scrollWidth;
                    horizontalContainer.style.transform = `translateX(${-translateX}px)`;
                }

                animationFrameId = null;
            });
        };

        // Initial setup
        updateDimensions();

        // Use ResizeObserver for more reliable dimension tracking
        // ONLY observe the container (content) to avoid layout loops with the section (parent)
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
            onScroll();
        });
        resizeObserver.observe(horizontalContainer);

        window.addEventListener('scroll', onScroll, { passive: true });

        // Ensure recalculation after images load
        const images = horizontalContainer.querySelectorAll('img');
        images.forEach(img => {
            if (img.complete) {
                updateDimensions();
            } else {
                img.addEventListener('load', updateDimensions);
            }
        });

        // Cleanup on mobile/tablet switch
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        const handleMediaChange = (e) => {
            if (e.matches) {
                solutionsSection.style.height = '';
                horizontalContainer.style.transform = '';
                window.removeEventListener('scroll', onScroll);
                resizeObserver.disconnect();
            } else {
                window.addEventListener('scroll', onScroll, { passive: true });
                resizeObserver.observe(horizontalContainer);
                updateDimensions();
            }
        };
        mediaQuery.addEventListener('change', handleMediaChange);

    } else if (solutionsSection) {
        solutionsSection.style.height = '';
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
                previewEl.style.transform = 'translateY(-50%) scale(1)';

                accordionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });

            item.addEventListener('mouseleave', () => {
                previewEl.style.opacity = '0';
                previewEl.style.transform = 'translateY(-50%) scale(0.9)';
                item.classList.remove('active');
            });
        });
    }

    // --- CORE VALUES SLIDER LOGIC ---
    const valuesSlider = document.getElementById('valuesSlider');
    const valueTiles = document.querySelectorAll('.value-tile');

    if (valuesSlider && valueTiles.length > 0) {
        let activeIndex = 0;
        let autoSlideInterval;

        const updateActiveTile = () => {
            const containerCenter = valuesSlider.scrollLeft + (valuesSlider.offsetWidth / 2);
            let closestTile = null;
            let minDistance = Infinity;
            let newIndex = 0;

            valueTiles.forEach((tile, index) => {
                const tileCenter = tile.offsetLeft + (tile.offsetWidth / 2);
                const distance = Math.abs(containerCenter - tileCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestTile = tile;
                    newIndex = index;
                }
            });

            activeIndex = newIndex;
            valueTiles.forEach(tile => {
                if (tile === closestTile) {
                    tile.classList.add('active');
                } else {
                    tile.classList.remove('active');
                }
            });
        };

        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                activeIndex = (activeIndex + 1) % valueTiles.length;
                const nextTile = valueTiles[activeIndex];
                const scrollPos = nextTile.offsetLeft + (nextTile.offsetWidth / 2) - (valuesSlider.offsetWidth / 2);
                valuesSlider.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }, 3000);
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
        };

        valuesSlider.addEventListener('scroll', updateActiveTile);
        valuesSlider.addEventListener('mouseenter', stopAutoSlide);
        valuesSlider.addEventListener('mouseleave', startAutoSlide);
        valuesSlider.addEventListener('touchstart', stopAutoSlide);
        valuesSlider.addEventListener('touchend', startAutoSlide);

        // Initial call after a short delay to ensure layout is ready
        setTimeout(() => {
            updateActiveTile();
            startAutoSlide();
        }, 300);

        window.addEventListener('resize', updateActiveTile);
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
