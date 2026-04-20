// test-local.js
// Script para testar o sistema GBP localmente
// Uso: node test-local.js

require('dotenv').config();

const { generateGBPAudit, saveReportToFile } = require('./index');

// DADOS DE TESTE - ALTERE CONFORME NECESSÁRIO
const TEST_CASES = [
  {
    name: 'Floricultura Ygaraflor',
    address: 'Garopaba, SC',
    description: '✓ Seu primeiro teste'
  },
  {
    name: 'Restaurante Centro',
    address: 'Brusque, SC',
    description: '✓ Outro negócio para comparar'
  },
  // Adicione mais conforme necessário
];

/**
 * Função para executar teste
 */
async function runTest(testCase) {
  console.log('\n' + '='.repeat(70));
  console.log(`🧪 TESTE: ${testCase.name} - ${testCase.description}`);
  console.log('='.repeat(70));

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('❌ ERRO: Variável GOOGLE_PLACES_API_KEY não configurada!');
    console.log('\n📝 Crie arquivo .env na raiz do projeto com:');
    console.log('GOOGLE_PLACES_API_KEY=sua_chave_google_aqui');
    process.exit(1);
  }

  try {
    // Executar auditoria
    const result = await generateGBPAudit(
      testCase.name,
      testCase.address,
      apiKey
    );

    if (!result.success) {
      console.error('❌ Falha na auditoria:', result.error);
      return false;
    }

    // Dados extraídos
    console.log('\n📊 DADOS EXTRAÍDOS:');
    console.log(`  Nome: ${result.gbpData.name}`);
    console.log(`  Endereço: ${result.gbpData.formatted_address}`);
    console.log(`  Telefone: ${result.gbpData.phone || 'Não configurado'}`);
    console.log(`  Website: ${result.gbpData.website || 'Não configurado'}`);
    console.log(`  Fotos: ${result.gbpData.photo_count} fotos`);
    console.log(`  Avaliação: ${result.gbpData.rating} ⭐ (${result.gbpData.review_count} reviews)`);
    console.log(`  Link GBP: ${result.gbpData.url}`);

    // Resultado do audit
    console.log('\n🎯 RESULTADO DO AUDIT:');
    console.log(`  Score: ${result.auditResult.totalScore}/100`);
    console.log(`  Classificação: ${result.auditResult.classification}`);
    console.log(`  Gaps encontrados: ${result.auditResult.gaps.length}`);

    console.log('\n⚠️ PONTOS DE MELHORIA:');
    result.auditResult.gaps.slice(0, 5).forEach((gap, i) => {
      console.log(`  ${i + 1}. ${gap}`);
    });

    // Salvar arquivo HTML
    const filename = `relatorio_${testCase.name.replace(/\s+/g, '_')}_${Date.now()}.html`;
    await saveReportToFile(result.reportHTML, filename);
    console.log(`\n✅ Relatório salvo: ${filename}`);
    console.log(`   Abra no navegador para visualizar`);

    return true;

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    return false;
  }
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  console.log('\n🚀 INICIANDO TESTES DO SISTEMA GBP AUDIT');
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const testCase of TEST_CASES) {
    const success = await runTest(testCase);
    if (success) {
      passed++;
    } else {
      failed++;
    }
    
    // Delay entre testes para não sobrecarregar API
    if (TEST_CASES.indexOf(testCase) < TEST_CASES.length - 1) {
      console.log('\n⏳ Aguardando 2 segundos para próximo teste...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Resumo final
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(70));
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(`📈 Total: ${TEST_CASES.length}`);
  console.log('='.repeat(70));

  if (failed === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('\n✨ Próximos passos:');
    console.log('  1. Verifique os arquivos HTML gerados');
    console.log('  2. Integre com Make.com (veja MAKE_COM_INTEGRATION.md)');
    console.log('  3. Teste o webhook em produção');
    console.log('  4. Comece a oferecer para seus clientes!');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os erros acima.');
  }
}

/**
 * Menu interativo
 */
async function interactiveMode() {
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => {
    rl.question(prompt, resolve);
  });

  console.log('\n🔍 TESTE INTERATIVO - SISTEMA GBP AUDIT');
  console.log('='.repeat(70));

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ERRO: Configure GOOGLE_PLACES_API_KEY em .env');
    rl.close();
    process.exit(1);
  }

  let continueLoop = true;
  
  while (continueLoop) {
    console.log('\n📋 Menu:');
    console.log('  1. Testar negócio específico');
    console.log('  2. Executar todos os testes');
    console.log('  3. Sair');

    const choice = await question('\nEscolha (1-3): ');

    switch (choice) {
      case '1':
        const name = await question('Nome do negócio: ');
        const address = await question('Endereço (cidade, estado): ');
        
        console.log('\n⏳ Processando...');
        const result = await generateGBPAudit(name, address, apiKey);
        
        if (result.success) {
          console.log(`\n✅ Sucesso!`);
          console.log(`Score: ${result.auditResult.totalScore}/100`);
          console.log(`Classificação: ${result.auditResult.classification}`);
          
          const saveFile = await question('Salvar relatório? (s/n): ');
          if (saveFile.toLowerCase() === 's') {
            const filename = `relatorio_${name.replace(/\s+/g, '_')}.html`;
            await saveReportToFile(result.reportHTML, filename);
            console.log(`✅ Salvo: ${filename}`);
          }
        } else {
          console.log(`\n❌ Erro: ${result.error}`);
        }
        break;

      case '2':
        await runAllTests();
        break;

      case '3':
        continueLoop = false;
        console.log('\n👋 Até logo!');
        break;

      default:
        console.log('❌ Opção inválida');
    }
  }

  rl.close();
}

/**
 * Verificar dependências
 */
function checkDependencies() {
  try {
    require('axios');
    return true;
  } catch {
    console.error('❌ Dependências não instaladas!');
    console.error('Execute: npm install');
    process.exit(1);
  }
}

/**
 * Main
 */
async function main() {
  console.clear();
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                    ║');
  console.log('║           🔍 TESTE - SISTEMA DE AUDITORIA GBP                      ║');
  console.log('║                                                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');

  // Checar dependências
  checkDependencies();

  // Se passar argumentos na linha de comando
  const args = process.argv.slice(2);

  if (args[0] === '--test') {
    await runAllTests();
  } else if (args[0] === '--interactive') {
    await interactiveMode();
  } else {
    // Modo padrão
    console.log('\n💡 Modo de uso:');
    console.log('  npm start           - Executa todos os testes');
    console.log('  npm run test        - Igual a acima');
    console.log('  node test-local.js --test        - Testa casos pré-configurados');
    console.log('  node test-local.js --interactive - Modo interativo');

    // Executar testes padrão
    await runAllTests();
  }
}

// Executar
main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
