const getImageBtn = document.getElementById('getImageBtn');
const selectBreed = document.getElementById('dog-breed');
const selectSubBreed = document.getElementById('sub-breed');
const subBreedSelectContainer = document.querySelector('.sub-breed-container');
const imageGallery = document.getElementById('image-gallery');

// Fetch breeds from the dog API
async function fetchBreeds() {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const breedsData = await response.json();
    return breedsData;
}

// Populate breed options
function populateBreeds(breedsData) {
    const breeds = breedsData.message;
    for (const breed in breeds) {
        const option = document.createElement('option');
        option.innerHTML = breed;
        option.value = breed;
        selectBreed.appendChild(option);
    }
}

// Fetch sub-breeds for the selected breed
async function fetchSubBreeds(breed) {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
    const subBreeds = await response.json();
    return subBreeds;
}

// Populate sub-breed options
function populateSubBreeds(subBreeds) {
    selectSubBreed.innerHTML = ''; // Clear previous sub-breed options
    if (subBreeds.message.length > 0) {
        const option = document.createElement('option');
        option.innerHTML = 'All';
        option.value = '';
        selectSubBreed.appendChild(option);
        subBreeds.message.forEach(subBreed => {
            const option = document.createElement('option');
            option.innerHTML = subBreed;
            option.value = subBreed;
            selectSubBreed.appendChild(option);
        });
        selectSubBreed.disabled = false;
        selectSubBreed.style.display = 'block';
    } else {
        selectSubBreed.disabled = true;
        selectSubBreed.style.display = 'none';
    }
}

// Fetches images from the dog API
async function fetchDogImages(breed, subBreed = '') {
    let url = `https://dog.ceo/api/breed/${breed}`;
    if (subBreed !== '') {
        url += `/${subBreed}`;
    }
    url += '/images/random/10'; // Fetch 10 images

    const response = await fetch(url);
    const dogData = await response.json();
    return dogData;
}

// Get image button click event listener
getImageBtn.addEventListener('click', () => {
    const breed = selectBreed.value;
    const subBreed = selectSubBreed.value;

    fetchDogImages(breed, subBreed)
        .then(data => {
            if (data.message) {
                let html = '';
                data.message.forEach(image => {
                    html += `<img src="${image}" alt="">`;
                });
                imageGallery.innerHTML = html;
            } else {
                alert("Images not found, please select valid options");
            }
        })
        .catch(error => {
            console.error('Error fetching dog images:', error);
        });
});

// Select breed event listener
selectBreed.addEventListener('change', () => {
    const breed = selectBreed.value;
    if (breed !== '') {
        fetchSubBreeds(breed)
            .then(subBreeds => {
                populateSubBreeds(subBreeds);
            })
            .catch(error => {
                console.error('Error fetching sub-breeds:', error);
            });
    } else {
        selectSubBreed.innerHTML = '';
        selectSubBreed.disabled = true;
        selectSubBreed.style.display = 'none';
    }
});

// Fetch breeds and populate options on page load
fetchBreeds()
    .then(breedsData => {
        populateBreeds(breedsData);
    })
    .catch(error => {
        console.error('Error fetching breeds:', error);
    });