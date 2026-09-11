import http from "node:http";

http.get('http://localhost:8080/contact', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VERIFYING REDESIGNED CONTACT PAGE ===');
    console.log('Status code:', res.statusCode);

    // 1. Hero checks
    console.log('\n--- 1. HERO SECTION ---');
    console.log('Has Eyebrow "THE ATELIER":', data.includes('THE ATELIER'));
    console.log('Has Heading "Contact Armorer Firearms":', data.includes('Contact Armorer Firearms'));
    console.log('Has Back button:', data.includes('Back to Archive'));
    console.log('Has Hero Image (contact_hero_atelier):', data.includes('contact_hero_atelier'));
    console.log('Has Hero Plate Caption ("PLATE 03"):', data.includes('PLATE 03'));

    // 2. Contact Information checks
    console.log('\n--- 2. CONTACT INFORMATION ---');
    console.log('Has Address "119 Jewel Basin Ct":', data.includes('119 Jewel Basin Ct'));
    console.log('Has City "Bigfork, Montana 59911":', data.includes('Bigfork, Montana 59911'));
    console.log('Has Phone "(406) 555-0142":', data.includes('(406) 555-0142'));
    console.log('Has Email "ArmorerFirearms@outlook.com":', data.includes('ArmorerFirearms@outlook.com'));
    console.log('Has Google Maps Link:', data.includes('maps.google.com'));
    console.log('Has FFL Compliance notice:', data.includes('licensed FFL'));

    // 3. Form checks
    console.log('\n--- 3. PRIVATE INQUIRY FORM ---');
    console.log('Has Form Title "Private Inquiry":', data.includes('Private Inquiry'));
    console.log('Has Full Name Input:', data.includes('Full Name *'));
    console.log('Has Email Address Input:', data.includes('Email Address *'));
    console.log('Has Telephone Input:', data.includes('Telephone (Optional)'));
    console.log('Has Piece of Interest Input:', data.includes('Piece of Interest'));
    console.log('Has Message Textarea:', data.includes('Message *'));
    console.log('Has Submit Button ("SUBMIT INQUIRY"):', data.includes('SUBMIT INQUIRY'));

    // 4. Protocols & Closing CTA
    console.log('\n--- 4. PROTOCOLS & CLOSING CTA ---');
    console.log('Has "Private Viewings by Appointment":', data.includes('Private Viewings by Appointment'));
    console.log('Has "Explore Before You Visit":', data.includes('Explore Before You Visit'));
    console.log('Has Link to /collection:', data.includes('/collection') && data.includes('EXPLORE THE COLLECTION'));
    console.log('Has Active Contact Link in Header:', data.includes('Contact'));
  });
}).on('error', err => console.error(err));
