import { parseContent, skillCategorySchema } from "./schema";
import { z } from "zod";

const skillsSchema = z.array(skillCategorySchema).length(6);

export const skills = parseContent(
  skillsSchema,
  [
    {
      id: "frontend",
      label: {
        en: "Mobile & Frontend",
        fr: "Mobile & Frontend",
        ar: "تطبيقات الموبايل والواجهات",
      },
      summary: {
        en: "Cross-platform mobile applications and modern web interfaces built with Flutter, Next.js, Dart, and clean architectural principles.",
        fr: "Applications mobiles multiplateformes et interfaces web modernes conçues avec Flutter, Next.js, Dart et une architecture propre.",
        ar: "تطبيقات موبايل متعددة المنصات وواجهات ويب عصرية مبنية بـ Flutter وNext.js وDart بهندسة برمجية نظيفة.",
      },
      items: [
        {
          name: "Flutter & Dart",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "Cross-platform iOS & Android, Riverpod, BLoC, offline-first syncing.",
            fr: "Multiplateforme iOS & Android, Riverpod, BLoC, synchronisation hors ligne.",
            ar: "تطوير شامل لـ iOS وAndroid، إدارة الحالة بـ BLoC وRiverpod، والعمل دون إنترنت.",
          },
        },
        {
          name: "Kotlin & Android Native",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "Modern Android development, Jetpack Compose, Coroutines, and native platform channels.",
            fr: "Développement Android moderne, Jetpack Compose, Coroutines et canaux natifs.",
            ar: "تطوير أندرويد الأصيل بـ Kotlin، مكتبات Jetpack الحديثة، والاتصال العتادي المباشر.",
          },
        },
        {
          name: "Next.js & React",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "App Router, SSR, Server Components, and responsive web apps.",
            fr: "App Router, SSR, Server Components et applications web réactives.",
            ar: "تطبيقات الويب السريعة، العرض من الخادم SSR، ومكونات React الحديثة.",
          },
        },
        {
          name: "Android SDK & Platform Tools",
          level: 4,
          years: 2,
          highlight: true,
          note: {
            en: "Native Android development, parcel delivery logistics app, Jetpack components.",
            fr: "Développement Android natif, application logistique, composants Jetpack.",
            ar: "تطوير أندرويد الأصيل، تطبيقات الخدمات والتوصيل، ومكتبات Jetpack الحديثة.",
          },
        },
        {
          name: "HTML5, CSS3 & JavaScript",
          level: 5,
          years: 4,
          note: {
            en: "Semantic HTML, modern CSS layouts, Flexbox/Grid, and dynamic JS.",
            fr: "HTML sémantique, CSS moderne, Flexbox/Grid et JavaScript dynamique.",
            ar: "بناء صفحات الويب الدلالية، تنسيقات CSS المتقدمة، وجافاسكريبت التفاعلي.",
          },
        },
        {
          name: "TypeScript",
          level: 4,
          years: 3,
          note: {
            en: "Strict type safety, generic interfaces, and scalable contracts.",
            fr: "Typage strict, interfaces génériques et architectures robustes.",
            ar: "كتابة أكواد آمنة بأنواع بيانات دقيقة وموثوقية عالية.",
          },
        },
        {
          name: "Tailwind CSS",
          level: 5,
          years: 3,
          note: {
            en: "Custom design systems, responsive utilities, and fluid animations.",
            fr: "Systèmes de design sur mesure, utilitaires réactifs et micro-animations.",
            ar: "أنظمة تصميم مخصصة، واجهات متجاوبة، وحركات تفاعلية سلسة.",
          },
        },
      ],
    },
    {
      id: "backend",
      label: {
        en: "Backend & APIs",
        fr: "Backend & APIs",
        ar: "الخلفية البرمجية والواجهات البرمجية",
      },
      summary: {
        en: "High-performance RESTful APIs, microservices, and asynchronous services engineered for stability and low latency.",
        fr: "APIs RESTful performantes, microservices et architectures asynchrones conçus pour la stabilité et la faible latence.",
        ar: "واجهات برمجية RESTful وخدمات خلفية عالية الأداء والاستقرار مع استجابة فائقة السرعة.",
      },
      items: [
        {
          name: "Python & FastAPI",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "High-throughput asynchronous APIs, Pydantic validation, and OpenAPI documentation.",
            fr: "APIs asynchrones rapides, validation Pydantic et documentation OpenAPI.",
            ar: "واجهات برمجية غير متزامنة، التحقق التلقائي بـ Pydantic وتوثيق OpenAPI.",
          },
        },
        {
          name: "Node.js & Express",
          level: 4,
          years: 3,
          highlight: true,
          note: {
            en: "Scalable backend routes, token-based authentication (JWT), and middleware.",
            fr: "Routage backend évolutif, authentification JWT et intergiciels.",
            ar: "خوادم خلفية مرنة، مصادقة آمنة بـ JWT، وإدارة متقدمة للطلبات.",
          },
        },
        {
          name: "Java",
          level: 4,
          years: 3,
          note: {
            en: "Object-oriented design, algorithm implementation, and academic systems at USTHB.",
            fr: "Programmation orientée objet, algorithmique avancée et projets USTHB.",
            ar: "البرمجة كائنية التوجه، الخوارزميات المتقدمة، ومشاريع أكاديمية بجامعة USTHB.",
          },
        },
        {
          name: "REST APIs & JSON Contracts",
          level: 5,
          years: 4,
          note: {
            en: "Contract-first architecture, clean payloads, and robust error handling.",
            fr: "Architecture axée sur les contrats, charges utiles propres et gestion d'erreurs.",
            ar: "تصميم واجهات برمجية نظيفة بمعايير دقيقة ومعالجة شاملة للأخطاء.",
          },
        },
        {
          name: "Clean Architecture & Design Patterns",
          level: 5,
          years: 3,
          note: {
            en: "Separation of concerns, repository pattern, testable domain models.",
            fr: "Séparation des responsabilités, patron repository, modèles testables.",
            ar: "فصل المهام بطبقات نظيفة، نمط المستودع، ونماذج قابلة للاختبار.",
          },
        },
      ],
    },
    {
      id: "cloud",
      label: {
        en: "Cloud & Databases",
        fr: "Cloud & Bases de Données",
        ar: "السحابة وقواعد البيانات",
      },
      summary: {
        en: "Relational and document databases, distributed storage, and serverless cloud deployment pipelines.",
        fr: "Bases de données relationnelles et documentaires, stockage distribué et déploiements cloud serverless.",
        ar: "قواعد البيانات العلائقية والمستندية، التخزين السحابي الموزع، والنشر السحابي الفوري.",
      },
      items: [
        {
          name: "Cloudflare (Workers, Pages, D1, KV)",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "Serverless edge compute, global CDN distribution, edge KV caching, and D1 SQLite databases.",
            fr: "Calcul serverless en périphérie, distribution CDN mondiale, cache KV et bases D1.",
            ar: "تشغيل سحابي سريع على خوادم Edge، كاش موزع عالمياً، وقواعد بيانات D1 السريعة.",
          },
        },
        {
          name: "Supabase & PostgreSQL",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "Realtime subscriptions, Row-Level Security (RLS), edge functions, and Postgres schemas.",
            fr: "Souscriptions temps réel, sécurité Row-Level (RLS), edge functions et schémas Postgres.",
            ar: "مزامنة لحظية، حماية متقدمة على مستوى السطور RLS، واستعلامات علائقية قوية.",
          },
        },
        {
          name: "PostgreSQL",
          level: 4,
          years: 3,
          highlight: true,
          note: {
            en: "Complex relational queries, indexing, foreign keys, and migration scripts.",
            fr: "Requêtes relationnelles complexes, indexation et scripts de migration.",
            ar: "استعلامات علائقية متقدمة، فهرسة سريعة، وإدارة مخططات البيانات.",
          },
        },
        {
          name: "SQLite & Local Persistence",
          level: 5,
          years: 4,
          note: {
            en: "Embedded client-side caching, offline-first mobile sync, relational schema.",
            fr: "Cache local embarqué, synchronisation mobile hors ligne, schémas relationnels.",
            ar: "تخزين محلي مدمج في الهاتف، مزامنة بدون اتصال، وهيكلة علائقية سريعة.",
          },
        },
        {
          name: "Firebase (Firestore & Auth)",
          level: 5,
          years: 3,
          note: {
            en: "Real-time subscriptions, secure rule configurations, and media storage.",
            fr: "Synchronisation en temps réel, règles de sécurité et stockage média.",
            ar: "تحديثات لحظية، حماية وقواعد أمنية متينة، وتخزين ملفات وسائط.",
          },
        },
        {
          name: "Cloud Hosting & Deployments",
          level: 5,
          years: 3,
          note: {
            en: "Automated Git deployments, custom domains, HTTPS, and edge CDN distribution.",
            fr: "Déploiements Git automatisés, domaines personnalisés et distribution CDN.",
            ar: "نشر مؤتمت عبر Git، ربط النطاقات، وشهادات HTTPS، وتوزيع CDN عالمي.",
          },
        },
      ],
    },
    {
      id: "data-ai",
      label: {
        en: "Data Science & Vision",
        fr: "Data Science & Vision",
        ar: "علم البيانات والرؤية الحاسوبية",
      },
      summary: {
        en: "Computer vision pipelines, 3D WebGL interfaces, bioinformatics analytics, and numerical modeling algorithms.",
        fr: "Vision par ordinateur, interfaces 3D WebGL, analyses bioinformatiques et algorithmes de modélisation numérique.",
        ar: "خوارزميات الرؤية الحاسوبية، واجهات WebGL ثلاثية الأبعاد، تحليلات البيومعلوماتية والنمذجة العددية.",
      },
      items: [
        {
          name: "Computer Vision & MediaPipe",
          level: 4,
          years: 2,
          highlight: true,
          note: {
            en: "Real-time hand tracking, gesture estimation, OpenCV processing, and touchless spatial controls.",
            fr: "Suivi des mains en temps réel, estimation de gestes, traitement OpenCV et interfaces spatiales sans contact.",
            ar: "تتبع حركة اليدين، تمييز الإيماءات اللحظية، معالجة الصور بـ OpenCV والتفاعل المكاني بدون لمس.",
          },
        },
        {
          name: "Three.js & WebGL",
          level: 4,
          years: 2,
          highlight: true,
          note: {
            en: "3D scene composition, interactive spatial meshes, shaders, and browser-based graphics.",
            fr: "Composition de scènes 3D, maillages spatiaux interactifs, shaders et rendu WebGL.",
            ar: "بناء المشاهد ثلاثية الأبعاد، الإكساء المكاني التفاعلي، وبرمجة الرسوميات في المتصفح.",
          },
        },
        {
          name: "Pandas & NumPy",
          level: 5,
          years: 3,
          note: {
            en: "Data cleansing, transformation, numerical array computations, and statistical modeling.",
            fr: "Nettoyage de données, manipulation tabulaire et modélisation statistique.",
            ar: "تنظيف وهندسة البيانات، معالجة المصفوفات الرياضية، والتحليل الإحصائي.",
          },
        },
        {
          name: "R & Bioinformatics Tools",
          level: 4,
          years: 2,
          note: {
            en: "Statistical genomics, biological sequence alignment, and bio-databases at USTHB.",
            fr: "Statistiques génomiques, alignement de séquences biologiques et bases USTHB.",
            ar: "التحليل الإحصائي الجيني، محاذاة التسلسلات الحيوية وقواعد بيانات USTHB.",
          },
        },
        {
          name: "Plotly & Data Dashboards",
          level: 4,
          years: 2,
          note: {
            en: "Interactive scientific charts, exploratory graphics, and Streamlit data platforms.",
            fr: "Graphiques scientifiques interactifs et tableaux de bord Streamlit.",
            ar: "رسوم بيانية علمية تفاعلية، ولوحات تحكم تفاعلية مع Streamlit.",
          },
        },
        {
          name: "Applied Machine Learning",
          level: 4,
          years: 2,
          note: {
            en: "Scikit-learn, classification pipelines, feature engineering, and model validation.",
            fr: "Scikit-learn, classification, ingénierie de caractéristiques et validation croisée.",
            ar: "مكتبة Scikit-learn، نماذج التصنيف، هندسة الميزات والتحقق الإحصائي.",
          },
        },
      ],
    },
    {
      id: "devops",
      label: {
        en: "DevOps & Engineering",
        fr: "DevOps & Ingénierie",
        ar: "التشغيل وهندسة الأنظمة",
      },
      summary: {
        en: "Repeatable builds, containerization, automated testing workflows, and reliable delivery practices.",
        fr: "Builds reproductibles, conteneurisation, tests automatisés et pratiques de livraison fiables.",
        ar: "بيئات بناء موثوقة، هندسة الحاويات، أتمتة الاختبارات وممارسات التسليم المستمر.",
      },
      items: [
        {
          name: "Git & GitHub",
          level: 5,
          years: 4,
          highlight: true,
          note: {
            en: "Branching strategies, collaborative workflows, PR reviews, version control.",
            fr: "Stratégies de branches, revues de code et contrôle de version rigoureux.",
            ar: "إدارة الفروع، المراجعات البرمجية، والتحكم الاحترافي بنسخ الكود.",
          },
        },
        {
          name: "Docker & Containerization",
          level: 4,
          years: 2,
          highlight: true,
          note: {
            en: "Dockerfile creation, container isolation, environment consistency.",
            fr: "Création de Dockerfile, isolation de conteneurs, environnements cohérents.",
            ar: "إنشاء ملفات Dockerfile، عزل التطبيقات، وتطابق بيئات التطوير والتشغيل.",
          },
        },
        {
          name: "CI/CD & GitHub Actions",
          level: 4,
          years: 2,
          note: {
            en: "Automated build checks, linting, tests, and preview releases.",
            fr: "Vérifications de build automatisées, linters et déploiements continus.",
            ar: "أتمتة الفحص البرمجي والاختبارات والنشر التلقائي للنسخ.",
          },
        },
        {
          name: "Linux & Bash Scripting",
          level: 4,
          years: 3,
          note: {
            en: "Command line proficiency, server administration, automated shell tasks.",
            fr: "Maîtrise du terminal, administration serveur et scripts d'automatisation.",
            ar: "التعامل المتقدم مع أنظمة لينكس، أوامر الطرفية، وسكربتات الأتمتة.",
          },
        },
      ],
    },
    {
      id: "tools",
      label: {
        en: "Design & Tools",
        fr: "Design & Outils",
        ar: "التصميم والأدوات",
      },
      summary: {
        en: "Modern developer tooling, accessible UI/UX prototyping, mobile emulators, and API debugging.",
        fr: "Outils de développement modernes, prototypage UI/UX accessible et débogage d'APIs.",
        ar: "أدوات التطوير الحديثة، النماذج التفاعلية لتجربة المستخدم، واختبار الواجهات البرمجية.",
      },
      items: [
        {
          name: "Figma (UI/UX Prototyping)",
          level: 4,
          years: 3,
          highlight: true,
          note: {
            en: "Component libraries, accessible wireframes, micro-interaction mockups.",
            fr: "Bibliothèques de composants, maquettage interactif et accessibilité.",
            ar: "مكتبات المكونات، نماذج الواجهات التفاعلية، ومراعاة سهولة الاستخدام.",
          },
        },
        {
          name: "Android Studio & Flutter DevTools",
          level: 5,
          years: 3,
          highlight: true,
          note: {
            en: "Profiling, memory leak detection, widget inspection, and release signing.",
            fr: "Profilage, analyse mémoire, inspection de widgets et signature de releases.",
            ar: "تحليل الأداء والذاكرة، فحص المكونات، وبناء الحزم للإنتاج.",
          },
        },
        {
          name: "Postman & API Testing",
          level: 5,
          years: 3,
          note: {
            en: "Endpoint debugging, environment variables, authentication flow verification.",
            fr: "Débogage d'endpoints, variables d'environnement et tests d'auth.",
            ar: "فحص المسارات البرمجية، متغيرات البيئة، واختبار مسارات المصادقة.",
          },
        },
        {
          name: "VS Code & JetBrains IDEs",
          level: 5,
          years: 4,
          note: {
            en: "Custom extensions, shortcuts, debugging sessions, and productivity setup.",
            fr: "Extensions sur mesure, raccourcis et sessions de débogage avancées.",
            ar: "بيئات العمل المتطورة، اختصارات الإنتاجية، وجلسات التنقيح الدقيقة.",
          },
        },
      ],
    },
  ],
  "src/content/skills.ts",
);

export type Skills = typeof skills;
