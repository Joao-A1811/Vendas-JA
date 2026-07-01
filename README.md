# Marketing Digital — NextLevel

Base técnica para vender vários infoprodutos digitais (ebooks, cursos), em nichos diferentes,
em português/inglês/espanhol, via anúncios no Facebook/Instagram, com checkout pela Hotmart.

**NextLevel** é a marca pública do site (o que o cliente vê). "Vendas-JA" é só o nome do projeto/
repositório internamente — não aparece em nenhuma página.

## Estrutura de pastas

| Pasta | Conteúdo |
|---|---|
| `assets/config-global.js` | **Pixel do Meta + Firebase — edita UMA vez aqui, vale pro site todo** |
| `assets/produtos.js` | **Lista de produtos do catálogo — edita UMA vez, muda nos 3 idiomas** |
| `index.html` / `index-en.html` / `index-es.html` | Página inicial (catálogo), uma por idioma |
| `landing-page/` | O **template em branco**, nos 3 idiomas — copie essa pasta pra criar um produto novo |
| `produtos/<nicho>/` | Uma página de vendas por produto, nos 3 idiomas |
| `ebooks/gerador-ebook.html` | Ferramenta para gerar ebook em PDF no navegador |
| `ebooks/arquivos/` | **PDFs dos ebooks gratuitos** (um por produto/idioma — ver LEIA-ME.txt lá dentro) |
| `anuncios/` | Templates de copy para Facebook Ads, Brasil e internacional |
| `leads/painel-leads.html` | Painel dos leads capturados (com produto e idioma), exporta CSV |

## Automações já embutidas

- **Publicação automática**: qualquer alteração enviada ao GitHub (commit + push) vai pro ar
  sozinha em ~1 minuto (deploy automático do Netlify). Dá até pra editar direto no site do
  GitHub (tecla `.` ou botão de lápis no arquivo → Commit) sem usar o PowerShell.
- **Configuração central**: Pixel do Meta e Firebase ficam só em `assets/config-global.js`.
  Colou o Pixel lá uma vez → todas as páginas (atuais e futuras) já ficam medindo.
- **Catálogo central**: produtos do catálogo ficam só em `assets/produtos.js`. Adicionou/mudou
  lá → as 3 páginas iniciais atualizam juntas. Campo `disponivel: true/false` controla o selo
  "Em breve / Coming soon / Próximamente".
- **Ebook no idioma certo, na hora**: quem se cadastra na página em espanhol recebe o botão de
  download do ebook em espanhol imediatamente (campo `linkEbookGratis` do CONFIG + PDF em
  `ebooks/arquivos/`). O lead fica salvo com o idioma, então a automação de e-mail (Brevo)
  também consegue mandar a sequência na língua certa.
- **Rastreamento de campanha**: UTMs do anúncio são capturados, preservados ao trocar de idioma,
  repassados ao checkout da Hotmart e gravados junto com cada lead.

## Seletor de idioma

Toda página tem um seletor **PT / EN / ES** no topo. As 3 versões são arquivos irmãos na mesma
pasta (`index.html`, `index-en.html`, `index-es.html`); o seletor troca de arquivo mantendo os
parâmetros de UTM da campanha.

## Como adicionar um produto novo

1. Copie a pasta `landing-page/` para `produtos/<slug-do-produto>/` (já vem com os 3 idiomas).
2. Edite o `CONFIG` no topo de cada um dos 3 arquivos: headline, benefícios, depoimentos, preço,
   `linkCheckoutHotmart` (um por idioma/moeda) e `linkEbookGratis`.
3. Gere os 3 ebooks em `ebooks/gerador-ebook.html` e suba os PDFs em `ebooks/arquivos/`
   (convenção: `<slug>-pt.pdf`, `<slug>-en.pdf`, `<slug>-es.pdf`).
4. Adicione o bloco do produto em `assets/produtos.js` (um lugar só).
5. Commit + push — o site atualiza sozinho.
6. Monte o anúncio usando os templates de `anuncios/`, apontando pra URL do produto no idioma
   certo.

## Sobre os nichos "sensíveis" (saúde e relacionamento)

- **Emagrecimento / ganho de massa**: sem promessas numéricas específicas, sem foto de
  "antes e depois", sem linguagem de vergonha corporal (política do Meta Ads).
- **Relacionamentos** (`confianca-social`, `comunicacao-e-relacionamentos`): o enquadramento é
  confiança, comunicação e habilidades sociais — não manipulação. Além de ser a linha ética que
  seguimos, é o que passa nas políticas de anúncio do Meta.
- **Investimentos**: sem promessa de rentabilidade garantida ou específica.

Mais detalhes de copy por nicho nos arquivos de `anuncios/`.

## O que precisa de configuração manual (contas de terceiros)

Ver `CHECKLIST-CONFIGURACAO.md`. Pendências atuais: Pixel do Meta (travado, retomar) e
automação de e-mail no Brevo (quando os ebooks existirem).
