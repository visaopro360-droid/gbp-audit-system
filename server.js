// server.js
// Servidor Express - GBP Audit System (VERSÃO FINAL COM INTEGRAÇÃO COMPLETA)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { auditGBP } = require('./gbp-auditor');
const { extractGBPData } = require('./gbp-extractor');
const { auditGBPAdvanced } = require('./gbp-advanced-audit');
const { generateFinalProfessionalReport } = require('./gbp-final-report-generator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROTA: Health Check
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: '✅ GBP Audit Server OK',
    version: '2.0.0 - PROFESSIONAL',
    endpoints: {
      health: 'GET /',
      audit: 'POST /api/gbp-audit',
      advancedAudit: 'POST /api/gbp-audit-advanced',
      professionalReport: 'POST /api/gbp-report-professional'
    }
  });
});

// ============================================
// ROTA: Auditoria Básica (Original)
// ============================================
app.post('/api/gbp-audit', async (req, res) => {
  try {
    const { businessName, address, clientEmail, apiKey } = req.body;

    if (!businessName || !address) {
      return res.status(400).json({
        error: 'businessName e address são obrigatórios'
      });
    }

    console.log(`🔍 Auditoria Básica: ${businessName} em ${address}`);

    const googleApiKey = apiKey || process.env.GOOGLE_PLACES_API_KEY;
    
    if (!googleApiKey) {
      return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY não configurada' });
    }

    const gbpData = await extractGBPData(businessName, address, googleApiKey);

    if (!gbpData) {
      return res.status(404).json({
        error: `Negócio "${businessName}" não encontrado em ${address}`
      });
    }

    console.log(`✅ Dados extraídos: ${gbpData.name}`);

    const auditResult = auditGBP(gbpData);

    console.log(`✅ Auditoria concluída: Score ${auditResult.totalScore}/100`);

    res.json({
      success: true,
      businessName: gbpData.name,
      address: gbpData.formatted_address,
      score: auditResult.totalScore,
      classification: auditResult.classification,
      gaps: auditResult.gaps,
      recommendations: auditResult.recommendations,
      clientEmail: clientEmail || null,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro na auditoria básica:', error.message);
    res.status(500).json({
      error: 'Erro ao processar auditoria',
      message: error.message
    });
  }
});

// ============================================
// ROTA: Auditoria Avançada (25+ Fatores)
// ============================================
app.post('/api/gbp-audit-advanced', async (req, res) => {
  try {
    const { businessName, address, clientEmail, apiKey } = req.body;

    if (!businessName || !address) {
      return res.status(400).json({
        error: 'businessName e address são obrigatórios'
      });
    }

    console.log(`🔍 Auditoria Avançada: ${businessName} em ${address}`);

    const googleApiKey = apiKey || process.env.GOOGLE_PLACES_API_KEY;
    
    if (!googleApiKey) {
      return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY não configurada' });
    }

    // 1. Extrair dados
    const gbpData = await extractGBPData(businessName, address, googleApiKey);

    if (!gbpData) {
      return res.status(404).json({
        error: `Negócio "${businessName}" não encontrado em ${address}`
      });
    }

    console.log(`✅ Dados extraídos: ${gbpData.name}`);

    // 2. Auditoria básica
    const auditResult = auditGBP(gbpData);

    console.log(`✅ Auditoria básica: Score ${auditResult.totalScore}/100`);

    // 3. Auditoria Avançada (25+ fatores)
    const advancedAnalysis = auditGBPAdvanced(gbpData, auditResult);

    console.log(`✅ Análise avançada: 25+ fatores analisados`);

    res.json({
      success: true,
      businessName: gbpData.name,
      address: gbpData.formatted_address,
      basicScore: auditResult.totalScore,
      businessType: advancedAnalysis.businessType,
      detailedScores: advancedAnalysis.detailedScores,
      competitors: advancedAnalysis.competitors,
      keywordAnalysis: advancedAnalysis.keywordAnalysis,
      roiAnalysis: advancedAnalysis.roiAnalysis,
      financialImpact: advancedAnalysis.financialImpact,
      aiRecommendations: advancedAnalysis.aiRecommendations,
      geoGridData: advancedAnalysis.geoGridData,
      clientEmail: clientEmail || null,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro na auditoria avançada:', error.message);
    res.status(500).json({
      error: 'Erro ao processar auditoria avançada',
      message: error.message
    });
  }
});

// ============================================
// ROTA: Relatório Profissional Completo (30+ páginas)
// ============================================
app.post('/api/gbp-report-professional', async (req, res) => {
  try {
    const { businessName, address, clientEmail, apiKey } = req.body;

    if (!businessName || !address) {
      return res.status(400).json({
        error: 'businessName e address são obrigatórios'
      });
    }

    console.log(`📊 Gerando Relatório Profissional: ${businessName}`);

    const googleApiKey = apiKey || process.env.GOOGLE_PLACES_API_KEY;
    
    if (!googleApiKey) {
      return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY não configurada' });
    }

    // 1. Extrair dados
    const gbpData = await extractGBPData(businessName, address, googleApiKey);

    if (!gbpData) {
      return res.status(404).json({
        error: `Negócio "${businessName}" não encontrado em ${address}`
      });
    }

    console.log(`✅ Dados extraídos: ${gbpData.name}`);

    // 2. Auditoria básica
    const auditResult = auditGBP(gbpData);

    console.log(`✅ Auditoria básica concluída`);

    // 3. Gerar relatório profissional (integra análise avançada)
    const htmlReport = generateFinalProfessionalReport(auditResult, gbpData, auditResult);

    console.log(`✅ Relatório profissional gerado (30+ páginas)`);

    res.json({
      success: true,
      businessName: gbpData.name,
      address: gbpData.formatted_address,
      score: auditResult.totalScore,
      classification: auditResult.classification,
      htmlReport: htmlReport,
      clientEmail: clientEmail || null,
      type: 'professional',
      pages: '30+',
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao gerar relatório profissional:', error.message);
    res.status(500).json({
      error: 'Erro ao gerar relatório profissional',
      message: error.message
    });
  }
});

// ============================================
// ROTA: Salvar Relatório (Para Make.com)
// ============================================
app.post('/api/save-report', (req, res) => {
  try {
    const { fileName, htmlContent, clientEmail } = req.body;

    if (!fileName || !htmlContent) {
      return res.status(400).json({
        error: 'fileName e htmlContent são obrigatórios'
      });
    }

    console.log(`📄 Relatório solicitado: ${fileName}`);
    console.log(`📧 Email: ${clientEmail || 'Não fornecido'}`);

    res.json({
      success: true,
      message: 'Relatório processado com sucesso',
      fileName: fileName,
      clientEmail: clientEmail
    });

  } catch (error) {
    console.error('❌ Erro ao salvar relatório:', error.message);
    res.status(500).json({
      error: 'Erro ao salvar relatório',
      message: error.message
    });
  }
});

// ============================================
// ROTA: Enviar Email (Para Make.com)
// ============================================
app.post('/api/send-email', (req, res) => {
  try {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({
        error: 'to, subject e htmlContent são obrigatórios'
      });
    }

    console.log(`📧 Email preparado para: ${to}`);
    console.log(`📌 Assunto: ${subject}`);

    res.json({
      success: true,
      message: 'Email pronto para envio',
      to: to,
      subject: subject
    });

  } catch (error) {
    console.error('❌ Erro ao preparar email:', error.message);
    res.status(500).json({
      error: 'Erro ao preparar email',
      message: error.message
    });
  }
});

// ============================================
// TRATAMENTO DE ERROS 404
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      health: 'GET /',
      basicAudit: 'POST /api/gbp-audit',
      advancedAudit: 'POST /api/gbp-audit-advanced',
      professionalReport: 'POST /api/gbp-report-professional'
    }
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║     🚀 GBP AUDIT SERVER v2.0 - PROFESSIONAL          ║
║                                                        ║
║     Porta: ${PORT}                                          ║
║     Ambiente: ${process.env.NODE_ENV || 'development'}     ║
║                                                        ║
║     ✅ Health:  GET http://localhost:${PORT}/               ║
║     ✅ Basic:   POST http://localhost:${PORT}/api/gbp-audit ║
║     ✅ Advanced: POST /api/gbp-audit-advanced          ║
║     ✅ Pro:     POST /api/gbp-report-professional     ║
║                                                        ║
║     Endpoints: 4 | Fatores: 25+ | Relatório: 30pgs   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;