# Marketing Digital — Vendas-JA

Base técnica para vender vários infoprodutos digitais (ebooks, cursos), em nichos diferentes,
via anúncios no Facebook/Instagram, com checkout pela Hotmart.

## Estrutura de pastas

| Pasta | Conteúdo |
|---|---|
| `index.html` | Página inicial (catálogo) listando os produtos — uso interno, pra você navegar entre as páginas |
| `landing-page/` | O **template em branco** — copie essa pasta pra criar um produto novo |
| `produtos/<nicho>/` | Uma página de vendas por produto (cópia do template, com o `CONFIG` preenchido) |
| `anuncios/` | Templates de copy para Facebook Ads, Brasil e internacional |
| `ebooks/` | Ferramenta para gerar ebook em PDF + template de estrutura de conteúdo |
| `leads/` | Painel para visualizar e exportar (CSV) os leads capturados, de todos os produtos |

Hoje já existem 5 pastas de exemplo em `produtos/` (emagrecimento, ganho-de-massa, investimentos,
confianca-social, comunicacao-e-relacionamentos) — todas ainda com conteúdo `{{placeholder}}`,
prontas pra receber o texto real de cada produto.

## Como adicionar um produto novo

1. Copie a pasta `landing-page/` para dentro de `produtos/`, com um nome curto (ex: `produtos/meu-novo-produto/`).
2. Abra o `index.html` dentro dela e edite o objeto `CONFIG` no topo (headline, benefícios,
   depoimentos, preço, link do checkout Hotmart, FAQ). O Firebase já vem preenchido.
3. Adicione o produto na lista `PRODUTOS` do `index.html` da raiz (opcional, só pra aparecer no
   catálogo interno).
4. Publique (commit + push) — o Netlify atualiza sozinho.
5. Gere o ebook gratuito correspondente em `ebooks/gerador-ebook.html`.
6. Monte o anúncio usando `anuncios/copy-facebook-br.md` (ou `-internacional.md`), com a URL do
   produto (ex: `https://vendas-ja.netlify.app/produtos/meu-novo-produto/`).

Todos os produtos compartilham o mesmo Firebase (leads) e o mesmo Netlify — cada lead salvo já
identifica de qual produto veio (campo `produto`).

## Sobre os nichos "sensíveis" (saúde e relacionamento)

- **Emagrecimento / ganho de massa**: sem promessas numéricas específicas, sem foto de
  "antes e depois", sem linguagem de vergonha corporal (política do Meta Ads).
- **Relacionamentos** (`confianca-social`, `comunicacao-e-relacionamentos`): o enquadramento é
  confiança, comunicação e habilidades sociais — não manipulação ou táticas de "pegar" alguém à
  força. Além de ser a linha ética que seguimos, é também o que passa nas políticas de anúncio do
  Meta (conteúdo sexualmente sugestivo ou manipulador é removido).
- **Investimentos**: sem promessa de rentabilidade garantida ou específica.

Mais detalhes de copy por nicho estão nos arquivos de `anuncios/`.

## O que já está pronto

- Todas as páginas de produto: visual dinâmico (animações ao rolar, barra de compra fixa,
  contador de oferta opcional, seção de depoimentos), captura de lead, Meta Pixel e link de
  checkout Hotmart com rastreamento de UTM.
- Gerador de ebook em PDF (capa, sumário, capítulos, página final de CTA).
- Painel de leads com exportação para CSV.
- Templates de copy de anúncio (BR e internacional), com avisos de política por nicho.

Todos os arquivos são HTML estático — abrem direto no navegador, sem instalar nada.

## O que precisa de configuração manual (contas de terceiros)

Ver `CHECKLIST-CONFIGURACAO.md`.
