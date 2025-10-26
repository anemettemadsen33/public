// Results Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initResultsPage();
});

async function initResultsPage() {
    utils.showLoading('loadingState');
    
    try {
        // Get URL parameters
        const filters = utils.getUrlParams();
        
        // Load all cars
        const allCars = await utils.loadCarsData();
        
        // Filter cars based on URL parameters
        let filteredCars = utils.filterCars(allCars, filters);
        
        // Display active filters
        displayActiveFilters(filters);
        
        // Display results count
        displayResultsCount(filteredCars.length);
        
        // Initialize sorting
        initSorting(filteredCars, filters);
        
        // Display cars
        displayCars(filteredCars);
        
        utils.hideLoading('loadingState');
        
    } catch (error) {
        console.error('Error loading results:', error);
        utils.hideLoading('loadingState');
        utils.show('noResults');
    }
}

function displayActiveFilters(filters) {
    const activeFiltersContainer = document.getElementById('activeFilters');
    
    if (!activeFiltersContainer) return;
    
    const filterLabels = {
        marca: 'Marcă',
        model: 'Model',
        combustibil: 'Combustibil',
        transmisie: 'Transmisie',
        pretMin: 'Preț min',
        pretMax: 'Preț max',
        anMin: 'An min',
        anMax: 'An max',
        kmMax: 'Km max'
    };
    
    let filtersHTML = '';
    
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            const label = filterLabels[key] || key;
            filtersHTML += `
                <div class="filter-tag">
                    ${label}: ${filters[key]}
                    <span class="remove" onclick="removeFilter('${key}')">×</span>
                </div>
            `;
        }
    });
    
    if (filtersHTML) {
        activeFiltersContainer.innerHTML = filtersHTML;
    } else {
        activeFiltersContainer.innerHTML = '<p style="color: #666;">Niciun filtru activ</p>';
    }
}

function removeFilter(filterKey) {
    const params = utils.getUrlParams();
    delete params[filterKey];
    
    const url = utils.buildUrl('results.html', params);
    window.location.href = url;
}

function displayResultsCount(count) {
    const resultsCountContainer = document.getElementById('resultsCount');
    
    if (!resultsCountContainer) return;
    
    if (count === 0) {
        resultsCountContainer.innerHTML = 'Nu s-au găsit rezultate';
    } else if (count === 1) {
        resultsCountContainer.innerHTML = '1 mașină găsită';
    } else {
        resultsCountContainer.innerHTML = `${count} mașini găsite`;
    }
}

function initSorting(cars, filters) {
    const sortBySelect = document.getElementById('sortBy');
    
    if (!sortBySelect) return;
    
    sortBySelect.addEventListener('change', function() {
        const sortedCars = utils.sortCars(cars, this.value);
        displayCars(sortedCars);
    });
}

function displayCars(cars) {
    const carsGridContainer = document.getElementById('carsGrid');
    const noResultsContainer = document.getElementById('noResults');
    
    if (!carsGridContainer) return;
    
    if (cars.length === 0) {
        carsGridContainer.innerHTML = '';
        utils.show('noResults');
        return;
    }
    
    utils.hide('noResults');
    
    // Display all cars
    carsGridContainer.innerHTML = cars.map(car => utils.createCarCard(car)).join('');
}
