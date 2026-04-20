// gbp-report-generator.js
// Gera relatório HTML profissional com recomendações

function generateGBPReport(businessName, gbpData, auditResult) {
  
  const scoreColor = (score) => {
    if (score >= 80) return '#28a745'; // Verde
    if (score >= 60) return '#ff9800'; // Laranja
    return '#dc3545'; // Vermelho
  };

  const scoreEmoji = (score) => {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  const translateField = (field) => {
    const translate = {
      name: 'Nome do Negócio',
      address: 'Endereço',
      phone: 'Telefone',
      website: 'Website',
      hours: 'Horários',
      photos: 'Fotos',
      category: 'Categoria',
      status: 'Status',
      reviews: 'Avaliações'
    };
    return translate[field] || field;
  };

  const reportHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório GBP - ${businessName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 16px;
      opacity: 0.9;
      margin: 5px 0;
    }

    .date {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 10px;
    }

    .score-section {
      padding: 40px 30px;
      background: #f9f9f9;
      text-align: center;
    }

    .main-score {
      font-size: 64px;
      font-weight: bold;
      color: var(--score-color);
      margin: 20px 0;
    }

    .score-label {
      font-size: 18px;
      color: #333;
      margin-bottom: 30px;
    }

    .score-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 30px;
    }

    @media (max-width: 600px) {
      .score-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .score-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-top: 4px solid #ddd;
    }

    .score-box.excellent { border-top-color: #28a745; }
    .score-box.good { border-top-color: #ff9800; }
    .score-box.poor { border-top-color: #dc3545; }

    .score-value {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0;
    }

    .score-label-small {
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section {
      padding: 30px;
      border-top: 1px solid #eee;
    }

    .section h2 {
      color: #333;
      font-size: 22px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .gap {
      background: white;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 12px 0;
      border-radius: 4px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      font-size: 14px;
      line-height: 1.6;
    }

    .gap.critical {
      border-left-color: #dc3545;
      background: #fff5f7;
    }

    .gap.good {
      border-left-color: #28a745;
      background: #f1f9f1;
    }

    .gap.info {
      border-left-color: #17a2b8;
      background: #f1f9fc;
    }

    .data-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }

    .data-item:last-child {
      border-bottom: none;
    }

    .data-label {
      font-weight: 600;
      color: #333;
    }

    .data-value {
      color: #666;
      text-align: right;
      flex: 1;
      margin-left: 20px;
      word-break: break-word;
    }

    .data-value a {
      color: #667eea;
      text-decoration: none;
    }

    .data-value a:hover {
      text-decoration: underline;
    }

    .recommendations {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      padding: 20px;
      border-radius: 8px;
      margin-top: 15px;
    }

    .recommendations ul {
      margin-left: 20px;
      font-size: 14px;
      line-height: 1.8;
    }

    .recommendations li {
      margin: 8px 0;
      color: #333;
    }

    .recommendations strong {
      color: #667eea;
    }

    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .cta-section h2 {
      color: white;
      margin-bottom: 15px;
    }

    .cta-section p {
      font-size: 14px;
      margin-bottom: 25px;
      opacity: 0.95;
      line-height: 1.6;
    }

    .cta-button {
      background: white;
      color: #667eea;
      padding: 15px 40px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .footer {
      background: #f5f5f5;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #eee;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }

    .badge.critical {
      background: #ffe0e0;
      color: #dc3545;
    }

    .badge.warning {
      background: #fff4e0;
      color: #ff9800;
    }

    .badge.success {
      background: #e0f0e0;
      color: #28a745;
    }

    .link-gbp {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .link-gbp:hover {
      text-decoration: underline;
    }

    .print-note {
      background: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
      margin: 20px 0;
      text-align: center;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .print-note {
        display: none;
      }
      .cta-button {
        display: none;
      }
    }
  </style>
  <script>
    const scoreColor = ${JSON.stringify(auditResult.totalScore >= 80 ? '#28a745' : auditResult.totalScore >= 60 ? '#ff9800' : '#dc3545')};
    document.documentElement.style.setProperty('--score-color', scoreColor);
  </script>
</head>
<body>
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <h1>🔍 Auditoria Google Business Profile</h1>
      <p>${businessName}</p>
      <p class="date">Relatório gerado em ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <!-- SCORE PRINCIPAL -->
    <div class="score-section">
      <div class="score-label">${auditResult.classification}</div>
      <div class="main-score">${auditResult.totalScore}</div>
      <div style="font-size: 16px; color: #666;">de 100 pontos</div>
      
      <div class="score-grid">
        ${Object.entries(auditResult.scores).map(([key, score]) => {
          let cssClass = 'excellent';
          if (score < 80 && score >= 60) cssClass = 'good';
          if (score < 60) cssClass = 'poor';
          
          return `
            <div class="score-box ${cssClass}">
              <div class="score-value" style="color: ${scoreColor(score)}">${scoreEmoji(score)} ${score}</div>
              <div class="score-label-small">${translateField(key)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- PONTOS DE MELHORIA -->
    <div class="section">
      <h2>⚠️ Pontos de Melhoria Identificados</h2>
      ${auditResult.gaps.map((gap, i) => {
        let cssClass = 'info';
        if (gap.includes('❌')) cssClass = 'critical';
        if (gap.includes('✓')) cssClass = 'good';
        
        return `<div class="gap ${cssClass}">${gap}</div>`;
      }).join('')}
    </div>

    <!-- RECOMENDAÇÕES -->
    <div class="section">
      <h2>✨ Recomendações de Otimização</h2>
      <div class="recommendations">
        <ul>
          <li><strong>Fotos de Qualidade:</strong> Adicione 10-15 fotos de alta resolução do seu negócio, produtos, equipe. Aumenta cliques em 42%.</li>
          <li><strong>Horários Precisos:</strong> Configure e mantenha horários atualizados. Atualize em feriados. Melhora cliques em 35%.</li>
          <li><strong>Descrição Completa:</strong> Escreva 2-3 parágrafos descrevendo seu negócio, valores, diferenciais.</li>
          <li><strong>Atributos:</strong> Selecione todos os atributos aplicáveis (estacionamento, WiFi, cartão de crédito, etc.)</li>
          <li><strong>Incentive Avaliações:</strong> Peça para clientes avaliarem seu perfil. Avaliações aumentam confiança.</li>
          <li><strong>Website Profissional:</strong> Vincule um site de qualidade. ${auditResult.recommendations.includes('website') ? '<strong style="color: #667eea;">Nós podemos criar um para você!</strong>' : ''}</li>
          <li><strong>Respostas a Reviews:</strong> Responda a todas as avaliações (positivas e negativas) em até 48 horas.</li>
          <li><strong>Categorias Corretas:</strong> Verifique se a categoria primária é a mais relevante para seu negócio.</li>
        </ul>
      </div>
    </div>

    <!-- DADOS ATUAIS -->
    <div class="section">
      <h2>📊 Dados Atuais Extraídos do GBP</h2>
      <div class="data-item">
        <span class="data-label">Nome do Negócio</span>
        <span class="data-value">${gbpData.name}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Endereço</span>
        <span class="data-value">${gbpData.formatted_address}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Telefone</span>
        <span class="data-value">${gbpData.phone ? `<a href="tel:${gbpData.phone}">${gbpData.phone}</a>` : '<span style="color: #999;">Não configurado</span>'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Website</span>
        <span class="data-value">${gbpData.website ? `<a href="${gbpData.website}" target="_blank">${gbpData.website}</a>` : '<span style="color: #999;">Não configurado</span>'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Avaliação</span>
        <span class="data-value">${gbpData.rating ? `${gbpData.rating} ⭐ (${gbpData.review_count} avaliações)` : '<span style="color: #999;">Sem avaliações</span>'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Fotos Publicadas</span>
        <span class="data-value">${gbpData.photo_count} fotos</span>
      </div>
      <div class="data-item">
        <span class="data-label">Horários</span>
        <span class="data-value">${gbpData.opening_hours && gbpData.opening_hours.weekday_text ? '✅ Configurados' : '<span style="color: #dc3545;">❌ Não configurados</span>'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Status do Negócio</span>
        <span class="data-value">${gbpData.business_status === 'OPERATIONAL' ? '✅ Operacional' : `⚠️ ${gbpData.business_status}`}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Categoria</span>
        <span class="data-value">${gbpData.types && gbpData.types.length > 0 ? gbpData.types.slice(0, 3).join(', ') : '<span style="color: #999;">Não definida</span>'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Perfil GBP</span>
        <span class="data-value"><a href="${gbpData.url}" target="_blank" class="link-gbp">Ver no Google Maps →</a></span>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-section">
      <h2>🚀 Próximas Etapas</h2>
      <p>
        Oferecemos um serviço completo que combina:<br>
        <strong>✓ Otimização de seu Google Business Profile</strong><br>
        <strong>✓ Criação de Website Profissional Responsivo</strong><br>
        <strong>✓ Integração com suas redes sociais</strong><br>
        <strong>✓ SEO otimizado para sua região</strong>
      </p>
      <button class="cta-button" onclick="this.textContent = '📧 Email enviado!'; setTimeout(() => alert('Entre em contato: seu-email@seu-dominio.com'), 500);">
        Solicitar Cotação Completa
      </button>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Relatório gerado automaticamente • Dados extraídos em ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
      <p>Este relatório é confidencial e foi preparado especificamente para ${businessName}</p>
    </div>
  </div>

  <div class="print-note">
    💡 Dica: Use Ctrl+P (ou Cmd+P no Mac) para imprimir ou salvar como PDF este relatório
  </div>
</body>
</html>
  `;

  return reportHTML;
}

module.exports = { generateGBPReport };
