#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function readFile(filename) {
    const filePath = path.join(__dirname, filename);
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        log(`Error reading ${filename}: ${error.message}`, 'red');
        return null;
    }
}

function runVerification() {
    log('\n========================================', 'cyan');
    log('Local Lead Shield Website Verification', 'cyan');
    log('========================================\n', 'cyan');

    const html = readFile('index.html');
    const css = readFile('styles.css');
    const js = readFile('script.js');
    const api = readFile('api/audit-request.js');

    if (!html || !css || !js || !api) {
        log('✗ Missing required files', 'red');
        process.exit(1);
    }

    let passed = 0;
    let failed = 0;
    const issues = [];

    // Test 1: Check for required sections
    log('Testing required sections...', 'cyan');
    const requiredSections = [
        { id: 'home', name: 'Hero/Home' },
        { id: 'website-sprint', name: 'Website Sprint' },
        { id: 'leak-audit', name: 'Business Leak Audit' },
        { id: 'monitoring', name: 'Hosting & Monitoring' },
        { id: 'process', name: 'Process' },
        { id: 'pricing', name: 'Pricing' },
        { id: 'faq', name: 'FAQ' },
        { id: 'contact', name: 'Contact' },
    ];

    requiredSections.forEach(section => {
        if (html.includes(`id="${section.id}"`)) {
            log(`  ✓ ${section.name} section found`, 'green');
            passed++;
        } else {
            log(`  ✗ ${section.name} section missing`, 'red');
            issues.push(`Missing ${section.name} section`);
            failed++;
        }
    });

    // Test 2: Check for pricing information
    log('\nTesting pricing sections...', 'cyan');
    const pricingTerms = [
        { term: '£395', name: 'Proof-builder pricing (£395)' },
        { term: '£850', name: 'Standard Sprint pricing (£850)' },
        { term: '£1,800', name: 'Lead-Ready pricing (£1,800)' },
        { term: '£3,500', name: 'Revenue Leak Rebuild pricing (£3,500)' },
        { term: '£49', name: 'Basic Hosting pricing (£49)' },
        { term: '£79', name: 'Growth Monitor pricing (£79)' },
        { term: '£149', name: 'Leak Watch pricing (£149)' },
        { term: 'Tailored Team AI Workflow Workshop', name: 'Tailored AI workshop positioning' },
    ];

    pricingTerms.forEach(item => {
        if (html.includes(item.term)) {
            log(`  ✓ ${item.name} found`, 'green');
            passed++;
        } else {
            log(`  ✗ ${item.name} missing`, 'red');
            issues.push(`Missing ${item.name}`);
            failed++;
        }
    });

    // Test 3: Check for contact CTA
    log('\nTesting contact CTA...', 'cyan');
    if (html.includes('mailto:hello@localleadshield.co.uk')) {
        log('  ✓ Contact email CTA found', 'green');
        passed++;
    } else {
        log('  ✗ Contact email CTA missing', 'red');
        issues.push('Missing contact email CTA');
        failed++;
    }

    // Test 4: Check that AI add-ons are clearly marked as separate
    log('\nTesting AI add-ons separation...', 'cyan');
    const aiSeparationTerms = [
        'premium add-ons quoted and delivered separately',
        'NOT included in standard website builds',
        'separate premium services',
    ];

    const aiSeparationFound = aiSeparationTerms.some(term =>
        html.toLowerCase().includes(term.toLowerCase())
    );

    if (aiSeparationFound) {
        log('  ✓ AI add-ons clearly marked as separate', 'green');
        passed++;
    } else {
        log('  ✗ AI add-ons separation not clearly stated', 'red');
        issues.push('AI add-ons must be clearly marked as separate from standard builds');
        failed++;
    }

    // Test 5: Check for proper lead disclaimer or conditional guarantee
    log('\nTesting lead disclaimer / guarantee terms...', 'cyan');
    const disclaimerTerms = [
        'leads still depend on',
        'do not guarantee leads',
        'no. we improve clarity',
    ];
    const conditionalGuaranteeTerms = [
        'money-back guarantee',
        '100% money-back',
    ];

    const hasDisclaimer = disclaimerTerms.some(term =>
        html.toLowerCase().includes(term.toLowerCase())
    );
    const hasConditionalGuarantee = conditionalGuaranteeTerms.some(term =>
        html.toLowerCase().includes(term.toLowerCase())
    );

    if (hasDisclaimer || hasConditionalGuarantee) {
        log('  ✓ Proper lead disclaimer / conditional guarantee found', 'green');
        passed++;
    } else {
        log('  ✗ Lead disclaimer or conditional guarantee missing', 'red');
        issues.push('Must clearly state lead limitations or offer a documented conditional guarantee');
        failed++;
    }

    // Test 6: Check for fake case study prevention
    log('\nTesting for fake case studies...', 'cyan');
    const fakeCaseStudyIndicators = [
        /increased leads by \d+%/i,
        /guaranteed \d+ leads/i,
        /\d+x roi/i,
        /generated £\d+,\d+ in revenue/i,
    ];

    const hasFakeClaims = fakeCaseStudyIndicators.some(pattern => pattern.test(html));

    if (!hasFakeClaims) {
        log('  ✓ No fake case study claims detected', 'green');
        passed++;
    } else {
        log('  ✗ Potential fake case study claims detected', 'red');
        issues.push('Website contains unsupported case study claims');
        failed++;
    }

    // Test 7: Check for real proof example
    log('\nTesting proof/example section...', 'cyan');
    if (html.includes('massage therapy') || html.includes('Recent Example')) {
        log('  ✓ Real proof example section found', 'green');
        passed++;
    } else {
        log('  ✗ Proof example section missing', 'yellow');
        // Not a critical failure, just a warning
    }

    // Test 8: Check for process steps
    log('\nTesting process steps...', 'cyan');
    const processSteps = [
        'Send us what already exists',
        'We extract proof',
        'You review before launch',
        'We launch, track and monitor',
    ];

    const allStepsFound = processSteps.every(step => html.includes(step));

    if (allStepsFound) {
        log('  ✓ All process steps found', 'green');
        passed++;
    } else {
        log('  ✗ Some process steps missing', 'red');
        issues.push('Process section incomplete');
        failed++;
    }

    // Test 9: Check for dark theme styling
    log('\nTesting dark theme...', 'cyan');
    if (css.includes('--color-bg-primary') && css.includes('#0a0e1a')) {
        log('  ✓ Dark theme CSS variables found', 'green');
        passed++;
    } else {
        log('  ✗ Dark theme CSS missing', 'red');
        issues.push('Dark theme styling not implemented');
        failed++;
    }

    // Test 10: Check for responsive design
    log('\nTesting responsive design...', 'cyan');
    if (css.includes('@media') && css.includes('max-width')) {
        log('  ✓ Responsive design media queries found', 'green');
        passed++;
    } else {
        log('  ✗ Responsive design media queries missing', 'red');
        issues.push('Responsive design not implemented');
        failed++;
    }

    // Test 11: Check for mobile menu
    log('\nTesting mobile menu...', 'cyan');
    if (html.includes('mobile-menu-toggle') && js.includes('mobile-menu-toggle')) {
        log('  ✓ Mobile menu implementation found', 'green');
        passed++;
    } else {
        log('  ✗ Mobile menu not implemented', 'red');
        issues.push('Mobile menu missing');
        failed++;
    }

    // Test 12: Verify no hardcoded customer testimonials
    log('\nTesting for fake testimonials...', 'cyan');
    const testimonialIndicators = [
        /<blockquote/i,
        /testimonial/i,
        /customer said/i,
        /client review:/i,
    ];

    const hasTestimonials = testimonialIndicators.some(pattern =>
        typeof pattern === 'string' ? html.toLowerCase().includes(pattern.toLowerCase()) : pattern.test(html)
    );

    if (!hasTestimonials) {
        log('  ✓ No fake testimonials found', 'green');
        passed++;
    } else {
        log('  ✗ Potential fake testimonials detected', 'red');
        issues.push('Website may contain fake testimonials');
        failed++;
    }

    // Test 13: Business Leak Audit positioning beyond websites
    log('\nTesting Business Leak Audit positioning...', 'cyan');
    const positioningTerms = [
        'Free Business Leak Audit',
        'A website is just one possible fix',
        'Google Business Profile',
        'missed calls',
    ];
    const hasPositioning = positioningTerms.every(term => html.includes(term));
    if (hasPositioning) {
        log('  ✓ Business Leak Audit positioning found', 'green');
        passed++;
    } else {
        log('  ✗ Business Leak Audit positioning incomplete', 'red');
        issues.push('Must position the offer as a wider Business Leak Audit, not just website builds');
        failed++;
    }

    // Test 14: Plain-English technical term pattern
    log('\nTesting plain-English technical explanations...', 'cyan');
    const plainTechTerms = [
        'Know exactly where every enquiry comes from',
        'UTM',
        'See where visitors click, stop and leave',
        'Microsoft Clarity',
        'see who visits, from where and what they do',
        'Google Analytics 4 / GA4',
    ];
    if (plainTechTerms.every(term => html.includes(term))) {
        log('  ✓ Plain-English technical explanations found', 'green');
        passed++;
    } else {
        log('  ✗ Plain-English technical explanations missing', 'red');
        issues.push('Technical terms must be explained as customer benefits first');
        failed++;
    }

    // Test 15: Free audit intake form
    log('\nTesting free audit intake form...', 'cyan');
    const requiredFormFields = [
        'id="audit-form"',
        'name="businessName"',
        'name="contactName"',
        'name="phone"',
        'name="email"',
        'name="customerType"',
        'name="whatSell"',
        'name="websiteUrl"',
        'name="gbpUrl"',
        'name="socialUrl"',
        'name="productUrl"',
        'name="biggestLeak"',
        'name="consent"',
        'name="website"',
    ];
    if (requiredFormFields.every(term => html.includes(term))) {
        log('  ✓ Free audit intake form fields found', 'green');
        passed++;
    } else {
        log('  ✗ Free audit intake form incomplete', 'red');
        issues.push('Free audit form must include required JV/client intake fields and honeypot');
        failed++;
    }

    // Test 16: Secure API handler basics
    log('\nTesting secure API handler basics...', 'cyan');
    const apiSecurityTerms = [
        "req.method !== 'POST'",
        'content-length',
        'sanitizeString',
        'isValidEmail',
        'isValidUrl',
        'checkRateLimit',
        'Honeypot',
        'SMTP_HOST',
        'CRM_API_KEY',
    ];
    if (apiSecurityTerms.every(term => api.includes(term))) {
        log('  ✓ Secure API handler checks found', 'green');
        passed++;
    } else {
        log('  ✗ Secure API handler missing expected checks', 'red');
        issues.push('API handler must include POST-only, size guard, sanitisation, validation, honeypot, rate-limit and integration TODOs');
        failed++;
    }

    // Test 17: Client-side safe form submission
    log('\nTesting client-side form submission...', 'cyan');
    if (js.includes("fetch('/api/audit-request'") && js.includes('textContent') && js.includes('sanitizeText')) {
        log('  ✓ Client-side secure form submission found', 'green');
        passed++;
    } else {
        log('  ✗ Client-side form submission incomplete', 'red');
        issues.push('script.js must submit to API and avoid unsafe HTML insertion');
        failed++;
    }

    // Summary
    log('\n========================================', 'cyan');
    log('Verification Summary', 'cyan');
    log('========================================', 'cyan');
    log(`Passed: ${passed}`, 'green');
    log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');

    if (issues.length > 0) {
        log('\nIssues Found:', 'yellow');
        issues.forEach(issue => {
            log(`  - ${issue}`, 'red');
        });
    }

    log('\n');

    if (failed === 0) {
        log('✓ All verification checks passed!', 'green');
        log('Website is ready for deployment.\n', 'green');
        process.exit(0);
    } else {
        log('✗ Verification failed. Please fix the issues above.', 'red');
        log('');
        process.exit(1);
    }
}

// Run verification
runVerification();
