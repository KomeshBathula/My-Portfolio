

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------
       1. Custom Cursor Logic
       ------------------------------------------------------------- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Check if device is desktop (coarse pointer check usually implies touch)
    const isDesktop = matchMedia('(pointer:fine)').matches;

    if (isDesktop && cursorDot && cursorOutline) {

        let mouseX = 0;
        let mouseY = 0;

        // Lagging cursor position
        let outlineX = 0;
        let outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Buttons and Links Hover Effect
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .story-card, .skill-badge, input, textarea');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });

        // Animation Loop for Smooth Trail
        const animateCursor = () => {
            // Lerp (Linear Interpolation) factor for delay (0.0 to 1.0)
            const speed = 0.15;

            outlineX += (mouseX - outlineX) * speed;
            outlineY += (mouseY - outlineY) * speed;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    }

    /* -------------------------------------------------------------
       2. Staggered Reveal Animations
       ------------------------------------------------------------- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // General fade-in elements
    document.querySelectorAll('.fade-in, .about-text, .about-img-wrapper').forEach(el => {
        el.classList.add('reveal'); // Ensure base class is present
        revealObserver.observe(el);
    });

    // Staggered Groups (Projects, Skills, Timeline, Stories)
    const staggerGroups = [
        document.querySelectorAll('.project-card'),
        document.querySelectorAll('.timeline-item'),
        document.querySelectorAll('.skill-category'),
        document.querySelectorAll('.story-card'),
        document.querySelectorAll('.hobby-item')
    ];

    staggerGroups.forEach(group => {
        group.forEach((el, index) => {
            el.classList.add('reveal');
            // Add dynamic delay driven by index
            el.style.transitionDelay = `${index * 100}ms`;
            revealObserver.observe(el);
        });
    });

    /* -------------------------------------------------------------
       3. Navbar Highlight & Smooth Scroll
       ------------------------------------------------------------- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjustment for offset
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll correction
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
