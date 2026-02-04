// Application state
let articles = [];
let brandIcons = {};
let currentPage = 1;
const articlesPerPage = 25;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadBrandIcons();
    loadArticles();
    setupPagination();
    setCurrentYear();
});

// Set current year in footer
function setCurrentYear() {
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Load brand icons mapping from JSON file
async function loadBrandIcons() {
    try {
        const response = await fetch('json/brand-icons.json');
        if (response.ok) {
            brandIcons = await response.json();
        }
    } catch (error) {
        console.warn('Brand icons mapping not loaded:', error);
    }
}

// Load articles from JSON file
async function loadArticles() {
    try {
        const response = await fetch('json/Northstar.json');
        
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        
        const rawArticles = await response.json();
        articles = Array.isArray(rawArticles)
            ? rawArticles.filter(hasRequiredFields)
            : [];
        displayArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        displayError('Unable to load articles. Please try again later.');
    }
}

// Display articles for current page
function displayArticles() {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const pageArticles = articles.slice(startIndex, endIndex);

    // Clear existing content
    const featuredSection = document.getElementById('featured-articles');
    const regularSection = document.getElementById('regular-articles');
    featuredSection.innerHTML = '';
    regularSection.innerHTML = '';

    if (pageArticles.length === 0) {
        displayError('No articles found.');
        return;
    }

    // Page 1: Show 1 full-width top story + 9 articles in 3-column grid
    // Other pages: Show all articles in blog style
    if (currentPage === 1) {
        const topStory = pageArticles.slice(0, 1);
        const gridArticles = pageArticles.slice(1, 10);
        const regularArticles = pageArticles.slice(10);

        // Display top story (full width)
        if (topStory.length > 0) {
            const topStoryContainer = document.createElement('div');
            topStoryContainer.className = 'top-story-container';
            topStoryContainer.appendChild(createTopStoryArticle(topStory[0]));
            featuredSection.appendChild(topStoryContainer);
        }

        // Display grid articles (3 per row)
        if (gridArticles.length > 0) {
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid-container';
            
            gridArticles.forEach(article => {
                gridContainer.appendChild(createFeaturedArticle(article));
            });
            
            featuredSection.appendChild(gridContainer);
        }

        // Display remaining articles in blog style
        regularArticles.forEach(article => {
            regularSection.appendChild(createRegularArticle(article));
        });
    } else {
        // All articles in blog style for pages 2+
        pageArticles.forEach(article => {
            regularSection.appendChild(createRegularArticle(article));
        });
    }

    // Update pagination
    updatePagination();
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Create a top story article element (full width with large image)
function createTopStoryArticle(article) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'top-story-article';
    const hasValidUrl = isValidUrl(article.url);
    if (hasValidUrl) {
        articleDiv.style.cursor = 'pointer';
    }
    
    // Make entire article clickable
    if (hasValidUrl) {
        articleDiv.addEventListener('click', (e) => {
            // Don't trigger if clicking on the read more link directly
            if (e.target.tagName !== 'A') {
                window.open(article.url, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // Add image if available
    if (article.image_url) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'top-story-image';
        const img = document.createElement('img');
        img.src = article.image_url;
        img.alt = article.title;
        img.loading = 'eager';
        imageDiv.appendChild(img);
        articleDiv.appendChild(imageDiv);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'top-story-content-wrapper';

    const brandIcon = createBrandIcon(article.brand);
    const contentDiv = document.createElement('div');
    contentDiv.className = 'article-content';

    const brandSpan = document.createElement('span');
    brandSpan.className = 'article-brand';
    brandSpan.textContent = article.brand;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'article-date';
    dateSpan.textContent = formatDate(article.date);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'article-meta';
    metaDiv.appendChild(brandSpan);
    metaDiv.appendChild(dateSpan);

    const title = document.createElement('h1');
    title.textContent = article.title;

    const blurb = document.createElement('p');
    blurb.className = 'article-blurb';
    blurb.textContent = article.blurb;

    let link = null;
    if (hasValidUrl) {
        link = document.createElement('a');
        link.href = article.url;
        link.className = 'read-more';
        link.textContent = 'Read More';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    contentDiv.appendChild(metaDiv);
    contentDiv.appendChild(title);
    contentDiv.appendChild(blurb);
    if (link) {
        contentDiv.appendChild(link);
    }

    contentWrapper.appendChild(brandIcon);
    contentWrapper.appendChild(contentDiv);
    articleDiv.appendChild(contentWrapper);

    return articleDiv;
}

// Create a featured article element
function createFeaturedArticle(article) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'featured-article';
    const hasValidUrl = isValidUrl(article.url);
    if (hasValidUrl) {
        articleDiv.style.cursor = 'pointer';
    }
    
    // Make entire article clickable
    if (hasValidUrl) {
        articleDiv.addEventListener('click', (e) => {
            // Don't trigger if clicking on the read more link directly
            if (e.target.tagName !== 'A') {
                window.open(article.url, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // Add image if available
    if (article.image_url) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'article-image';
        const img = document.createElement('img');
        img.src = article.image_url;
        img.alt = article.title;
        img.loading = 'lazy';
        imageDiv.appendChild(img);
        articleDiv.appendChild(imageDiv);
    }

    // Create wrapper for icon and meta info side by side
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'article-content-wrapper';

    const brandIcon = createBrandIcon(article.brand);
    
    const metaContainer = document.createElement('div');
    metaContainer.style.flex = '1';

    const brandSpan = document.createElement('span');
    brandSpan.className = 'article-brand';
    brandSpan.textContent = article.brand;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'article-date';
    dateSpan.textContent = formatDate(article.date);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'article-meta';
    metaDiv.appendChild(brandSpan);
    metaDiv.appendChild(dateSpan);

    metaContainer.appendChild(metaDiv);
    contentWrapper.appendChild(brandIcon);
    contentWrapper.appendChild(metaContainer);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'article-content';

    const title = document.createElement('h2');
    title.textContent = article.title;

    const blurb = document.createElement('p');
    blurb.className = 'article-blurb';
    blurb.textContent = article.blurb;

    let link = null;
    if (hasValidUrl) {
        link = document.createElement('a');
        link.href = article.url;
        link.className = 'read-more';
        link.textContent = 'Read More';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    contentDiv.appendChild(title);
    contentDiv.appendChild(blurb);
    if (link) {
        contentDiv.appendChild(link);
    }

    articleDiv.appendChild(contentWrapper);
    articleDiv.appendChild(contentDiv);

    return articleDiv;
}

// Create a regular article element
function createRegularArticle(article) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'regular-article';
    const hasValidUrl = isValidUrl(article.url);
    if (hasValidUrl) {
        articleDiv.style.cursor = 'pointer';
    }
    
    // Make entire article clickable
    if (hasValidUrl) {
        articleDiv.addEventListener('click', (e) => {
            // Don't trigger if clicking on the read more link directly
            if (e.target.tagName !== 'A') {
                window.open(article.url, '_blank', 'noopener,noreferrer');
            }
        });
    }

    const brandIcon = createBrandIcon(article.brand);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'article-details';

    const brandSpan = document.createElement('span');
    brandSpan.className = 'article-brand';
    brandSpan.textContent = article.brand;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'article-date';
    dateSpan.textContent = formatDate(article.date);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'article-meta';
    metaDiv.appendChild(brandSpan);
    metaDiv.appendChild(dateSpan);

    const title = document.createElement('h3');
    title.textContent = article.title;

    const blurb = document.createElement('p');
    blurb.className = 'article-blurb';
    blurb.textContent = article.blurb;

    let link = null;
    if (hasValidUrl) {
        link = document.createElement('a');
        link.href = article.url;
        link.className = 'read-more';
        link.textContent = 'Read More';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    detailsDiv.appendChild(metaDiv);
    detailsDiv.appendChild(title);
    detailsDiv.appendChild(blurb);
    if (link) {
        detailsDiv.appendChild(link);
    }

    articleDiv.appendChild(brandIcon);
    articleDiv.appendChild(detailsDiv);

    return articleDiv;
}

// Create a brand icon (image if available, otherwise placeholder circle)
function createBrandIcon(brandName) {
    const icon = document.createElement('div');
    icon.className = 'article-brand-icon';
    
    // Check if brand has an associated icon image
    if (brandIcons[brandName]) {
        const img = document.createElement('img');
        img.src = brandIcons[brandName];
        img.alt = brandName;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '10px';
        icon.appendChild(img);
        return icon;
    }
    
    // Default to blue circle with initials
    
    // Get initials from brand name
    const initials = brandName
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    icon.textContent = initials;
    icon.title = brandName;
    
    return icon;
}

// Setup pagination event listeners
function setupPagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayArticles();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(articles.length / articlesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayArticles();
        }
    });
}

// Update pagination display
function updatePagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    const totalPages = Math.ceil(articles.length / articlesPerPage);

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Display error message
function displayError(message) {
    const featuredSection = document.getElementById('featured-articles');
    featuredSection.innerHTML = `<div class="error">${message}</div>`;
}

// Validate required fields for an article
function hasRequiredFields(article) {
    return Boolean(
        article &&
        typeof article.title === 'string' && article.title.trim() &&
        typeof article.url === 'string' && article.url.trim() &&
        typeof article.brand === 'string' && article.brand.trim() &&
        typeof article.blurb === 'string' && article.blurb.trim()
    );
}

// Validate URL format (http/https)
function isValidUrl(value) {
    if (typeof value !== 'string') return false;
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
