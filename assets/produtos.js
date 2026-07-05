// ============================================================
// CATÁLOGO DE PRODUTOS — NextLevel
// Este é o ÚNICO lugar onde a lista de produtos do catálogo é
// editada. As páginas iniciais (PT/EN/ES) leem daqui.
//
// Por decisão do dono do projeto (jul/2026): só ficam listados aqui os
// produtos que JÁ estão sendo vendidos de verdade (checkout Hotmart real
// em pelo menos uma moeda). Os produtos ainda em rascunho (emagrecimento,
// ganho-de-massa, investimentos, confiança social, comunicação e
// relacionamentos) tiveram suas páginas mantidas em produtos/<slug>/ pra
// reaproveitar depois, mas foram retirados do catálogo público.
//
// Para adicionar um produto:
//   1. Crie a pasta produtos/<slug>/ (copiando landing-page/)
//   2. Registre o produto na Hotmart e cole o link de checkout real
//   3. Só então adicione um bloco aqui com o mesmo slug
//   4. Quando TODOS os idiomas tiverem checkout funcionando,
//      troque disponivel: false por true (some o "Em breve")
// ============================================================
window.PRODUTOS_SITE = [
  {
    slug: 'treino-em-casa',
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Treino em Casa', en: 'Home Workout', es: 'Entrenamiento en Casa' },
    resumo: {
      pt: 'Treinos por área muscular, cronograma de 30 dias e dieta de apoio — sem academia, sem equipamento caro.',
      en: 'Workouts by muscle group, a 30-day schedule and supportive nutrition — no gym, no expensive equipment.',
      es: 'Entrenamientos por grupo muscular, cronograma de 30 días y alimentación de apoyo — sin gimnasio, sin equipo caro.'
    }
  },
  {
    slug: 'suplementacao-inteligente',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 7.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Suplementação Inteligente', en: 'Smart Supplementation', es: 'Suplementación Inteligente' },
    resumo: {
      pt: 'Whey, creatina, cafeína e checklist de compra — suplemente com método, sem desperdício e sem promessa milagrosa.',
      en: 'Whey, creatine, caffeine and a shopping checklist — supplement with method, no waste and no miracle promises.',
      es: 'Whey, creatina, cafeína y checklist de compra — suplementa con método, sin desperdicio y sin promesas milagrosas.'
    }
  },
  {
    slug: 'receitas-fitness',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 8.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Receitas, Marmitas e Cardápios Fitness', en: 'Fitness Recipes, Meal Preps and Menus', es: 'Recetas, Viandas y Menús Fitness' },
    resumo: {
      pt: '50+ receitas fitness, cardápios por objetivo e sistema de meal prep — organize sua semana sem dieta radical.',
      en: '50+ fitness recipes, menus by goal and a meal prep system — organize your week without a crash diet.',
      es: '50+ recetas fitness, menús por objetivo y sistema de meal prep — organiza tu semana sin dieta radical.'
    }
  },
  {
    slug: 'desafio-30-dias',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 9.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Desafio 30 Dias', en: '30-Day Challenge', es: 'Desafío 30 Días' },
    resumo: {
      pt: '30 missões diárias de treino, alimentação, sono e hábitos — sistema de pontuação e plano de continuidade de 90 dias.',
      en: '30 daily missions for training, nutrition, sleep and habits — scoring system and a 90-day continuity plan.',
      es: '30 misiones diarias de entrenamiento, alimentación, sueño y hábitos — sistema de puntuación y plan de continuidad de 90 días.'
    }
  },
  {
    slug: 'emagrecimento',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 10.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Emagrecimento Inteligente', en: 'Smart Weight Loss', es: 'Adelgazamiento Inteligente' },
    resumo: {
      pt: 'Dieta flexível, treino progressivo e protocolo contra a fome emocional — um plano de 30 dias sem dieta radical.',
      en: 'Flexible diet, progressive training and a protocol against emotional hunger — a 30-day plan, no crash diets.',
      es: 'Dieta flexible, entrenamiento progresivo y protocolo contra el hambre emocional — un plan de 30 días sin dietas extremas.'
    }
  },
  {
    slug: 'ganho-de-massa',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 11.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Ganho de Massa Muscular', en: 'Muscle Mass Gain', es: 'Ganancia de Masa Muscular' },
    resumo: {
      pt: 'Superávit calórico sem exagero, treino progressivo e recuperação organizada — hipertrofia com método, sem promessa de quilos.',
      en: 'Caloric surplus without excess, progressive training and organized recovery — hypertrophy with method, no promised pounds.',
      es: 'Superávit calórico sin exceso, entrenamiento progresivo y recuperación organizada — hipertrofia con método, sin promesa de kilos.'
    }
  },
  {
    slug: 'treino-academia',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 12.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Manual Completo de Academia', en: 'Complete Gym Manual', es: 'Manual Completo de Gimnasio' },
    resumo: {
      pt: 'Treinos por grupo muscular, dieta por objetivo, 4 divisões semanais e cronograma de 12 semanas — evolua na academia com método.',
      en: 'Workouts by muscle group, diet by goal, 4 weekly splits and a 12-week schedule — progress at the gym with method.',
      es: 'Entrenamientos por grupo muscular, dieta por objetivo, 4 divisiones semanales y cronograma de 12 semanas — evoluciona en el gimnasio con método.'
    }
  },
  {
    slug: 'mentalidade-ansiedade-habitos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 13.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Mentalidade, Ansiedade e Hábitos', en: 'Mindset, Anxiety and Habits', es: 'Mentalidad, Ansiedad y Hábitos' },
    resumo: {
      pt: 'Ciclo do hábito, protocolo anti-impulso de 10 minutos e plano de 30 dias — construa constância e controle gatilhos emocionais.',
      en: 'Habit cycle, a 10-minute anti-impulse protocol and a 30-day plan — build consistency and control emotional triggers.',
      es: 'Ciclo del hábito, protocolo antiimpulso de 10 minutos y plan de 30 días — construye constancia y controla gatillos emocionales.'
    }
  },
  {
    slug: 'mobilidade-alongamento-prevencao',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 14.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Mobilidade, Alongamento e Prevenção de Lesões', en: 'Mobility, Stretching and Injury Prevention', es: 'Movilidad, Estiramiento y Prevención de Lesiones' },
    resumo: {
      pt: 'Rotinas A/B por articulação, biblioteca de alongamentos e cronograma de 30 dias — treine melhor e ganhe amplitude com segurança.',
      en: 'A/B routines by joint, a stretching library and a 30-day schedule — train better and gain range of motion safely.',
      es: 'Rutinas A/B por articulación, biblioteca de estiramientos y cronograma de 30 días — entrena mejor y gana amplitud con seguridad.'
    }
  },
  {
    slug: 'confianca-social',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 15.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Ansiedade Social e Conversas com Naturalidade', en: 'Social Anxiety and Natural Conversations', es: 'Ansiedad Social y Conversaciones con Naturalidad' },
    resumo: {
      pt: 'Escada de exposição gradual, playbooks por situação e plano de 30 dias — destrave conversas e crie conexões com respeito.',
      en: 'A gradual exposure ladder, playbooks by situation and a 30-day plan — unlock conversations and build connections with respect.',
      es: 'Escalera de exposición gradual, playbooks por situación y plan de 30 días — destraba conversaciones y crea conexiones con respeto.'
    }
  },
  {
    slug: 'carisma-humor-storytelling',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 16.
    disponivel: true,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Carisma, Humor e Storytelling', en: 'Charisma, Humor and Storytelling', es: 'Carisma, Humor y Storytelling' },
    resumo: {
      pt: 'Método C.H.A.R.M.E., estruturas de storytelling e plano de 30 dias — crie conexão e conte histórias interessantes sem forçar personagem.',
      en: 'The C.H.A.R.M. method, storytelling structures and a 30-day plan — build connection and tell interesting stories without forcing a persona.',
      es: 'Método C.H.A.R.M.E., estructuras de storytelling y plan de 30 días — crea conexión y cuenta historias interesantes sin forzar un personaje.'
    }
  }
];
