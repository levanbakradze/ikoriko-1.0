// utils.js - Consolidated utilities for Ikoriko website
// Ready for direct GitHub copy-paste

const IkorikoUtils = {
    // Unified star rating generator
    generateStarRating(rating, reviewCount = 0) {
        if (!rating) rating = 0;
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`;
        }
        
        // Half star
        if (halfStar) {
            stars += `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`;
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += `<svg class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`;
        }
        
        return `<div class="flex items-center mt-2">${stars}${reviewCount ? `<span class="text-sm text-base-content/60 ml-2">${reviewCount}</span>` : ''}</div>`;
    },

    // Enhanced product card generator
    createProductCard(product, isCarousel = true) {
        if (!product) return '';
        
        const finalLink = `products/product.html?id=${product.id}`;
        const wrapperClass = isCarousel ? 'carousel-item' : '';
        
        return `
            ${wrapperClass ? `<div class="${wrapperClass}">` : ''}
                <div class="product-card bg-base-100 rounded-lg shadow-md border border-base-300 flex flex-col overflow-hidden w-80 h-full">
                    <div class="relative group">
                        <img src="${product.image || ''}" alt="${product.title || ''}" class="h-56 w-full object-cover">
                        ${product.isNew ? `<div class="absolute top-0 left-0 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded-br-lg">ახალი</div>` : ''}
                        <div class="absolute top-2 right-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            ხელნაკეთი ✋
                        </div>
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <div class="flex-grow">
                            <div class="flex justify-between items-start min-h-[3.5rem]">
                                <h2 class="text-lg font-semibold text-base-content flex-1 pr-2">${product.title || 'უსახელო პროდუქტი'}</h2>
                                <p class="text-lg font-bold text-primary">${product.price || '₾0'}</p>
                            </div>
                            <p class="text-sm text-base-content/70 mt-1">${product.brand || 'Ikoriko'}</p>
                            ${this.generateStarRating(product.rating || 0, product.reviewCount || 0)}
                            <div class="mt-2 min-h-[2.5rem]">
                                ${product.specs ? product.specs.map(spec => `<p class="text-sm text-base-content/70">${spec}</p>`).join('') : ''}
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="text-center">
                                <a href="${finalLink}" class="text-primary hover:underline font-semibold text-sm">
                                    დეტალების ნახვა
                                </a>
                            </div>
                            <div class="craftsman-signature mt-2 text-center">
                                ხელით დამზადებული ივერის მიერ
                            </div>
                        </div>
                    </div>
                </div>
            ${wrapperClass ? '</div>' : ''}
        `;
    },

    // Safe carousel movement
    moveCarousel(category, direction) {
        const carousel = document.getElementById(`${category}-carousel`);
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        const isMobile = window.innerWidth < 768;
        const pageSize = isMobile ? 1 : 4;
        
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = items[0].offsetWidth + 16;
        const moveDistance = itemWidth * pageSize;
        
        if (direction > 0) {
            carousel.scrollBy({ left: moveDistance, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -moveDistance, behavior: 'smooth' });
        }
    },

    // Theme management
    initTheme() {
        const themeController = document.querySelector('.theme-controller');
        if (!themeController) return;

        try {
            const savedTheme = localStorage.getItem('theme') || 'corporate';
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeController.checked = savedTheme === 'business';

            themeController.addEventListener('change', (e) => {
                const theme = e.target.checked ? 'business' : 'corporate';
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        } catch (error) {
            console.log('Theme initialization completed:', error);
        }
    },

    // Smooth scrolling
    initSmoothScroll() {
        try {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: Math.max(0, targetPosition),
                            behavior: 'smooth'
                        });
                    }
                });
            });
        } catch (error) {
            console.log('Smooth scroll initialization completed:', error);
        }
    },

    // Navbar hiding
    initNavbarHiding() {
        const header = document.getElementById('main-header');
        if (!header) return;

        try {
            let lastScrollTop = 0;

            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                    header.classList.add('navbar-hidden');
                } else {
                    header.classList.remove('navbar-hidden');
                }
                
                lastScrollTop = Math.max(0, scrollTop);
            }, { passive: true });
        } catch (error) {
            console.log('Navbar hiding completed:', error);
        }
    },

    // Initialize all features
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
            return;
        }

        try {
            this.initTheme();
            this.initSmoothScroll();
            this.initNavbarHiding();
            console.log('✅ IkorikoUtils initialized successfully');
        } catch (error) {
            console.log('IkorikoUtils initialization completed with warnings:', error);
        }
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IkorikoUtils.init());
} else {
    IkorikoUtils.init();
}

// Make available globally
window.IkorikoUtils = IkorikoUtils;

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IkorikoUtils;
}
