// MAKE_COM_INTEGRATION.md
# 🔌 Integração com Make.com - Guia Passo a Passo

Este guia mostra como integrar o Sistema GBP Audit com seu fluxo Make.com existente.

---

## 🎯 Fluxo Final (o que você terá)

```
ENTRADA: Formulário do cliente
    ↓
[Make Webhook] Recebe businessName + address + clientEmail
    ↓
[Node.js Code] Executa GBP Audit
    ↓
[Decision] Sucesso?
    ├─ SIM → [Email] Envia relatório HTML + website link
    └─ NÃO → [Email] Envia mensagem de erro
```

---

## 📋 Pré-requisitos

- ✅ Conta Make.com ativa
- ✅ Arquivo `.js` deste sistema em seu servidor Node ou função serverless
- ✅ Google Places API Key (já tem)
- ✅ Conta Gmail/Email para enviar relatórios

---

## 🚀 Passo 1: Preparar o Código para Make

### A. Crie arquivo: `make-handler.js`

Este arquivo é o que Make executará:

```javascript
// make-handler.js
// Handler específico para Make.com

const { extractGBPData } = require('./gbp-extractor');
const { auditGBP } = require('./gbp-auditor');
const { generateGBPReport } = require('./gbp-report-generator');

/**
 * Handler para Make.com
 * Recebe input do webhook e retorna resultado
 */
async function handleGBPAudit(input) {
  const {
    businessName,
    address,
    clientEmail,
    apiKey = process.env.GOOGLE_PLACES_API_KEY
  } = input;

  // Validações
  if (!businessName || !address) {
    return {
      success: false,
      error: 'Faltam dados: businessName ou address',
      received: input
    };
  }

  if (!apiKey) {
    return {
      success: false,
      error: 'Google Places API Key não configurada'
    };
  }

  try {
    // 1. Extrair dados GBP
    const gbpData = await extractGBPData(businessName, address, apiKey);

    // 2. Auditar
    const auditResult = auditGBP(gbpData);

    // 3. Gerar relatório
    const reportHTML = generateGBPReport(businessName, gbpData, auditResult);

    // 4. Retornar para Make
    return {
      success: true,
      businessName: businessName,
      totalScore: auditResult.totalScore,
      classification: auditResult.classification,
      gapCount: auditResult.gaps.length,
      reportHTML: reportHTML,
      clientEmail: clientEmail,
      gbpUrl: gbpData.url,
      photoCount: gbpData.photo_count,
      reviewCount: gbpData.review_count,
      website: gbpData.website || 'Não configurado'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      businessName: businessName,
      clientEmail: clientEmail
    };
  }
}

// Para uso direto no Make
module.exports = handleGBPAudit;

// Alternativa: Se Make suportar função IIFE
// (async () => { ... })();
```

---

## 🔨 Passo 2: Criar Cenário no Make

### A. Acesse Make.com

1. Faça login em [make.com](https://make.com)
2. Clique em **+ Create a New Scenario**
3. Selecione **Webhooks** como primeiro módulo

### B. Configure Webhook Trigger

**Módulo 1: Webhooks - Instant Trigger**

1. Clique em **Webhooks** → **Instant Trigger** (ou **Custom Webhook**)
2. Clique no ícone + para criar novo webhook
3. Dê um nome: `GBP Audit Webhook`
4. Defina como **POST**
5. **COPIE** a URL do webhook (vai usar depois)

**Exemplo:**
```
https://hook.make.com/abc123def456...
```

### C. Define a Estrutura de Dados (Data Structure)

No mesmo módulo Webhooks:

1. Clique em **Set up required data structure**
2. Adicione os campos esperados:

```json
{
  "businessName": "string",
  "address": "string",
  "clientEmail": "string",
  "apiKey": "string (opcional)"
}
```

3. Clique em **Save**

---

## 💻 Passo 3: Adicionar Node.js/Code Execution

Agora você precisa executar o código. Make oferece 2 opções:

### OPÇÃO A: Usar "Run Node.js Code" (Se disponível)

1. Adicione módulo: **Integrations** → **Node.js** (ou similar)
2. Clique em **Run Code**
3. Cole este código:

```javascript
const { extractGBPData } = require('./gbp-extractor');
const { auditGBP } = require('./gbp-auditor');
const { generateGBPReport } = require('./gbp-report-generator');

// input vem do webhook anterior
const { businessName, address, clientEmail, apiKey } = input;

try {
  // 1. Extrair
  const gbpData = await extractGBPData(businessName, address, apiKey);
  
  // 2. Auditar
  const auditResult = auditGBP(gbpData);
  
  // 3. Relatório
  const reportHTML = generateGBPReport(businessName, gbpData, auditResult);
  
  return {
    success: true,
    businessName: businessName,
    totalScore: auditResult.totalScore,
    classification: auditResult.classification,
    reportHTML: reportHTML,
    clientEmail: clientEmail,
    gbpUrl: gbpData.url
  };
} catch (error) {
  return {
    success: false,
    error: error.message,
    businessName: businessName
  };
}
```

### OPÇÃO B: Usar HTTP Request para seu próprio servidor

1. Adicione módulo: **HTTP** → **Make a request**
2. Configure:

```
URL: https://seu-servidor.com/api/gbp-audit
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer SEU_TOKEN

Body:
{
  "businessName": {{1.businessName}},
  "address": {{1.address}},
  "clientEmail": {{1.clientEmail}},
  "apiKey": {{env.GOOGLE_PLACES_API_KEY}}
}
```

Seu servidor Node rodaria `make-handler.js` e retornaria o resultado.

---

## 📧 Passo 4: Adicionar Email Module

1. Adicione módulo: **Gmail** (ou **Email**)

2. Configure:

```
Gmail Module:
  From: seu-email@gmail.com
  To: {{3.clientEmail}}  (output do código anterior)
  Subject: 🔍 Relatório GBP - {{3.businessName}}
  
  Body (HTML):
    <html>
      <p>Oi {{3.businessName}},</p>
      <p>Seu relatório de auditoria do Google Business Profile está pronto!</p>
      <p><strong>Score: {{3.totalScore}}/100 - {{3.classification}}</strong></p>
      <p><a href="{{3.gbpUrl}}">Ver seu GBP aqui →</a></p>
      <hr>
      {{3.reportHTML}}
      <hr>
      <p>Oferecemos otimização completa. Fale conosco!</p>
    </html>
  
  Attachments: (deixe vazio ou adicione HTML em PDF)
```

---

## 🔀 Passo 5: Adicionar Decision (If/Then)

Para tratar erros:

1. Após módulo de código, adicione **Flow Control** → **Router**

2. Configure 2 caminhos:

**Caminho 1 (Sucesso):**
```
Condition: 3.success == true
Actions: [Email com relatório]
```

**Caminho 2 (Erro):**
```
Condition: 3.success == false
Actions: [Email notificando erro ao cliente]
```

---

## 🧪 Passo 6: Testar

### A. Dispare um Webhook de Teste

1. Clique em **Webhooks** → **Ativate webhooks for testing**
2. Use `curl` ou Postman para enviar:

```bash
curl -X POST https://hook.make.com/abc123def456 \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Floricultura Ygaraflor",
    "address": "Garopaba, SC",
    "clientEmail": "seu-email@test.com",
    "apiKey": "sua_chave_google"
  }'
```

### B. Verifique Logs

No Make:
1. Clique em **Run once** ou **Deploy**
2. Veja os logs de cada módulo
3. Procure por erros

### C. Teste Email

Se chegou o email, teste abrindo no navegador. Se HTML não rendeu bem:

1. Use **Utilities** → **HTML to PDF** antes de email
2. Anexe como PDF

---

## 📱 Integração com seu Formulário

Seu formulário precisa enviar para o webhook:

### HTML Form:

```html
<form action="https://hook.make.com/abc123..." method="POST">
  <input type="text" name="businessName" required>
  <input type="text" name="address" required>
  <input type="email" name="clientEmail" required>
  <button type="submit">Gerar Relatório</button>
</form>
```

### React/Vue (Seu Lovable):

```javascript
const handleSubmit = async (formData) => {
  const response = await fetch('https://hook.make.com/abc123...', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessName: formData.name,
      address: formData.address,
      clientEmail: formData.email,
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY
    })
  });
  
  const result = await response.json();
  console.log('Relatório enviado!', result);
};
```

---

## 🔐 Variáveis de Ambiente no Make

1. No Make, vá em **Team settings** → **Variables**
2. Crie variável:

```
Name: GOOGLE_PLACES_API_KEY
Value: sua_chave_aqui
Scope: Global
```

3. Use no código: `{{env.GOOGLE_PLACES_API_KEY}}`

---

## 📊 Resultado Final

Quando tudo estiver configurado:

```
Cliente entra em seu site
    ↓
Preenche: Nome + Endereço
    ↓
Make dispara automaticamente
    ↓
Extrai dados do GBP
    ↓
Gera auditoria
    ↓
Cria HTML bonito
    ↓
Envia por email em segundos
    ↓
Cliente recebe relatório profissional
```

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| "API Key inválida" | Verifique em **Variables** → está configurada? |
| "Webhook não dispara" | Clique em teste → veja se chega no first module |
| "Email sem HTML" | Use Gmail + ative "HTML mode" ou converta para PDF |
| "Campo undefined" | No módulo de código, use `{{1.fieldName}}` (1 = webhook) |
| "Relatório incompleto" | Aumentar timeout em **HTTP settings** |

---

## 💡 Dicas Extras

**1. Adicione Analytics**
```
Adicione campo: timestamp, origem
Armazene em Google Sheets (Make tem integração)
Veja quantos relatórios foram gerados por dia
```

**2. Crie Versão PDF**
```
Módulo: HTML to PDF
Input: {{3.reportHTML}}
Anexe ao email
```

**3. Integre com CRM**
```
Após email enviado:
- Crie lead no seu CRM
- Envie para Google Sheets
- Integre com Zapier/Integromat
```

**4. Adicione WhatsApp**
```
Após auditoria:
- Envie mensagem via WhatsApp
- Link para visualizar relatório
- Oferta especial de otimização
```

---

## 🎉 Próximos Passos

Após ter isso funcionando:

1. ✅ Teste com 3-5 clientes reais
2. ✅ Refine os gaps e recomendações
3. ✅ Adicione pricing para "Serviço de Otimização GBP"
4. ✅ Crie landing page oferta: "Diagnóstico GBP Grátis"
5. ✅ Coloque no seu site principal

---

**Dúvidas?** Re-teste um passo por vez. Make tem logs detalhados - leia tudo!
