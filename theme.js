document.addEventListener('DOMContentLoaded', () => {
    // --- THEME CONTROLLER ---
    const themeController = document.querySelector('.theme-controller');
    if (themeController) {
        const applyTheme = () => {
            const currentTheme = localStorage.getItem('theme') || 'corporate'; // Default to corporate
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeController.checked = currentTheme === 'business';
        };

        applyTheme(); // Set theme on initial load

        themeController.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'business' : 'corporate';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // --- AUTO-HIDING HEADER ---
    const header = document.getElementById('main-header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                // Scrolling Down
                header.classList.add('navbar-hidden');
            } else {
                // Scrolling Up
                header.classList.remove('navbar-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }
});