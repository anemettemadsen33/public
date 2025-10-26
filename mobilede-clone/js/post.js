// Post Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initPostForm();
    initImageUpload();
});

function initPostForm() {
    const postForm = document.getElementById('postForm');
    
    if (!postForm) return;
    
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validatePostForm()) {
            handleFormSubmit();
        }
    });
}

function validatePostForm() {
    let isValid = true;
    
    // Validate marca
    isValid = utils.validateField('marca', 'marcaError', function(value) {
        if (!value) {
            return { valid: false, message: 'Te rog selectează marca' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate model
    isValid = utils.validateField('model', 'modelError', function(value) {
        if (!value || value.trim().length < 2) {
            return { valid: false, message: 'Te rog introdu modelul (minim 2 caractere)' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate an
    isValid = utils.validateField('an', 'anError', function(value) {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (!value || year < 1990 || year > currentYear + 1) {
            return { valid: false, message: `Anul trebuie să fie între 1990 și ${currentYear + 1}` };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate km
    isValid = utils.validateField('km', 'kmError', function(value) {
        const km = parseInt(value);
        if (!value || km < 0 || km > 500000) {
            return { valid: false, message: 'Kilometrajul trebuie să fie între 0 și 500,000' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate combustibil
    isValid = utils.validateField('combustibil', 'combustibilError', function(value) {
        if (!value) {
            return { valid: false, message: 'Te rog selectează tipul de combustibil' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate transmisie
    isValid = utils.validateField('transmisie', 'transmisieError', function(value) {
        if (!value) {
            return { valid: false, message: 'Te rog selectează tipul de transmisie' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate pret
    isValid = utils.validateField('pret', 'pretError', function(value) {
        const price = parseInt(value);
        if (!value || price < 500 || price > 1000000) {
            return { valid: false, message: 'Prețul trebuie să fie între 500 și 1,000,000 €' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate descriere
    isValid = utils.validateField('descriere', 'descriereError', function(value) {
        if (!value || value.trim().length < 50) {
            return { valid: false, message: 'Descrierea trebuie să aibă cel puțin 50 de caractere' };
        }
        return { valid: true };
    }) && isValid;
    
    // Validate contact fields
    isValid = utils.validateField('contactNume', 'contactNumeError', function(value) {
        if (!value || value.trim().length < 3) {
            return { valid: false, message: 'Te rog introdu numele (minim 3 caractere)' };
        }
        return { valid: true };
    }) && isValid;
    
    isValid = utils.validateField('contactTelefon', 'contactTelefonError', function(value) {
        const phoneRegex = /^[\d\s+()-]+$/;
        if (!value || value.trim().length < 10 || !phoneRegex.test(value)) {
            return { valid: false, message: 'Te rog introdu un număr de telefon valid' };
        }
        return { valid: true };
    }) && isValid;
    
    isValid = utils.validateField('contactEmail', 'contactEmailError', function(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
            return { valid: false, message: 'Te rog introdu o adresă de email validă' };
        }
        return { valid: true };
    }) && isValid;
    
    return isValid;
}

function handleFormSubmit() {
    const formData = new FormData(document.getElementById('postForm'));
    const data = Object.fromEntries(formData);
    
    // Get images
    const images = window.uploadedImages || [];
    
    // Create listing object
    const listing = {
        id: Date.now(), // Generate unique ID
        marca: data.marca,
        model: data.model,
        an: parseInt(data.an),
        km: parseInt(data.km),
        combustibil: data.combustibil,
        transmisie: data.transmisie,
        pret: parseInt(data.pret),
        descriere: data.descriere,
        imagine: images[0] || 'https://via.placeholder.com/400x200?text=No+Image',
        imagini: images,
        specificatii: {
            putere: data.putere || '',
            culoare: data.culoare || '',
            numarUsi: '4',
            locuri: '5',
            emisiiCO2: '',
            normaPoluare: 'Euro 6'
        },
        contact: {
            nume: data.contactNume,
            telefon: data.contactTelefon,
            email: data.contactEmail
        }
    };
    
    // Log to console (in a real app, this would be an API call)
    console.log('New listing submitted:', listing);
    
    // Save to localStorage for demo purposes
    const savedListings = utils.storage.get('userListings') || [];
    savedListings.push(listing);
    utils.storage.set('userListings', savedListings);
    
    // Show success message
    utils.show('successMessage');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Redirect to details page after 2 seconds
    setTimeout(function() {
        window.location.href = `details.html?id=${listing.id}`;
    }, 2000);
}

function initImageUpload() {
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('images');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!imageUploadArea || !imageInput) return;
    
    // Initialize uploaded images array
    window.uploadedImages = [];
    
    // Click to upload
    imageUploadArea.addEventListener('click', function() {
        imageInput.click();
    });
    
    // Handle file selection
    imageInput.addEventListener('change', function(e) {
        handleImageFiles(e.target.files);
    });
    
    // Drag and drop
    imageUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#3498db';
    });
    
    imageUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#ddd';
    });
    
    imageUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#ddd';
        handleImageFiles(e.dataTransfer.files);
    });
}

function handleImageFiles(files) {
    const imagePreview = document.getElementById('imagePreview');
    const imagesError = document.getElementById('imagesError');
    
    if (!files || files.length === 0) return;
    
    // Check max 10 images
    if (window.uploadedImages.length + files.length > 10) {
        imagesError.textContent = 'Poți încărca maximum 10 imagini';
        return;
    }
    
    // Process each file
    Array.from(files).forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            imagesError.textContent = 'Te rog încarcă doar fișiere imagine';
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            imagesError.textContent = 'Fiecare imagine trebuie să fie mai mică de 5MB';
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            window.uploadedImages.push(imageUrl);
            
            // Add to preview
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Preview';
            imagePreview.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    });
    
    // Clear error
    imagesError.textContent = '';
}
