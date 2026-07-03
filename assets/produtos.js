// ============================================================
// CATÁLOGO DE PRODUTOS — NextLevel
// Este é o ÚNICO lugar onde a lista de produtos do catálogo é
// editada. As páginas iniciais (PT/EN/ES) leem daqui.
//
// Para adicionar um produto:
//   1. Crie a pasta produtos/<slug>/ (copiando landing-page/)
//   2. Adicione um bloco aqui com o mesmo slug
//   3. Quando a página do produto estiver pronta pra vender,
//      troque disponivel: false por true (some o "Em breve")
// ============================================================
window.PRODUTOS_SITE = [
  {
    slug: 'emagrecimento',
    disponivel: false,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Emagrecimento', en: 'Weight Loss', es: 'Pérdida de Peso' },
    resumo: {
      pt: 'Emagreça de forma leve, sem dietas malucas nem sofrimento.',
      en: 'Lose weight the light way — no crazy diets, no suffering.',
      es: 'Adelgaza de forma ligera, sin dietas locas ni sufrimiento.'
    }
  },
  {
    slug: 'ganho-de-massa',
    disponivel: false,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Ganho de Massa', en: 'Muscle Gain', es: 'Ganancia Muscular' },
    resumo: {
      pt: 'Treino, comida e descanso num plano simples: músculo com método, não achismo.',
      en: 'Training, food and rest in one simple plan: muscle with method, not guesswork.',
      es: 'Entrenamiento, comida y descanso en un plan simple: músculo con método.'
    }
  },
  {
    slug: 'investimentos',
    disponivel: false,
    tag:    { pt: 'Finanças', en: 'Finance', es: 'Finanzas' },
    titulo: { pt: 'Investimentos', en: 'Investing', es: 'Inversiones' },
    resumo: {
      pt: 'Saia do zero: organize seu dinheiro e comece a investir sem economês.',
      en: 'Go from zero: organize your money and start investing without the jargon.',
      es: 'Pasa de cero: organiza tu dinero y empieza a invertir sin tecnicismos.'
    }
  },
  {
    slug: 'confianca-social',
    disponivel: false,
    tag:    { pt: 'Relacionamentos', en: 'Relationships', es: 'Relaciones' },
    titulo: { pt: 'Confiança Social', en: 'Social Confidence', es: 'Confianza Social' },
    resumo: {
      pt: 'Vença a timidez e fique à vontade em qualquer conversa — sem fingir ser outra pessoa.',
      en: 'Beat shyness and feel at ease in any conversation — without pretending to be someone else.',
      es: 'Supera la timidez y siéntete cómodo en cualquier conversación — sin fingir ser otra persona.'
    }
  },
  {
    slug: 'comunicacao-e-relacionamentos',
    disponivel: false,
    tag:    { pt: 'Relacionamentos', en: 'Relationships', es: 'Relaciones' },
    titulo: { pt: 'Comunicação e Relacionamentos', en: 'Communication & Relationships', es: 'Comunicación y Relaciones' },
    resumo: {
      pt: 'Comunicação com clareza e empatia pra relações que duram — no amor, na família e no trabalho.',
      en: 'Clear, empathetic communication for relationships that last — in love, family and work.',
      es: 'Comunicación clara y empática para relaciones que duran — en el amor, la familia y el trabajo.'
    }
  },
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
  }
];
