// Get references to the HTML elements
const getImageBtn = document.getElementById('getImageBtn');
const selectBreed = document.getElementById('dog-breed');
const selectSubBreed = document.getElementById('sub-breed');
const subBreedSelectContainer = document.querySelector('.sub-breed-container');
const imageGallery = document.getElementById('image-gallery');

// Fetch breeds from the dog API
async function fetchBreeds() {
    const response = await fetch('https://dog.ceo/api/breeds/list/all'); // is used to send an HTTP request to the specified URL and wait for the response to be resolved before proceeding with the code execution.
    const breedsData = await response.json(); // API is returning JSON data, so response.json() is used to extract the JSON data from the response.
    return breedsData; // return the data to the function call
}

// Fetch breeds and populate options on page load
// After getting the array list from the async function fetchBreeds(), now we have to use the data for drop down list
fetchBreeds()
    .then(breedData => {
        populateBreeds(breedData); // Fetch breeds and populate breed options on page load
    })
    .catch(error => {
        console.error('Error fetching breeds:', error); // Log any errors while fetching breeds
    });


// The populateBreeds() function is used to populate the breed options in an HTML select dropdown based on the data passed to it.
// This function used to give the drop dwon list of the breeds.
function populateBreeds(breedsData) {
    // This line extracts the message property from the breedsData object and assigns it to the breeds variable.
    const breeds = breedsData.message; 
    // This is a for...in loop that iterates over each key in the breeds object. In this case, each key represents a dog breed.
    for (const breed in breeds) {
        // Create a new HTML option element for each breed and it is necessary because Since we don't know the exact number of breeds in advance, we need a way to dynamically create breed options based on the available data.
        const option = document.createElement('option'); 
        option.innerHTML = breed; // : It sets the text content of the option to the name of the dog breed, which is represented by the breed variable.
        option.value = breed; // It sets the value attribute of the option to the name of the dog breed. 
        selectBreed.appendChild(option); // Add the option to the breed select dropdown
    }
}

// Fetch sub-breeds for the selected breed
async function fetchSubBreeds(breed) {
    // In this URL, {breed} is a placeholder that should be replaced with the actual name of the dog breed for which you want to fetch the list of sub-breeds. For example, if you want to fetch the sub-breeds for the breed "hound," you would replace {breed} with hound
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`); // Here we use backticks because of ${}.
    const subBreeds = await response.json(); // API is returning JSON data, so response.json() is used to extract the JSON data from the response.
    return subBreeds; // return the data to the function call
}

// Populate sub-breed options
function populateSubBreeds(subBreeds) {
    //  if we didn't use it The new sub-breeds will be appended to the existing options in the selectSubBreed dropdown instead of replacing them.
    //  and The dropdown will show a mixture of the old and new sub-breeds, which might be confusing for the user.
     selectSubBreed.innerHTML = ''; // Clear previous sub-breed options from the drop dwon
    // If there are sub-breeds available for the selected breed
     if (subBreeds.message.length > 0) { 
        const option = document.createElement('option'); // Create an option for "All" sub-breeds
        option.innerHTML = 'All'; 
        option.value = ''; // It sets the value attribute of the option to an empty string. 
        selectSubBreed.appendChild(option); // Add the "All" option to the sub-breed select dropdown
        subBreeds.message.forEach(subBreed => { // This is a loop that iterates through each sub-breed in the subBreeds array.
            const option = document.createElement('option'); // Create new HTML option elements for each sub-breed
            option.innerHTML = subBreed; // Set the sub-breed name as the option's text content
            option.value = subBreed; // Set the sub-breed name as the option's value
            selectSubBreed.appendChild(option); // Add the sub-breed option to the sub-breed select dropdown
        });
        selectSubBreed.disabled = false; // Enable the sub-breed select dropdown
        selectSubBreed.style.display = 'block'; // Show the sub-breed select dropdown
    } else {
        selectSubBreed.disabled = true; // Disable the sub-breed select dropdown
        selectSubBreed.style.display = 'none'; // Hide the sub-breed select dropdown
    }
}

// Fetches images from the dog API
// subBreed = '' , why? // Here if we didn't provide a value for subBreed, the function will use the default value, which is an empty string.
// And if we didn't use it as empty string the the function without providing a value for subBreed, the parameter will be undefined.
//Inside the function, the code may not handle undefined correctly, and it could lead to unexpected behavior or errors.
async function fetchDogImages(breed, subBreed = '') { 
    let url = `https://dog.ceo/api/breed/${breed}`; // This initializes the url variable with the base URL for the Dog CEO's Dog API, including the selected breed.
    if (subBreed !== '') { // If a sub-breed is selected, add it to the API URL
        url += `/${subBreed}`; // is equivalent to url = url + /${subBreed};, where url is the original URL containing the main breed, and ${subBreed} is the selected sub-breed.
    }
    url += '/images/random/100'; // Fetch 100 random images for the selected breed/sub-breed
    //After our URL is set now we have fetch it.
    const response = await fetch(url); // Fetch the dog images
    const dogData = await response.json(); // Extract JSON data from the response
    return dogData;
}

// Get image button click event listener
getImageBtn.addEventListener('click', () => {
    const breed = selectBreed.value; // Get the selected breed
    const subBreed = selectSubBreed.value; // Get the selected sub-breed

    fetchDogImages(breed, subBreed)
    // This is a Promise chain. When the fetchDogImages function resolves successfully and returns data, the .then block is executed. The fetched data is available as data inside the arrow function.
        .then(data => {
            if (data.message) { // This conditional statement checks if the fetched data contains a message property. 
            // This initializes an empty string html that will be used to store the HTML code for displaying the dog images.   
                let html = '';
            // This loop iterates through each URL in the message array (which contains the URLs of the dog images).            
                data.message.forEach(image => { // Image is work as a i in the for loop.
                html += `<img src="${image}" alt="">`; // Generate HTML for displaying the dog images
                });
                imageGallery.innerHTML = html; // Display the dog images in the image gallery
            } else {
                alert("Images not found, please select valid options"); // Show an alert if no images are found
            }
        })
        // If there is an error while fetching the dog images, it will be caught in the .catch block, and an error message will be logged to the console.
        .catch(error => {
            console.error('Error fetching dog images:', error); // Log any errors while fetching dog images
        });
});

// Select breed event listener
// Why we needed this event? // Ans :- When the page loads, the first dropdown will show all the available dog breeds, but the second dropdown will be empty and disabled. You won't see any sub-breeds listed.
selectBreed.addEventListener('change', () => {
    const breed = selectBreed.value; // Get the selected breed
    if (breed !== '') { // If a breed is selected
        fetchSubBreeds(breed)
            .then(subBreeds => {
                populateSubBreeds(subBreeds); // Fetch and populate sub-breed options for the selected breed
            })
            .catch(error => {
                console.error('Error fetching sub-breeds:', error); // Log any errors while fetching sub-breeds
            });
    } else {
        selectSubBreed.innerHTML = ''; // If no breed is selected, clear the sub-breed options
        selectSubBreed.disabled = true; // Disable the sub-breed select dropdown
        selectSubBreed.style.display = 'none'; // Hide the sub-breed select dropdown
    }
});

