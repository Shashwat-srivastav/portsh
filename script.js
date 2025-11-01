// Intelligent Loading System
document.addEventListener('DOMContentLoaded', function() {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const progressBar = document.querySelector('.loader-progress-bar');
    
    // Track actual loading progress
    let resourcesLoaded = 0;
    const totalResources = document.images.length + document.styleSheets.length + 3; // +3 for HTML, main JS, and fonts
    
    // Function to update the real loading progress
    const updateProgress = () => {
        resourcesLoaded++;
        let percentage = Math.min((resourcesLoaded / totalResources) * 100, 100);
        if (progressBar) progressBar.style.width = `${percentage}%`;
        
        // When fully loaded, hide the loader after ensuring animations complete
        if (percentage >= 100) {
            // Minimum display time: 3.5 seconds to ensure all animations are visible
            setTimeout(() => {
                if (loaderWrapper) loaderWrapper.classList.add('hidden');
                
                // Remove from DOM after transition completes
                setTimeout(() => {
                    if (loaderWrapper) loaderWrapper.style.display = 'none';
                    
                    // Add entrance animations for elements
                    document.querySelectorAll('.animate-on-load').forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('animated');
                        }, 80 * index);
                    });
                }, 600);
            }, 4000); // Longer delay to ensure all terminal animations and branding are visible
        }
    };
    
    // Track each image load
    Array.from(document.images).forEach(img => {
        if (img.complete) updateProgress();
        else img.addEventListener('load', updateProgress);
    });
    
    // Track CSS files
    Array.from(document.styleSheets).forEach(() => updateProgress());
    
    // Count the main resources
    updateProgress(); // HTML
    updateProgress(); // JS
    updateProgress(); // Fonts
    
    // Fallback in case some resources fail to load
    window.addEventListener('load', function() {
        if (loaderWrapper && !loaderWrapper.classList.contains('hidden')) {
            // Force minimum loader display time of 3.5 seconds
            const minimumDisplayTime = 3500; // milliseconds
            const elapsedTime = Date.now() - window.performance.timing.navigationStart;
            
            if (elapsedTime < minimumDisplayTime) {
                // If page loaded too quickly, delay the completion
                setTimeout(() => {
                    resourcesLoaded = totalResources;
                    updateProgress();
                }, minimumDisplayTime - elapsedTime);
            } else {
                // If already passed minimum time, complete loading
                resourcesLoaded = totalResources;
                updateProgress();
            }
        }
    });
});

// Terminal-inspired Navigation
const menuToggle = document.getElementById('menu-toggle');
const terminalMenu = document.getElementById('terminal-menu');
const terminalNavLinks = document.querySelectorAll('.terminal-nav-link');

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        terminalMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
terminalNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        terminalMenu.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
        
        // Set active link
        terminalNavLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Highlight active section on scroll
window.addEventListener('scroll', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active section highlighting
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    terminalNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth reveal animation for elements (optimized)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target); // Stop observing after animation
        }
    });
}, observerOptions);

// Observe cards and timeline items
document.querySelectorAll('.project-card, .skill-category, .timeline-item, .journey-card, .achievement-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInObserver.observe(el);
});

// Animate skill bars when visible
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Case study download handlers
const caseStudyButtons = document.querySelectorAll('.case-study-download');
caseStudyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const project = button.getAttribute('data-project');
        
        // Show download notification
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Request Sent! Check your email';
        button.style.background = 'var(--color-success)';
        button.style.borderColor = 'var(--color-success)';
        
        // Reset after 3 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.borderColor = '';
        }, 3000);
        
        // Here you would typically trigger email with case study PDF
        console.log(`Case study requested: ${project}`);
        
        // Optional: Open email client with pre-filled subject
        const subject = encodeURIComponent(`Case Study Request: ${project}`);
        const body = encodeURIComponent('Hi Anushka,\n\nI would like to receive the detailed case study for this project.\n\nThank you!');
        window.location.href = `mailto:anushka.gupta22222@gmail.com?subject=${subject}&body=${body}`;
    });
});

// Add active class to current nav item based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Remove old typing effect - not needed anymore
// Portfolio is real and impactful, no need for gimmicks

// Terminal cursor blink animation
const terminalCursor = document.querySelector('.terminal-cursor');
if (terminalCursor) {
    setInterval(() => {
        terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
    }, 530);
}

// Achievement card hover effects
const achievementCards = document.querySelectorAll('.achievement-card');
achievementCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) rotate(1deg)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add particle effect to hero section (optimized for performance)
function createParticle() {
    const hero = document.querySelector('.hero');
    if (!hero || document.hidden) return;
    
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--color-primary);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
        pointer-events: none;
        animation: particleFloat 4s ease-out forwards;
    `;
    
    hero.appendChild(particle);
    
    setTimeout(() => particle.remove(), 4000);
}

// Create particles at intervals (reduced frequency)
let particleInterval = setInterval(createParticle, 500);

// Pause particles when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(particleInterval);
    } else {
        particleInterval = setInterval(createParticle, 500);
    }
});

// Add CSS animation for particles
if (!document.getElementById('particle-animation')) {
    const style = document.createElement('style');
    style.id = 'particle-animation';
    style.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translate(0, 0) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.2;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Terminal Skills Tabs
document.addEventListener('DOMContentLoaded', () => {
    const terminalTabs = document.querySelectorAll('.terminal-tab');
    
    if (terminalTabs.length > 0) {
        terminalTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs
                terminalTabs.forEach(t => t.classList.remove('active'));
                
                // Activate clicked tab
                tab.classList.add('active');
                
                // Hide all tab content
                const tabContents = document.querySelectorAll('.terminal-tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Show matching content
                const tabId = tab.getAttribute('data-tab');
                const activeContent = document.getElementById(`${tabId}-content`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }
});

console.log('Portfolio loaded successfully!');
