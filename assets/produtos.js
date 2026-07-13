// ============================================================
// CATÁLOGO DE PRODUTOS — NextLevel
// Este é o ÚNICO lugar onde a lista de produtos do catálogo é
// editada. As páginas iniciais (PT/EN/ES) leem daqui.
//
// Por decisão do dono do projeto (jul/2026): só ficam vendáveis (disponivel:
// true) os produtos que JÁ estão sendo vendidos de verdade (checkout Hotmart
// real em pelo menos uma moeda). O produto 'investimentos' está listado com
// disponivel: false enquanto aguarda cadastro na Hotmart (ver CLAUDE.md) —
// aparece como "Em breve" no site até os 3 checkouts ficarem prontos.
//
// Para adicionar um produto:
//   1. Crie a pasta produtos/<slug>/ (copiando landing-page/)
//   2. Registre o produto na Hotmart e cole o link de checkout real
//   3. Só então adicione um bloco aqui com o mesmo slug
//   4. Quando TODOS os idiomas tiverem checkout funcionando,
//      troque disponivel: false por true (some o "Em breve")
// ============================================================
// Categorias do catálogo — usadas pela página /categorias/ (3 idiomas) e
// pelas tags dos cards. Categoria só aparece no site quando tem pelo menos
// um produto listado abaixo com o slug dela.
window.CATEGORIAS_SITE = {
  'saude-fitness': {
    icone: (window.ICONS || {}).pulse || '💪',
    nome: { pt: 'Saúde e Fitness', en: 'Health & Fitness', es: 'Salud y Fitness' },
    desc: {
      pt: 'Treino, alimentação, suplementação e hábitos — métodos práticos pra evoluir seu corpo com constância.',
      en: 'Training, nutrition, supplementation and habits — practical methods to evolve your body with consistency.',
      es: 'Entrenamiento, alimentación, suplementación y hábitos — métodos prácticos para evolucionar tu cuerpo con constancia.'
    }
  },
  'relacionamentos': {
    icone: (window.ICONS || {}).chat || '💬',
    nome: { pt: 'Relacionamentos e Habilidades Sociais', en: 'Relationships & Social Skills', es: 'Relaciones y Habilidades Sociales' },
    desc: {
      pt: 'Conversas, presença, carisma e conexões saudáveis — comunicação genuína e respeito, nunca manipulação.',
      en: 'Conversations, presence, charisma and healthy connections — genuine communication and respect, never manipulation.',
      es: 'Conversaciones, presencia, carisma y conexiones saludables — comunicación genuina y respeto, nunca manipulación.'
    }
  },
  'financas': {
    icone: (window.ICONS || {}).globe || '🌐',
    nome: { pt: 'Educação Financeira', en: 'Financial Education', es: 'Educación Financiera' },
    desc: {
      pt: 'Investimento, diversificação e organização financeira — conteúdo educativo, sem promessa de rentabilidade.',
      en: 'Investing, diversification and financial organization — educational content, no promised returns.',
      es: 'Inversión, diversificación y organización financiera — contenido educativo, sin promesa de rentabilidad.'
    }
  }
};

window.PRODUTOS_SITE = [
  {
    slug: 'treino-em-casa',
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'saude-fitness',
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
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 15.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Ansiedade Social e Conversas com Naturalidade', en: 'Social Anxiety and Natural Conversations', es: 'Ansiedad Social y Conversaciones con Naturalidad' },
    resumo: {
      pt: 'Escada de exposição gradual, playbooks por situação e plano de 30 dias — destrave conversas e crie conexões com respeito.',
      en: 'A gradual exposure ladder, playbooks by situation and a 30-day plan — unlock conversations and build connections with respect.',
      es: 'Escalera de exposición gradual, playbooks por situación y plan de 30 días — destraba conversaciones y crea conexiones con respeto.'
    }
  },
  {
    slug: 'carisma-humor-storytelling',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 16.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Carisma, Humor e Storytelling', en: 'Charisma, Humor and Storytelling', es: 'Carisma, Humor y Storytelling' },
    resumo: {
      pt: 'Método C.H.A.R.M.E., estruturas de storytelling e plano de 30 dias — crie conexão e conte histórias interessantes sem forçar personagem.',
      en: 'The C.H.A.R.M. method, storytelling structures and a 30-day plan — build connection and tell interesting stories without forcing a persona.',
      es: 'Método C.H.A.R.M.E., estructuras de storytelling y plan de 30 días — crea conexión y cuenta historias interesantes sin forzar un personaje.'
    }
  },
  {
    slug: 'comunicacao-e-relacionamentos',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 17.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Comunicação e Relacionamento: Conversas que Criam Conexão', en: 'Communication and Relationships: Conversations That Create Connection', es: 'Comunicación y Relación: Conversaciones que Crean Conexión' },
    resumo: {
      pt: 'Método O.U.V.I.R., estrutura de storytelling 30-20-10 e plano de 30 dias — comunique-se com clareza e construa relacionamentos saudáveis.',
      en: 'The listening method, the 30-20-10 storytelling structure and a 30-day plan — communicate clearly and build healthy relationships.',
      es: 'Método O.U.V.I.R., estructura de storytelling 30-20-10 y plan de 30 días — comunícate con claridad y construye relaciones saludables.'
    }
  },
  {
    slug: 'atracao-com-respeito',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 18.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Confiança Social: Atração com Respeito', en: 'Social Confidence: Attraction with Respect', es: 'Confianza Social: Atracción con Respeto' },
    resumo: {
      pt: 'Diagnóstico social, Protocolo P.A.R.E. para ansiedade, método C.O.N.E.C.T.A. e plano de 30 dias — presença, autoestima e atração com respeito.',
      en: 'A social diagnostic, the STOP protocol for anxiety, the C.O.N.N.E.C.T. method and a 30-day plan — presence, self-esteem and attraction with respect.',
      es: 'Diagnóstico social, Protocolo P.A.R.E. para la ansiedad, método C.O.N.E.C.T.A. y plan de 30 días — presencia, autoestima y atracción con respeto.'
    }
  },
  {
    slug: 'presenca-social',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 19.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Linguagem Corporal e Presença Social', en: 'Body Language and Social Presence', es: 'Lenguaje Corporal y Presencia Social' },
    resumo: {
      pt: 'Postura, olhar, voz, espaço pessoal e calibragem social — presença visível e atração com respeito, com plano de 30 dias.',
      en: 'Posture, eye contact, voice, personal space and social calibration — visible presence and attraction with respect, with a 30-day plan.',
      es: 'Postura, mirada, voz, espacio personal y calibración social — presencia visible y atracción con respeto, con plan de 30 días.'
    }
  },
  {
    slug: 'limites-rejeicao-maturidade',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 20.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Limites, Rejeição e Maturidade Emocional', en: 'Boundaries, Rejection and Emotional Maturity', es: 'Límites, Rechazo y Madurez Emocional' },
    resumo: {
      pt: 'Protocolo P.A.R.A., mapa de limites e frases de comunicação assertiva — comunique limites e lide com rejeição com maturidade, num plano de 30 dias.',
      en: 'The P.A.R.M. protocol, a boundary map and assertive communication phrases — communicate boundaries and handle rejection with maturity, in a 30-day plan.',
      es: 'Protocolo P.A.R.A., mapa de límites y frases de comunicación asertiva — comunica límites y maneja el rechazo con madurez, en un plan de 30 días.'
    }
  },
  {
    slug: 'mensagens-e-conversas-online',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 21.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Mensagens, WhatsApp e Conversas Online', en: 'Messages, WhatsApp and Online Conversations', es: 'Mensajes, WhatsApp y Conversaciones Online' },
    resumo: {
      pt: 'Fórmula base da conversa, técnica C.E.C., convite para sair com respeito e segurança contra golpes afetivos — converse com leveza, clareza e respeito, num plano de 30 dias.',
      en: 'The base conversation formula, the C.E.S. technique, inviting someone out with respect and safety against romance scams — talk with lightness, clarity and respect, in a 30-day plan.',
      es: 'Fórmula base de la conversación, técnica C.E.C., cómo invitar a salir con respeto y seguridad contra estafas románticas — conversa con ligereza, claridad y respeto, en un plan de 30 días.'
    }
  },
  {
    slug: 'primeiro-encontro',
    categoria: 'relacionamentos',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 22.
    disponivel: true,
    tag:    { pt: 'Relacionamentos',  en: 'Relationships',  es: 'Relaciones' },
    titulo: { pt: 'Primeiro Encontro: Conversa, Presença e Respeito', en: 'First Date: Conversation, Presence and Respect', es: 'Primera Cita: Conversación, Presencia y Respeto' },
    resumo: {
      pt: 'Mentalidade certa, convite sem pressão, estrutura C.E.C. para conversar e presença/limites — prepare-se e crie uma experiência leve para os dois, num plano de 30 dias.',
      en: 'The right mindset, invitations without pressure, the C.E.S. structure for conversation, and presence/boundaries — prepare and create a light experience for both of you, in a 30-day plan.',
      es: 'La mentalidad correcta, invitaciones sin presión, la estructura C.E.C. para conversar y presencia/límites — prepárate y crea una experiencia ligera para ambos, en un plan de 30 días.'
    }
  },
  {
    slug: 'etfs-investimento-global',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 23.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'ETFs e Investimento Global', en: 'ETFs and Global Investing', es: 'ETFs e Inversión Global' },
    resumo: {
      pt: 'ETFs, BDRs, custos, impostos e carteira global com método — diversifique fora do Brasil sem promessa de rentabilidade.',
      en: 'ETFs, access certificates, costs, taxes and a global portfolio with method — diversify beyond your home market, no promised returns.',
      es: 'ETFs, certificados de acceso, costos, impuestos y cartera global con método — diversifica fuera de tu país sin promesa de rentabilidad.'
    }
  },
  {
    slug: 'fiis-do-zero',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 24.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'FIIs do Zero', en: 'REITs from Zero', es: 'REITs desde Cero' },
    resumo: {
      pt: 'Tipos de FIIs, indicadores sem confusão, análise prática e carteira com método — sem promessa de rentabilidade.',
      en: 'REIT types, indicators without confusion, practical analysis and a teaching portfolio with method — no promised returns.',
      es: 'Tipos de REITs, indicadores sin confusión, análisis práctico y cartera con método — sin promesa de rentabilidad.'
    }
  },
  {
    slug: 'financas-pessoais',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 25.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Finanças Pessoais e Liberdade Financeira', en: 'Personal Finance and Financial Freedom', es: 'Finanzas Personales y Libertad Financiera' },
    resumo: {
      pt: 'Diagnóstico, orçamento, dívidas, reserva de emergência, metas e investimentos com plano de 30 dias — sem promessa de rentabilidade.',
      en: 'Diagnosis, budgeting, debt, emergency fund, goals and investing with a 30-day plan — no promised returns.',
      es: 'Diagnóstico, presupuesto, deudas, fondo de emergencia, metas e inversiones con plan de 30 días — sin promesa de rentabilidad.'
    }
  },
  {
    slug: 'imposto-de-renda-investidores',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 26.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Imposto de Renda para Investidores', en: 'Investment Tax Organization', es: 'Organización Fiscal para Inversionistas' },
    resumo: {
      pt: 'Rotina mensal, pasta fiscal, ações, FIIs, ETFs, BDRs, exterior, cripto e declaração anual — com plano de 30 dias e checklists.',
      en: 'A monthly routine, tax folder system, stocks, REITs, ETFs, foreign assets, crypto and annual filing — with a 30-day plan and checklists.',
      es: 'Rutina mensual, carpeta fiscal, acciones, REITs, ETFs, exterior, cripto y declaración anual — con plan de 30 días y checklists.'
    }
  },
  {
    slug: 'investimentos',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 27.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Investimentos do Zero ao Método', en: 'Investing from Zero: A Complete Method', es: 'Inversiones desde Cero: Un Método Completo' },
    resumo: {
      pt: 'Diagnóstico, reserva, perfil de risco, renda fixa, fundos, FIIs, ações, ETFs e carteira com plano de 30 dias — sem promessa de rentabilidade.',
      en: 'Diagnosis, emergency fund, risk profile, fixed income, funds, REITs, stocks, ETFs and portfolio building with a 30-day plan — no promised returns.',
      es: 'Diagnóstico, fondo de emergencia, perfil de riesgo, renta fija, fondos, REITs, acciones, ETFs y cartera con plan de 30 días — sin promesa de rentabilidad.'
    }
  },
  {
    slug: 'psicologia-do-investidor',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 28.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Psicologia do Investidor', en: 'Investor Psychology', es: 'Psicología del Inversor' },
    resumo: {
      pt: 'Método P.A.U.S.A., diagnóstico de vieses comportamentais e protocolo anti-pânico para decidir com mais disciplina — sem indicar ativos.',
      en: 'The S.T.O.P. method, a behavioral bias diagnostic and an anti-panic protocol to decide with more discipline — no asset picks.',
      es: 'Método P.A.U.S.A., diagnóstico de sesgos de comportamiento y protocolo antipánico para decidir con más disciplina — sin indicar activos.'
    }
  },
  {
    slug: 'renda-fixa-inteligente',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 29.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Renda Fixa Inteligente', en: 'Smart Fixed Income', es: 'Renta Fija Inteligente' },
    resumo: {
      pt: 'Método prático de 7 filtros para comparar Tesouro Direto, CDB, LCI/LCA e crédito privado, entender FGC e marcação a mercado, e montar uma carteira por camadas.',
      en: 'A practical 7-filter method to compare treasury bonds, CDs, tax-exempt notes and private credit, understand deposit insurance and mark-to-market, and build a layered portfolio.',
      es: 'Método práctico de 7 filtros para comparar el Tesoro Directo, CDB, LCI/LCA y crédito privado, entender el fondo de garantía y la valoración a mercado, y armar una cartera por capas.'
    }
  },
  {
    slug: 'seguranca-financeira-e-golpes',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 30.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Segurança Financeira e Golpes', en: 'Financial Safety & Scams', es: 'Seguridad Financiera y Estafas' },
    resumo: {
      pt: 'Reconheça pirâmides, falsos assessores, phishing e boletos falsos, e monte um plano de blindagem financeira em 30 dias.',
      en: 'Recognize pyramid schemes, fake advisors, phishing and fake invoices, and build a 30-day financial shielding plan.',
      es: 'Reconoce pirámides, falsos asesores, phishing y facturas falsas, y arma un plan de blindaje financiero en 30 días.'
    }
  },
  {
    slug: 'dividendos-e-renda-passiva',
    categoria: 'financas',
    // Checkout real nas 3 moedas (PT/EN/ES) — ver CADASTRO-HOTMART.md, seção 31.
    disponivel: true,
    tag:    { pt: 'Finanças',  en: 'Finance',  es: 'Finanzas' },
    titulo: { pt: 'Dividendos e Renda Passiva', en: 'Dividends & Passive Income', es: 'Dividendos y Renta Pasiva' },
    resumo: {
      pt: 'Método prático para construir renda recorrente com ações, FIIs, reinvestimento e disciplina financeira — sem promessa de rentabilidade.',
      en: 'A practical method to build recurring income with stocks, REITs, reinvestment and financial discipline — no promised returns.',
      es: 'Método práctico para construir renta recurrente con acciones, FIIs/REITs, reinversión y disciplina financiera — sin promesa de rentabilidad.'
    }
  }
];
