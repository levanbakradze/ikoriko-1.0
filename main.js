// --- HELPER FUNCTION FOR STAR RATINGS ---
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < fullStars; i++) { stars += `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`; }
    if (halfStar) { stars += `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`; }
    for (let i = 0; i < emptyStars; i++) { stars += `<svg class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`; }
    return stars;
}

// --- PRODUCT CARD FUNCTION ---
function createProductCard(product) {
    const finalLink = `products/product.html?id=${product.id}`;
    return `
    <div class="carousel-item">
        <div class="product-card bg-base-100 rounded-lg shadow-md border border-base-300 flex flex-col overflow-hidden w-80 h-full">
            <div class="relative">
                <img src="${product.image}" alt="${product.title}" class="h-56 w-full object-cover">
                ${product.isNew ? `<div class="absolute top-0 left-0 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded-br-lg">ახალი</div>` : ''}
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <div class="flex-grow">
                    <div class="flex justify-between items-start min-h-[3.5rem]"><h2 class="text-lg font-semibold text-base-content flex-1 pr-2">${product.title}</h2><p class="text-lg font-bold text-primary">${product.price}</p></div>
                    <p class="text-sm text-base-content/70 mt-1">${product.brand || 'Ikoriko'}</p>
                    <div class="flex items-center mt-2">${generateStarRating(product.rating || 0)}<span class="text-sm text-base-content/60 ml-2">${product.reviewCount || 0}</span></div>
                    <div class="mt-2 min-h-[2.5rem]">${product.specs ? product.specs.map(spec => `<p class="text-sm text-base-content/70">${spec}</p>`).join('') : ''}</div>
                </div>
                <div class="mt-6 text-center"><a href="${finalLink}" class="text-primary hover:underline font-semibold text-sm">დეტალების ნახვა</a></div>
            </div>
        </div>
    </div>`;
}

// --- REVIEW CARD FUNCTION ---
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

// --- CAROUSEL LOGIC ---
const carouselState = { gym: { index: 0 }, armwrestling: { index: 0 }, accessories: { index: 0 }, reviews: { index: 0 } };

// --- UPDATED CAROUSEL FUNCTION for Responsive Scrolling ---
function moveCarousel(category, direction) {
    const state = carouselState[category];
    const carouselElement = document.getElementById(`${category}-carousel`);
    if (!carouselElement) return;

    const items = carouselElement.getElementsByClassName('carousel-item');
    const totalItems = items.length;
    if (totalItems === 0) return;

    // Check window width to determine how many items to scroll
    let pageSize = (window.innerWidth >= 768) ? 4 : 1; // 4 for desktop/tablet, 1 for mobile

    let newIndex = state.index + (direction * pageSize);

    // Boundary checks to loop the carousel
    if (newIndex >= totalItems) {
        newIndex = 0; // Go back to the start
    }
    if (newIndex < 0) {
        // Go to the start of the last page, considering the page size
        newIndex = Math.floor((totalItems - 1) / pageSize) * pageSize;
    }
    
    // Make sure we don't go to an index that doesn't exist
    state.index = Math.min(newIndex, totalItems - 1);
    
    const targetItem = items[state.index];
    if(targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    // Populate carousels...
    const gymTrack = document.getElementById('gym-carousel');
    if (gymTrack) {
        gymTrack.innerHTML = '';
        productsDatabase.gym.forEach(p => gymTrack.innerHTML += createProductCard(p));
    }
    const armwrestlingTrack = document.getElementById('armwrestling-carousel');
    if (armwrestlingTrack) {
        armwrestlingTrack.innerHTML = '';
        productsDatabase.armwrestling.forEach(p => armwrestlingTrack.innerHTML += createProductCard(p));
    }
    const accessoriesTrack = document.getElementById('accessories-carousel');
    if (accessoriesTrack) {
        accessoriesTrack.innerHTML = '';
        productsDatabase.accessories.forEach(p => accessoriesTrack.innerHTML += createProductCard(p));
    }
    const reviewsTrack = document.getElementById('reviews-carousel');
    if (reviewsTrack) {
        reviewsTrack.innerHTML = '';
        reviewsDatabase.forEach(r => reviewsTrack.innerHTML += createReviewCard(r));
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});