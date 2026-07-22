export type Project = {
  title: string;
  number: string;
  year: string;
  category: string;
  description: string;
  status: string;
  cover: string;
  slug: string;
  externalUrl: string;
};

export const site = {
  name: "Marco Su",
  fullName: "苏传毫 / Marco Su",
  initials: "MS",
  role: "Independent Product Maker / Vibe Coder",
  tagline: "Not trained as a programmer. Serious about building products.",
  introLine: "From logistics and communication to AI-native products.",
  positioning:
    "From logistics and communication to AI-native products—turning curiosity into things people can open and use.",
  email: "marco.su@edu.unifi.it",
  location: "Florence, Italy",
  github: "https://github.com/marcoooo129",
  instagram: "https://instagram.com/marco.su",
  accentColor: "#21A35C",
  socials: [
    { label: "Email", handle: "marco.su@edu.unifi.it", href: "mailto:marco.su@edu.unifi.it" },
    { label: "Instagram", handle: "@marco.su", href: "https://instagram.com/marco.su" },
    { label: "GitHub", handle: "marcoooo129", href: "https://github.com/marcoooo129" },
  ],
  manifesto: {
    eyebrow: "A non-linear path / 2026",
    heading: "Building at the intersection of AI, communication and lived experience through",
    words: [
      "language tools",
      "student products",
      "creative websites",
      "native apps",
      "small experiments",
    ],
    body:
      "I studied logistics in China, then moved to Florence to study language and communication. AI gave me a practical way to turn everyday observations into working products.",
  },
  education: [
    {
      school: "University of Florence",
      program: "Pratiche, Linguaggi e Culture della Comunicazione",
      period: "2025—Present",
      location: "Florence, Italy",
    },
    {
      school: "Guilin University of Technology",
      program: "Bachelor’s Degree in Logistics Management",
      period: "2020—2024",
      location: "Guilin, China",
    },
  ],
  languages: ["Chinese / Native", "Italian / CILS B2", "English / CET-4"],
  projects: [
    {
      title: "dimmi",
      number: "01",
      year: "2026",
      category: "Native macOS App / Language Tool",
      description:
        "A SwiftUI menu-bar translator that turns copied or selected text into an in-context translation card, usage notes and a searchable local expression library.",
      status: "Beta / SwiftUI",
      cover: "/projects/dimmi.jpg",
      slug: "dimmi",
      externalUrl: "https://marcoooo129.github.io/dimmi/",
    },
    {
      title: "Florence Student",
      number: "02",
      year: "2025—26",
      category: "Education Platform / Course Discovery",
      description:
        "A focused UNIFI course explorer that brings 313 classes, degree programmes and professor information into one searchable student interface.",
      status: "Live / Student utility",
      cover: "/projects/florence-student.jpg",
      slug: "florence-student",
      externalUrl: "https://florence-student.vercel.app",
    },
    {
      title: "AnimeLegno Studio",
      number: "03",
      year: "2026",
      category: "Creative Commerce / Custom Woodcraft",
      description:
        "A bilingual showcase for handmade anime wood carvings, combining a moving gallery with a clear four-step commission journey and direct enquiries.",
      status: "Live / EN + IT",
      cover: "/projects/animelegno.jpg",
      slug: "animelegno",
      externalUrl: "https://animelegno-progetto.vercel.app/",
    },
    {
      title: "NOVE Firenze",
      number: "04",
      year: "2026",
      category: "Retail Experience / Bespoke Jewelry",
      description:
        "An Italian–English retail demo for a made-to-measure jewelry atelier, with editorial collections, product selection and appointment-led customization.",
      status: "Demo / EN + IT",
      cover: "/projects/nove-firenze.jpg",
      slug: "nove-firenze",
      externalUrl: "https://privato-sito.vercel.app/",
    },
  ] satisfies Project[],
  aboutStatement:
    "I never planned to build software. I studied logistics in Guilin, moved to Florence for a master's in communication, and somewhere between the two I started shipping small tools instead of waiting to feel qualified.",
  story: [
    {
      index: "01",
      title: "Systems",
      meta: "Guilin, 2020—24",
      short: "Logistics taught me to see systems before screens.",
      body:
        "Four years of routes, constraints and dependencies rewired how I think. I still break every product down into flows and bottlenecks before I open an editor. The subject changed; the instinct to map the whole system did not.",
    },
    {
      index: "02",
      title: "Language",
      meta: "Florence, 2025—",
      short: "Florence made language part of the problem, not decoration.",
      body:
        "Studying communication across languages and cultures put expression, context and everyday friction at the center of my decisions. What is actually worth building usually hides in the gap between what people mean and what a screen lets them say.",
    },
    {
      index: "03",
      title: "Building with AI",
      meta: "Ongoing",
      short: "AI turned curiosity into something I could ship the same week.",
      body:
        "I work in a vibe-coding loop: notice a friction, prototype it in a day, put it in front of real people, keep what survives. AI closed the distance between having an idea and holding a working version of it.",
    },
  ],
  writing: [
    {
      index: "01",
      slug: "ship-without-permission",
      title: "You don't need permission to ship",
      date: "2026 · 06",
      tag: "Craft",
      readingTime: "4 min",
      excerpt:
        "I spent a year waiting to feel like a real developer. Shipping dimmi to five friends taught me more than that whole year of waiting.",
      body: [
        "For most of a year I told myself I wasn't ready. I hadn't finished the right courses, I couldn't reverse a linked list on a whiteboard, and every time I opened someone else's codebase it felt like proof that I didn't belong. So I kept preparing. Preparing is a comfortable way to avoid being judged.",
        "Then I built dimmi in a weekend and sent it to five friends studying in Italy. Within a day I had bug reports, feature requests, and one message that just said \"finally.\" None of them asked where I studied. They asked whether the translation kept the tone of the original sentence.",
        "That was the whole lesson. The market for a working tool is real people with a real problem, and they do not grade your résumé. They open the thing, use it, and tell you what's broken. That feedback is worth more than any credential because it is about the work, not about me.",
        "I still don't feel like a \"real\" developer, whatever that is. I've just stopped letting the feeling decide what I'm allowed to make. Ship first. The permission you're waiting for is something you hand yourself.",
      ],
    },
    {
      index: "02",
      slug: "reading-a-city",
      title: "Reading a city like a supply chain",
      date: "2026 · 05",
      tag: "Notes",
      readingTime: "6 min",
      excerpt:
        "Moving to Florence, I kept catching myself mapping bus lines, queues and rent like logistics networks. Old training doesn't leave; it just changes what it points at.",
      body: [
        "I studied logistics for four years in Guilin. I thought I was leaving that behind when I moved to Florence for communication. Instead I found myself doing the same thing to a new city: tracing where things flow, where they get stuck, and who pays for the friction.",
        "The bus from my apartment is a supply chain. So is the queue at the questura, the way rent listings move faster in group chats than on official sites, the informal network of students passing furniture down each year. Once you've learned to see a system as inputs, constraints and bottlenecks, you can't switch it off.",
        "That turned out to be the useful part of my background — not the specific models, but the instinct to ask what the whole system is doing before I touch any single part of it. When I build a product now, I map the flow first: where does a person enter, where do they hesitate, where do they give up.",
        "Old training doesn't disappear. It just changes what it points at. Mine used to point at warehouses. Now it points at screens.",
      ],
    },
    {
      index: "03",
      slug: "translation-is-a-product-problem",
      title: "Translation is a product problem",
      date: "2026 · 03",
      tag: "Language",
      readingTime: "5 min",
      excerpt:
        "A dictionary gives you the word. It rarely gives you the moment. Notes on why I built a translator that keeps the context around the text.",
      body: [
        "Living between Chinese, Italian and English, I translate something almost every hour. And almost every tool I used gave me the same thing: a word, stripped of the situation it came from. Correct, and useless.",
        "The problem was never the dictionary. It was that meaning lives in context — who is speaking, how formal the moment is, what came just before. A word that's perfect in a lecture is wrong in a message to a friend. Existing tools threw all of that away and handed back a single \"right\" answer.",
        "So dimmi keeps the context. It reads what you selected together with what surrounds it, and returns not just a translation but usage notes and the register the phrase belongs to. It treats translation as a communication problem, which is what my degree keeps insisting it is.",
        "Framing it as a product problem instead of a language problem changed everything about how I built it. The question stopped being \"what does this word mean\" and became \"what does this person need to say, and to whom.\"",
      ],
    },
    {
      index: "04",
      slug: "one-tool-a-week",
      title: "One small tool a week",
      date: "2026 · 02",
      tag: "Process",
      readingTime: "3 min",
      excerpt:
        "My whole workflow in one rule: ship something openable every week, however rough. The constraint does more for me than any roadmap.",
      body: [
        "I don't keep a roadmap. I keep one rule: every week, ship something a person can open. It can be ugly, it can do one thing, it can quietly disappear next week. It just has to be real and usable by someone who isn't me.",
        "The constraint does the work a roadmap pretends to do. A week is too short to over-design and too long to skip. It forces me to cut scope until there's a core worth shipping, and it turns \"someday\" ideas into things I've actually held.",
        "Most of these tools are small and most of them don't survive. That's fine — the ones that do earned it by being used. The weekly rhythm means I'm always closer to a real user than to my own imagination.",
        "Vibe coding makes this possible. The distance between noticing a friction and having a rough working version has collapsed to a day or two. So the only discipline left to keep is the shipping.",
      ],
    },
  ],
} as const;

export type SiteData = typeof site;
