// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-toggle-icon');
    const themeText = document.querySelector('.theme-toggle-text');

    function applyTheme(theme) {
        const normalized = theme === 'light' ? 'light' : 'dark';
        document.documentElement.dataset.theme = normalized;
        localStorage.setItem('lls-theme', normalized);

        if (themeToggle) {
            const isLight = normalized === 'light';
            themeToggle.setAttribute('aria-pressed', String(isLight));
            themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        }

        if (themeIcon) {
            themeIcon.textContent = normalized === 'light' ? '🌙' : '☀️';
        }

        if (themeText) {
            themeText.textContent = normalized === 'light' ? 'Dark' : 'Light';
        }
    }

    applyTheme(localStorage.getItem('lls-theme') || document.documentElement.dataset.theme || 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }


    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Audit form submission
    const auditForm = document.getElementById('audit-form');
    const formMessage = document.getElementById('form-message');

    if (auditForm && formMessage) {
        auditForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous messages
            formMessage.className = 'form-message loading';
            formMessage.textContent = 'Submitting your request...';

            // Collect form data
            const formData = new FormData(auditForm);
            const data = {
                businessName: formData.get('businessName'),
                contactName: formData.get('contactName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                customerType: formData.get('customerType'),
                whatSell: formData.get('whatSell'),
                websiteUrl: formData.get('websiteUrl'),
                gbpUrl: formData.get('gbpUrl'),
                socialUrl: formData.get('socialUrl'),
                productUrl: formData.get('productUrl'),
                biggestLeak: formData.get('biggestLeak'),
                notes: formData.get('notes'),
                website: formData.get('website'), // Honeypot
                consent: formData.get('consent')
            };

            // Client-side validation
            if (!data.businessName || !data.contactName || !data.phone || !data.email || !data.customerType || !data.whatSell || !data.biggestLeak) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please fill in all required fields.';
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please enter a valid email address.';
                return;
            }

            // Consent check
            if (!data.consent) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please consent to the review of your public pages.';
                return;
            }

            try {
                // Submit to API
                const response = await fetch('/api/audit-request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    // Success - sanitize and display message
                    formMessage.className = 'form-message success';
                    formMessage.textContent = sanitizeText(result.message);

                    // Reset form
                    auditForm.reset();

                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // Error from API
                    formMessage.className = 'form-message error';
                    formMessage.textContent = sanitizeText(result.error || 'Something went wrong. Please try again or email us directly.');
                }
            } catch (error) {
                // Network or other error
                console.error('Form submission error:', error);
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Unable to submit request. Please check your connection or email us directly at hello@localleadshield.co.uk';
            }
        });
    }

    // Sanitize text before inserting into DOM (prevent XSS)
    function sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.textContent;
    }
});
