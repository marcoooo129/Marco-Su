export type Locale = 'zh' | 'en' | 'it';
export type ProjectVisual = 'dimmi' | 'florence' | 'anime' | 'spend';

export interface Project {
  id: string;
  visual: ProjectVisual;
  year: string;
  title: string;
  type: string;
  tagline: string;
  description: string;
  status: string;
  tools: string[];
  live?: string;
  source?: string;
}

export interface Translation {
  meta: {
    title: string;
    description: string;
    socialDescription: string;
    locale: string;
  };
  nav: {
    work: string;
    about: string;
    contact: string;
    menu: string;
    close: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    phrases: string[];
    accessibleHeadline: string;
    intro: string;
    role: string;
    location: string;
    explore: string;
  };
  work: {
    eyebrow: string;
    title: string;
    intro: string;
    choose: string;
    project: string;
    live: string;
    source: string;
    previous: string;
    next: string;
    status: string;
  };
  projects: Project[];
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    education: string;
    current: string;
    florence: string;
    florenceDegree: string;
    guilin: string;
    guilinDegree: string;
    focus: string;
    focusItems: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    email: string;
    github: string;
  };
  footer: {
    note: string;
    backToTop: string;
  };
}

export const translations: Record<Locale, Translation> = {
  zh: {
    meta: {
      title: 'Marco Su｜独立产品创作者',
      description: 'Marco Su 是生活在佛罗伦萨的独立产品创作者，通过 AI、设计与代码把想法变成真实作品。',
      socialDescription: '从物流管理与传播学走向 AI 和产品创造。',
      locale: 'zh_CN',
    },
    nav: { work: '作品', about: '关于', contact: '联系', menu: '菜单', close: '关闭菜单', language: '选择语言' },
    hero: {
      eyebrow: 'Marco Su · Florence',
      phrases: ['你好。', 'Ciao.', 'Hello.', '用 AI，把想法做出来。'],
      accessibleHeadline: '你好。我用 AI 把想法做出来。',
      intro: '我不是科班程序员，但我正在认真做产品。本科学物流管理，现在在佛罗伦萨学习传播；AI 让我跨过技术门槛，顺着兴趣开始创造。',
      role: 'Independent Maker / Vibe Coder',
      location: '佛罗伦萨，意大利',
      explore: '查看作品',
    },
    work: { eyebrow: 'Selected work', title: '我做过的一些东西。', intro: '这里有完整产品，也有用于验证想法的实验。它们不假装完美，但都真实地被做出来、运行过并持续迭代。', choose: '选择一个项目', project: '项目', live: '访问项目', source: '查看源码', previous: '上一个项目', next: '下一个项目', status: '当前状态' },
    projects: [
      { id: 'dimmi', visual: 'dimmi', year: '2026', title: 'dimmi', type: 'macOS App', tagline: '划词即翻，但不止于翻译。', description: '为中文母语者设计的原生 macOS 菜单栏翻译工具。复制或划词后直接在当前语境中完成翻译、表达解析和历史检索。', status: '0.1.0 Beta', tools: ['Swift 6', 'SwiftUI', 'AppKit', 'SwiftData'], live: 'https://marcoooo129.github.io/dimmi/', source: 'https://github.com/marcoooo129/dimmi' },
      { id: 'florence-student', visual: 'florence', year: '2025—26', title: 'Florence Student', type: 'Product prototype', tagline: '让选课不再依赖零散聊天。', description: '面向佛罗伦萨大学学生的课程、教授评价与资料平台，从真实的留学生选课信息差出发，完成 Web 与 SwiftUI 原型。', status: '持续开发中', tools: ['React', 'TypeScript', 'Supabase', 'SwiftUI'], live: 'https://florence-student.vercel.app', source: 'https://github.com/marcosu0129-max/florence-student' },
      { id: 'animelegno', visual: 'anime', year: '2026', title: 'AnimeLegno Studio', type: 'Brand website', tagline: '木雕与动漫艺术，在佛罗伦萨相遇。', description: '为木雕工作室整理品牌叙事、作品展示和定制流程，并在保留自定义鼠标与图片滚动效果的同时完成性能优化。', status: '已上线', tools: ['React', 'TypeScript', 'Motion', 'Supabase'], live: 'https://animelegno-progetto.vercel.app/', source: 'https://github.com/marcoooo129/animelegno-progetto' },
      { id: 'vibespend', visual: 'spend', year: '2025', title: 'VibeSpend', type: 'AI web experiment', tagline: '对着网页说一句话，就记下一笔消费。', description: '把语音输入、AI 自动分类、消费报告和 3D 数据可视化组合在一起的创意原型，用来探索更自然的记账方式。', status: '实验版本', tools: ['Next.js', 'TypeScript', 'Google AI', 'Three.js'], live: 'https://vibespend.vercel.app' },
    ],
    about: {
      eyebrow: 'About', title: '一条不是提前规划好的路。',
      paragraphs: ['我本科在桂林理工大学学习物流管理，之后来到意大利，在佛罗伦萨大学攻读传播学硕士。这两段经历让我从系统、语言和社会的不同角度理解问题。', 'AI 出现以后，我第一次感到，一个没有传统计算机背景的人也能真正参与产品创造。我开始通过对话、尝试、报错和修改，把模糊的念头变成别人可以打开和使用的东西。', '我还在学习，也不急着给自己一个过早的职业标签。比起描述自己会什么，我更愿意持续做下去，让作品回答“我是谁”。'],
      education: '教育路径', current: '现在', florence: '佛罗伦萨大学', florenceDegree: '传播学硕士在读 · 2025—现在', guilin: '桂林理工大学', guilinDegree: '物流管理学士 · 2020—2024', focus: '现在关注', focusItems: ['AI 原生产品', '语言与沟通工具', '个人效率软件', '真实生活中的小问题'],
    },
    contact: { eyebrow: 'Contact', title: '有想法，就聊聊。', body: '如果你也在做 AI 产品、独立开发，或者对我的某个作品有建议，欢迎写信给我。', email: '发送邮件', github: 'GitHub' },
    footer: { note: '在佛罗伦萨学习，也在持续创造。', backToTop: '回到顶部' },
  },
  en: {
    meta: { title: 'Marco Su | Independent Product Maker', description: 'Marco Su is an independent product maker in Florence, turning ideas into working products with AI, design and code.', socialDescription: 'From logistics and communication studies to AI and product making.', locale: 'en_GB' },
    nav: { work: 'Work', about: 'About', contact: 'Contact', menu: 'Menu', close: 'Close menu', language: 'Choose language' },
    hero: { eyebrow: 'Marco Su · Florence', phrases: ['Hello.', 'Ciao.', '你好。', 'Ideas into products.'], accessibleHeadline: 'Hello. I turn ideas into products with AI.', intro: 'I was not trained as a programmer, but I am serious about making products. I studied logistics and now communication in Florence; AI helped me cross the technical threshold and start building around my curiosity.', role: 'Independent Maker / Vibe Coder', location: 'Florence, Italy', explore: 'Explore my work' },
    work: { eyebrow: 'Selected work', title: 'A few things I have made.', intro: 'Some are complete products; others test a single idea. They do not pretend to be perfect, but each one has been built, run and iterated in the real world.', choose: 'Choose a project', project: 'Project', live: 'Visit project', source: 'View source', previous: 'Previous project', next: 'Next project', status: 'Current status' },
    projects: [
      { id: 'dimmi', visual: 'dimmi', year: '2026', title: 'dimmi', type: 'macOS App', tagline: 'Translate selected text—and understand how to say it.', description: 'A native macOS menu-bar translation tool designed for Chinese speakers. It keeps translation, expression analysis and searchable history inside the current context.', status: '0.1.0 Beta', tools: ['Swift 6', 'SwiftUI', 'AppKit', 'SwiftData'], live: 'https://marcoooo129.github.io/dimmi/', source: 'https://github.com/marcoooo129/dimmi' },
      { id: 'florence-student', visual: 'florence', year: '2025—26', title: 'Florence Student', type: 'Product prototype', tagline: 'Course choices should not depend on scattered group chats.', description: 'A course, professor and study-material platform for students at the University of Florence, shaped by the real information gap international students face.', status: 'In development', tools: ['React', 'TypeScript', 'Supabase', 'SwiftUI'], live: 'https://florence-student.vercel.app', source: 'https://github.com/marcosu0129-max/florence-student' },
      { id: 'animelegno', visual: 'anime', year: '2026', title: 'AnimeLegno Studio', type: 'Brand website', tagline: 'Woodcarving and anime art meet in Florence.', description: 'A bilingual brand and portfolio site for a woodcarving studio. I reworked its story, collection and custom process while preserving its cursor and image motion with better performance.', status: 'Live', tools: ['React', 'TypeScript', 'Motion', 'Supabase'], live: 'https://animelegno-progetto.vercel.app/', source: 'https://github.com/marcoooo129/animelegno-progetto' },
      { id: 'vibespend', visual: 'spend', year: '2025', title: 'VibeSpend', type: 'AI web experiment', tagline: 'Say what you spent. Let the interface do the rest.', description: 'A creative prototype combining voice input, AI categorisation, spending reports and 3D data visualisation to explore a more natural way to track money.', status: 'Experiment', tools: ['Next.js', 'TypeScript', 'Google AI', 'Three.js'], live: 'https://vibespend.vercel.app' },
    ],
    about: { eyebrow: 'About', title: 'A path that was not planned in advance.', paragraphs: ['I studied logistics management at Guilin University of Technology, then moved to Italy for a master’s in communication at the University of Florence. Together, these experiences taught me to see problems through systems, language and society.', 'With AI, I realised that someone without a traditional computer-science background could participate in making real products. Through conversation, trials, errors and revisions, I began turning vague ideas into things other people can open and use.', 'I am still learning and I am not rushing into a fixed label. I would rather keep making and let the work answer who I am.'], education: 'Education', current: 'Now', florence: 'University of Florence', florenceDegree: 'MA in Communication · 2025—present', guilin: 'Guilin University of Technology', guilinDegree: 'B.Mgt. in Logistics · 2020—2024', focus: 'Current interests', focusItems: ['AI-native products', 'Language and communication tools', 'Personal productivity software', 'Small, real-life problems'] },
    contact: { eyebrow: 'Contact', title: 'Have an idea? Let’s talk.', body: 'If you are making AI products, building independently, or have thoughts about one of my projects, I would be glad to hear from you.', email: 'Send an email', github: 'GitHub' },
    footer: { note: 'Learning in Florence, making along the way.', backToTop: 'Back to top' },
  },
  it: {
    meta: { title: 'Marco Su | Independent Product Maker', description: 'Marco Su è un maker indipendente a Firenze: trasforma idee in prodotti funzionanti con AI, design e codice.', socialDescription: 'Dalla logistica e comunicazione alla creazione di prodotti con l’AI.', locale: 'it_IT' },
    nav: { work: 'Progetti', about: 'Chi sono', contact: 'Contatti', menu: 'Menu', close: 'Chiudi menu', language: 'Scegli lingua' },
    hero: { eyebrow: 'Marco Su · Firenze', phrases: ['Ciao.', '你好。', 'Hello.', 'Idee che diventano prodotti.'], accessibleHeadline: 'Ciao. Trasformo idee in prodotti con l’AI.', intro: 'Non ho una formazione da programmatore, ma costruisco prodotti sul serio. Ho studiato logistica e ora comunicazione a Firenze; l’AI mi ha permesso di superare la barriera tecnica e creare seguendo la mia curiosità.', role: 'Independent Maker / Vibe Coder', location: 'Firenze, Italia', explore: 'Scopri i progetti' },
    work: { eyebrow: 'Selected work', title: 'Alcune cose che ho creato.', intro: 'Ci sono prodotti completi e piccoli esperimenti nati per verificare un’idea. Non fingono di essere perfetti, ma sono stati costruiti, provati e migliorati davvero.', choose: 'Scegli un progetto', project: 'Progetto', live: 'Visita il progetto', source: 'Vedi il codice', previous: 'Progetto precedente', next: 'Progetto successivo', status: 'Stato attuale' },
    projects: [
      { id: 'dimmi', visual: 'dimmi', year: '2026', title: 'dimmi', type: 'App macOS', tagline: 'Traduci una selezione e capisci come dirlo davvero.', description: 'Un’app nativa nella barra dei menu di macOS pensata per chi parla cinese. Traduzione, analisi delle espressioni e cronologia restano nel contesto in cui si lavora.', status: '0.1.0 Beta', tools: ['Swift 6', 'SwiftUI', 'AppKit', 'SwiftData'], live: 'https://marcoooo129.github.io/dimmi/', source: 'https://github.com/marcoooo129/dimmi' },
      { id: 'florence-student', visual: 'florence', year: '2025—26', title: 'Florence Student', type: 'Prototipo di prodotto', tagline: 'Scegliere un corso non dovrebbe dipendere da chat sparse.', description: 'Una piattaforma di corsi, docenti e materiali per gli studenti dell’Università di Firenze, nata dal problema reale di orientarsi tra informazioni frammentate.', status: 'In sviluppo', tools: ['React', 'TypeScript', 'Supabase', 'SwiftUI'], live: 'https://florence-student.vercel.app', source: 'https://github.com/marcosu0129-max/florence-student' },
      { id: 'animelegno', visual: 'anime', year: '2026', title: 'AnimeLegno Studio', type: 'Sito di brand', tagline: 'Intaglio del legno e anime art si incontrano a Firenze.', description: 'Un sito bilingue di brand e portfolio per uno studio di intaglio. Ho riorganizzato racconto, opere e percorso su misura, preservando cursore e movimento delle immagini con prestazioni migliori.', status: 'Online', tools: ['React', 'TypeScript', 'Motion', 'Supabase'], live: 'https://animelegno-progetto.vercel.app/', source: 'https://github.com/marcoooo129/animelegno-progetto' },
      { id: 'vibespend', visual: 'spend', year: '2025', title: 'VibeSpend', type: 'Esperimento web AI', tagline: 'Racconta una spesa. L’interfaccia fa il resto.', description: 'Un prototipo creativo che combina voce, classificazione AI, report di spesa e visualizzazione 3D per esplorare un modo più naturale di tenere i conti.', status: 'Esperimento', tools: ['Next.js', 'TypeScript', 'Google AI', 'Three.js'], live: 'https://vibespend.vercel.app' },
    ],
    about: { eyebrow: 'Chi sono', title: 'Un percorso non pianificato in anticipo.', paragraphs: ['Ho studiato gestione della logistica alla Guilin University of Technology e poi mi sono trasferito in Italia per una laurea magistrale in comunicazione all’Università di Firenze. Queste esperienze mi hanno insegnato a leggere i problemi attraverso sistemi, linguaggio e società.', 'Con l’AI ho capito che anche chi non ha una formazione informatica tradizionale può partecipare alla creazione di prodotti reali. Attraverso dialoghi, prove, errori e revisioni, ho iniziato a trasformare idee vaghe in cose che altre persone possono aprire e usare.', 'Sto ancora imparando e non ho fretta di scegliere un’etichetta definitiva. Preferisco continuare a creare e lasciare che siano i progetti a raccontare chi sono.'], education: 'Formazione', current: 'Ora', florence: 'Università degli Studi di Firenze', florenceDegree: 'Laurea magistrale in Comunicazione · 2025—oggi', guilin: 'Guilin University of Technology', guilinDegree: 'Laurea in Gestione della logistica · 2020—2024', focus: 'Interessi attuali', focusItems: ['Prodotti AI-native', 'Strumenti per lingua e comunicazione', 'Software per la produttività personale', 'Piccoli problemi della vita reale'] },
    contact: { eyebrow: 'Contatti', title: 'Hai un’idea? Parliamone.', body: 'Se stai creando prodotti AI, lavori come indipendente o vuoi condividere un pensiero su uno dei miei progetti, scrivimi.', email: 'Invia un’email', github: 'GitHub' },
    footer: { note: 'Studio a Firenze e continuo a creare.', backToTop: 'Torna su' },
  },
};
