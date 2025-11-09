// Global variables
let isSearchOpen = false;
let isMobileMenuOpen = false;
let searchQuery = '';
let isSearchLoading = false;
let currentAge = 21.0;
let daysLived = 0;
let lifeProgress = 0;

// DOM Elements
const searchOverlay = document.querySelector('.global-search-overlay');
const searchContainer = document.querySelector('.global-search-container');
const searchInput = document.querySelector('.global-search-input');
const searchClose = document.querySelector('.search-close');
const searchLoading = document.querySelector('.search-loading');
const searchResults = document.querySelector('.global-search-results');
const searchIcons = document.querySelectorAll('.search-icon');

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNavMenu = document.querySelector('.mobile-nav-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Life progress elements
const currentAgeElement = document.getElementById('currentAge');
const progressFillElement = document.getElementById('progressFill');
const daysLivedElement = document.getElementById('daysLived');
const lifeProgressElement = document.getElementById('lifeProgress');
const remainingYearsElement = document.getElementById('remainingYears');

// Initialize the application
function init() {
    setupEventListeners();
    calculateLifeProgress();
    setupLifeProgressTimer();
    handleResize();
}

// Setup all event listeners
function setupEventListeners() {
    // Search functionality
    searchIcons.forEach(icon => {
        icon.addEventListener('click', openSearch);
    });
    
    searchClose.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', handleSearchOverlayClick);
    searchInput.addEventListener('keypress', handleSearchKeypress);
    searchInput.addEventListener('input', handleSearchInput);

    // Mobile menu functionality
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Navigation link interactions
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        if (!link.classList.contains('search-icon')) {
            link.addEventListener('click', handleNavLinkClick);
        }
    });

    // Window events
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Prevent body scroll when search is open
    document.addEventListener('keydown', handleKeydown);
}

// Search functionality
function openSearch() {
    isSearchOpen = true;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus the search input after animation
    setTimeout(() => {
        searchInput.focus();
    }, 400);
    
    // Add active state to search icons
    searchIcons.forEach(icon => icon.classList.add('active'));
}

function closeSearch() {
    isSearchOpen = false;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear search state
    searchInput.value = '';
    searchQuery = '';
    isSearchLoading = false;
    searchLoading.classList.remove('active');
    searchResults.classList.remove('active');
    searchResults.innerHTML = '';
    
    // Remove active state from search icons
    searchIcons.forEach(icon => icon.classList.remove('active'));
}

function handleSearchOverlayClick(e) {
    if (e.target === searchOverlay) {
        closeSearch();
    }
}

function handleSearchKeypress(e) {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
    }
}

function handleSearchInput(e) {
    searchQuery = e.target.value;
    
    // Clear results if input is empty
    if (!searchQuery.trim()) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
    }
}

function performSearch(query) {
    if (isSearchLoading || !query.trim()) return;
    
    isSearchLoading = true;
    searchLoading.classList.add('active');
    searchResults.classList.remove('active');
    
    // Simulate search with timeout
    setTimeout(() => {
        isSearchLoading = false;
        searchLoading.classList.remove('active');
        
        // Mock search results
        const mockResults = generateMockSearchResults(query);
        displaySearchResults(mockResults);
    }, 1500);
}

function generateMockSearchResults(query) {
    const mockData = [
        {
            title: 'AI-Powered Web Development',
            excerpt: 'Exploring the future of web development with artificial intelligence...',
            url: '#',
            category: 'Blog'
        },
        {
            title: 'Modern JavaScript Frameworks',
            excerpt: 'A comprehensive guide to choosing the right framework for your project...',
            url: '#',
            category: 'Tutorial'
        },
        {
            title: 'Premium Website Template',
            excerpt: 'Professional website templates designed for modern businesses...',
            url: '#',
            category: 'Shop'
        }
    ];
    
    // Filter results based on query (simple contains check)
    return mockData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase())
    );
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found. Try different keywords.</div>';
    } else {
        const resultsHTML = results.map(result => `
            <div class="search-result-item">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-excerpt">${result.excerpt}</div>
                <a href="${result.url}" class="search-result-url">${result.url}</a>
                <span class="search-result-category">${result.category}</span>
            </div>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
    }
    
    searchResults.classList.add('active');
}

// Mobile menu functionality
function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    
    mobileMenuBtn.classList.toggle('active', isMobileMenuOpen);
    mobileNavMenu.classList.toggle('active', isMobileMenuOpen);
    
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    isMobileMenuOpen = false;
    mobileMenuBtn.classList.remove('active');
    mobileNavMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigation link interactions
function handleNavLinkClick(e) {
    e.preventDefault();
    
    // Remove active class from all nav links
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    allNavLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    e.target.classList.add('active');
    
    // Close mobile menu if it's open
    if (isMobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Here you would typically handle routing or page changes
    console.log('Navigating to:', e.target.textContent.trim());
}

// Life progress calculations
function calculateLifeProgress() {
    // Birth date (adjust as needed)
    const birthDate = new Date('2003-09-26');
    const now = new Date();
    
    // Calculate age
    const ageInMs = now.getTime() - birthDate.getTime();
    const ageInYears = ageInMs / (365.25 * 24 * 60 * 60 * 1000);
    const days = Math.floor(ageInMs / (24 * 60 * 60 * 1000));
    
    // Calculate progress (assuming 80 years lifespan)
    const progress = (ageInYears / 80) * 100;
    const remainingYears = Math.round(80 - ageInYears);
    
    // Update global variables
    currentAge = parseFloat(ageInYears.toFixed(1));
    daysLived = days;
    lifeProgress = parseFloat(progress.toFixed(1));
    
    // Update DOM elements
    updateLifeProgressDisplay();
}

function updateLifeProgressDisplay() {
    if (currentAgeElement) currentAgeElement.textContent = currentAge;
    if (progressFillElement) progressFillElement.style.width = `${lifeProgress}%`;
    if (daysLivedElement) daysLivedElement.textContent = daysLived.toLocaleString();
    if (lifeProgressElement) lifeProgressElement.textContent = `${lifeProgress}%`;
    if (remainingYearsElement) remainingYearsElement.textContent = `~${Math.round(80 - currentAge)}`;
}

function setupLifeProgressTimer() {
    // Update life progress every minute
    setInterval(() => {
        calculateLifeProgress();
    }, 60000);
}

// Handle window resize
function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Adjust search overlay for mobile
    if (window.innerWidth <= 768 && isSearchOpen) {
        // Ensure proper mobile search styling
        searchContainer.style.width = '95%';
    }
}

// Handle window scroll
function handleScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    // Add/remove scrolled class based on scroll position
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Handle keyboard shortcuts
function handleKeydown(e) {
    // Close search with Escape key
    if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
        return;
    }
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
        return;
    }
    
    // Open search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isSearchOpen) {
            openSearch();
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced animations and interactions
function initializeEnhancements() {
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add parallax effect to floating elements
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-cube');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.1}deg)`;
        });
    }, 16));
}

// Error handling
function handleError(error) {
    console.error('Application error:', error);
    
    // You could implement error reporting here
    // For example, send to analytics or error tracking service
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
        initializeEnhancements();
        
        // Add loaded class to body for CSS animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
        console.log('Buddha Citta Portfolio initialized successfully');
    } catch (error) {
        handleError(error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
        // Recalculate life progress in case user was away for a while
        calculateLifeProgress();
    }
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for potential external use
window.BuddhaCittaPortfolio = {
    openSearch,
    closeSearch,
    toggleMobileMenu,
    calculateLifeProgress,
    handleError
};
