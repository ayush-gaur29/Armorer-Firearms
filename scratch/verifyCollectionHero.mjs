import http from "node:http";

http.get('http://localhost:8080/collection', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== VERIFYING COLLECTION HERO REFINEMENT ===');
    console.log('Status code:', res.statusCode);

    // Check Hero elements
    console.log('Has "The Collection":', data.includes('The Collection'));
    console.log('Has "THE ARMORER ARCHIVE":', data.includes('THE ARMORER ARCHIVE'));
    console.log('Has Back button:', data.includes('Back to Atelier'));

    // Check Right-side Image Element
    console.log('Has "collection_hero_archival":', data.includes('collection_hero_archival'));
    console.log('Has Right Column Archival Caption ("PRIVATE COLLECTION"):', data.includes('PRIVATE COLLECTION'));
    console.log('Has 2-column grid ("lg:grid-cols-12"):', data.includes('lg:grid-cols-12'));
    console.log('Has left column span ("lg:col-span-7"):', data.includes('lg:col-span-7'));
    console.log('Has right column span ("lg:col-span-5"):', data.includes('lg:col-span-5'));

    // Check Statistics Strip is still intact
    console.log('Has "Pieces In Archive":', data.includes('Pieces In Archive'));
    console.log('Has "Curated Categories":', data.includes('Curated Categories'));
    console.log('Has "Historical Span":', data.includes('Historical Span'));
    console.log('Has "Provenance Documented":', data.includes('Provenance Documented'));

    // Check Filters & Search intact
    console.log('Has Search Input:', data.includes('Search archive by maker, model, caliber...'));

    // Check Collection pieces intact
    console.log('Has Winchester Model 1873:', data.includes('Winchester Model 1873'));
    console.log('Has Remington Model 870 Wingmaster:', data.includes('Remington Model 870 Wingmaster'));
    console.log('Has Sig Sauer P226:', data.includes('Sig Sauer P226'));
  });
}).on('error', err => console.error(err));
