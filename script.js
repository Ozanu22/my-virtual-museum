document.addEventListener('DOMContentLoaded', () => {
    const museumContainer = document.getElementById('museum-container');
    const loadingMessage = document.getElementById('loading-message');

    // Your actual sheet.best API URL goes here!
    const SHEET_BEST_API_URL = 'https://api.sheetbest.com/sheets/4466bd80-7666-4e3f-9081-66465747bf41';

    fetch(SHEET_BEST_API_URL)
        .then(response => {
            if (!response.ok) {
                // If the response isn't OK (e.g., 404, 500 status)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove loading message once data is fetched
            loadingMessage.remove();

            if (data.length === 0) {
                museumContainer.innerHTML = '<p>No artifacts found. Please check your Google Sheet and Sheet.Best setup.</p>';
                return;
            }

            data.forEach(artifact => {
                const card = document.createElement('div');
                card.classList.add('artifact-card');

                // Construct image HTML conditionally
                let imageHtml = '';
                // Check if 'Image Link' exists and is a non-empty string that looks like a URL
                if (artifact['Image Link'] && typeof artifact['Image Link'] === 'string' && artifact['Image Link'].startsWith('http')) {
                    imageHtml = `<img src="${artifact['Image Link']}" alt="Image of ${artifact.Name}">`;
                } else {
                    // Optional: Add a placeholder image or a message if no valid image link is found
                    imageHtml = `<p>Image not available for ${artifact.Name}</p>`;
                    console.warn(`No valid image link found for artifact: ${artifact.Name}`);
                }

                // Accessing properties using dot notation or bracket notation for names with spaces
                card.innerHTML = `
                    <h2>${artifact.Name}</h2>
                    ${imageHtml} <p><strong>Description:</strong> ${artifact.Description}</p>
                    <p><strong>Findspot:</strong> ${artifact.Findspot}</p>
                    <p><strong>Date:</strong> ${artifact.Date}</p>
                    <p><strong>Material:</strong> ${artifact.Material}</p>
                `;
                museumContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching artifacts:', error);
            loadingMessage.textContent = 'Failed to load artifacts. Please check your internet connection or the API URL.';
            loadingMessage.style.color = 'red';
        });
});
