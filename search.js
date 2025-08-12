// Search functionality for Ikoriko website

// Fallback search using local database if Algolia isn't configured
function initializeLocalSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults || !window.productsDatabase) {
        console.warn('Search components not found or products database not loaded');
        return;
    }
    
    // Combine all products from all categories
    const allProducts = [
        ...productsDatabase.gym,
        ...productsDatabase.armwrestling, 
        ...productsDatabase.accessories
    ];
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Hide results if query is empty
        if (!query) {
            searchResults.classList.add('hidden');
            return;
        }
        
        // Debounce search to avoid too many rapid searches
        searchTimeout = setTimeout(() => {
            performLocalSearch(query, allProducts, searchResults);
        }, 300);
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.classList.add('hidden');
        }
    });
    
    // Show search results when focusing on search input
    searchInput.addEventListener('focus', function() {
        const query = this.value.trim().toLowerCase();
        if (query) {
            searchResults.classList.remove('hidden');
        }
    });
}

function performLocalSearch(query, products, resultsContainer) {
    // Simple search algorithm - match title, brand, or specs
    const matchedProducts = products.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(query);
        const brandMatch = product.brand && product.brand.toLowerCase().includes(query);
        const specsMatch = product.specs && product.specs.some(spec => 
            spec.toLowerCase().includes(query)
        );
        
        return titleMatch || brandMatch || specsMatch;
    }).slice(0, 8); // Limit to 8 results
    
    displaySearchResults(matchedProducts, resultsContainer, query);
}

function displaySearchResults(products, container, query) {
    if (products.length === 0) {
        container.innerHTML = `
            <div class="p-4 text-center text-base-content/60">
                <div class="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p>არ მოიძებნა "${query}" მოთხოვნით შედეგები</p>
                <p class="text-sm mt-1">სცადეთ სხვადასხვა სიტყვები</p>
            </div>
        `;
        container.classList.remove('hidden');
        return;
    }
    
    const resultsHTML = products.map(product => `
        <div class="border-b border-base-300 last:border-b-0">
            <a href="products/product.html?id=${product.id}" class="flex items-center gap-4 p-4 hover:bg-base-200 transition-colors group">
                <img src="${product.image}" alt="${product.title}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-base-content group-hover:text-primary transition-colors truncate">${highlightMatch(product.title, query)}</h3>
                    <p class="text-sm text-base-content/70">${product.brand || 'Ikoriko'}</p>
                    <p class="text-sm font-bold text-primary">${product.price}</p>
                </div>
                <div class="flex items-center text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </a>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
    container.classList.remove('hidden');
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</mark>');
}

// Algolia search initialization (if credentials are available)
function initializeAlgoliaSearch() {
    // This would be used if Algolia is configured with proper app ID and API key
    // For now, we'll use the fallback local search
    console.info('Algolia search not configured, using local search fallback');
    initializeLocalSearch();
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for products database to load
    if (window.productsDatabase) {
        initializeAlgoliaSearch();
    } else {
        // Wait for products database to load
        const checkDatabase = setInterval(() => {
            if (window.productsDatabase) {
                clearInterval(checkDatabase);
                initializeAlgoliaSearch();
            }
        }, 100);
    }
});