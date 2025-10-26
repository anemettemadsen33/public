// Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initDetailsPage();
    initContactModal();
});

async function initDetailsPage() {
    utils.showLoading('loadingState');
    
    try {
        // Get car ID from URL
        const params = utils.getUrlParams();
        const carId = parseInt(params.id);
        
        if (!carId) {
            throw new Error('No car ID provided');
        }
        
        // Load all cars
        const cars = await utils.loadCarsData();
        
        // Find the specific car
        const car = cars.find(c => c.id === carId);
        
        if (!car) {
            throw new Error('Car not found');
        }
        
        // Display car details
        displayCarDetails(car);
        
        utils.hideLoading('loadingState');
        utils.show('vehicleContent');
        
    } catch (error) {
        console.error('Error loading car details:', error);
        utils.hideLoading('loadingState');
        utils.show('notFound');
    }
}

function displayCarDetails(car) {
    // Set title
    const titleElement = document.getElementById('vehicleTitle');
    if (titleElement) {
        titleElement.textContent = `${car.marca} ${car.model}`;
    }
    
    // Set price
    const priceElement = document.getElementById('vehiclePrice');
    if (priceElement) {
        priceElement.textContent = utils.formatPrice(car.pret);
    }
    
    // Set main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = car.imagini ? car.imagini[0] : car.imagine;
        mainImage.alt = `${car.marca} ${car.model}`;
        mainImage.onerror = function() {
            this.src = `https://via.placeholder.com/800x600?text=${car.marca}+${car.model}`;
        };
    }
    
    // Set gallery thumbnails
    const galleryThumbs = document.getElementById('galleryThumbs');
    if (galleryThumbs && car.imagini) {
        galleryThumbs.innerHTML = car.imagini.map((img, index) => `
            <img src="${img}" alt="${car.marca} ${car.model} ${index + 1}" 
                 class="${index === 0 ? 'active' : ''}"
                 onclick="changeMainImage('${img}')"
                 onerror="this.src='https://via.placeholder.com/80x60?text=Img+${index + 1}'">
        `).join('');
    }
    
    // Set main specs
    const mainSpecs = document.getElementById('mainSpecs');
    if (mainSpecs) {
        mainSpecs.innerHTML = `
            <div class="spec-item">
                <strong>An Fabricație</strong>
                <div>${car.an}</div>
            </div>
            <div class="spec-item">
                <strong>Kilometraj</strong>
                <div>${utils.formatKm(car.km)}</div>
            </div>
            <div class="spec-item">
                <strong>Combustibil</strong>
                <div>${car.combustibil}</div>
            </div>
            <div class="spec-item">
                <strong>Transmisie</strong>
                <div>${car.transmisie}</div>
            </div>
        `;
    }
    
    // Set description
    const description = document.getElementById('vehicleDescription');
    if (description) {
        description.textContent = car.descriere;
    }
    
    // Set technical specs
    const technicalSpecs = document.getElementById('technicalSpecs');
    if (technicalSpecs && car.specificatii) {
        const specs = car.specificatii;
        technicalSpecs.innerHTML = `
            ${specs.putere ? `<div class="spec-item"><strong>Putere</strong><div>${specs.putere}</div></div>` : ''}
            ${specs.culoare ? `<div class="spec-item"><strong>Culoare</strong><div>${specs.culoare}</div></div>` : ''}
            ${specs.numarUsi ? `<div class="spec-item"><strong>Număr Uși</strong><div>${specs.numarUsi}</div></div>` : ''}
            ${specs.locuri ? `<div class="spec-item"><strong>Locuri</strong><div>${specs.locuri}</div></div>` : ''}
            ${specs.emisiiCO2 ? `<div class="spec-item"><strong>Emisii CO2</strong><div>${specs.emisiiCO2}</div></div>` : ''}
            ${specs.normaPoluare ? `<div class="spec-item"><strong>Normă Poluare</strong><div>${specs.normaPoluare}</div></div>` : ''}
        `;
    }
    
    // Store contact info for modal
    window.currentCarContact = car.contact;
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    const thumbs = document.querySelectorAll('.gallery-thumbs img');
    thumbs.forEach(thumb => {
        if (thumb.src.includes(imageSrc)) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function initContactModal() {
    const contactBtn = document.getElementById('contactBtn');
    const modal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');
    
    if (contactBtn && modal) {
        contactBtn.addEventListener('click', function() {
            modal.classList.add('active');
            displayContactInfo();
        });
    }
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmit();
        });
    }
}

function displayContactInfo() {
    const contactInfo = document.getElementById('contactInfo');
    
    if (!contactInfo || !window.currentCarContact) return;
    
    const contact = window.currentCarContact;
    
    contactInfo.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <h3 style="margin-bottom: 1rem;">Informații Vânzător</h3>
            <p><strong>Nume:</strong> ${contact.nume}</p>
            <p><strong>Telefon:</strong> <a href="tel:${contact.telefon}">${contact.telefon}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        </div>
    `;
}

function handleContactFormSubmit() {
    const formData = new FormData(document.getElementById('contactForm'));
    const data = Object.fromEntries(formData);
    
    // Simulate sending message (in a real app, this would be an API call)
    console.log('Contact form submitted:', data);
    
    // Show success message
    document.getElementById('contactForm').style.display = 'none';
    utils.show('contactSuccess');
    
    // Close modal after 3 seconds
    setTimeout(function() {
        document.getElementById('contactModal').classList.remove('active');
        document.getElementById('contactForm').style.display = 'block';
        utils.hide('contactSuccess');
    }, 3000);
}
