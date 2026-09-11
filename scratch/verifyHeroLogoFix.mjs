import http from "node:http";

http.get('http://localhost:8080/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VERIFYING INTEGRATED HERO LOGO PLACEMENT ===');
    console.log('Status code:', res.statusCode);

    // Check desktop/tablet logo integration
    const hasDesktopLogo = data.includes('hidden sm:inline-block') && data.includes('lg:size-[5.5rem]');
    console.log('Has desktop/tablet logo integrated beside Historic Arms:', hasDesktopLogo);

    // Check mobile logo presence
    const hasMobileLogo = data.includes('sm:hidden') && data.includes('size-[54px]');
    console.log('Has mobile logo with clean layout:', hasMobileLogo);

    // Check sizes: desktop (88px in 75-100px range), tablet (64-80px in 60-80px range), mobile (54px in 50-65px range)
    console.log('Has size-16 (tablet 64px):', data.includes('size-16'));
    console.log('Has md:size-20 (tablet 80px):', data.includes('md:size-20'));
    console.log('Has lg:size-[5.5rem] (desktop 88px):', data.includes('lg:size-[5.5rem]'));
    console.log('Has size-[54px] (mobile 54px):', data.includes('size-[54px]'));

    // Check headings and elements
    console.log('Has "A Private Archive of":', data.includes('A Private Archive of'));
    console.log('Has "Historic Arms":', data.includes('Historic Arms'));
    console.log('Has video background intact:', data.includes('cover_video.mp4'));
    console.log('Has CTA intact:', data.includes('/collection'));
  });
}).on('error', err => console.error(err));
