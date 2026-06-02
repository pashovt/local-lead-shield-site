// Secure Vercel serverless function for Business Leak Audit requests
// Security features: POST-only, size guard, sanitization, validation, honeypot, rate limiting

// In-memory rate limiting (basic - resets on function cold start)
const requestLog = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_IP = 3;

// Simple sanitization - remove dangerous characters, limit length
function sanitizeString(str, maxLength = 500) {
    if (typeof str !== 'string') return '';

    // Remove null bytes, control characters, and trim
    let cleaned = str
        .replace(/\0/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .trim();

    // Limit length
    if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength);
    }

    return cleaned;
}

// Email validation (simple but effective)
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length < 255;
}

// URL validation (optional fields)
function isValidUrl(url) {
    if (!url) return true; // Optional field
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

// Check rate limit for IP
function checkRateLimit(ip) {
    const now = Date.now();
    const ipLog = requestLog.get(ip) || [];

    // Remove old entries outside the window
    const recentRequests = ipLog.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS_PER_IP) {
        return false; // Rate limit exceeded
    }

    // Add current request
    recentRequests.push(now);
    requestLog.set(ip, recentRequests);

    return true;
}

module.exports = async (req, res) => {
    // 1. Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // 2. Check request body size (Vercel has default 4.5MB limit, we want much smaller)
        const contentLength = parseInt(req.headers['content-length'] || '0');
        if (contentLength > 50000) { // 50KB max
            return res.status(413).json({
                success: false,
                error: 'Request too large'
            });
        }

        // 3. Get IP for rate limiting (Vercel provides this)
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
                   req.headers['x-real-ip'] ||
                   'unknown';

        // 4. Check rate limit
        if (!checkRateLimit(ip)) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests. Please try again in a minute.'
            });
        }

        // 5. Parse and validate body
        const body = req.body;

        if (!body || typeof body !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid request body'
            });
        }

        // 6. Honeypot check - if 'website' field is filled, it's a bot
        if (body.website && body.website.trim() !== '') {
            // Log but don't reveal it's a honeypot
            console.log('Honeypot triggered from IP:', ip);
            return res.status(200).json({
                success: true,
                message: 'Thank you! We will review your request shortly.'
            });
        }

        // 7. Sanitize and validate required fields
        const businessName = sanitizeString(body.businessName, 200);
        const contactName = sanitizeString(body.contactName, 200);
        const phone = sanitizeString(body.phone, 50);
        const email = sanitizeString(body.email, 255);
        const customerType = sanitizeString(body.customerType, 300);
        const whatSell = sanitizeString(body.whatSell, 300);
        const biggestLeak = sanitizeString(body.biggestLeak, 100);
        const consent = body.consent;

        // Check required fields
        if (!businessName || !contactName || !phone || !email || !customerType || !whatSell || !biggestLeak) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }

        // Check consent
        if (consent !== true && consent !== 'true' && consent !== 'on') {
            return res.status(400).json({
                success: false,
                error: 'Consent is required'
            });
        }

        // 8. Sanitize optional URL fields
        const websiteUrl = sanitizeString(body.websiteUrl, 500);
        const gbpUrl = sanitizeString(body.gbpUrl, 500);
        const socialUrl = sanitizeString(body.socialUrl, 500);
        const productUrl = sanitizeString(body.productUrl, 500);
        const notes = sanitizeString(body.notes, 1000);

        // Validate URLs if provided
        if (websiteUrl && !isValidUrl(websiteUrl)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid website URL'
            });
        }
        if (gbpUrl && !isValidUrl(gbpUrl)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Google Business Profile URL'
            });
        }
        if (socialUrl && !isValidUrl(socialUrl)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid social media URL'
            });
        }
        if (productUrl && !isValidUrl(productUrl)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product URL'
            });
        }

        // 9. Build sanitized submission object (safe to log/store)
        const submission = {
            timestamp: new Date().toISOString(),
            businessName,
            contactName,
            phone,
            email,
            customerType,
            whatSell,
            biggestLeak,
            websiteUrl: websiteUrl || null,
            gbpUrl: gbpUrl || null,
            socialUrl: socialUrl || null,
            productUrl: productUrl || null,
            notes: notes || null,
            ip: ip.substring(0, 50), // Truncate IP for safety
        };

        const logSummary = {
            timestamp: submission.timestamp,
            businessName,
            biggestLeak,
            hasWebsiteUrl: Boolean(websiteUrl),
            hasGbpUrl: Boolean(gbpUrl),
            hasSocialUrl: Boolean(socialUrl),
            hasProductUrl: Boolean(productUrl),
            ipPrefix: ip.substring(0, 12),
        };

        // 10. Log a redacted summary only (for now - replace with email/CRM integration)
        // Do not log full phone/email/contact details into Vercel logs.
        console.log('Audit request received:', JSON.stringify(logSummary));

        // TODO: Email integration
        // Add environment variables:
        // - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (for email sending)
        // - NOTIFICATION_EMAIL (where to send audit requests)
        // - CRM_API_KEY, CRM_ENDPOINT (for CRM integration)
        //
        // Example email send (using nodemailer):
        // const transporter = nodemailer.createTransport({ ... });
        // await transporter.sendMail({
        //   from: process.env.SMTP_USER,
        //   to: process.env.NOTIFICATION_EMAIL,
        //   subject: `New Audit Request: ${businessName}`,
        //   text: JSON.stringify(submission, null, 2)
        // });

        // 11. Return success
        return res.status(200).json({
            success: true,
            message: 'Thank you! We will review your business and contact you within 24-48 hours with your free leak audit findings.'
        });

    } catch (error) {
        // Log error but don't expose details to client
        console.error('Audit request error:', error.message);

        return res.status(500).json({
            success: false,
            error: 'An error occurred processing your request. Please try again or email us directly.'
        });
    }
};
