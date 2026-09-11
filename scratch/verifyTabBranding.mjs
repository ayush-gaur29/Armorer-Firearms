const routes = [
  '/',
  '/collection',
  '/about',
  '/contact',
  '/collection/colt-single-action-army-1873',
  '/login',
  '/signup',
  '/profile'
];

async function verifyAll() {
  console.log('--- Verifying Browser Tab Branding Across All Routes ---');
  let hasErrors = false;

  for (const route of routes) {
    const url = `http://localhost:8080${route}`;
    try {
      const res = await fetch(url);
      const html = await res.text();
      
      // Extract <title>
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : 'NO TITLE FOUND';

      // Check favicon links
      const hasFaviconIco = html.includes('href="/favicon.ico?v=2"');
      const hasFavicon32 = html.includes('href="/favicon-32x32.png?v=2"');
      const hasAppleTouch = html.includes('href="/apple-touch-icon.png?v=2"');
      const hasManifest = html.includes('href="/site.webmanifest"');

      console.log(`Route [${route}]:`);
      console.log(`  Title: "${title}"`);
      console.log(`  Favicon ico: ${hasFaviconIco ? 'OK' : 'MISSING'}`);
      console.log(`  Favicon 32x32: ${hasFavicon32 ? 'OK' : 'MISSING'}`);
      console.log(`  Apple touch icon: ${hasAppleTouch ? 'OK' : 'MISSING'}`);
      console.log(`  Web manifest: ${hasManifest ? 'OK' : 'MISSING'}`);

      if (title !== 'Armorer Firearms') {
        console.error(`  FAIL: Title is "${title}", expected strictly "Armorer Firearms"`);
        hasErrors = true;
      }
      if (!hasFaviconIco || !hasFavicon32 || !hasAppleTouch || !hasManifest) {
        console.error(`  FAIL: Missing expected favicon/icon links`);
        hasErrors = true;
      }
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\nVerification encountered errors.');
    process.exit(1);
  } else {
    console.log('\nAll routes verified successfully! Strict "Armorer Firearms" title and icons everywhere.');
  }
}

verifyAll();
