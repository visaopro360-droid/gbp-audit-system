// gbp-final-report-generator.js
// Gerador de relatório final profissional (30+ páginas) - VERSÃO CORRIGIDA

const { auditGBPAdvanced } = require('./gbp-advanced-audit');

function generateFinalProfessionalReport(auditData, gbpData, auditResult) {
  const advancedAnalysis = auditGBPAdvanced(gbpData, auditResult);
  
  // Construir alertas
  let alertsHTML = '';
  if (auditResult.gaps && auditResult.gaps.length > 0) {
    auditResult.gaps.slice(0, 5).forEach(gap => {
      let alertClass = 'alert-warning';
      if (gap.includes('CRÍTICO')) alertClass = 'alert-critical';
      if (gap.includes('✓')) alertClass = 'alert-success';
      alertsHTML += '<div class="alert ' + alertClass + '">' + gap + '</div>';
    });
  }
  
  // Construir tabela de fatores
  let factorsTableHTML = '';
  Object.entries(advancedAnalysis.detailedScores).forEach(([key, data]) => {
    const status = data.score >= 80 ? '✅ Excelente' : data.score >= 60 ? '⚠️ Bom' : '❌ Crítico';
    factorsTableHTML += '<tr><td><strong>' + data.label + '</strong></td>';
    factorsTableHTML += '<td>' + data.score + '/100</td>';
    factorsTableHTML += '<td>' + (data.weight * 100).toFixed(0) + '%</td>';
    factorsTableHTML += '<td>' + status + '</td></tr>';
  });
  
  // Construir heatmap
  let heatmapHTML = '';
  Object.entries(advancedAnalysis.heatmap).forEach(([key, data]) => {
    const cssClass = 'heatmap-' + data.level.toLowerCase();
    heatmapHTML += '<div class="heatmap-item ' + cssClass + '">' + data.risk + '</div>';
  });
  
  // Construir tabela de keywords
  let keywordsTableHTML = '';
  advancedAnalysis.keywordAnalysis.forEach(kw => {
    keywordsTableHTML += '<tr>';
    keywordsTableHTML += '<td><strong>' + kw.keyword + '</strong></td>';
    keywordsTableHTML += '<td>#' + kw.currentPosition + '</td>';
    keywordsTableHTML += '<td>#' + kw.targetPosition + '</td>';
    keywordsTableHTML += '<td>' + kw.searchVolume + '/mês</td>';
    keywordsTableHTML += '<td>' + kw.difficulty + '%</td>';
    keywordsTableHTML += '<td>' + kw.opportunity + '</td>';
    keywordsTableHTML += '</tr>';
  });
  
  // Construir cards de competidores
  let competitorsHTML = '';
  advancedAnalysis.competitors.forEach((comp, idx) => {
    competitorsHTML += '<div class="card" style="margin: 20px 0;">';
    competitorsHTML += '<strong>#' + (idx + 1) + ' - ' + comp.name + '</strong>';
    competitorsHTML += '<p><strong>Score:</strong> ' + comp.score + '/100</p>';
    competitorsHTML += '<p><strong>Reviews:</strong> ' + comp.reviews + '</p>';
    competitorsHTML += '<p><strong>Rating:</strong> ' + comp.rating + '⭐</p>';
    
    competitorsHTML += '<h4 style="margin-top: 15px; color: #4caf50;">✅ Vantagens:</h4>';
    competitorsHTML += '<ul style="margin-left: 20px;">';
    comp.advantages.forEach(adv => {
      competitorsHTML += '<li>' + adv + '</li>';
    });
    competitorsHTML += '</ul>';
    
    competitorsHTML += '<h4 style="margin-top: 10px; color: #f44;">❌ Desvantagens:</h4>';
    competitorsHTML += '<ul style="margin-left: 20px;">';
    comp.disadvantages.forEach(dis => {
      competitorsHTML += '<li>' + dis + '</li>';
    });
    competitorsHTML += '</ul>';
    competitorsHTML += '</div>';
  });
  
  // Construir tabela ROI
  let roiTableHTML = '';
  advancedAnalysis.roiAnalysis.forEach(roi => {
    roiTableHTML += '<tr>';
    roiTableHTML += '<td><strong>' + roi.action + '</strong></td>';
    roiTableHTML += '<td>' + (roi.impact * 100).toFixed(0) + '%</td>';
    roiTableHTML += '<td>' + roi.effort + '</td>';
    roiTableHTML += '<td>' + roi.daysToImplement + '</td>';
    roiTableHTML += '<td><strong style="color: #4caf50;">R$ ' + roi.revenue.toLocaleString('pt-BR') + '</strong></td>';
    roiTableHTML += '</tr>';
  });
  
  // Construir cards de conteúdo AI
  let contentCardsHTML = '';
  advancedAnalysis.aiRecommendations.contentSuggestions.forEach(sugg => {
    contentCardsHTML += '<div class="card"><strong>💡 Ideia</strong>' + sugg + '</div>';
  });
  
  // Construir lista de posts
  let postsListHTML = '';
  advancedAnalysis.aiRecommendations.postIdeas.forEach(post => {
    postsListHTML += '<li><strong>' + post + '</strong></li>';
  });
  
  const report = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auditoria GBP Professional - ${gbpData.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"><\/script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 30px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 42px;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 20px;
            opacity: 0.95;
            margin-bottom: 20px;
        }
        
        .header .meta {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 30px;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .score-hero {
            padding: 40px;
            text-align: center;
            background: linear-gradient(to bottom, #f8f9fa, white);
        }
        
        .score-circle {
            width: 280px;
            height: 280px;
            margin: 0 auto 30px;
            background: conic-gradient(#667eea 0deg, #667eea ${auditResult.totalScore * 3.6}deg, #e0e0e0 ${auditResult.totalScore * 3.6}deg, #e0e0e0 360deg);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
            position: relative;
        }
        
        .score-circle::after {
            content: '';
            position: absolute;
            width: 250px;
            height: 250px;
            background: white;
            border-radius: 50%;
        }
        
        .score-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        
        .score-number {
            font-size: 80px;
            font-weight: bold;
            color: #667eea;
            line-height: 1;
        }
        
        .score-label {
            font-size: 16px;
            color: #666;
            margin-top: 10px;
        }
        
        .score-status {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: ${auditResult.totalScore >= 85 ? '#d4edda' : auditResult.totalScore >= 70 ? '#fff3cd' : '#f8d7da'};
            color: ${auditResult.totalScore >= 85 ? '#155724' : auditResult.totalScore >= 70 ? '#856404' : '#721c24'};
            border-radius: 30px;
            font-weight: 600;
            border: 2px solid ${auditResult.totalScore >= 85 ? '#c3e6cb' : auditResult.totalScore >= 70 ? '#ffeaa7' : '#f5c6cb'};
        }
        
        .section {
            padding: 50px 40px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .section h2 {
            font-size: 32px;
            margin-bottom: 30px;
            color: #333;
            border-left: 5px solid #667eea;
            padding-left: 20px;
        }
        
        .section h3 {
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 20px;
            color: #444;
        }
        
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .card strong {
            display: block;
            margin-bottom: 10px;
            color: #667eea;
        }
        
        .chart-container {
            position: relative;
            height: 400px;
            margin: 30px 0;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
        }
        
        .table th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        .table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .table tr:hover {
            background: #f8f9fa;
        }
        
        .alert {
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid;
        }
        
        .alert-critical {
            background: #fee;
            border-color: #f44;
            color: #c33;
        }
        
        .alert-warning {
            background: #ffd;
            border-color: #fb0;
            color: #b90;
        }
        
        .alert-success {
            background: #efe;
            border-color: #4f4;
            color: #3a3;
        }
        
        .alert-info {
            background: #eef;
            border-color: #44f;
            color: #33a;
        }
        
        .financial-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 10px;
            margin: 30px 0;
        }
        
        .financial-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .financial-value {
            font-weight: bold;
            font-size: 16px;
        }
        
        .heatmap-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }
        
        .heatmap-item {
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            color: white;
        }
        
        .heatmap-green { background: #4caf50; }
        .heatmap-yellow { background: #ffc107; color: #333; }
        .heatmap-orange { background: #ff9800; }
        .heatmap-red { background: #f44336; }
        
        .footer {
            background: #f8f9fa;
            padding: 40px;
            text-align: center;
            color: #666;
            border-top: 2px solid #e0e0e0;
        }
        
        .footer p {
            margin: 5px 0;
            font-size: 12px;
        }
        
        @media print {
            body { background: white; }
            .wrapper { box-shadow: none; }
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 28px; }
            .cards-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>📊 Auditoria Profissional GBP</h1>
            <p class="subtitle">${gbpData.name}</p>
            <div class="meta">
                <div>📍 ${gbpData.formatted_address}</div>
                <div>⭐ ${gbpData.rating || 'N/A'} (${gbpData.user_ratings_total || 0} avaliações)</div>
                <div>📅 ${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
        </div>
        
        <div class="score-hero">
            <div class="score-circle">
                <div class="score-content">
                    <div class="score-number">${auditResult.totalScore}</div>
                    <div class="score-label">de 100</div>
                </div>
            </div>
            <div class="score-status">${auditResult.classification}</div>
        </div>
        
        <div class="section">
            <h2>📋 Resumo Executivo</h2>
            
            <div class="alert alert-info">
                <strong>Tipo de Negócio Detectado:</strong> ${advancedAnalysis.businessType.toUpperCase()}
            </div>
            
            <h3>Status Geral</h3>
            <div class="cards-grid">
                <div class="card"><strong>Score Geral</strong>${auditResult.totalScore}/100</div>
                <div class="card"><strong>Classificação</strong>${auditResult.classification}</div>
                <div class="card"><strong>Fatores Analisados</strong>25+</div>
                <div class="card"><strong>Competidores</strong>3</div>
            </div>
            
            <h3>Pontos Críticos</h3>
            ${alertsHTML}
        </div>
        
        <div class="section">
            <h2>📈 Análise Detalhada (25+ Fatores)</h2>
            
            <h3>Detalhamento por Fator</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Fator</th>
                        <th>Score</th>
                        <th>Peso</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${factorsTableHTML}
                </tbody>
            </table>
            
            <h3>Heatmap de Risco</h3>
            <div class="heatmap-grid">
                ${heatmapHTML}
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Análise de Palavras-Chave</h2>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>Palavra-Chave</th>
                        <th>Posição</th>
                        <th>Meta</th>
                        <th>Volume</th>
                        <th>Dificuldade</th>
                        <th>Oportunidade</th>
                    </tr>
                </thead>
                <tbody>
                    ${keywordsTableHTML}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>🏆 Análise Competitiva</h2>
            ${competitorsHTML}
        </div>
        
        <div class="section">
            <h2>💰 Impacto Financeiro Real</h2>
            
            <div class="financial-box">
                <div class="financial-row">
                    <span>Buscas por mês:</span>
                    <span class="financial-value">${advancedAnalysis.financialImpact.searchesPerMonth}</span>
                </div>
                <div class="financial-row">
                    <span>Taxa de conversão:</span>
                    <span class="financial-value">${advancedAnalysis.financialImpact.conversionRate}%</span>
                </div>
                <div class="financial-row">
                    <span>Ticket médio:</span>
                    <span class="financial-value">${advancedAnalysis.financialImpact.avgTicketValue}</span>
                </div>
                <div class="financial-row">
                    <span>Potencial/mês:</span>
                    <span class="financial-value">${advancedAnalysis.financialImpact.potentialRevenue}</span>
                </div>
                <div class="financial-row">
                    <span>Você está gerando:</span>
                    <span class="financial-value">${advancedAnalysis.financialImpact.currentRevenue}</span>
                </div>
                <div class="financial-row" style="border-top: 2px solid rgba(255,255,255,0.5); padding-top: 15px; margin-top: 15px;">
                    <span style="font-size: 18px; font-weight: bold;">ESTÁ PERDENDO:</span>
                    <span class="financial-value" style="font-size: 18px;">${advancedAnalysis.financialImpact.lostRevenue}</span>
                </div>
            </div>
            
            <h3>ROI de Cada Ação</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Ação</th>
                        <th>Impacto</th>
                        <th>Dificuldade</th>
                        <th>Dias</th>
                        <th>Ganho/mês</th>
                    </tr>
                </thead>
                <tbody>
                    ${roiTableHTML}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>🤖 Recomendações Personalizadas por IA</h2>
            
            <h3>Sugestões de Conteúdo</h3>
            <div class="cards-grid">
                ${contentCardsHTML}
            </div>
            
            <h3>Ideias de Posts</h3>
            <ol style="margin-left: 20px; line-height: 2;">
                ${postsListHTML}
            </ol>
        </div>
        
        <div class="section">
            <h2>🚀 Próximos Passos</h2>
            
            <h3>Ação Imediata</h3>
            <div class="alert alert-critical">
                <strong>ESTA SEMANA:</strong> Implemente os itens críticos e ganhe em torno de R$ ${advancedAnalysis.roiAnalysis[0].revenue.toLocaleString('pt-BR')}/mês
            </div>
            
            <h3>Próximos 30 Dias</h3>
            <div class="alert alert-warning">
                <strong>PRÓXIMO MÊS:</strong> Otimize todos os fatores
            </div>
            
            <h3>Próximos 90 Dias</h3>
            <div class="alert alert-success">
                <strong>3 MESES:</strong> Implemente website profissional + ganhe R$ ${advancedAnalysis.financialImpact.possibleGains}/mês
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Relatório Gerado:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p>Sistema de Auditoria GBP Profissional v2.0</p>
            <p style="margin-top: 20px;">© 2026 Visão Pro 360 - Otimização Google Business Profile</p>
        </div>
    </div>
</body>
</html>
  `;
  
  return report;
}

module.exports = { generateFinalProfessionalReport };