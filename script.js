document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    const html = document.documentElement;
    const themeDropdown = document.getElementById('theme-dropdown');
    const dropdownTrigger = themeDropdown.querySelector('.dropdown-trigger');
    const dropdownOptions = themeDropdown.querySelectorAll('.dropdown-options li');
    const currentValueSpan = themeDropdown.querySelector('.current-value');
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const settingsDropdown = document.getElementById('settings-dropdown');
    const colorDots = document.querySelectorAll('.color-dot');

    const getStoredTheme = () => localStorage.getItem('portfolio-theme') || 'system';
    const getStoredColor = () => localStorage.getItem('portfolio-color') || '#3b82f6';

    const applyColor = (color) => {
        document.documentElement.style.setProperty('--accent', color);

        // Dynamic Glows
        const root = document.querySelector(':root');
        const glowColor = `${color}22`; // 13% opacity
        root.style.setProperty('--accent-glow', glowColor);

        // Hero Gradient and Ambient Effects
        document.documentElement.style.setProperty('--gradient', `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`);

        // Update selection color
        const style = document.createElement('style');
        style.innerHTML = `::selection { background: ${color}; color: white; }`;
        document.head.appendChild(style);

        colorDots.forEach(dot => {
            if (dot.dataset.color === color) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    };

    const setThemeIcon = (mode) => {
        let htm = '';
        if (mode === 'light') htm = '<i class="ph ph-sun"></i>';
        else if (mode === 'dark') htm = '<i class="ph ph-moon"></i>';
        else htm = '<i class="ph ph-monitor"></i>';
        currentValueSpan.innerHTML = htm;
    };

    const applyTheme = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            html.dataset.theme = mode;
        } else {
            if (systemMedia.matches) html.dataset.theme = 'dark';
            else html.dataset.theme = 'light';
        }
        setThemeIcon(mode);

        // Update active class in dropdown
        dropdownOptions.forEach(opt => {
            if (opt.dataset.value === mode) opt.classList.add('active');
            else opt.classList.remove('active');
        });
    };

    // Initial Apply
    const initialMode = getStoredTheme();
    const initialColor = getStoredColor();
    applyTheme(initialMode);
    applyColor(initialColor);

    // Toggle Dropdowns
    const toggleDropdown = (el) => {
        const isOpen = el.classList.contains('open');
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
        if (!isOpen) el.classList.add('open');
    };

    themeDropdown.querySelector('.dropdown-trigger').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(themeDropdown);
    });

    settingsDropdown.querySelector('.dropdown-trigger').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(settingsDropdown);
    });

    // Theme Option Click
    dropdownOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedMode = option.dataset.value;
            localStorage.setItem('portfolio-theme', selectedMode);
            applyTheme(selectedMode);
            themeDropdown.classList.remove('open');
        });
    });

    // Color Selection
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.dataset.color;
            localStorage.setItem('portfolio-color', color);
            applyColor(color);
            settingsDropdown.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
    });

    systemMedia.addEventListener('change', () => {
        if (getStoredTheme() === 'system') {
            applyTheme('system');
        }
    });

    const revealItems = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));

    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    const setActiveNavLink = () => {
        let currentSection = '';

        // Detect if we are at the bottom of the page
        const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

        if (isBottom) {
            currentSection = sections[sections.length - 1].id;
        } else {
            sections.forEach((section) => {
                const top = section.offsetTop - 150;
                if (window.scrollY >= top) {
                    currentSection = section.id;
                }
            });
        }

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = href.slice(1);

            if (target === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Link Lenis scroll to nav highlighting
    lenis.on('scroll', setActiveNavLink);
    setActiveNavLink();

    document.querySelectorAll('.nav-link, .hero-actions a').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            lenis.scrollTo(targetId, {
                offset: -80,
                duration: 1.5
            });
        });
    });

    const fetchStats = async () => {
        const leetcodeEl = document.getElementById('leetcode-stats');
        const gfgEl = document.getElementById('gfg-stats');

        // LeetCode Stats
        try {
            const lcRes = await fetch('https://leetcode-stats-api.herokuapp.com/Komesh_Bathula');
            const lcData = await lcRes.json();
            if (lcData && lcData.status === 'success') {
                leetcodeEl.textContent = `${lcData.totalSolved} Problems Solved`;
                leetcodeEl.classList.add('stat-updated');
            } else {
                leetcodeEl.textContent = '200+ Problems Solved';
            }
        } catch (err) {
            console.error('LeetCode fetch error:', err);
            leetcodeEl.textContent = '200+ Problems Solved';
        }

        // GFG Stats - Using a more reliable unofficial API or more professional fallback
        try {
            // Updated GFG scraper API
            const gfgRes = await fetch('https://gfg-stats.vercel.app/api/profile/komeshbathula');
            const gfgData = await gfgRes.json();
            if (gfgData && (gfgData.totalSolved || gfgData.total_solved)) {
                const solvedCount = gfgData.totalSolved || gfgData.total_solved;
                gfgEl.textContent = `${solvedCount} Problems Solved`;
                gfgEl.classList.add('stat-updated');
            } else {
                gfgEl.textContent = '600+ Problems Solved';
            }
        } catch (err) {
            console.error('GFG fetch error:', err);
            gfgEl.textContent = '600+ Problems Solved';
        }
    };

    fetchStats();
});
