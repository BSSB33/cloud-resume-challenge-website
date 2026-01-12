// Typing Animation
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["a Data Engineer", "an ETL Developer", "a Cloud Engineer"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// Start typing animation when page loads
document.addEventListener("DOMContentLoaded", function() {
    if (textArray.length) setTimeout(type, 100);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    }

    lastScroll = currentScroll;
});

// View counter - calls Lambda function to increment and display count
function updateViewCounter() {
    const viewCountElement = document.getElementById('view-count');

    // Check if element exists
    if (!viewCountElement) {
        console.error('View counter element not found');
        return;
    }

    // Check if user has already been counted in this browser session
    const hasBeenCounted = sessionStorage.getItem('visitor_counted');

    // Lambda Function URL
    const API_ENDPOINT = 'https://idwplnuz6vbf2h7mjw6ztsa54q0mfwfy.lambda-url.eu-west-1.on.aws/';

    // Show loading state
    viewCountElement.textContent = '...';

    // Call Lambda function
    // Only increment if this is the first visit in this session
    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            increment: !hasBeenCounted  // Only increment if not counted this session
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Mark this session as counted (only if we actually incremented)
        if (!hasBeenCounted) {
            sessionStorage.setItem('visitor_counted', 'true');
        }

        // Format the number with thousand separators
        const formattedViews = data.views.toLocaleString();
        viewCountElement.textContent = formattedViews;
    })
    .catch(error => {
        console.error('Error fetching view count:', error);
        viewCountElement.textContent = '---';
    });
}

// Wait for DOM to be fully loaded before calling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateViewCounter);
} else {
    // DOM already loaded
    updateViewCounter();
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Project Details Toggle
function toggleProject() {
    const details = document.getElementById('projectDetails');
    const button = document.querySelector('.project-toggle');
    const toggleText = button.querySelector('.toggle-text');
    const toggleIcon = button.querySelector('.toggle-icon');

    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        toggleText.textContent = 'Show Details';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        details.classList.add('expanded');
        toggleText.textContent = 'Hide Details';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

// RAG Project Details Toggle
function toggleRagProject() {
    const details = document.getElementById('ragProjectDetails');
    const buttons = document.querySelectorAll('.project-toggle');
    let button = null;

    // Find the button for RAG project
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') === 'toggleRagProject()') {
            button = btn;
        }
    });

    if (!button) return;

    const toggleText = button.querySelector('.toggle-text');
    const toggleIcon = button.querySelector('.toggle-icon');

    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        toggleText.textContent = 'Show Details';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        details.classList.add('expanded');
        toggleText.textContent = 'Hide Details';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

// ETL Project Details Toggle
function toggleEtlProject() {
    const details = document.getElementById('etlProjectDetails');
    const buttons = document.querySelectorAll('.project-toggle');
    let button = null;

    // Find the button for ETL project
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') === 'toggleEtlProject()') {
            button = btn;
        }
    });

    if (!button) return;

    const toggleText = button.querySelector('.toggle-text');
    const toggleIcon = button.querySelector('.toggle-icon');

    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        toggleText.textContent = 'Show Details';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        details.classList.add('expanded');
        toggleText.textContent = 'Hide Details';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}
