// index.js
// Arquivo principal - integra tudo e pode ser usado no Make.com

const { extractGBPData } = require('./gbp-extractor');
const { auditGBP } = require('./gbp-auditor');
const { generateGBPReport } = require('./gbp-report-generator');

/**
 * Função principal que executa o fluxo completo
 * 
 * @param {string} businessName - Nome do negócio (ex: "Floricultura Ygaraflor")
 * @param {string} address - Endereço (ex: "Garopaba, SC")
 * @param {string} apiKey - Sua chave Google Places API
 * @returns {object} Objeto com gbpData, auditResult, reportHTML
 */
async function generateGBPAudit(businessName, address, apiKey) {
  try {
    console.log('='.repeat(60));
    console.log('🔍 INICIANDO AUDITORIA DE GBP');
    console.log('='.repeat(60));
    console.log(`\n📍 Negócio: ${businessName}`);
    console.log(`📍 Local: ${address}\n`);

    // ETAPA 1: Extrair dados
    console.log('⏳ [1/3] Extraindo dados do Google Business Profile...');
    const gbpData = await extractGBPData(businessName, address, apiKey);

    // ETAPA 2: Auditar dados
    console.log('⏳ [2/3] Analisando dados e gerando score...');
    const auditResult = auditGBP(gbpData);
    console.log(`✅ Score Final: ${auditResult.totalScore}/100 ${auditResult.classification}`);

    // ETAPA 3: Gerar relatório HTML
    console.log('⏳ [3/3] Gerando relatório HTML...');
    const reportHTML = generateGBPReport(businessName, gbpData, auditResult);
    console.log('✅ Relatório gerado com sucesso\n');

    console.log('='.repeat(60));
    console.log('✅ AUDITORIA CONCLUÍDA COM SUCESSO');
    console.log('='.repeat(60));

    // Retornar objeto com todos os dados
    return {
      success: true,
      businessName,
      gbpData,
      auditResult,
      reportHTML,
      summary: {
        totalScore: auditResult.totalScore,
        classification: auditResult.classification,
        gapCount: auditResult.gaps.length,
        gbpUrl: gbpData.url
      }
    };

  } catch (error) {
    console.error('❌ ERRO NA AUDITORIA:', error.message);
    return {
      success: false,
      error: error.message,
      businessName,
      address
    };
  }
}

/**
 * Função para salvar o relatório em arquivo
 */
async function saveReportToFile(reportHTML, filename) {
  const fs = require('fs').promises;
  try {
    await fs.writeFile(filename, reportHTML, 'utf-8');
    console.log(`✅ Relatório salvo: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao salvar: ${error.message}`);
    return false;
  }
}

// EXEMPLO DE USO
// =============================================================================

// Para testar localmente, descomente e preencha seus dados:
/*
(async () => {
  const result = await generateGBPAudit(
    'Floricultura Ygaraflor',           // Nome do negócio
    'Garopaba, SC',                      // Endereço
    'SUA_CHAVE_GOOGLE_PLACES_API'        // Sua chave API
  );

  if (result.success) {
    // Salvar relatório em arquivo
    await saveReportToFile(
      result.reportHTML,
      `relatorio_${result.businessName.replace(/\s+/g, '_')}.html`
    );

    // Exibir resumo
    console.log('\n📊 RESUMO:');
    console.log(result.summary);
  }
})();
*/

// INTEGRAÇÃO COM MAKE.COM
// =============================================================================
// No Make, configure assim:
//
// 1. Webhook Trigger → Recebe: businessName, address
// 2. HTTP Module → Node.js Code Module
//    Adicione este código no corpo da função
// 3. Email Module → Envia reportHTML como anexo/body
//
// Exemplo de Webhook JSON para testar:
// {
//   "businessName": "Floricultura Ygaraflor",
//   "address": "Garopaba, SC",
//   "apiKey": "YOUR_GOOGLE_PLACES_API_KEY"
// }

module.exports = {
  generateGBPAudit,
  saveReportToFile,
  extractGBPData: require('./gbp-extractor').extractGBPData,
  auditGBP: require('./gbp-auditor').auditGBP,
  generateGBPReport: require('./gbp-report-generator').generateGBPReport
};
