// Loading Screen Script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Stylesheet for Loading Screen dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/loading.css';
    document.head.appendChild(link);

    // 2. Inject Premium Preloader HTML markup dynamically
    const preloaderHTML = `
        <div class="page-loader">
            <div class="loader-container">
                <div class="loader-glow"></div>
                <svg class="progress-ring" width="160" height="160">
                    <circle class="progress-ring-circle-bg" cx="80" cy="80" r="65" stroke="rgba(255,255,255,0.05)" stroke-width="4" fill="transparent" />
                    <circle class="progress-ring-circle" cx="80" cy="80" r="65" stroke="#00ff44" stroke-width="4" fill="transparent" />
                </svg>
                <svg class="loader-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <!-- Left Wave (Solid Green) -->
                    <path d="M52,22 C47,25 38,32 38,44 C38,53 46,58 48,63 C49,67 46,70 46,70 C46,70 52,65 52,55 C52,47 43,42 46,34 C48,28 51,21 51,21 Z" fill="#00ff44" />
                    <!-- Right Wave (Solid Green) -->
                    <path d="M52,22 C47,25 38,32 38,44 C38,53 46,58 48,63 C49,67 46,70 46,70 C46,70 52,65 52,55 C52,47 43,42 46,34 C48,28 51,21 51,21 Z" fill="#00ff44" transform="rotate(180 50 50)" />
                </svg>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

    const loader = document.querySelector('.page-loader');
    const circle = document.querySelector('.progress-ring-circle');

    if (!loader) return;

    // Set initial overflow hidden on body while loading
    document.body.style.overflow = 'hidden';

    let circumference = 408; // fallback
    if (circle) {
        const radius = circle.r.baseVal.value || 65;
        circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
    }

    // --- Dynamic Component Loader (Navbar & Footer) ---
    const loadComponent = async (placeholderId, url) => {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const html = await response.text();
                    placeholder.innerHTML = html;
                }
            } catch (err) {
                console.error(`Error loading ${url}:`, err);
            }
        }
    };

    // Initialize layout components concurrently in the background
    Promise.all([
        loadComponent('navbar-placeholder', 'navbar.html'),
        loadComponent('footer-placeholder', 'footer.html')
    ]).then(() => {
        // Highlight active navbar link
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '') || 'index';
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // Initialize scroll listener for navbar header
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
        
        // Build Mobile Navigation Menu
        const desktopNavList = document.querySelector('.nav-list');
        const offcanvasBody = document.querySelector('.offcanvas-body');
        
        if (desktopNavList && offcanvasBody) {
            // Clone the desktop nav list
            const mobileNavList = desktopNavList.cloneNode(true);
            mobileNavList.className = 'mobile-nav-list';
            
            // Insert it before the contact info in offcanvas
            const offcanvasText = offcanvasBody.querySelector('.offcanvas-text');
            if (offcanvasText) {
                offcanvasText.insertAdjacentElement('afterend', mobileNavList);
            } else {
                offcanvasBody.appendChild(mobileNavList);
            }
            
            // Add click handlers for mobile dropdowns
            const mobileDropdowns = mobileNavList.querySelectorAll('.dropdown > a, .dropdown-submenu > a');
            mobileDropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('active');
                });
            });
        }
    });

    // Animation helper
    function runLoader(duration, onComplete) {
        let startTime = null;

        function animateLoader(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Update progress ring stroke-dashoffset
            if (circle) {
                const offset = circumference - progress * circumference;
                circle.style.strokeDashoffset = offset;
            }

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                if (onComplete) {
                    onComplete();
                }
            }
        }

        requestAnimationFrame(animateLoader);
    }

    // Initial load animation (2.5 seconds)
    runLoader(2500, () => {
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            document.body.style.overflow = '';
            setTimeout(() => {
                loader.style.display = 'none';
                // Trigger an event so main.js knows loader is done
                document.dispatchEvent(new Event('loaderFinished'));
            }, 800);
        }, 100);
    });
});
