// main.js - Simplified and optimized for Ikoriko website
// Ready for direct GitHub copy-paste

// --- REVIEW CARD FUNCTION (unique to main page) ---
function createReviewCard(review) {
    return `
    <div class="carousel-item">
        <div class="bg-base-100 rounded-lg shadow-md border border-base-300 flex flex-col p-6 w-80 h-full">
            <div class="flex-grow">
                <svg class="w-10 h-10 text-primary opacity-20 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <h2 class="text-xl font-semibold text-base-content mt-2">${review.title}</h2>
                <p class="text-base-content/70 mt-2 leading-relaxed">${review.body}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-base-300 text-left">
                <p class="font-semibold text-base-content">${review.name}</p>
                <p class="text-sm text-base-content/60">${review.date}</p>
            </div>
        </div>
    </div>`;
}

// --- CAROUSEL MOVEMENT USING UTILITIES ---
function moveCarousel(category, direction) {
    if (typeof IkorikoUtils !== 'undefined') {
        IkorikoUtils.moveCarousel(category, direction);
    } else {
        // Fallback if utilities not loaded
        const carousel = document.getElementById(`${category}-carousel`);
        if (!carousel) return;
        
        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        const isMobile = window.innerWidth < 768;
        const pageSize = isMobile ? 1 : 4;
        const itemWidth = items[0].offsetWidth + 16;
        const moveDistance = itemWidth * pageSize;
        
        if (direction > 0) {
            carousel.scrollBy({ left: moveDistance, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -moveDistance, behavior: 'smooth' });
        }
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main.js initializing...');
    
    // Check if utilities and database are loaded
    if (typeof IkorikoUtils === 'undefined') {
        console.warn('⚠️ IkorikoUtils not found. Some features may not work.');
    }
    
    if (typeof productsDatabase === 'undefined') {
        console.warn('⚠️ ProductsDatabase not found. Products will not load.');
        return;
    }

    // Populate product carousels using utilities
    const categories = ['gym', 'armwrestling', 'accessories'];
    categories.forEach(category => {
        const track = document.getElementById(`${category}-carousel`);
        if (track && productsDatabase[category]) {
            track.innerHTML = '';
            
            productsDatabase[category].forEach(product => {
                if (typeof IkorikoUtils !== 'undefined') {
                    // Use utility function if available
                    track.innerHTML += IkorikoUtils.createProductCard(product, true);
                } else {
                    // Fallback product card creation
                    const finalLink = `products/product.html?id=${product.id}`;
                    track.innerHTML += `
                    <div class="carousel-item">
                        <div class="product-card bg-base-100 rounded-lg shadow-md border border-base-300 flex flex-col overflow-hidden w-80 h-full">
                            <div class="relative">
                                <img src="${product.image}" alt="${product.title}" class="h-56 w-full object-cover">
                                ${product.isNew ? `<div class="absolute top-0 left-0 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded-br-lg">ახალი</div>` : ''}
                            </div>
                            <div class="p-4 flex flex-col flex-grow">
                                <div class="flex-grow">
                                    <div class="flex justify-between items-start min-h-[3.5rem]">
                                        <h2 class="text-lg font-semibold text-base-content flex-1 pr-2">${product.title}</h2>
                                        <p class="text-lg font-bold text-primary">${product.price}</p>
                                    </div>
                                    <p class="text-sm text-base-content/70 mt-1">${product.brand || 'Ikoriko'}</p>
                                    <div class="flex items-center mt-2">
                                        <span class="text-sm text-base-content/60">${product.reviewCount || 0} შეფასება</span>
                                    </div>
                                    <div class="mt-2 min-h-[2.5rem]">
                                        ${product.specs ? product.specs.map(spec => `<p class="text-sm text-base-content/70">${spec}</p>`).join('') : ''}
                                    </div>
                                </div>
                                <div class="mt-6 text-center">
                                    <a href="${finalLink}" class="text-primary hover:underline font-semibold text-sm">დეტალების ნახვა</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
            });
            
            console.log(`✅ Loaded ${productsDatabase[category].length} ${category} products`);
        }
    });
    
    // Populate reviews carousel
    const reviewsTrack = document.getElementById('reviews-carousel');
    if (reviewsTrack && typeof reviewsDatabase !== 'undefined') {
        reviewsTrack.innerHTML = '';
        reviewsDatabase.forEach(review => {
            reviewsTrack.innerHTML += createReviewCard(review);
        });
        console.log(`✅ Loaded ${reviewsDatabase.length} reviews`);
    }
    
    // Initialize smooth scroll for anchor links (fallback)
    if (typeof IkorikoUtils === 'undefined') {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
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
    }
    
    console.log('✅ Main.js initialization complete');
});

// Make moveCarousel available globally for buttons
window.moveCarousel = moveCarousel;
