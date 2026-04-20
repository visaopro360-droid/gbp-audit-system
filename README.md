# 🔍 Sistema de Auditoria Google Business Profile (GBP)

Sistema completo para extrair dados do Google Business Profile, gerar análise automática e criar relatório HTML profissional.

---

## 📋 O que o sistema faz?

1. **Extrai dados** do GBP via Google Places API (nome, telefone, fotos, avaliações, etc)
2. **Gera score** de otimização com ponderação inteligente
3. **Identifica gaps** (campos incompletos, falta de fotos, etc)
4. **Cria relatório HTML** profissional e pronto para enviar ao cliente
5. **Oferece recomendações** específicas de melhoria

---

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 14+ instalado
- Chave Google Places API (já tem a sua, certo?)

### Passos

```bash
# 1. Copie os arquivos para seu projeto
# - gbp-extractor.js
# - gbp-auditor.js
# - gbp-report-generator.js
# - index.js
# - package.json

# 2. Instale dependências
npm install

# 3. Configure sua chave API em um arquivo .env
# Crie arquivo .env na raiz do projeto:
GOOGLE_PLACES_API_KEY=sua_chave_aqui
```

---

## 💻 Uso Local (Teste na sua máquina)

### 1. Descomente o exemplo em `index.js`

Abra `index.js` e descomente o trecho:

```javascript
(async () => {
  const result = await generateGBPAudit(
    'Floricultura Ygaraflor',           // Seu negócio
    'Garopaba, SC',                      // Seu endereço
    'SUA_CHAVE_GOOGLE_PLACES_API'        // Sua chave
  );

  if (result.success) {
    await saveReportToFile(
      result.reportHTML,
      `relatorio_${result.businessName.replace(/\s+/g, '_')}.html`
    );
    console.log('\n📊 RESUMO:');
    console.log(result.summary);
  }
})();
```

### 2. Execute

```bash
npm start
```

### 3. Verifique o arquivo gerado

```
relatorio_Floricultura_Ygaraflor.html
```

Abra no navegador para visualizar.

---

## 🔌 Integração com Make.com

Este é o caso de uso real: automatizar para seus clientes.

### Setup no Make

#### 1. Crie um novo Cenário (Scenario)

```
Webhook → HTTP Module → Email Module
```

#### 2. Configure o Webhook Trigger

- Vá em **Make.com** → Crie novo Cenário
- Primeiro módulo: **Webhooks** → Instant Trigger
- Clique em "Create a webhook"
- Defina como **POST**
- Copie a URL do webhook

#### 3. Configure HTTP Module (Code)

No Make, adicione módulo **HTTP → Make a request** e configure:

**Method:** POST
**URL:** Deixe em branco (ou use local se tiver servidor Node)

Ou use **Node.js Code Module** se o Make suporta:

```javascript
// Código para colar no Make HTTP Module ou Code Module

const axios = require('axios');

// Suas funções importadas
const { extractGBPData } = require('gbp-extractor');
const { auditGBP } = require('gbp-auditor');
const { generateGBPReport } = require('gbp-report-generator');

async function processGBPAudit(businessName, address, apiKey) {
  const gbpData = await extractGBPData(businessName, address, apiKey);
  const auditResult = auditGBP(gbpData);
  const reportHTML = generateGBPReport(businessName, gbpData, auditResult);
  
  return {
    success: true,
    reportHTML: reportHTML,
    auditResult: auditResult,
    businessName: businessName
  };
}

// No Make, receberá: businessName, address, apiKey
let result = await processGBPAudit(
  input.businessName,
  input.address,
  input.apiKey || process.env.GOOGLE_PLACES_API_KEY
);

return result;
```

#### 4. Configure Email Module

- Módulo: **Gmail** ou **Email**
- Destinatário: `{{input.clientEmail}}` ou fixo
- Assunto: `Relatório GBP - {{input.businessName}}`
- Body: Adicione o HTML do relatório

**IMPORTANTE:** Para enviar HTML como email:
- Use um módulo que aceite HTML (Gmail com modo HTML)
- Ou crie PDF do HTML antes

---

## 📊 Estrutura de Dados

### Input (Webhook)

```json
{
  "businessName": "Floricultura Ygaraflor",
  "address": "Avenida Geral Liberato Bittencourt, Garopaba, SC",
  "clientEmail": "cliente@email.com",
  "apiKey": "YOUR_GOOGLE_PLACES_API_KEY"
}
```

### Output

```json
{
  "success": true,
  "businessName": "Floricultura Ygaraflor",
  "gbpData": {
    "name": "Floricultura Ygaraflor",
    "formatted_address": "...",
    "phone": "+55 48 99999-9999",
    "website": "https://example.com",
    "photo_count": 7,
    "rating": 4.5,
    "review_count": 23,
    ...
  },
  "auditResult": {
    "scores": {
      "name": 100,
      "address": 100,
      "phone": 100,
      "website": 100,
      "hours": 0,
      "photos": 70,
      "category": 100,
      "status": 100,
      "reviews": 80
    },
    "totalScore": 83,
    "classification": "🟢 Excelente",
    "gaps": [
      "❌ CRÍTICO: Horários não configurados...",
      "⚠️ Apenas 7 fotos..."
    ]
  },
  "reportHTML": "<html>...</html>",
  "summary": {
    "totalScore": 83,
    "classification": "🟢 Excelente",
    "gapCount": 2,
    "gbpUrl": "https://maps.google.com/..."
  }
}
```

---

## 🎯 Caso de Uso Prático: Seu Fluxo Atual

Você já tem:
- ✅ Google Places API
- ✅ Make.com
- ✅ Lovable para gerar sites

**Novo fluxo:**

```
Cliente entra no seu formulário
        ↓
[Make Webhook] Recebe: nome + endereço
        ↓
[Este sistema] Extrai GBP + gera audit
        ↓
[Lovable] Gera website (como já faz)
        ↓
[Email] Envia ao cliente:
  - Relatório GBP (HTML bonito)
  - Link do site gerado
  - Oferta de otimização GBP por R$ 300-500
```

---

## 📝 Documentação das Funções

### `generateGBPAudit(businessName, address, apiKey)`

**Parâmetros:**
- `businessName` (string): Nome do negócio
- `address` (string): Endereço
- `apiKey` (string): Sua chave Google Places API

**Retorno:**
```javascript
{
  success: boolean,
  businessName: string,
  gbpData: object,
  auditResult: object,
  reportHTML: string,
  summary: object
}
```

### `auditGBP(gbpData)`

Gera análise completa. Critérios ponderados:
- Telefone: 20% (crítico)
- Horários: 15% (crítico)
- Website: 15%
- Nome: 10%
- Endereço: 10%
- Fotos: 10%
- Avaliações: 10%
- Categoria: 5%
- Status: 5%

### `generateGBPReport(businessName, gbpData, auditResult)`

Gera HTML responsivo, pronto para imprimir/enviar.

---

## 🔐 Segurança

**IMPORTANTE:** Nunca commit sua chave API!

```bash
# Crie .gitignore
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo "*.html" >> .gitignore
```

No Make.com, armazene a chave em variáveis de ambiente/secrets.

---

## 📈 Métricas de Impacto (para vender)

Use estes dados no seu pitch:

- **+35%** cliques quando horários estão configurados
- **+42%** cliques com 10+ fotos de qualidade
- **+40%** mais contatos com telefone visível
- Score GBP influencia ranking local em até 30%

---

## 🐛 Troubleshooting

### Erro: "Negócio não encontrado"
- Verifique o nome e endereço exatos
- Tente com apenas o nome + cidade
- Confirme se existe no Google Maps

### Erro: "Invalid API Key"
- Confirme que a chave está correta
- Verifique se Places API está habilitada
- Confirme quota disponível

### Email não envia
- Use um serviço específico (Gmail, SendGrid)
- No Make, configure autenticação corretamente
- Teste com HTML simples primeiro

---

## 💡 Ideias de Expansão

1. **Monitoramento contínuo** - Rodar audit toda semana
2. **Painel de dashboard** - Cliente vê evolução do score
3. **Integração Instagram** - Puxar dados do Instagram também
4. **Sistema de alertas** - "Seu GBP caiu em 5 pontos"
5. **A/B Testing** - Testar diferentes descrições/fotos

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique se os arquivos estão no mesmo diretório
2. Confira `package.json` e rode `npm install`
3. Teste com `npm start` primeiro
4. No Make, use o "Run once" para debugar

---

## 📄 Licença

MIT - Use livremente para seu negócio!

---

**Desenvolvido para:** Jose - Serviço de Geração de Websites
**Versão:** 1.0.0
**Data:** Abril 2024
