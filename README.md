# Local Lead Shield Website

**Fast local-service websites that don't leak leads**

A polished static one-page demo/proposal website for Local Lead Shield, showcasing website build and business leak audit services for UK local-service businesses.

## Overview

This website presents Local Lead Shield's core offering: building fast, conversion-focused websites from existing proof (Google Business Profile, reviews, social media) and monitoring enquiry leaks post-launch.

## Project Structure

```
.
├── index.html       # Main single-page website
├── styles.css       # Dark premium theme styling
├── script.js        # Mobile menu and smooth scroll functionality
├── verify.js        # Verification script to check content requirements
├── package.json     # Project configuration and scripts
└── README.md        # This file
```

## Features

- **Dark Premium Theme**: Professional dark color scheme with cyan accents
- **Fully Responsive**: Mobile-first design with responsive navigation
- **Static Files Only**: No build process required, deploy anywhere
- **Vercel-Ready**: Can be deployed to Vercel with zero configuration
- **Content Verified**: Automated checks ensure no fake claims or unsupported guarantees

## Key Sections

1. **Hero**: Main value proposition and CTAs
2. **Problem Strip**: Common enquiry leaks businesses face
3. **Active Services**:
   - Free Quick Leak Check / AI Task Mapping Call (£0)
   - Proof-Builder / Referral Website Rate (£345)
   - Basic Hosting & Safety + Weekly/Monthly Traffic Update (£25/month)
   - Website add-ons (£95–£195)
   - AI Task-Mapping Taster (£650)
   - Tailored Team AI Workflow Workshop (£1,750)
4. **Process**: 4-step workflow from intake to monitoring
5. **Hosting**: One current hosting/care offer, not multiple tiers
6. **Metrics**: Plain-English tracking explanations for GA4, UTM and Microsoft Clarity
7. **AI Training**: Two separate premium training services, not included in standard website builds
8. **Pricing Summary**: Active standard prices only
9. **FAQ**: Common questions answered
10. **Contact**: Secure audit request form and email CTA

## Getting Started

### View Locally

Using Python's built-in HTTP server:

```bash
npm run dev
```

Then visit `http://localhost:8000`

Or open `index.html` directly in your browser.

### Run Verification

Check that all required content is present and no fake claims exist:

```bash
npm test
```

Or:

```bash
npm run verify
```

The verification script checks for:
- All required sections present
- Pricing information complete
- Contact CTA working
- AI add-ons clearly marked as separate
- No unsupported lead guarantees
- No fake case studies or testimonials
- Dark theme implementation
- Responsive design
- Mobile menu functionality

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

Or connect your Git repository to Vercel via their web interface.

### Other Static Hosts

This site works with any static file hosting:
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any standard web server

Simply upload all files to your hosting provider.

## Content Guidelines

This website adheres to strict content standards:

✅ **Allowed:**
- Real pricing based on market research
- Actual service descriptions
- Genuine process explanations
- Honest disclaimers about what we can/cannot guarantee
- Real proof examples (anonymized where needed)

❌ **Not Allowed:**
- Fake case studies or testimonials
- Unsupported lead guarantees
- Invented customer quotes
- Misleading ROI claims
- Suggesting AI add-ons are included in base packages

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --color-bg-primary: #0a0e1a;
    --color-bg-secondary: #131829;
    --color-accent: #00d4ff;
    /* ... */
}
```

### Contact Email

Update the mailto link in `index.html`:

```html
<a href="mailto:hello@localleadshield.co.uk">
```

### Content

All content is in `index.html`. Update sections as needed, then run `npm test` to verify compliance.

## Technical Details

- **No dependencies**: Pure HTML, CSS, and vanilla JavaScript
- **No build step**: Static files ready to deploy
- **Mobile-first**: Responsive design tested on various screen sizes
- **SEO-ready**: Proper meta tags, semantic HTML, heading hierarchy
- **Fast**: No external libraries, optimized for performance
- **Secure**: Can be served over HTTPS with proper headers

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Working Brand Notice

**Local Lead Shield** is a working brand name based on preliminary DNS and search checks only. This is NOT a trademark search. Client is responsible for final trademark clearance before commercial use.

## License

UNLICENSED - This is a proprietary demo/proposal website for Local Lead Shield.

## Contact

For questions or inquiries: hello@localleadshield.co.uk

---

**Built:** 2026-05-30  
**Status:** Ready for deployment and client review
