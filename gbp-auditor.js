// gbp-auditor.js
// Analisa dados do GBP e gera score de otimização

function auditGBP(gbpData) {
  const audit = {
    scores: {},
    gaps: [],
    totalScore: 0,
    recommendations: []
  };

  // 1. NOME (obrigatório e impactante)
  if (gbpData.name && gbpData.name.length > 3) {
    audit.scores.name = 100;
  } else {
    audit.scores.name = 0;
    audit.gaps.push('Nome do negócio incompleto ou muito curto');
  }

  // 2. ENDEREÇO (obrigatório)
  if (gbpData.formatted_address && gbpData.formatted_address.length > 10) {
    audit.scores.address = 100;
  } else {
    audit.scores.address = 0;
    audit.gaps.push('Endereço incompleto ou mal formatado');
  }

  // 3. TELEFONE (CRÍTICO - aumenta contatos em 40%)
  if (gbpData.phone && gbpData.phone.length > 5) {
    audit.scores.phone = 100;
  } else {
    audit.scores.phone = 0;
    audit.gaps.push('❌ CRÍTICO: Telefone não configurado (reduz contatos em 40%)');
  }

// 4. WEBSITE (importante para conversão)
if (gbpData.website) {
  const website = gbpData.website.toLowerCase();
  const isInstagram = website.includes('instagram.com') || 
                      website.includes('ig.com') ||
                      website.includes('insta');
  
  if (isInstagram) {
    // 🚨 INSTAGRAM COMO WEBSITE
    audit.scores.website = 0;
    audit.gaps.push('🚨 CRÍTICO: Instagram cadastrado como website - Reduz visibilidade em 40%');
    audit.recommendations.push('website');
  } else if (website.startsWith('http')) {
    // Website real encontrado
    audit.scores.website = 100;
  } else {
    audit.scores.website = 0;
    audit.gaps.push('Website URL inválida');
  }
} else {
  audit.scores.website = 0;
  audit.gaps.push('Website não vinculado (você pode oferecer criar um!)');
  audit.recommendations.push('website');
}
  // 5. HORÁRIOS (muito importante - 35% menos cliques sem isso)
  const hasHours = gbpData.opening_hours && 
                   gbpData.opening_hours.weekday_text && 
                   gbpData.opening_hours.weekday_text.length > 0;
  
  if (hasHours) {
    audit.scores.hours = 100;
  } else {
    audit.scores.hours = 0;
    audit.gaps.push('❌ Horários não configurados (reduz cliques em 35%)');
  }

  // 6. FOTOS (impactante - aumenta cliques em 42%)
  const photoCount = gbpData.photo_count || 0;
  
  if (photoCount >= 15) {
    audit.scores.photos = 100;
  } else if (photoCount >= 10) {
    audit.scores.photos = 85;
    audit.gaps.push(`✓ ${photoCount} fotos. Bom, mas ideal 15+`);
  } else if (photoCount >= 5) {
    audit.scores.photos = 60;
    audit.gaps.push(`⚠️ Apenas ${photoCount} fotos. Ideal: 10-15 (melhora CTR 42%)`);
  } else {
    audit.scores.photos = 30;
    audit.gaps.push(`❌ CRÍTICO: ${photoCount} fotos apenas. Mínimo 5, ideal 10-15`);
  }

  // 7. CATEGORIA (importante para relevância)
  if (gbpData.types && gbpData.types.length > 0) {
    audit.scores.category = 100;
  } else {
    audit.scores.category = 0;
    audit.gaps.push('Categoria não definida (impacta relevância nas buscas)');
  }

  // 8. STATUS DO NEGÓCIO
  if (gbpData.business_status === 'OPERATIONAL') {
    audit.scores.status = 100;
  } else if (gbpData.business_status === 'CLOSED_TEMPORARILY') {
    audit.scores.status = 50;
    audit.gaps.push('⚠️ Negócio marcado como fechado temporariamente');
  } else {
    audit.scores.status = 0;
    audit.gaps.push(`❌ Status: ${gbpData.business_status}. Pode impactar visibilidade`);
  }

  // 9. DESCRIÇÃO (não consigo via API, mas é crítica)
  // Nota: A API não expõe descrição, mas deve ser incluída na auditoria manual
  audit.gaps.push('💡 Descrição: Adicione descrição completa (2-3 parágrafos) sobre o negócio');

  // 10. AVALIAÇÕES (bônus)
  const reviewCount = gbpData.review_count || 0;
  
  if (reviewCount > 50) {
    audit.scores.reviews = 100;
  } else if (reviewCount > 20) {
    audit.scores.reviews = 80;
    audit.gaps.push(`✓ ${reviewCount} avaliações. Bom, continue pedindo mais`);
  } else if (reviewCount > 5) {
    audit.scores.reviews = 50;
    audit.gaps.push(`⚠️ Apenas ${reviewCount} avaliações. Incentive clientes a deixar reviews`);
  } else {
    audit.scores.reviews = 20;
    audit.gaps.push(`❌ ${reviewCount} avaliações. Crítico pedir para clientes avaliarem`);
  }

  // CÁLCULO FINAL: Média ponderada
  const weights = {
    name: 0.10,
    address: 0.10,
    phone: 0.20,        // Crítico
    website: 0.15,
    hours: 0.15,        // Crítico
    photos: 0.10,
    category: 0.05,
    status: 0.05,
    reviews: 0.10
  };

  audit.totalScore = Math.round(
    Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + ((audit.scores[key] || 0) * weight);
    }, 0)
  );

  // Classificação do score
  if (audit.totalScore >= 85) {
    audit.classification = '🟢 Excelente';
  } else if (audit.totalScore >= 70) {
    audit.classification = '🟡 Bom (pode melhorar)';
  } else if (audit.totalScore >= 50) {
    audit.classification = '🟠 Precisa otimizar';
  } else {
    audit.classification = '🔴 Crítico';
  }

  return audit;
}
// ✅ Detecta Instagram como website
function detectInstagramAsWebsite(gbpData) {
  if (!gbpData.website) {
    return { detected: false, hasWebsite: false };
  }
  
  const website = gbpData.website.toLowerCase();
  const isInstagram = website.includes('instagram.com') || 
                      website.includes('ig.com') ||
                      website.includes('insta');
  
  return { 
    detected: isInstagram, 
    hasWebsite: !isInstagram,
    url: gbpData.website 
  };
}


module.exports = { auditGBP };
