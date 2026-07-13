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
      nomeProduto: 'Investimentos do Zero ao Método — Guia Completo NextLevel',
      tema: 'diagnóstico financeiro, orçamento, reserva de emergência, perfil de risco, renda fixa, fundos, FIIs, ações, ETFs, montagem de carteira, psicologia do investidor e segurança contra golpes',
      dica: 'Antes de qualquer aplicação, responda: se sua carteira caísse 20% amanhã, você venderia tudo em pânico ou manteria o plano? Essa é a "pergunta de ouro" que revela seu perfil de risco real.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Investing from Zero: A Complete Method — Complete NextLevel Guide',
      tema: 'financial diagnosis, budgeting, emergency fund, risk profile, fixed income, funds, REITs, stocks, ETFs, portfolio building, investor psychology and scam protection',
      dica: 'Before any investment, ask yourself: if your portfolio dropped 20% tomorrow, would you sell everything in a panic, or stick to the plan? That\'s the "million-dollar question" that reveals your real risk profile.',
    },
    es: {
      nomeProduto: 'Inversiones desde Cero: Un Método Completo — Guía Completa NextLevel',
      tema: 'diagnóstico financiero, presupuesto, fondo de emergencia, perfil de riesgo, renta fija, fondos, REITs, acciones, ETFs, construcción de cartera, psicología del inversionista y protección contra estafas',
      dica: 'Antes de cualquier inversión, pregúntate: si tu cartera cayera 20% mañana, ¿venderías todo en pánico, o mantendrías el plan? Esa es la "pregunta de oro" que revela tu perfil de riesgo real.',
    },
  }),

  'confianca-social': montar('confianca-social', {
    pt: {
      nomeProduto: 'Ansiedade Social e Conversas com Naturalidade — Guia Completo NextLevel',
      tema: 'escada de exposição gradual, playbooks por situação e plano de 30 dias para destravar conversas',
      dica: 'Hoje, faça UMA pergunta simples a alguém (no mercado, no trabalho, no elevador) — só isso. Naturalidade social se constrói como músculo: repetições pequenas, feitas com frequência.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Social Anxiety and Natural Conversations — Complete NextLevel Guide',
      tema: 'a gradual exposure ladder, playbooks by situation, and a 30-day plan to unlock conversations',
      dica: "Today, ask ONE simple question to someone (at the store, at work, in the elevator) — that's it. Social ease is built like a muscle: small reps, done often.",
    },
    es: {
      nomeProduto: 'Ansiedad Social y Conversaciones con Naturalidad — Guía Completa NextLevel',
      tema: 'escalera de exposición gradual, playbooks por situación y plan de 30 días para destrabar conversaciones',
      dica: 'Hoy, hazle UNA pregunta simple a alguien (en la tienda, en el trabajo, en el ascensor) — solo eso. La naturalidad social se construye como un músculo: repeticiones pequeñas y frecuentes.',
    },
  }),

  'comunicacao-e-relacionamentos': montar('comunicacao-e-relacionamentos', {
    pt: {
      nomeProduto: 'Comunicação e Relacionamento: Conversas que Criam Conexão — Guia Completo NextLevel',
      tema: 'método O.U.V.I.R. de escuta ativa, storytelling social e método R.E.P.A.R.O. para conflitos',
      dica: "Na próxima conversa difícil, antes de responder, repita com suas palavras o que a pessoa disse ('então o que te incomoda é...'). Esse gesto simples desarma a briga e mostra que você escutou de verdade.",
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Communication and Relationships: Conversations That Create Connection — Complete NextLevel Guide',
      tema: 'the listening method for active listening, social storytelling and a conflict-repair method',
      dica: "In your next difficult conversation, before replying, repeat in your own words what the person said ('so what bothers you is...'). This simple move defuses the fight and shows you truly listened.",
    },
    es: {
      nomeProduto: 'Comunicación y Relación: Conversaciones que Crean Conexión — Guía Completa NextLevel',
      tema: 'método O.U.V.I.R. de escucha activa, storytelling social y método R.E.P.A.R.O. para conflictos',
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

  'mentalidade-ansiedade-habitos': montar('mentalidade-ansiedade-habitos', {
    pt: {
      nomeProduto: 'Mentalidade, Ansiedade e Hábitos — Guia Completo NextLevel',
      tema: 'ciclo do hábito, protocolo anti-impulso e plano de 30 dias para construir constância',
      dica: 'Da próxima vez que sentir vontade de comer por impulso, teste o protocolo de 10 minutos antes de decidir: nomeie a emoção, respire, mova o corpo e só depois decida. Criar esse espaço já muda a decisão na maioria das vezes.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Mindset, Anxiety and Habits — Complete NextLevel Guide',
      tema: 'the habit cycle, an anti-impulse protocol, and a 30-day plan to build consistency',
      dica: "Next time you feel like eating on impulse, try the 10-minute protocol before deciding: name the emotion, breathe, move your body, and only then decide. Creating that space changes the decision most of the time.",
    },
    es: {
      nomeProduto: 'Mentalidad, Ansiedad y Hábitos — Guía Completa NextLevel',
      tema: 'ciclo del hábito, protocolo antiimpulso y plan de 30 días para construir constancia',
      dica: 'La próxima vez que sientas ganas de comer por impulso, prueba el protocolo de 10 minutos antes de decidir: nombra la emoción, respira, mueve el cuerpo y solo después decide. Crear ese espacio cambia la decisión la mayoría de las veces.',
    },
  }),

  'mobilidade-alongamento-prevencao': montar('mobilidade-alongamento-prevencao', {
    pt: {
      nomeProduto: 'Mobilidade, Alongamento e Prevenção de Lesões — Guia Completo NextLevel',
      tema: 'rotinas A/B por articulação, aquecimento de 3 camadas e prevenção de lesões por área',
      dica: 'Antes do próximo treino, faça só 5 minutos do aquecimento específico da articulação que mais te preocupa. Prevenção não é o treino extra que você nunca faz — é o aquecimento de 5 minutos que você já pode começar hoje.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Mobility, Stretching and Injury Prevention — Complete NextLevel Guide',
      tema: 'A/B routines by joint, a 3-layer warm-up, and injury prevention by area',
      dica: "Before your next workout, do just 5 minutes of the warm-up specific to the joint that worries you most. Prevention isn't the extra workout you never do — it's the 5-minute warm-up you can start today.",
    },
    es: {
      nomeProduto: 'Movilidad, Estiramiento y Prevención de Lesiones — Guía Completa NextLevel',
      tema: 'rutinas A/B por articulación, calentamiento de 3 capas y prevención de lesiones por área',
      dica: 'Antes de tu próximo entrenamiento, haz solo 5 minutos del calentamiento específico de la articulación que más te preocupa. La prevención no es el entrenamiento extra que nunca haces — es el calentamiento de 5 minutos que ya puedes empezar hoy.',
    },
  }),

  'carisma-humor-storytelling': montar('carisma-humor-storytelling', {
    pt: {
      nomeProduto: 'Carisma, Humor e Storytelling — Guia Completo NextLevel',
      tema: 'método C.H.A.R.M.E., estruturas de storytelling e playbooks por situação para conversar com mais leveza',
      dica: 'Na próxima conversa, aplique a técnica 2+1: antes de contar algo sobre você, faça duas respostas conectadas ao que a outra pessoa falou — uma validação e uma pergunta — e só depois compartilhe uma experiência curta.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Charisma, Humor and Storytelling — Complete NextLevel Guide',
      tema: 'the C.H.A.R.M. method, storytelling structures, and playbooks by situation to talk with more ease',
      dica: "In your next conversation, try the 2+1 technique: before sharing something about yourself, give two responses connected to what the other person said — a validation and a question — then share a short experience of your own.",
    },
    es: {
      nomeProduto: 'Carisma, Humor y Storytelling — Guía Completa NextLevel',
      tema: 'el método C.H.A.R.M.E., estructuras de storytelling y playbooks por situación para conversar con más ligereza',
      dica: 'En tu próxima conversación, prueba la técnica 2+1: antes de contar algo sobre ti, da dos respuestas conectadas a lo que la otra persona dijo — una validación y una pregunta — y solo después comparte una experiencia corta tuya.',
    },
  }),

  'atracao-com-respeito': montar('atracao-com-respeito', {
    pt: {
      nomeProduto: 'Confiança Social: Atração com Respeito — Guia Completo NextLevel',
      tema: 'diagnóstico social, Protocolo P.A.R.E. para ansiedade e método C.O.N.E.C.T.A. para conversas naturais',
      dica: 'Hoje, pratique um degrau da escada de exposição social: cumprimente 3 pessoas em ambientes comuns (porteiro, caixa, colega). Confiança social se constrói como músculo — repetições pequenas e frequentes.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Social Confidence: Attraction with Respect — Complete NextLevel Guide',
      tema: 'a social diagnostic, the STOP protocol for anxiety, and the C.O.N.N.E.C.T. method for natural conversations',
      dica: "Today, practice one step of the social exposure ladder: greet 3 people in common settings (a doorman, a cashier, a coworker). Social confidence is built like a muscle — small, frequent reps.",
    },
    es: {
      nomeProduto: 'Confianza Social: Atracción con Respeto — Guía Completa NextLevel',
      tema: 'diagnóstico social, Protocolo P.A.R.E. para la ansiedad y método C.O.N.E.C.T.A. para conversaciones naturales',
      dica: 'Hoy, practica un escalón de la escalera de exposición social: saluda a 3 personas en ambientes comunes (portero, cajero, colega). La confianza social se construye como un músculo — repeticiones pequeñas y frecuentes.',
    },
  }),

  'presenca-social': montar('presenca-social', {
    pt: {
      nomeProduto: 'Linguagem Corporal e Presença Social — Guia Completo NextLevel',
      tema: 'postura, olhar, voz, espaço pessoal e calibragem social — presença visível e atração com respeito',
      dica: 'Hoje, faça o protocolo de 60 segundos antes de entrar em um ambiente social: pés apoiados, ombros soltos, mãos visíveis e um ponto de foco à frente. Presença se treina no corpo, não só na cabeça.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Body Language and Social Presence — Complete NextLevel Guide',
      tema: 'posture, eye contact, voice, personal space and social calibration — visible presence and attraction with respect',
      dica: 'Today, do the 60-second protocol before entering a social setting: feet grounded, shoulders relaxed, hands visible and a focal point ahead of you. Presence is trained in the body, not just the mind.',
    },
    es: {
      nomeProduto: 'Lenguaje Corporal y Presencia Social — Guía Completa NextLevel',
      tema: 'postura, mirada, voz, espacio personal y calibración social — presencia visible y atracción con respeto',
      dica: 'Hoy, haz el protocolo de 60 segundos antes de entrar en un ambiente social: pies apoyados, hombros sueltos, manos visibles y un punto de enfoque al frente. La presencia se entrena en el cuerpo, no solo en la mente.',
    },
  }),

  'limites-rejeicao-maturidade': montar('limites-rejeicao-maturidade', {
    pt: {
      nomeProduto: 'Limites, Rejeição e Maturidade Emocional — Guia Completo NextLevel',
      tema: 'Protocolo P.A.R.A., mapa de limites e frases de comunicação assertiva — comunique limites e lide com rejeição com maturidade',
      dica: 'Hoje, aplique o Protocolo P.A.R.A. numa pequena frustração: pause antes de reagir, acolha o que está sentindo sem se julgar, reavalie a situação e só então aja com dignidade.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Boundaries, Rejection and Emotional Maturity — Complete NextLevel Guide',
      tema: 'the P.A.R.M. protocol, a boundary map and assertive communication phrases — communicate boundaries and handle rejection with maturity',
      dica: 'Today, apply the P.A.R.M. protocol to a small frustration: pause before reacting, acknowledge what you\'re feeling without judging yourself, reassess the situation, and only then move with dignity.',
    },
    es: {
      nomeProduto: 'Límites, Rechazo y Madurez Emocional — Guía Completa NextLevel',
      tema: 'Protocolo P.A.R.A., mapa de límites y frases de comunicación asertiva — comunica límites y maneja el rechazo con madurez',
      dica: 'Hoy, aplica el Protocolo P.A.R.A. en una pequeña frustración: pausa antes de reaccionar, acoge lo que sientes sin juzgarte, reevalúa la situación y solo entonces actúa con dignidad.',
    },
  }),

  'mensagens-e-conversas-online': montar('mensagens-e-conversas-online', {
    pt: {
      nomeProduto: 'Mensagens, WhatsApp e Conversas Online — Guia Completo NextLevel',
      tema: 'fórmula base da conversa, técnica C.E.C., convite para sair com respeito e segurança contra golpes afetivos',
      dica: 'Hoje, aplique a técnica C.E.C. numa conversa: comente algo sobre a resposta da pessoa, explore com uma pergunta curta e compartilhe um detalhe seu para equilibrar a troca.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Messages, WhatsApp and Online Conversations — Complete NextLevel Guide',
      tema: 'the base conversation formula, the C.E.S. technique, inviting someone out with respect and safety against romance scams',
      dica: 'Today, apply the C.E.S. technique in a conversation: comment on something about the person\'s reply, explore with a short question, and share a detail about yourself to balance the exchange.',
    },
    es: {
      nomeProduto: 'Mensajes, WhatsApp y Conversaciones Online — Guía Completa NextLevel',
      tema: 'fórmula base de la conversación, técnica C.E.C., cómo invitar a salir con respeto y seguridad contra estafas románticas',
      dica: 'Hoy, aplica la técnica C.E.C. en una conversación: comenta algo sobre la respuesta de la persona, explora con una pregunta corta y comparte un detalle tuyo para equilibrar el intercambio.',
    },
  }),

  'primeiro-encontro': montar('primeiro-encontro', {
    pt: {
      nomeProduto: 'Primeiro Encontro: Conversa, Presença e Respeito — Guia Completo NextLevel',
      tema: 'mentalidade certa, convite sem pressão, estrutura C.E.C. para conversar e presença/limites no primeiro encontro',
      dica: 'Antes do próximo encontro, use a preparação mental de 15 minutos do guia: respire mais devagar, relembre o objetivo (conhecer, conversar e respeitar) e defina uma atitude-chave para o encontro.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'First Date: Conversation, Presence and Respect — Complete NextLevel Guide',
      tema: 'the right mindset, invitations without pressure, the C.E.S. structure for conversation, and presence/boundaries on a first date',
      dica: 'Before your next date, use the guide\'s 15-minute mental warm-up: slow your breathing, recall the purpose (get to know each other, talk, and respect), and set one key intention for the date.',
    },
    es: {
      nomeProduto: 'Primera Cita: Conversación, Presencia y Respeto — Guía Completa NextLevel',
      tema: 'la mentalidad correcta, invitaciones sin presión, la estructura C.E.C. para conversar y presencia/límites en la primera cita',
      dica: 'Antes de tu próxima cita, usa la preparación mental de 15 minutos de la guía: respira más despacio, recuerda el objetivo (conocer, conversar y respetar) y define una actitud clave para la cita.',
    },
  }),

  'etfs-investimento-global': montar('etfs-investimento-global', {
    pt: {
      nomeProduto: 'ETFs e Investimento Global — Guia Completo NextLevel',
      tema: 'ETF sem mistério, caminhos de acesso, riscos/custos/impostos e carteira global com método',
      dica: 'Antes de comprar qualquer ETF, aplique os 10 critérios do guia: índice, objetivo, custo, liquidez, tracking, concentração, moeda, domicílio, distribuição e uso na carteira.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'ETFs and Global Investing — Complete NextLevel Guide',
      tema: 'ETFs without the mystery, access routes, risks/costs/taxes, and a global portfolio with method',
      dica: 'Before buying any ETF, apply the guide\'s 10 criteria: index, objective, cost, liquidity, tracking, concentration, currency, domicile, distribution, and portfolio role.',
    },
    es: {
      nomeProduto: 'ETFs e Inversión Global — Guía Completa NextLevel',
      tema: 'ETF sin misterio, caminos de acceso, riesgos/costos/impuestos y cartera global con método',
      dica: 'Antes de comprar cualquier ETF, aplica los 10 criterios de la guía: índice, objetivo, costo, liquidez, tracking, concentración, moneda, domicilio, distribución y uso en la cartera.',
    },
  }),

  'fiis-do-zero': montar('fiis-do-zero', {
    pt: {
      nomeProduto: 'FIIs do Zero — Guia Completo NextLevel',
      tema: 'base dos FIIs, tipos de fundos, indicadores sem confusão (Dividend Yield, P/VP, vacância, WAULT), análise prática e carteira com método',
      dica: 'Antes de comprar qualquer FII, use o checklist do guia: leia o relatório gerencial, identifique se é tijolo, papel, híbrido ou FoF, entenda os riscos e a concentração, compare com pares do mesmo segmento e confirme se a liquidez é compatível com o valor investido.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'REITs from Zero — Complete NextLevel Guide',
      tema: 'REIT fundamentals, fund types, indicators without confusion (Dividend Yield, price-to-NAV, vacancy, WAULT), practical analysis, and a teaching portfolio',
      dica: 'Before buying any REIT, use the guide\'s checklist: read the latest management report, identify if it\'s equity, mortgage, hybrid, or a fund of funds, understand the risks and concentration, compare with peers in the same segment, and confirm liquidity matches your invested amount.',
    },
    es: {
      nomeProduto: 'REITs desde Cero — Guía Completa NextLevel',
      tema: 'base de los REITs, tipos de fondos, indicadores sin confusión (Dividend Yield, precio/valor patrimonial, vacancia, WAULT), análisis práctico y cartera con método',
      dica: 'Antes de comprar cualquier REIT, usa el checklist de la guía: lee el informe gerencial más reciente, identifica si es de capital, hipotecario, híbrido o fondo de fondos, entiende los riesgos y la concentración, compara con pares del mismo segmento y confirma que la liquidez sea compatible con el valor invertido.',
    },
  }),

  'financas-pessoais': montar('financas-pessoais', {
    pt: {
      nomeProduto: 'Finanças Pessoais e Liberdade Financeira — Guia Completo NextLevel',
      tema: 'diagnóstico financeiro, orçamento por função, plano de ataque a dívidas, reserva de emergência, metas por prazo e a ordem certa para investir',
      dica: 'Antes de qualquer outra coisa, calcule seus 5 números essenciais: renda líquida mensal, custo de vida essencial, gasto total, dívida total e patrimônio líquido. Esse diagnóstico simples é a base de todo o método.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Personal Finance and Financial Freedom — Complete NextLevel Guide',
      tema: 'financial diagnosis, budgeting by function, a debt attack plan, an emergency fund, goals by timeline, and the right order to start investing',
      dica: 'Before anything else, calculate your 5 essential numbers: monthly net income, essential cost of living, total spending, total debt, and net worth. This simple diagnosis is the foundation of the whole method.',
    },
    es: {
      nomeProduto: 'Finanzas Personales y Libertad Financiera — Guía Completa NextLevel',
      tema: 'diagnóstico financiero, presupuesto por función, plan de ataque a deudas, fondo de emergencia, metas por plazo y el orden correcto para invertir',
      dica: 'Antes que nada, calcula tus 5 números esenciales: ingreso neto mensual, costo de vida esencial, gasto total, deuda total y patrimonio neto. Este diagnóstico simple es la base de todo el método.',
    },
  }),

  'imposto-de-renda-investidores': montar('imposto-de-renda-investidores', {
    pt: {
      nomeProduto: 'Imposto de Renda para Investidores — Guia Completo NextLevel',
      tema: 'rotina mensal, pasta fiscal, ações, FIIs, ETFs, BDRs, day trade, proventos, exterior, cripto e declaração anual',
      dica: 'Nomeie seus arquivos assim: AAAA-MM - Corretora - Nota - Ativo.pdf. Esse padrão simples economiza horas de organização no ano seguinte.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Investment Tax Organization: A Practical Method — Complete NextLevel Guide',
      tema: 'a monthly routine, tax folder system, stocks, REITs, ETFs, foreign-listed shares, frequent trading, dividends, foreign assets, crypto, and annual filing',
      dica: 'Name your files like this: YYYY-MM - Broker - Confirmation - Asset.pdf. This simple pattern saves hours of organizing the following year.',
    },
    es: {
      nomeProduto: 'Organización Fiscal para Inversionistas — Guía Completa NextLevel',
      tema: 'rutina mensual, carpeta fiscal, acciones, REITs, ETFs, acciones del exterior, trading frecuente, dividendos, activos en el exterior, cripto y declaración anual',
      dica: 'Nombra tus archivos así: AAAA-MM - Bróker - Confirmación - Activo.pdf. Este patrón simple ahorra horas de organización el año siguiente.',
    },
  }),

  'psicologia-do-investidor': montar('psicologia-do-investidor', {
    pt: {
      nomeProduto: 'Psicologia do Investidor — Guia Completo NextLevel',
      tema: 'método P.A.U.S.A., diagnóstico de vieses comportamentais e protocolo anti-pânico para decidir com mais disciplina',
      dica: 'Antes da próxima decisão de investimento, aplique o método P.A.U.S.A.: Pare, Analise o que mudou de fato, Unifique com sua carteira como um todo, Simule o que acontece se você estiver errado, e só então Aja. Disciplina é isso — não deixar a emoção assinar a ordem de compra ou venda.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Investor Psychology — Complete NextLevel Guide',
      tema: 'the S.T.O.P. method, a behavioral bias diagnostic and an anti-panic protocol to decide with more discipline',
      dica: "Before your next investment decision, apply the S.T.O.P. method: Stop, Think through what actually changed, One portfolio view — does it fit the whole, Play out what happens if you're wrong, and only then Proceed. Discipline is not letting emotion sign the buy or sell order.",
    },
    es: {
      nomeProduto: 'Psicología del Inversor — Guía Completa NextLevel',
      tema: 'método P.A.U.S.A., diagnóstico de sesgos de comportamiento y protocolo antipánico para decidir con más disciplina',
      dica: 'Antes de tu próxima decisión de inversión, aplica el método P.A.U.S.A.: Para, Analiza qué cambió en realidad, Unifica con tu cartera como un todo, Simula qué pasa si te equivocas, y solo entonces Actúa. Disciplina es no dejar que la emoción firme la orden de compra o venta.',
    },
  }),

  'renda-fixa-inteligente': montar('renda-fixa-inteligente', {
    pt: {
      nomeProduto: 'Renda Fixa Inteligente — Guia Completo NextLevel',
      tema: 'método prático para comparar Tesouro Direto, CDB, LCI/LCA e crédito privado, entender FGC e marcação a mercado, e montar uma carteira por camadas',
      dica: 'Antes de comprar qualquer produto de renda fixa, aplique os 7 filtros: objetivo, prazo, liquidez, emissor, garantias, rentabilidade líquida e concentração. Se você não conseguir responder aos 7 em menos de 2 minutos, ainda não é hora de comprar.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Smart Fixed Income — Complete NextLevel Guide',
      tema: 'a practical method to compare treasury bonds, CDs, tax-exempt notes and private credit, understand deposit insurance and mark-to-market, and build a layered portfolio',
      dica: "Before buying any fixed income product, apply the 7 filters: goal, term, liquidity, issuer, guarantees, net return and concentration. If you can't answer all 7 in under 2 minutes, it's not time to buy yet.",
    },
    es: {
      nomeProduto: 'Renta Fija Inteligente — Guía Completa NextLevel',
      tema: 'método práctico para comparar el Tesoro Directo, CDB, LCI/LCA y crédito privado, entender el fondo de garantía y la valoración a mercado, y armar una cartera por capas',
      dica: 'Antes de comprar cualquier producto de renta fija, aplica los 7 filtros: objetivo, plazo, liquidez, emisor, garantías, rentabilidad neta y concentración. Si no puedes responder los 7 en menos de 2 minutos, todavía no es momento de comprar.',
    },
  }),

  'seguranca-financeira-e-golpes': montar('seguranca-financeira-e-golpes', {
    pt: {
      nomeProduto: 'Segurança Financeira e Golpes — Guia Completo NextLevel',
      tema: 'mapa dos golpes financeiros, os 20 sinais vermelhos, matriz de risco, segurança digital e bancária, resposta a incidentes e plano de blindagem de 30 dias',
      dica: 'Antes de qualquer transferência ou aporte, confirme: o dinheiro vai para conta da instituição, não de pessoa física? Se a resposta for não ou incerta, pare e verifique por canal oficial antes de decidir.',
      precoDe: 'R$ 97,00',
      precoPor: 'R$ 49,99',
    },
    en: {
      nomeProduto: 'Financial Safety & Scams — Complete NextLevel Guide',
      tema: 'the financial scam map, the 20 red flags, a risk matrix, digital and banking security, incident response and a 30-day shielding plan',
      dica: "Before any transfer or contribution, confirm: does the money go to the institution's account, not an individual's? If the answer is no or unclear, stop and verify through an official channel before deciding.",
    },
    es: {
      nomeProduto: 'Seguridad Financiera y Estafas — Guía Completa NextLevel',
      tema: 'el mapa de las estafas financieras, las 20 señales de alerta, matriz de riesgo, seguridad digital y bancaria, respuesta a incidentes y plan de blindaje de 30 días',
      dica: 'Antes de cualquier transferencia o aporte, confirma: ¿el dinero va a la cuenta de la institución, no de una persona física? Si la respuesta es no o incierta, detente y verifica por canal oficial antes de decidir.',
    },
  }),
};
