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
  }
];
