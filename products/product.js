// --- GLOBAL VARIABLES FOR MODAL ---
let galleryImages = [];
let currentImageIndex = 0;

// --- STAR RATING GENERATOR ---
function generateStarRating(rating, reviewCount) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < fullStars; i++) { stars += `<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" disabled />`; }
    if (halfStar) { stars += `<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" disabled />`; }
    for (let i = 0; i < emptyStars; i++) { stars += `<input type="radio" name="rating-2" class="mask mask-star-2 bg-gray-300" disabled />`; }
    
    let starHTML = `<div class="rating rating-sm">${stars}</div>`;
    starHTML = starHTML.replace(/bg-orange-400"( disabled)?( \/>)$/, 'bg-orange-400" disabled checked$2');

    return `
        <div class="flex items-center mt-3 gap-2">
            <span class="font-bold text-lg">${rating.toFixed(1)}</span>
            ${starHTML}
            <span class="text-base-content/70 underline hover:text-primary">(${reviewCount} reviews)</span>
        </div>`;
}

// --- IMAGE GALLERY & MODAL FUNCTIONS ---
function changeImage(thumbnailElement, newSrc, index) {
    document.getElementById('mainImage').src = newSrc;
    currentImageIndex = index;
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    Array.from(thumbnailContainer.children).forEach(thumb => {
        thumb.classList.remove('border-primary');
        thumb.classList.add('border-transparent');
    });
    thumbnailElement.classList.add('border-primary');
    thumbnailElement.classList.remove('border-transparent');
}

function openModal() {
    const imageModal = document.getElementById('imageModal');
    document.getElementById('modalImage').src = galleryImages[currentImageIndex];
    imageModal.classList.remove('hidden');
    imageModal.classList.add('flex');
}

function closeModal() {
    const imageModal = document.getElementById('imageModal');
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
}

function navigateModal(direction) {
    currentImageIndex += direction;
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    document.getElementById('modalImage').src = galleryImages[currentImageIndex];
}

window.changeImage = changeImage;
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateModal = navigateModal;

// --- NEW: RELATED PRODUCT CARD FUNCTION ---
function createRelatedProductCard(product) {
    return `
        <div class="card product-card bg-base-100 shadow-xl border border-transparent hover:border-primary transition-all duration-300 h-full">
            <figure class="px-4 pt-4">
                <a href="product.html?id=${product.id}" class="block h-48 w-full">
                    <img src="${product.image}" alt="${product.title}" class="rounded-xl h-full w-full object-cover" />
                </a>
            </figure>
            <div class="card-body items-center text-center p-4">
                <h2 class="card-title text-base line-clamp-2 min-h-[3rem]">${product.title}</h2>
                <p class="font-bold text-primary text-lg mt-2">${product.price}</p>
                <div class="card-actions mt-4">
                    <a href="product.html?id=${product.id}" class="btn btn-secondary btn-sm">დეტალების ნახვა</a>
                </div>
            </div>
        </div>
    `;
}

// --- NEW: FUNCTION TO LOAD RELATED PRODUCTS ---
function loadRelatedProducts(currentProductId) {
    const allProducts = [...productsDatabase.gym, ...productsDatabase.armwrestling, ...productsDatabase.accessories];
    
    const otherProducts = allProducts.filter(p => p.id != currentProductId);
    for (let i = otherProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherProducts[i], otherProducts[j]] = [otherProducts[j], otherProducts[i]];
    }

    const related = otherProducts.slice(0, 4);
    const grid = document.getElementById('related-products-grid');
    const section = document.getElementById('related-products-section');

    if (grid && section && related.length > 0) {
        grid.innerHTML = related.map(product => createRelatedProductCard(product)).join('');
    } else if (section) {
        section.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- MAIN FUNCTION TO LOAD PRODUCT ---
    const loadProductContent = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const container = document.getElementById('product-container');

        if (!productId || !detailedProductsDatabase[productId]) {
            container.innerHTML = '<p class="text-center text-xl">პროდუქტი ვერ მოიძებნა.</p>';
            return;
        }

        const product = detailedProductsDatabase[productId];
        galleryImages = product.images;

        const allProducts = [...productsDatabase.gym, ...productsDatabase.armwrestling, ...productsDatabase.accessories];
        const summaryProduct = allProducts.find(p => p.id == productId) || { rating: 0, reviewCount: 0 };
        
        const thumbnailsHTML = product.images.map((imgSrc, index) => `
            <div class="w-20 h-20 p-1 border-2 ${index === 0 ? 'border-primary' : 'border-transparent'} rounded-lg cursor-pointer hover:border-primary bg-base-100" 
                 onclick="window.changeImage(this, '${imgSrc}', ${index})">
                <img src="${imgSrc}" alt="Thumbnail ${index + 1}" class="thumbnail-img">
            </div>
        `).join('');

        const specsHTML = Object.entries(product.specs).map(([key, value]) => `
            <li class="flex justify-between"><span>${key}:</span> <span class="font-semibold text-right">${value}</span></li>
        `).join('');

        const productHTML = `
            <div class="mb-6">
                <a href="product-list.html" class="btn btn-ghost text-base-content/70 hover:bg-base-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    უკან დაბრუნება
                </a>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div class="flex flex-col items-center">
                    <div class="card bg-base-100 shadow-xl w-full">
                        <figure class="p-4 cursor-pointer" onclick="window.openModal()">
                            <img id="mainImage" src="${product.images[0]}" alt="${product.title}" class="main-product-image" />
                        </figure>
                    </div>
                    <div id="thumbnailContainer" class="flex justify-center flex-wrap mt-4 gap-2">
                        ${thumbnailsHTML}
                    </div>
                </div>

                <div class="flex flex-col justify-center">
                    <h1 class="text-4xl lg:text-5xl font-extrabold">${product.title}</h1>
                    <p class="text-3xl font-bold text-primary my-3">${product.price}</p>
                    
                    ${generateStarRating(summaryProduct.rating, summaryProduct.reviewCount)}

                    <div class="mt-4">
                        <p class="text-lg font-semibold text-base-content">${product.brand}</p>
                    </div>

                    <div class="mt-6">
                        <h2 class="text-xl font-semibold">აღწერა</h2>
                        <p class="text-base-content/80 mt-2 leading-relaxed">${product.description}</p>
                    </div>

                    <div class="mt-8">
                        <div class="collapse collapse-plus bg-base-100 shadow-sm rounded-lg">
                            <input type="checkbox" checked />
                            <div class="collapse-title text-xl font-medium">მახასიათებლები</div>
                            <div class="collapse-content">
                                <ul class="list-none mt-2 text-base-content/80 space-y-2">
                                    ${specsHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8">
                         <a href="https://wa.me/+995577627547" target="_blank" class="btn btn-success btn-lg text-white w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.458l-6.354 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.451-4.437-9.884-9.888-9.884-5.452 0-9.885 4.434-9.888 9.884-.002 2.024.604 3.965 1.735 5.62l.235.391-1.085 3.962 4.051-1.062.398.243z"/></svg>
                            შეძენა WhatsApp-ზე
                         </a>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = productHTML;
        document.getElementById('dynamic-title').textContent = product.title + ' - ხელნაკეთი დანადგარები';

        // Load related products after main content is loaded
        loadRelatedProducts(productId);
    };

    loadProductContent();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});