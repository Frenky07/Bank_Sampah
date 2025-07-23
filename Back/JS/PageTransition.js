window.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const pageOrder = [
        'Dashboard.html',
        'Setoran_Sampah.html',
        'Manajeman_Sampah.html',
        'Struk.html'    
    ]

    const currentPage = window.location.pathname.split('/').pop();
    const slideFrom = sessionStorage.getItem('slideFrom');

    if (slideFrom === 'right') {
        body.classList.add('slide-in-right');
    } else if (slideFrom === 'left') {
        body.classList.add('slide-in-left');
    } else if (slideFrom === 'fade') {
        body.classList.add('fade-in');
    }

    setTimeout(() => {
        body.classList.add('animate-in');
        body.classList.remove('slide-in-right', 'slide-in-left', 'fade-in');
        sessionStorage.removeItem('slideFrom');
    }, 10);

    document.querySelectorAll('.Navbar-Item').forEach(link => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        link.addEventListener('click', function (e) {
            e.preventDefault();

            if(href.includes('Login_page')) {
                body.classList.add('-put');
                sessionStorage.setItem('slideForm','Fade');
                return setTimeout(() => window.location.href - href, 500);
            }

            const targetPage = href.split('/').pop();
            const currentIndex = pageOrder.indexOf(currentPage);
            const targetIndex = pageOrder.indexOf(targetPage);

            let direction = 'right';
            if (href.includes('Dashboard')) {
                direction = 'left';
            } else if (href.includes('Login_Page')) {
                direction = 'fade';
            }

            if (direction === 'left') {
                body.classList.add('slide-out-right');
            } else if (direction === 'right') {
                body.classList.add('slide-out-left');
            } else {
                body.classList.add('fade-out');
            }

            sessionStorage.setItem('slideFrom', direction);

            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
});
