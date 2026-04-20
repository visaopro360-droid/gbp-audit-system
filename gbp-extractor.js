// gbp-extractor.js
// Extrai dados completos do Google Business Profile usando Places API

const axios = require('axios');

async function extractGBPData(businessName, address, apiKey) {
  try {
    console.log(`🔍 Buscando: ${businessName} em ${address}`);

    // 1. TEXT SEARCH para encontrar o negócio
    const searchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const searchParams = {
      query: `${businessName} ${address}`,
      key: apiKey
    };

    const searchResponse = await axios.get(searchUrl, { params: searchParams });
    
    if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
      throw new Error(`Negócio não encontrado: ${businessName} ${address}`);
    }

    const placeId = searchResponse.data.results[0].place_id;
    console.log(`✅ Encontrado Place ID: ${placeId}`);

    // 2. PLACE DETAILS para dados completos
    const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const detailsParams = {
      place_id: placeId,
      fields: [
        'name',
        'formatted_address',
        'international_phone_number',
        'formatted_phone_number',
        'website',
        'opening_hours',
        'photos',
        'types',
        'business_status',
        'url',
        'rating',
        'user_ratings_total',
        'reviews',
        'formatted_address',
        'geometry'
      ].join(','),
      key: apiKey
    };

    const detailsResponse = await axios.get(detailsUrl, { params: detailsParams });
    
    if (detailsResponse.data.status !== 'OK') {
      throw new Error(`Erro na API: ${detailsResponse.data.status}`);
    }

    const result = detailsResponse.data.result;

    // Estruturar dados de forma limpa
    const gbpData = {
      name: result.name || '',
      formatted_address: result.formatted_address || '',
      phone: result.international_phone_number || result.formatted_phone_number || '',
      website: result.website || '',
      opening_hours: result.opening_hours || {},
      photos: result.photos || [],
      types: result.types || [],
      business_status: result.business_status || '',
      url: result.url || '', // Link direto para GBP
      rating: result.rating || 0,
      review_count: result.user_ratings_total || 0,
      geometry: result.geometry || {}
    };

    // Contar fotos (se houver resultado)
    gbpData.photo_count = gbpData.photos.length;

    console.log(`✅ Dados extraídos com sucesso`);
    console.log(`   - Nome: ${gbpData.name}`);
    console.log(`   - Endereço: ${gbpData.formatted_address}`);
    console.log(`   - Fotos: ${gbpData.photo_count}`);
    console.log(`   - Avaliação: ${gbpData.rating} ⭐ (${gbpData.review_count} reviews)`);

    return gbpData;

  } catch (error) {
    console.error('❌ Erro ao extrair dados GBP:', error.message);
    throw error;
  }
}

module.exports = { extractGBPData };
