import http from "node:http";

http.get('http://localhost:8080/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VERIFYING HOMEPAGE HERO LOGO FIX ===');
    console.log('Status code:', res.statusCode);

    // Check logo image in hero
    const hasLogoImg = data.includes('src="/src/assets/logo.png"') || data.includes('logo.png');
    console.log('Has logo.png in hero:', hasLogoImg);

    // Check that excessive padding is gone
    const hasOldPadding = data.includes('pl-8 sm:pl-36 md:pl-44 lg:pl-52');
    console.log('Old padding is removed (false is good):', hasOldPadding);

    // Check that new size classes are present
    const hasNewSize = data.includes('size-12') && data.includes('lg:size-[4.5rem]');
    console.log('Has restrained size classes (size-12 to 4.5rem):', hasNewSize);

    // Check heading follows logo
    console.log('Has heading "A Private Archive of":', data.includes('A Private Archive of'));
    console.log('Has video background intact:', data.includes('cover_video.mp4'));
    console.log('Has CTA intact:', data.includes('View Collection') || data.includes('Explore The Archive') || data.includes('/collection'));
  });
}).on('error', err => console.error(err));
