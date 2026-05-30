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

    if (!html || !css || !js) {
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
        { term: '£25', name: 'Basic Hosting pricing (£25)' },
        { term: '£40', name: 'Growth Monitor pricing (£40)' },
        { term: '£95', name: 'Leak Watch pricing (£95)' },
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

    // Test 5: Check for proper lead guarantee disclaimer
    log('\nTesting lead guarantee disclaimer...', 'cyan');
    const noGuaranteeTerms = [
        'do not guarantee leads',
        'no. we improve clarity',
        'leads still depend on',
    ];

    const disclaimerFound = noGuaranteeTerms.some(term =>
        html.toLowerCase().includes(term.toLowerCase())
    );

    if (disclaimerFound) {
        log('  ✓ Proper lead guarantee disclaimer found', 'green');
        passed++;
    } else {
        log('  ✗ Lead guarantee disclaimer missing or unclear', 'red');
        issues.push('Must clearly state that leads are not guaranteed');
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
