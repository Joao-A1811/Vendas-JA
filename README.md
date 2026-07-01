# Marketing Digital — Vendas-JA

Base técnica para vender infoprodutos digitais (ebooks, cursos) via anúncios no Facebook/Instagram,
com checkout pela Hotmart. Esta pasta contém tudo que dá para deixar pronto **antes** de escolher
o primeiro produto — depois é só editar os arquivos de configuração com o conteúdo específico.

## O funil

```
Anúncio (Facebook/Instagram)
        │  copy em anuncios/
        ▼
Landing page (captura de lead)
        │  landing-page/index.html (ou index-en.html)
        │  formulário grava lead no Firebase
        ▼
Ebook grátis (isca) + e-mail de boas-vindas
        │  gerado em ebooks/gerador-ebook.html
        ▼
Oferta do produto pago → checkout Hotmart
        │  botão na própria landing page, com UTM
        ▼
Painel de leads (acompanhar e exportar para e-mail marketing)
           leads/painel-leads.html
```

## Estrutura de pastas

| Pasta | Conteúdo |
|---|---|
| `landing-page/` | Página de vendas reutilizável (PT-BR e EN), com captura de lead, Meta Pixel e link de checkout Hotmart |
| `anuncios/` | Templates de copy para Facebook Ads, Brasil e internacional |
| `ebooks/` | Ferramenta para gerar ebook em PDF (rodando 100% no navegador) + template de estrutura de conteúdo |
| `leads/` | Painel para visualizar e exportar (CSV) os leads capturados |

## O que já está pronto (não precisa de conta nenhuma pra testar)

- Landing page funcional, com validação de formulário e cálculo de UTM
- Gerador de ebook em PDF (capa, sumário com paginação automática, capítulos, página final de CTA)
- Templates de copy de anúncio (BR e internacional) com checklist de publicação
- Painel de leads com exportação para CSV

Todos os arquivos são HTML estático — abrem direto no navegador (Chrome/Edge/Firefox), sem instalar nada,
inclusive no Windows.

## O que precisa de configuração manual (contas de terceiros)

Ver `CHECKLIST-CONFIGURACAO.md` para o passo a passo. Resumo do que falta:

1. Conta Hotmart (produtor) + cadastro do produto → gera o link de checkout
2. Meta Business Manager com conta de anúncios verificada (**sem Dolphin Anty / antidetect browser** —
   decisão já tomada: usar conta real única, ver seção "Sobre anúncios" abaixo)
3. Projeto Firebase novo e separado, só para leads (não reaproveitar o projeto `valor-carteira` da
   plataforma de carteira, para não misturar dados de clientes de investimento com leads de marketing)
4. Conta de e-mail marketing (recomendado: Brevo, plano grátis) para transformar os leads capturados
   em sequência automática de e-mails
5. Site novo no Netlify apontando para `marketing-digital/landing-page` (a landing page de vendas é um
   site separado da `plataforma-carteira`, que continua publicada como está hoje — **não alteramos o
   `netlify.toml` da raiz** para não impactar o site já publicado)

## Sobre anúncios (decisão já registrada na conversa)

Foi avaliado o uso do Dolphin{Anty} (antidetect browser) para gerenciar contas de anúncio — decidimos
**não usar**, porque a função dele é mascarar fingerprint de navegador para parecer múltiplas
identidades/localizações diferentes ao Meta, o que viola os Termos de Uso do Meta Ads e é um dos
principais motivos de banimento de conta de anúncio (inclusive derrubando o Business Manager inteiro).
Para vender em outras localidades, o caminho é o Meta Business Manager oficial, com uma conta real,
segmentando campanhas por país/idioma/moeda.

## Próximo passo

Escolher o primeiro infoproduto (tema/nicho) para preencher:
- `CONFIG` no topo de `landing-page/index.html`
- Conteúdo do ebook em `ebooks/gerador-ebook.html`
- Copy de anúncio em `anuncios/copy-facebook-br.md`
