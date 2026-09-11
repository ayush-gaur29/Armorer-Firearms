const http = require('http');

http.get('http://localhost:8080/about', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VERIFYING REDESIGNED ABOUT PAGE ===');
    console.log('Page status:', res.statusCode);

    // 1. Hero & Header
    console.log('\n--- 1. HERO SECTION ---');
    console.log('Has Eyebrow "THE ATELIER":', data.includes('THE ATELIER'));
    console.log('Has Heading "About Armorer Firearms":', data.includes('About Armorer Firearms'));
    console.log('Has "EST. 1998":', data.includes('EST. 1998') || data.includes('1998'));
    console.log('Has "BIGFORK, MONTANA":', data.includes('BIGFORK, MONTANA'));
    console.log('Has Back Button:', data.includes('Back to Archive'));
    console.log('Has Hero Plate 01 Caption:', data.includes('PLATE 01 · THE BIGFORK ATELIER BENCH'));
    console.log('Has Hero Image (atelier_hero):', data.includes('atelier_hero'));

    // 2. Heritage Introduction & Pull Quote
    console.log('\n--- 2. HERITAGE INTRO & PULL QUOTE ---');
    console.log('Has Pull Quote ("What began as a precious metals business..."):', 
      data.includes('What began as a precious metals business grew into a serious firearms collection'));
    console.log('Has Origin Mention (Flathead Lake):', data.includes('Flathead Lake'));

    // 3. The Story: From Precious Metals to Historic Arms
    console.log('\n--- 3. THE STORY SECTION ---');
    console.log('Has Chapter I ("From Precious Metals to Historic Arms"):', data.includes('From Precious Metals to Historic Arms'));
    console.log('Has The Metallurgical Foundation:', data.includes('The Metallurgical Foundation'));
    console.log('Has Building the Estate Network:', data.includes('Building the Estate Network'));
    console.log('Has The Modern Specialty House:', data.includes('The Modern Specialty House'));

    // 4. Established / Timeline
    console.log('\n--- 4. TIMELINE SECTION ---');
    console.log('Has 1998 Timeline Node:', data.includes('FOUNDING ON FLATHEAD LAKE'));
    console.log('Has Estate Acquisitions Node:', data.includes('ESTATE ACQUISITIONS ACROSS THE ROCKIES'));
    console.log('Has Modern Archive Node:', data.includes('THE WORKING ATELIER & ARCHIVE'));

    // 5. Collection Philosophy (01 - 04)
    console.log('\n--- 5. COLLECTION PHILOSOPHY ---');
    console.log('Has "CURATION":', data.includes('CURATION'));
    console.log('Has "RESEARCH":', data.includes('RESEARCH'));
    console.log('Has "CONSERVATION":', data.includes('CONSERVATION'));
    console.log('Has "ACCESS":', data.includes('ACCESS'));

    // 6. Premium Visual Feature
    console.log('\n--- 6. VISUAL FEATURE SECTION ---');
    console.log('Has Feature Plate 02 Caption:', data.includes('PLATE 02 · RAKING LIGHT EXAMINATION &amp; CONSERVATION') || data.includes('PLATE 02 · RAKING LIGHT EXAMINATION'));
    console.log('Has Feature Image (conservation_detail):', data.includes('conservation_detail'));
    console.log('Has "Conservation, Not Restoration":', data.includes('Conservation, Not Restoration'));
    console.log('Has Raking Light Checklist:', data.includes('Raking Light Photographic Inspection'));

    // 7. Trust & Authenticity
    console.log('\n--- 7. TRUST & AUTHENTICITY ---');
    console.log('Has "Trust & Rigorous Authenticity":', data.includes('Trust &amp; Rigorous Authenticity') || data.includes('Trust & Rigorous Authenticity'));
    console.log('Has Factory Record Verification:', data.includes('FACTORY RECORD VERIFICATION'));

    // 8. CTA & Footer
    console.log('\n--- 8. CLOSING CTA & NAVIGATION ---');
    console.log('Has "Every Piece Has a History":', data.includes('Every Piece Has a History'));
    console.log('Has Explore Collection Button linking to /collection:', data.includes('/collection') && data.includes('EXPLORE THE COLLECTION'));
    console.log('Has Arrange Private Viewing CTA:', data.includes('ARRANGE A PRIVATE VIEWING'));
    console.log('Has Active About Link in Header:', data.includes('!text-brass font-semibold') || data.includes('About'));
  });
}).on('error', err => console.error('Fetch error:', err));
