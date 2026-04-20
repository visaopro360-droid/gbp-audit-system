const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { extractGBPData } = require('./gbp-extractor');
const { auditGBP } = require('./gbp-auditor');
const { generateGBPReport } = require('./gbp-report-generator');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    status: '✅ GBP Audit Server OK',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      audit: 'POST /api/gbp-audit'
    }
  });
});

app.post('/api/gbp-audit', async (req, res) => {
  try {
    console.log('🔍 Iniciando auditoria GBP...');
    
    const { businessName, address, clientEmail, apiKey } = req.body;

    if (!businessName || !businessName.trim()) {
      return res.status(400).json({
        success: false,
        error: 'businessName é obrigatório'
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        error: 'address é obrigatório'
      });
    }

    if (!clientEmail || !clientEmail.trim()) {
      return res.status(400).json({
        success: false,
        error: 'clientEmail é obrigatório'
      });
    }

    const apiKeyToUse = apiKey || process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKeyToUse) {
      return res.status(400).json({
        success: false,
        error: 'API Key não fornecida no body ou em .env'
      });
    }

    console.log(`📍 Negócio: ${businessName}`);
    console.log(`📍 Endereço: ${address}`);

    console.log('⏳ [1/3] Extraindo dados...');
    const gbpData = await extractGBPData(businessName, address, apiKeyToUse);

    console.log('⏳ [2/3] Analisando...');
    const auditResult = auditGBP(gbpData);

    console.log('⏳ [3/3] Gerando relatório...');
    const reportHTML = generateGBPReport(businessName, gbpData, auditResult);

    console.log(`✅ Auditoria concluída: ${auditResult.totalScore}/100`);

    res.json({
      success: true,
      businessName: gbpData.name,
      address: gbpData.formatted_address,
      totalScore: auditResult.totalScore,
      classification: auditResult.classification,
      gapCount: auditResult.gaps.length,
      photoCount: gbpData.photo_count,
      reviewCount: gbpData.review_count,
      website: gbpData.website || 'Não configurado',
      reportHTML: reportHTML,
      clientEmail: clientEmail,
      gbpUrl: gbpData.url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║     🚀 GBP AUDIT SERVER RODANDO                        ║
║                                                        ║
║     Porta: ${PORT}                                          ║
║     Ambiente: ${process.env.NODE_ENV || 'development'}         ║
║                                                        ║
║     Health:  http://localhost:${PORT}/                   ║
║     Audit:   POST http://localhost:${PORT}/api/gbp-audit ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;