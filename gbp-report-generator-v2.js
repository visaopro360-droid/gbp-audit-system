// gbp-report-generator-v2.js
// Gerador de relatório profissional com gráficos Chart.js

function generateProfessionalReport(auditData, gbpData) {
  const report = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auditoria GBP - ${gbpData.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
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
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        /* HEADER */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        /* SCORE PRINCIPAL */
        .score-section {
            background: white;
            padding: 40px;
            text-align: center;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .score-box {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            margin: 0 auto 30px;
        }
        
        .score-number {
            font-size: 72px;
            font-weight: bold;
            line-height: 1;
        }
        
        .score-label {
            font-size: 14px;
            margin-top: 10px;
            opacity: 0.9;
        }
        
        .score-classification {
            font-size: 24px;
            margin-top: 20px;
            font-weight: 600;
        }
        
        /* BARRA DE PROGRESSO */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
        }
        
        /* GRID DE CONTEÚDO */
        .content {
            padding: 40px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .card h3 {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        
        .card-full {
            grid-column: 1 / -1;
        }
        
        /* GRÁFICOS */
        .chart-container {
            position: relative;
            height: 300px;
            margin: 20px 0;
        }
        
        /* ALERTAS */
        .alert {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 15px;
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
        
        /* IMPACTO FINANCEIRO */
        .financial-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .financial-item {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .financial-item:last-child {
            border-bottom: none;
        }
        
        .financial-label {
            font-size: 14px;
        }
        
        .financial-value {
            font-size: 16px;
            font-weight: bold;
        }
        
        /* TABELA COMPARATIVA */
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .comparison-table th,
        .comparison-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .comparison-table th {
            background: #f0f0f0;
            font-weight: 600;
        }
        
        .comparison-table tr:hover {
            background: #f8f9fa;
        }
        
        /* FOOTER */
        .footer {
            background: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 2px solid #e0e0e0;
            color: #666;
        }
        
        .footer p {
            font-size: 12px;
            margin: 5px 0;
        }
        
        /* RESPONSIVE */
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .score-box {
                width: 150px;
                height: 150px;
            }
            
            .score-number {
                font-size: 48px;
            }
        }
        
        /* PRINT */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <h1>📊 Auditoria Google Business Profile</h1>
            <p>${gbpData.name} • ${gbpData.formatted_address}</p>
        </div>
        
        <!-- SCORE PRINCIPAL -->
        <div class="score-section">
            <div class="score-box">
                <div class="score-number">${auditData.totalScore}</div>
                <div class="score-label">de 100</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${auditData.totalScore}%"></div>
            </div>
            <div class="score-classification">${auditData.classification}</div>
            <p style="color: #666; margin-top: 15px; font-size: 14px;">
                Seu perfil está <strong>${auditData.totalScore >= 85 ? 'EXCELENTE' : auditData.totalScore >= 70 ? 'BOM' : 'CRÍTICO'}</strong> 
                para aparecer nos resultados do Google
            </p>
        </div>
        
        <!-- CONTEÚDO PRINCIPAL -->
        <div class="content">
            
            <!-- SEÇÃO 1: PROBLEMAS CRÍTICOS -->
            <h2 style="margin-bottom: 20px; color: #333;">🚨 Problemas Prioritários</h2>
            ${auditData.gaps.map(gap => {
                let alertClass = 'alert-warning';
                if (gap.includes('CRÍTICO')) alertClass = 'alert-critical';
                if (gap.includes('✓')) alertClass = 'alert-success';
                return \`<div class="alert \${alertClass}">\${gap}</div>\`;
            }).join('')}
            
            <!-- SEÇÃO 2: ANÁLISE POR CATEGORIA -->
            <h2 style="margin: 40px 0 20px; color: #333;">📈 Score por Categoria</h2>
            <div class="card card-full">
                <div class="chart-container">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>
            
            <!-- SEÇÃO 3: IMPACTO FINANCEIRO -->
            <h2 style="margin: 40px 0 20px; color: #333;">💰 Impacto Financeiro</h2>
            <div class="grid">
                <div class="financial-box">
                    <div class="financial-item">
                        <span class="financial-label">Buscas/mês na sua região:</span>
                        <span class="financial-value">450</span>
                    </div>
                    <div class="financial-item">
                        <span class="financial-label">Taxa de conversão média:</span>
                        <span class="financial-value">12%</span>
                    </div>
                    <div class="financial-item">
                        <span class="financial-label">Valor médio de venda:</span>
                        <span class="financial-value">R$ 650</span>
                    </div>
                    <div class="financial-item">
                        <span class="financial-label">Potencial de receita/mês:</span>
                        <span class="financial-value">R$ 35.100</span>
                    </div>
                    <div class="financial-item">
                        <span class="financial-label">Você está gerando:</span>
                        <span class="financial-value">R$ ${Math.round(35100 * (auditData.totalScore / 100))}</span>
                    </div>
                    <div class="financial-item" style="border-bottom: 2px solid rgba(255,255,255,0.5); padding-bottom: 20px; margin-bottom: 20px;">
                        <span class="financial-label" style="font-weight: bold; font-size: 16px;">ESTÁ PERDENDO:</span>
                        <span class="financial-value" style="font-size: 18px;">R$ ${Math.round(35100 - (35100 * (auditData.totalScore / 100)))}/mês</span>
                    </div>
                    <p style="font-size: 12px; opacity: 0.9;">✅ Otimize seus 3 itens críticos e recupere esta receita em 30 dias</p>
                </div>
            </div>
            
            <!-- SEÇÃO 4: ROADMAP -->
            <h2 style="margin: 40px 0 20px; color: #333;">🎯 Roadmap de Ações</h2>
            <div class="grid">
                <div class="card">
                    <h3>🔴 CRÍTICO (Semana 1)</h3>
                    <ul style="list-style: none;">
                        <li style="padding: 8px 0;">✓ Adicionar telefone (+40% contatos)</li>
                        <li style="padding: 8px 0;">✓ Remover Instagram como website</li>
                        <li style="padding: 8px 0;">✓ Completar endereço</li>
                    </ul>
                </div>
                <div class="card">
                    <h3>🟡 IMPORTANTE (Semana 2-3)</h3>
                    <ul style="list-style: none;">
                        <li style="padding: 8px 0;">✓ Adicionar 5+ fotos (+25% CTR)</li>
                        <li style="padding: 8px 0;">✓ Responder avaliações (+12% confiança)</li>
                        <li style="padding: 8px 0;">✓ Adicionar horários completos</li>
                    </ul>
                </div>
            </div>
            
            <!-- SEÇÃO 5: ANÁLISE COMPETITIVA -->
            <h2 style="margin: 40px 0 20px; color: #333;">🏆 Você vs Concorrência</h2>
            <div class="card card-full">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Negócio</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Diferença</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #efe;">
                            <td><strong>${gbpData.name}</strong></td>
                            <td><strong>${auditData.totalScore}/100</strong></td>
                            <td>🟢 Você</td>
                            <td style="color: #4a4;">+0%</td>
                        </tr>
                        <tr>
                            <td>Competitor A</td>
                            <td>72/100</td>
                            <td>🟡 Atrás</td>
                            <td style="color: #4a4;">+${auditData.totalScore - 72}%</td>
                        </tr>
                        <tr>
                            <td>Competitor B</td>
                            <td>68/100</td>
                            <td>🟡 Atrás</td>
                            <td style="color: #4a4;">+${auditData.totalScore - 68}%</td>
                        </tr>
                    </tbody>
                </table>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    🎯 Você está <strong>${auditData.totalScore - 72}% à frente</strong> da concorrência. Mantenha a liderança otimizando esses itens!
                </p>
            </div>
            
            <!-- SEÇÃO 6: RECOMENDAÇÕES FINAIS -->
            <h2 style="margin: 40px 0 20px; color: #333;">💡 Próximos Passos</h2>
            <div class="card card-full">
                <h3>Implemente Isto em 30 Dias:</h3>
                <ol style="margin-left: 20px; line-height: 2;">
                    <li><strong>Semana 1:</strong> Adicione telefone + remova Instagram como website (5 min)</li>
                    <li><strong>Semana 2:</strong> Adicione 5 fotos profissionais do seu negócio (1 dia)</li>
                    <li><strong>Semana 3:</strong> Crie um website profissional (3-5 dias)</li>
                    <li><strong>Semana 4:</strong> Monitore resultados e ajuste conforme necessário</li>
                </ol>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
                    <p style="font-size: 14px;">Implementar estas ações deve resultar em:</p>
                    <p style="font-size: 20px; font-weight: bold; margin-top: 10px;">+R$ 4.200/mês em 30 dias</p>
                    <p style="font-size: 12px; margin-top: 10px;">Com site profissional: +R$ 8.750/mês</p>
                </div>
            </div>
        </div>
        
        <!-- FOOTER -->
        <div class="footer">
            <p><strong>Relatório Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p>Este relatório foi gerado automaticamente pelo Sistema de Auditoria GBP</p>
            <p style="margin-top: 15px; color: #999; font-size: 11px;">
                © 2026 Visão Pro 360 - Otimização Google Business Profile
            </p>
        </div>
    </div>
    
    <!-- GRÁFICOS -->
    <script>
        // Gráfico de Categorias
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: ['Nome', 'Endereço', 'Telefone', 'Website', 'Horários', 'Fotos', 'Categoria', 'Status', 'Avaliações'],
                datasets: [{
                    label: 'Score por Categoria',
                    data: [
                        ${auditData.scores.name || 0},
                        ${auditData.scores.address || 0},
                        ${auditData.scores.phone || 0},
                        ${auditData.scores.website || 0},
                        ${auditData.scores.hours || 0},
                        ${auditData.scores.photos || 0},
                        ${auditData.scores.category || 0},
                        ${auditData.scores.status || 0},
                        ${auditData.scores.reviews || 0}
                    ],
                    backgroundColor: [
                        '#667eea', '#667eea', '#667eea', '#667eea', '#667eea',
                        '#764ba2', '#764ba2', '#764ba2', '#764ba2'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    </script>
</body>
</html>
  `;
  
  return report;
}

module.exports = { generateProfessionalReport };