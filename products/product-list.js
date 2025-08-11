const categoryTitles = {
    'all': 'ყველა პროდუქტი',
    'gym': 'დარბაზის დანადგარები',
    'armwrestling': 'მკლავჭიდის სავარჯიშო დანადგარები',
    'accessories': 'მკლავჭიდის აქსესუარები'
};

let currentProducts = [];
let currentPage = 1;
const productsPerPage = 9;

// --- NEW HELPER FUNCTION FOR STAR RATINGS ---
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

// --- NEW PRODUCT CARD FUNCTION ---
// This version is for the grid, so it doesn't have the "carousel-item" wrapper.
function createProductCard(product) {
    const finalLink = `product.html?id=${product.id}`;

    return `
        <div class="product-card bg-base-100 rounded-lg shadow-md border border-base-300 flex flex-col overflow-hidden h-full">
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
                        ${generateStarRating(product.rating || 0)}
                        <span class="text-sm text-base-content/60 ml-2">${product.reviewCount || 0}</span>
                    </div>
                    <div class="mt-2 min-h-[2.5rem]">
                        ${product.specs ? product.specs.map(spec => `<p class="text-sm text-base-content/70">${spec}</p>`).join('') : ''}
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <a href="${finalLink}" class="text-primary hover:underline font-semibold text-sm">
                        დეტალების ნახვა
                    </a>
                </div>
            </div>
        </div>
    `;
}

// --- ORIGINAL FUNCTIONS (UNCHANGED FROM YOUR FILE) ---
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = currentProducts.slice(startIndex, startIndex + productsPerPage);
    if (paginatedProducts.length === 0) {
        grid.innerHTML = '<p class="text-center col-span-full text-lg">პროდუქტები არ მოიძებნა.</p>';
        return;
    }
    paginatedProducts.forEach(product => {
        grid.innerHTML += createProductCard(product);
    });
    // grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Optional: can be annoying
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    pagination.innerHTML = '';
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    if (totalPages <= 1) return;
    const prevBtn = document.createElement('button');
    prevBtn.className = `join-item btn ${currentPage === 1 ? 'btn-disabled' : ''}`;
    prevBtn.innerHTML = '«';
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderProducts(); renderPagination(); window.scrollTo(0, 0);} };
    pagination.appendChild(prevBtn);
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `join-item btn ${i === currentPage ? 'btn-active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => { currentPage = i; renderProducts(); renderPagination(); window.scrollTo(0, 0);};
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const ellipsis = document.createElement('button');
            ellipsis.className = 'join-item btn btn-disabled';
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }
    const nextBtn = document.createElement('button');
    nextBtn.className = `join-item btn ${currentPage === totalPages ? 'btn-disabled' : ''}`;
    nextBtn.innerHTML = '»';
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderProducts(); renderPagination(); window.scrollTo(0, 0); } };
    pagination.appendChild(nextBtn);
}

function filterProducts(category) {
    currentPage = 1;
    if (typeof productsDatabase === 'undefined') { return; }
    if (category === 'all') {
        currentProducts = [...productsDatabase.gym, ...productsDatabase.armwrestling, ...productsDatabase.accessories];
    } else {
        currentProducts = productsDatabase[category] || [];
    }
    const pageTitle = document.getElementById('page-title');
    const breadcrumb = document.getElementById('breadcrumb-category');
    if (pageTitle) pageTitle.textContent = categoryTitles[category] || 'პროდუქტები';
    if (breadcrumb) breadcrumb.textContent = categoryTitles[category] || 'პროდუქტები';
    
    // Highlighting logic for the new menu structure
    document.querySelectorAll('#filter-menu li a').forEach(a => {
        const li = a.parentElement;
        if (a.id === `cat-${category}`) {
            li.classList.add('active', 'bordered');
        } else {
            li.classList.remove('active', 'bordered');
        }
    });

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('category', category);
    window.history.pushState({}, '', newUrl);
    renderProducts();
    renderPagination();
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('products-grid')) { return; }
    
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '<div class="col-span-full flex justify-center"><span class="loading loading-spinner loading-lg"></span></div>';
    
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    
    const initializeProducts = () => {
        if (typeof productsDatabase !== 'undefined') {
            filterProducts(category);
        } else {
            setTimeout(initializeProducts, 50);
        }
    };
    initializeProducts();
});

window.filterProducts = filterProducts;