// Main JavaScript - Shared Functionality

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Utility Functions
const utils = {
    // Format price with euro symbol
    formatPrice: function(price) {
        return `€ ${parseInt(price).toLocaleString('ro-RO')}`;
    },

    // Format kilometers
    formatKm: function(km) {
        return `${parseInt(km).toLocaleString('ro-RO')} km`;
    },

    // Get URL parameters
    getUrlParams: function() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        
        return params;
    },

    // Build URL with parameters
    buildUrl: function(baseUrl, params) {
        const url = new URL(baseUrl, window.location.origin);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        
        return url.toString();
    },

    // Load cars data from JSON
    loadCarsData: async function() {
        try {
            const response = await fetch('data/cars.json');
            if (!response.ok) {
                throw new Error('Failed to load cars data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading cars:', error);
            return [];
        }
    },

    // Filter cars based on criteria
    filterCars: function(cars, filters) {
        return cars.filter(car => {
            // Brand filter
            if (filters.marca && car.marca !== filters.marca) {
                return false;
            }

            // Model filter
            if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) {
                return false;
            }

            // Fuel type filter
            if (filters.combustibil && car.combustibil !== filters.combustibil) {
                return false;
            }

            // Transmission filter
            if (filters.transmisie && car.transmisie !== filters.transmisie) {
                return false;
            }

            // Price range filter
            if (filters.pretMin && car.pret < parseInt(filters.pretMin)) {
                return false;
            }
            if (filters.pretMax && car.pret > parseInt(filters.pretMax)) {
                return false;
            }

            // Year range filter
            if (filters.anMin && car.an < parseInt(filters.anMin)) {
                return false;
            }
            if (filters.anMax && car.an > parseInt(filters.anMax)) {
                return false;
            }

            // Mileage filter
            if (filters.kmMax && car.km > parseInt(filters.kmMax)) {
                return false;
            }

            return true;
        });
    },

    // Sort cars
    sortCars: function(cars, sortBy) {
        const sorted = [...cars];
        
        switch(sortBy) {
            case 'pret-asc':
                return sorted.sort((a, b) => a.pret - b.pret);
            case 'pret-desc':
                return sorted.sort((a, b) => b.pret - a.pret);
            case 'an-asc':
                return sorted.sort((a, b) => a.an - b.an);
            case 'an-desc':
                return sorted.sort((a, b) => b.an - a.an);
            case 'km-asc':
                return sorted.sort((a, b) => a.km - b.km);
            case 'km-desc':
                return sorted.sort((a, b) => b.km - a.km);
            default:
                return sorted;
        }
    },

    // Create car card HTML
    createCarCard: function(car) {
        return `
            <div class="car-card">
                <img src="${car.imagine}" alt="${car.marca} ${car.model}" 
                     onerror="this.src='https://via.placeholder.com/400x200?text=${car.marca}+${car.model}'">
                <div class="car-card-content">
                    <h3>${car.marca} ${car.model}</h3>
                    <div class="car-details">
                        ${car.an} • ${utils.formatKm(car.km)} • ${car.combustibil} • ${car.transmisie}
                    </div>
                    <div class="car-price">${utils.formatPrice(car.pret)}</div>
                    <a href="details.html?id=${car.id}" class="btn btn-primary">Vezi Detalii</a>
                </div>
            </div>
        `;
    },

    // Show loading state
    showLoading: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('d-none');
        }
    },

    // Hide loading state
    hideLoading: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('d-none');
        }
    },

    // Show element
    show: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('d-none');
        }
    },

    // Hide element
    hide: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('d-none');
        }
    },

    // Validate form field
    validateField: function(fieldId, errorId, validator) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        
        if (!field) return true;
        
        const result = validator(field.value);
        
        if (result.valid) {
            error.textContent = '';
            field.style.borderColor = '';
            return true;
        } else {
            error.textContent = result.message;
            field.style.borderColor = '#e74c3c';
            return false;
        }
    },

    // LocalStorage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Error removing from localStorage:', error);
            }
        }
    }
};

// Export utils for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
