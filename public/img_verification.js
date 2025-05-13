// Array of image paths
const backendUrl = 'https://graphical-password-authentication-vnxk.onrender.com';

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
const tolerance = 0.05; // Tolerance for point verification

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

        // Get username from session storage
        const username = sessionStorage.getItem('username');

        // Send selected points to server for comparison
        try {
            const response = await fetch(`${backendUrl}/compare-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    selectedPoints: selectedPoints
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                if (result.message === 'Points match successfully!') {
                    window.location.href = '/home.html';
                } else {
                    window.location.href = '/signin.html';
                }
            } else {
                alert('Error comparing points. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while comparing points.');
        }
    }
}

const username = sessionStorage.getItem('username'); // Get username from session storage
console.log('Username:', username); // Log the username after redirecting

(function() {
    shuffleArray(images);
    loadImage();
    
    imageContainer.addEventListener('click', handleImageClick);
    nextButton.addEventListener('click', handleNextClick);
})();
