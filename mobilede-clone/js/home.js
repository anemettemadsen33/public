// Home Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initSearchForm();
    loadFeaturedCars();
});

// Carousel functionality
function initCarousel() {
    const carouselInner = document.getElementById('carouselInner');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carouselInner || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const slides = carouselInner.children;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }
        
        const offset = -currentSlide * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }
    
    prevBtn.addEventListener('click', function() {
        showSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        showSlide(currentSlide + 1);
    });
    
    // Auto-advance carousel every 5 seconds
    setInterval(function() {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Search form functionality
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(searchForm);
        const params = {};
        
        formData.forEach((value, key) => {
            if (value && value.trim() !== '') {
                params[key] = value;
            }
        });
        
        // Build URL and redirect to results page
        const url = utils.buildUrl('results.html', params);
        window.location.href = url;
    });
}

// Load featured cars
async function loadFeaturedCars() {
    const featuredCarsContainer = document.getElementById('featuredCars');
    
    if (!featuredCarsContainer) return;
    
    try {
        const cars = await utils.loadCarsData();
        
        // Get random 3 cars for featured section
        const featuredCars = getRandomCars(cars, 3);
        
        if (featuredCars.length === 0) {
            featuredCarsContainer.innerHTML = '<p style="text-align: center; color: #666;">Nu există mașini disponibile momentan.</p>';
            return;
        }
        
        // Display featured cars
        featuredCarsContainer.innerHTML = featuredCars.map(car => utils.createCarCard(car)).join('');
        
    } catch (error) {
        console.error('Error loading featured cars:', error);
        featuredCarsContainer.innerHTML = '<p style="text-align: center; color: #e74c3c;">Eroare la încărcarea mașinilor.</p>';
    }
}

// Get random cars from array
function getRandomCars(cars, count) {
    const shuffled = [...cars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
