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
      pt: 'Perca peso sem dietas malucas nem sofrimento.',
      en: 'Lose weight without crazy diets or suffering.',
      es: 'Pierde peso sin dietas locas ni sufrimiento.'
    }
  },
  {
    slug: 'ganho-de-massa',
    disponivel: false,
    tag:    { pt: 'Saúde',  en: 'Health',  es: 'Salud' },
    titulo: { pt: 'Ganho de Massa', en: 'Muscle Gain', es: 'Ganancia Muscular' },
    resumo: {
      pt: 'Construa músculo de forma inteligente, sem perder tempo na academia.',
      en: 'Build muscle smartly, without wasting time at the gym.',
      es: 'Gana músculo de forma inteligente, sin perder horas en el gimnasio.'
    }
  },
  {
    slug: 'investimentos',
    disponivel: false,
    tag:    { pt: 'Finanças', en: 'Finance', es: 'Finanzas' },
    titulo: { pt: 'Investimentos', en: 'Investing', es: 'Inversiones' },
    resumo: {
      pt: 'Faça seu dinheiro trabalhar por você, do jeito certo.',
      en: 'Make your money work for you, the right way.',
      es: 'Haz que tu dinero trabaje para ti, de la forma correcta.'
    }
  },
  {
    slug: 'confianca-social',
    disponivel: false,
    tag:    { pt: 'Relacionamentos', en: 'Relationships', es: 'Relaciones' },
    titulo: { pt: 'Confiança Social', en: 'Social Confidence', es: 'Confianza Social' },
    resumo: {
      pt: 'Supere a timidez e sinta-se à vontade em qualquer conversa.',
      en: 'Overcome shyness and feel at ease in any conversation.',
      es: 'Supera la timidez y siéntete cómodo en cualquier conversación.'
    }
  },
  {
    slug: 'comunicacao-e-relacionamentos',
    disponivel: false,
    tag:    { pt: 'Relacionamentos', en: 'Relationships', es: 'Relaciones' },
    titulo: { pt: 'Comunicação e Relacionamentos', en: 'Communication & Relationships', es: 'Comunicación y Relaciones' },
    resumo: {
      pt: 'Construa conexões reais através de confiança e comunicação genuína.',
      en: 'Build real connections through confidence and genuine communication.',
      es: 'Construye conexiones reales a través de la confianza y la comunicación genuina.'
    }
  }
];
