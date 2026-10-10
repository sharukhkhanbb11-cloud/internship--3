/**
 * ====================================================================
 * AUTOMATED A11Y & SEO AUDIT TEST SCRIPT (Node.js)
 * Verifies semantic tags, ARIA attributes, SEO metadata & form labels
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');

const PAGES = ['index.html', 'about.html', 'projects.html', 'resume.html', 'contact.html'];
const REQUIRED_SEMANTIC_TAGS = ['<header', '<nav', '<main', '<section', '<article', '<aside', '<footer'];

let totalErrors = 0;
let totalPasses = 0;

function pass(msg) {
  console.log(`  ✓ PASS: ${msg}`);
  totalPasses++;
}

function fail(msg) {
  console.error(`  ✗ FAIL: ${msg}`);
  totalErrors++;
}

console.log('====================================================================');
console.log('STARTING AUTOMATED SEMANTIC HTML5 & ACCESSIBILITY AUDIT');
console.log('====================================================================\n');

PAGES.forEach((pageName) => {
  const filePath = path.join(__dirname, pageName);
  console.log(`Auditing ${pageName}...`);

  if (!fs.existsSync(filePath)) {
    fail(`File does not exist: ${pageName}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Semantic Tags Verification
  REQUIRED_SEMANTIC_TAGS.forEach((tag) => {
    if (content.includes(tag)) {
      pass(`Contains semantic landmark ${tag}>`);
    } else {
      fail(`Missing required semantic landmark ${tag}> in ${pageName}`);
    }
  });

  // 2. Skip to Content Link
  if (content.includes('href="#main-content"') && content.includes('class="skip-link"')) {
    pass('Contains WCAG 2.4.1 bypass block (Skip to main content link)');
  } else {
    fail('Missing skip-to-content link in ' + pageName);
  }

  // 3. Main content id
  if (content.includes('id="main-content"')) {
    pass('Main landmark contains matching id="main-content"');
  } else {
    fail('Main landmark missing id="main-content"');
  }

  // 4. Lang and dir attributes
  if (content.includes('lang="en"') && content.includes('dir="ltr"')) {
    pass('HTML root specifies valid lang="en" and dir="ltr"');
  } else {
    fail('HTML root missing lang or dir attributes');
  }

  // 5. SEO Meta Tags
  if (/<title>.+<\/title>/i.test(content)) {
    pass('Page contains descriptive <title>');
  } else {
    fail('Missing or empty <title>');
  }

  if (content.includes('<meta name="description"')) {
    pass('Contains SEO <meta name="description">');
  } else {
    fail('Missing SEO meta description');
  }

  if (content.includes('<link rel="canonical"')) {
    pass('Contains canonical link tag');
  } else {
    fail('Missing canonical link');
  }

  if (content.includes('property="og:title"') && content.includes('name="twitter:card"')) {
    pass('Contains Open Graph and Twitter Card social metadata');
  } else {
    fail('Missing Open Graph or Twitter metadata');
  }

  if (content.includes('application/ld+json')) {
    pass('Contains Schema.org JSON-LD structured data');
  } else {
    fail('Missing Schema.org JSON-LD script');
  }

  // 6. Contact Form Specifics (contact.html)
  if (pageName === 'contact.html') {
    if (content.includes('<form') && content.includes('<fieldset') && content.includes('<legend')) {
      pass('Contact form correctly uses <fieldset> and <legend> for accessible grouping');
    } else {
      fail('Contact form missing <fieldset> or <legend>');
    }

    const inputs = ['full-name', 'user-email', 'inquiry-type', 'user-message'];
    inputs.forEach((id) => {
      if (content.includes(`for="${id}"`) && content.includes(`id="${id}"`)) {
        pass(`Form input #${id} has matching <label for="${id}">`);
      } else {
        fail(`Form input #${id} missing properly matched label`);
      }
    });

    if (content.includes('aria-describedby=') && content.includes('aria-invalid=')) {
      pass('Form utilizes dynamic aria-describedby and aria-invalid attributes');
    } else {
      fail('Form missing aria-describedby or aria-invalid');
    }
  }

  console.log('');
});

// Verify Static Assets Existence
console.log('Verifying Asset References...');
const assets = [
  'assets/css/styles.css',
  'assets/js/main.js',
  'assets/js/contact.js',
  'assets/js/projects.js',
  'assets/icons/favicon.svg',
  'robots.txt',
  'sitemap.xml'
];

assets.forEach((assetPath) => {
  const fullPath = path.join(__dirname, assetPath);
  if (fs.existsSync(fullPath)) {
    pass(`Asset exists: ${assetPath}`);
  } else {
    fail(`Asset missing: ${assetPath}`);
  }
});

console.log('\n====================================================================');
console.log(`AUDIT COMPLETE: ${totalPasses} Passed, ${totalErrors} Failed`);
console.log('====================================================================\n');

if (totalErrors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
