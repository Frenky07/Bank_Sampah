// Hidden Navbar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbar-toggle');

    // Navbar hide/show on scroll
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past 100px
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Toggle navbar manually
    navbarToggle.addEventListener('click', function() {
        navbar.classList.toggle('navbar-visible');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Additional features
    
    // Hide navbar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        const isToggleButton = navbarToggle.contains(event.target);
        
        if (!isClickInsideNav && !isToggleButton && navbar.classList.contains('navbar-visible')) {
            navbar.classList.remove('navbar-visible');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        // Remove manual visibility class on desktop
        if (window.innerWidth > 768) {
            navbar.classList.remove('navbar-visible');
        }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to hide navbar
        if (e.key === 'Escape' && navbar.classList.contains('navbar-visible')) {
            navbar.classList.remove('navbar-visible');
        }
        
        // Press 'M' to toggle navbar (for accessibility)
        if (e.key === 'm' || e.key === 'M') {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                navbar.classList.toggle('navbar-visible');
            }
        }
    });

    // Throttle scroll events for better performance
    let ticking = false;
    
    function updateNavbar() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }

    // Replace the original scroll event with throttled version
    window.removeEventListener('scroll', arguments.callee);
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
});