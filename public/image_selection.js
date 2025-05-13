// Array of image paths
const images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let currentImageIndex = 0;

let selectedPoints = {};


// DOM elements
const imageContainer = document.getElementById('image-container');
const coordinatesDisplay = document.getElementById('coordinates-display');
const nextButton = document.getElementById('next-button');

// Load and display current image
function loadImage() {
    imageContainer.innerHTML = `
        <img src="${images[currentImageIndex]}" alt="Selection Image" id="selection-image">
    `;
    coordinatesDisplay.textContent = '';
}

// Handle image click
function handleImageClick(event) {
    const img = document.getElementById('selection-image');
    const rect = img.getBoundingClientRect();
    
    // Calculate relative coordinates
    const x = (event.clientX - rect.left)/rect.width;
    const y = (event.clientY - rect.top)/rect.height;   
    // Store coordinates with image name
    selectedPoints[currentImageIndex] = {
        imageName: images[currentImageIndex],
        coordinates: {x, y}
    };
    
    // Display coordinates
    coordinatesDisplay.textContent = `Selected Point: (${x}, ${y})`;
    
    // Enable next button
    nextButton.disabled = false;
}

// Handle next button click
async function handleNextClick() {

    currentImageIndex++;
    if (currentImageIndex < images.length) {
        loadImage();
        nextButton.disabled = true;
    } else {
        // All images processed
        console.log('All points selected with image names:', selectedPoints);


        
        // Get user info from sessionStorage
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        
        // Send data to server
        try {
            const response = await fetch('/complete-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userInfo,
                    selectedPoints
                })
            });

            if (response.ok) {
                // Clear session storage and redirect
                sessionStorage.removeItem('userInfo');
                window.location.href = '/index.html';
            } else {
                alert('Error completing registration. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }

    }
}

// Initialize the application
(function() {
    shuffleArray(images);
    loadImage();
    
    imageContainer.addEventListener('click', handleImageClick);
    nextButton.addEventListener('click', handleNextClick);
})();
