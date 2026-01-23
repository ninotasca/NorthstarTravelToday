// Load existing articles and display example
let existingArticles = [];

window.addEventListener('DOMContentLoaded', async () => {
    // Display example
    const exampleJson = {
        title: "Your Article Title",
        url: "https://example.com/article",
        brand: "Brand Name",
        blurb: "A brief description of the article",
        image_url: "https://example.com/image.jpg",
        date: "2026-01-22"
    };
    document.getElementById('example-json').textContent = JSON.stringify(exampleJson, null, 2);
    
    // Load existing articles
    await loadExistingArticles();
});

async function loadExistingArticles() {
    try {
        const response = await fetch('json/Northstar.json');
        existingArticles = await response.json();
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

async function mergeArticles() {
    const input = document.getElementById('new-json').value.trim();
    const statusMessage = document.getElementById('status-message');
    const mergeBtn = document.getElementById('merge-btn');
    
    // Clear previous messages
    statusMessage.textContent = '';
    statusMessage.className = 'message';
    
    if (!input) {
        statusMessage.textContent = 'Please paste some JSON first.';
        statusMessage.classList.add('error');
        return;
    }
    
    // Parse JSON
    let newArticles;
    try {
        newArticles = JSON.parse(input);
    } catch (e) {
        statusMessage.textContent = 'Invalid JSON format. Please check your syntax.';
        statusMessage.classList.add('error');
        return;
    }
    
    // Ensure it's an array
    if (!Array.isArray(newArticles)) {
        newArticles = [newArticles];
    }
    
    // Validate required fields and add defaults
    for (let article of newArticles) {
        if (!article.title || !article.url || !article.brand || !article.blurb) {
            statusMessage.textContent = 'Error: Each article must have title, url, brand, and blurb.';
            statusMessage.classList.add('error');
            return;
        }
        
        // Add defaults for optional fields
        if (!article.image_url) {
            article.image_url = null;
        }
        if (!article.date) {
            article.date = new Date().toISOString().split('T')[0];
        }
    }
    
    // Merge: new articles go to the top
    const mergedArticles = [...newArticles, ...existingArticles];
    
    // Download the merged JSON
    const jsonString = JSON.stringify(mergedArticles, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Northstar.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    statusMessage.textContent = `Success! Added ${newArticles.length} article(s). Northstar.json downloaded. Replace the file in json/ folder and refresh the site.`;
    statusMessage.classList.add('success');
    
    // Clear input
    document.getElementById('new-json').value = '';
}
