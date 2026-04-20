# ⚡ Quick Start - 5 Minutos

Comece agora. Perguntas depois.

---

## 1️⃣ Preparação (30 segundos)

Você precisa:
- ✅ Node.js 14+ instalado
- ✅ Google Places API Key (já tem)
- ✅ Estes arquivos no mesmo diretório

---

## 2️⃣ Instalar (1 minuto)

```bash
# Na pasta com os arquivos:
npm install
```

---

## 3️⃣ Configurar (1 minuto)

Crie arquivo `.env`:

```
GOOGLE_PLACES_API_KEY=sua_chave_aqui
```

Salve e feche.

---

## 4️⃣ Testar (2 minutos)

```bash
node test-local.js --interactive
```

Escolha opção 1, digite:
- **Nome:** Floricultura Ygaraflor
- **Endereço:** Garopaba, SC

Espere 10-15 segundos...

**Sucesso?** ✅ Arquivo `relatorio_*.html` foi criado!

Abra no navegador para ver o resultado.

---

## 5️⃣ Usar em Make.com

Vá ao arquivo: `MAKE_COM_INTEGRATION.md`

Siga os passos. Leva 20 minutos para integrar.

---

## 🎯 Fluxo Completo

```
Cliente → Seu Formulário → Make Webhook → Este Sistema → Email com Relatório
```

---

## ❓ Dúvidas?

| Problema | Solução |
|----------|---------|
| Erro "API Key inválida" | Verificou se colou certo em `.env`? |
| "Negócio não encontrado" | Tente: Nome completo + Cidade, SC |
| Nada acontece | Rode com `node test-local.js` (menos complexo) |
| "Cannot find module" | Rode `npm install` novamente |

---

## 📚 Próximas Leituras

1. **README.md** - Documentação completa
2. **MAKE_COM_INTEGRATION.md** - Integração detalhada
3. **gbp-auditor.js** - Veja como o score é calculado

---

**Pronto? Comece!** 🚀

```bash
npm install
node test-local.js --interactive
```

Depois é só integrar com Make e oferecer aos clientes!
