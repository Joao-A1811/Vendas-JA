// ============================================================
// Dados de cada produto usados nos e-mails da sequência.
// Espelham o CONFIG das páginas em produtos/<slug>/ — se mudar
// preço ou nome lá, atualize aqui também.
// ============================================================
const SITE = 'https://nextlevelbr.app.br';

function links(slug) {
  return {
    pt: { linkPagina: `${SITE}/produtos/${slug}/`, linkEbook: `${SITE}/ebooks/arquivos/${slug}-pt.pdf` },
    en: { linkPagina: `${SITE}/produtos/${slug}/index-en.html`, linkEbook: `${SITE}/ebooks/arquivos/${slug}-en.pdf` },
    es: { linkPagina: `${SITE}/produtos/${slug}/index-es.html`, linkEbook: `${SITE}/ebooks/arquivos/${slug}-es.pdf` },
  };
}

const PRECOS = {
  pt: { precoDe: 'R$ 97,00', precoPor: 'R$ 47,00' },
  en: { precoDe: '$37', precoPor: '$19' },
  es: { precoDe: '$37', precoPor: '$19' },
};

function montar(slug, dados) {
  const l = links(slug);
  const resultado = {};
  for (const idioma of ['pt', 'en', 'es']) {
    // Ordem importa: PRECOS entra primeiro pra servir de padrão, e dados[idioma]
    // pode sobrescrever precoDe/precoPor quando o produto tiver preço próprio.
    resultado[idioma] = { ...PRECOS[idioma], ...dados[idioma], ...l[idioma] };
  }
  return resultado;
}

export const PRODUTOS = {
  'emagrecimento': montar('emagrecimento', {
    pt: {
      nomeProduto: 'Emagrecimento Inteligente — Guia Completo NextLevel',
      tema: 'dieta flexível, treino progressivo e mente sob controle, sem dieta radical',
      dica: 'Nos momentos de fome emocional, aplique o Protocolo P.A.U.S.A. antes de decidir comer: Pare, Avalie a fome real, Utilize uma alternativa, Se ainda quiser, coma com atenção, Analise depois sem culpa.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Smart Weight Loss — Complete NextLevel Guide',
      tema: 'flexible diet, progressive training and your mindset under control, no crash diets',
      dica: "In moments of emotional hunger, apply the P.A.U.S.E. protocol before deciding to eat: Pause, Assess real hunger, Use an alternative, Should you still want to, eat mindfully, Evaluate afterward without guilt.",
    },
    es: {
      nomeProduto: 'Adelgazamiento Inteligente — Guía Completa NextLevel',
      tema: 'dieta flexible, entrenamiento progresivo y la mente bajo control, sin dietas extremas',
      dica: 'En los momentos de hambre emocional, aplica el Protocolo P.A.U.S.A. antes de decidir comer: Pausa, Analiza el hambre real, Usa una alternativa, Si aún quieres, come con atención, Analiza después sin culpa.',
    },
  }),

  'ganho-de-massa': montar('ganho-de-massa', {
    pt: {
      nomeProduto: 'Ganho de Massa Muscular — Guia Completo NextLevel',
      tema: 'superávit calórico, treino progressivo e recuperação, sem promessa de quilos',
      dica: 'Anote as cargas e repetições de cada treino, nem que seja no bloco de notas do celular. Sem registro não existe progressão — e progressão é o que faz o músculo crescer.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Muscle Mass Gain — Complete NextLevel Guide',
      tema: 'caloric surplus, progressive training and recovery, with no promised pounds',
      dica: "Write down the weights and reps of every workout, even if it's just in your phone's notes app. Without a record there's no progression — and progression is what makes muscle grow.",
    },
    es: {
      nomeProduto: 'Ganancia de Masa Muscular — Guía Completa NextLevel',
      tema: 'superávit calórico, entrenamiento progresivo y recuperación, sin promesa de kilos',
      dica: 'Anota las cargas y repeticiones de cada entrenamiento, aunque sea en las notas del móvil. Sin registro no hay progresión — y la progresión es lo que hace crecer el músculo.',
    },
  }),

  'investimentos': montar('investimentos', {
    pt: {
      nomeProduto: 'Ebook Investimentos do Zero',
      tema: 'investir do zero, sem economês',
      dica: 'Antes de pensar em onde investir, anote TODOS os seus gastos por 7 dias, sem julgamento. Esse mapa simples revela pra onde seu dinheiro está indo — e é a base de qualquer plano que funciona.',
    },
    en: {
      nomeProduto: 'Investing from Zero Ebook',
      tema: 'investing from zero, without the jargon',
      dica: "Before thinking about where to invest, write down ALL your expenses for 7 days, no judgment. That simple map reveals where your money is going — and it's the foundation of any plan that works.",
    },
    es: {
      nomeProduto: 'Ebook Inversiones desde Cero',
      tema: 'invertir desde cero, sin tecnicismos',
      dica: 'Antes de pensar en dónde invertir, anota TODOS tus gastos durante 7 días, sin juzgarte. Ese mapa simple revela a dónde va tu dinero — y es la base de cualquier plan que funcione.',
    },
  }),

  'confianca-social': montar('confianca-social', {
    pt: {
      nomeProduto: 'Ebook Confiança Social na Prática',
      tema: 'confiança social na prática',
      dica: 'Hoje, faça UMA pergunta simples a alguém (no mercado, no trabalho, no elevador) — só isso. Confiança social se constrói como músculo: repetições pequenas, feitas com frequência.',
    },
    en: {
      nomeProduto: 'Social Confidence in Practice Ebook',
      tema: 'social confidence in practice',
      dica: "Today, ask ONE simple question to someone (at the store, at work, in the elevator) — that's it. Social confidence is built like a muscle: small reps, done often.",
    },
    es: {
      nomeProduto: 'Ebook Confianza Social en la Práctica',
      tema: 'confianza social en la práctica',
      dica: 'Hoy, hazle UNA pregunta simple a alguien (en la tienda, en el trabajo, en el ascensor) — solo eso. La confianza social se construye como un músculo: repeticiones pequeñas y frecuentes.',
    },
  }),

  'comunicacao-e-relacionamentos': montar('comunicacao-e-relacionamentos', {
    pt: {
      nomeProduto: 'Ebook Comunicação e Relacionamentos',
      tema: 'comunicação e relacionamentos saudáveis',
      dica: "Na próxima conversa difícil, antes de responder, repita com suas palavras o que a pessoa disse ('então o que te incomoda é...'). Esse gesto simples desarma a briga e mostra que você escutou de verdade.",
    },
    en: {
      nomeProduto: 'Communication & Relationships Ebook',
      tema: 'communication and healthy relationships',
      dica: "In your next difficult conversation, before replying, repeat in your own words what the person said ('so what bothers you is...'). This simple move defuses the fight and shows you truly listened.",
    },
    es: {
      nomeProduto: 'Ebook Comunicación y Relaciones',
      tema: 'comunicación y relaciones sanas',
      dica: "En tu próxima conversación difícil, antes de responder, repite con tus palabras lo que la otra persona dijo ('entonces lo que te molesta es...'). Ese gesto simple desarma la pelea y demuestra que escuchaste de verdad.",
    },
  }),

  'treino-em-casa': montar('treino-em-casa', {
    pt: {
      nomeProduto: 'Treino em Casa — Manual Completo NextLevel',
      tema: 'treinar em casa com método, sem academia',
      dica: 'Nos dias sem vontade nenhuma, prometa só 5 minutos de treino. Muitas vezes você acaba continuando — e quando não continua, ainda manteve o hábito vivo, que é o que mais importa no início.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Home Workout — Complete NextLevel Manual',
      tema: 'training at home with method, no gym required',
      dica: "On days when you have zero motivation, promise yourself just 5 minutes of training. Often you'll end up continuing — and when you don't, you still kept the habit alive, which matters most in the beginning.",
    },
    es: {
      nomeProduto: 'Entrenamiento en Casa — Manual Completo NextLevel',
      tema: 'entrenar en casa con método, sin gimnasio',
      dica: 'En los días sin ninguna motivación, prométete solo 5 minutos de entrenamiento. Muchas veces terminas continuando — y cuando no lo haces, igual mantuviste el hábito vivo, que es lo más importante al principio.',
    },
  }),

  'suplementacao-inteligente': montar('suplementacao-inteligente', {
    pt: {
      nomeProduto: 'Suplementação Inteligente — Guia Completo NextLevel',
      tema: 'suplementar com método, sem desperdício e sem promessa milagrosa',
      dica: 'Antes de comprar qualquer suplemento novo, responda: eu já tentei resolver isso com comida, treino ou sono? Se a resposta for não, comida resolve mais barato e melhor do que qualquer pote.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Smart Supplementation — Complete NextLevel Guide',
      tema: 'supplementing with method, no waste and no miracle promises',
      dica: 'Before buying any new supplement, ask yourself: have I already tried solving this with food, training, or sleep? If the answer is no, food solves it cheaper and better than any tub.',
    },
    es: {
      nomeProduto: 'Suplementación Inteligente — Guía Completa NextLevel',
      tema: 'suplementar con método, sin desperdicio y sin promesas milagrosas',
      dica: 'Antes de comprar cualquier suplemento nuevo, pregúntate: ¿ya intenté resolver esto con comida, entrenamiento o sueño? Si la respuesta es no, la comida lo resuelve más barato y mejor que cualquier envase.',
    },
  }),

  'receitas-fitness': montar('receitas-fitness', {
    pt: {
      nomeProduto: 'Receitas, Marmitas e Cardápios Fitness — Guia Completo NextLevel',
      tema: 'comer bem com método, sem dieta radical',
      dica: 'Nesta semana, escolha só UMA receita nova do guia e monte a marmita dela com antecedência. Comida boa que já está pronta na geladeira vence qualquer tentação de última hora.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Fitness Recipes, Meal Preps and Menus — Complete NextLevel Guide',
      tema: 'eating well with method, no crash diet',
      dica: "This week, pick just ONE new recipe from the guide and prep it ahead of time. Good food that's already ready in the fridge beats any last-minute temptation.",
    },
    es: {
      nomeProduto: 'Recetas, Viandas y Menús Fitness — Guía Completa NextLevel',
      tema: 'comer bien con método, sin dieta radical',
      dica: 'Esta semana, elige solo UNA receta nueva de la guía y prepárala con anticipación. La buena comida que ya está lista en la heladera vence cualquier tentación de último momento.',
    },
  }),

  'desafio-30-dias': montar('desafio-30-dias', {
    pt: {
      nomeProduto: 'Desafio 30 Dias — Guia Completo NextLevel',
      tema: 'organizar treino, alimentação, sono e hábitos em 30 dias, sem radicalismo',
      dica: 'Hoje, marque só UMA missão do dia — treino, comida ou mentalidade — e cumpra ela até o fim. A regra dos 80% vale mais que qualquer semana perfeita abandonada no meio.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: '30-Day Challenge — Complete NextLevel Guide',
      tema: 'organizing training, nutrition, sleep, and habits in 30 days, no extremes',
      dica: "Today, pick just ONE mission of the day — training, food, or mindset — and follow through on it. The 80% rule beats any perfect week abandoned halfway.",
    },
    es: {
      nomeProduto: 'Desafío 30 Días — Guía Completa NextLevel',
      tema: 'organizar entrenamiento, alimentación, sueño y hábitos en 30 días, sin radicalismo',
      dica: 'Hoy, elige solo UNA misión del día — entrenamiento, comida o mentalidad — y cúmplela hasta el final. La regla del 80% vale más que cualquier semana perfecta abandonada a la mitad.',
    },
  }),

  'treino-academia': montar('treino-academia', {
    pt: {
      nomeProduto: 'Manual Completo de Academia — Guia Completo NextLevel',
      tema: 'treino por grupo muscular, dieta por objetivo e cronograma de 12 semanas na academia',
      dica: 'Escolha a divisão semanal (3x, 4x, 5x ou 6x) que cabe de verdade na sua rotina — a melhor divisão não é a mais avançada, é a que você consegue manter todo mês.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Complete Gym Manual — Complete NextLevel Guide',
      tema: 'workouts by muscle group, diet by goal, and a 12-week gym schedule',
      dica: "Pick the weekly split (3x, 4x, 5x, or 6x) that truly fits your routine — the best split isn't the most advanced one, it's the one you can keep up every month.",
    },
    es: {
      nomeProduto: 'Manual Completo de Gimnasio — Guía Completa NextLevel',
      tema: 'entrenamiento por grupo muscular, dieta por objetivo y cronograma de 12 semanas en el gimnasio',
      dica: 'Elige la división semanal (3x, 4x, 5x o 6x) que realmente encaje en tu rutina — la mejor división no es la más avanzada, es la que puedes mantener todos los meses.',
    },
  }),
};
