import { z } from "zod";
import { localizedText, parseContent } from "./schema";

export const reelProjectSchema = z.object({
  id: z.string().trim().min(1),
  title: localizedText,
  category: localizedText,
  description: localizedText,
  languages: z.array(z.string().trim().min(1)),
  tags: z.array(z.string().trim().min(1)),
  videoSrc: z.string().trim().min(1),
  posterSrc: z.string().trim().min(1),
  instagramUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export type ReelProject = z.infer<typeof reelProjectSchema>;

const reelsSchema = z.array(reelProjectSchema).min(1);

export const reels = parseContent(
  reelsSchema,
  [
    {
      id: "lstop",
      title: {
        en: "LStop · Transit & Minivans",
        fr: "LStop · Transport & Fourgons",
        ar: "LStop · تتبع النقل الجماعي والفرغونات",
      },
      category: {
        en: "Mobile App · Live Transit & Fleet Tracking",
        fr: "Application Mobile · Transport Collectif & Géolocalisation",
        ar: "تطبيق موبايل · النقل الجماعي والتتبع اللحظي",
      },
      description: {
        en: "Live collective transport & fleet tracking across Algerian lines. Passengers track driver positions in real time with traffic-aware route ETA, line filters, and a dedicated 1-click driver console (LStop.c).",
        fr: "Suivi en direct des transports collectifs et fourgons en Algérie. Élimine l'attente aux arrêts grâce à la géolocalisation continue, le calcul d'itinéraire routier précis et une console chauffeur dédiée (LStop.c).",
        ar: "تطبيق لتتبع حافلات وسيارات النقل الجماعي والفرغونات في الجزائر لحظياً. يقضي على انتظار الركاب عبر رصد مسار السائق وحساب دقيق لوقت الوصول مع لوحة تحكم فورية للسائقين (LStop.c).",
      },
      languages: ["Flutter", "Dart", "OpenStreetMap", "WebSockets"],
      tags: [
        "Mobile",
        "GPS Tracking",
        "Real-Time ETA",
        "Fleet Routing",
        "Driver Console",
      ],
      videoSrc: "/videos/projects/lstop.mp4",
      posterSrc: "/videos/projects/lstop.jpg",
      linkedinUrl:
        "https://www.linkedin.com/posts/lounes-benseba-a07549393_flutter-mobileapp-algeria-activity-7525304504443879424-KS23",
      featured: true,
    },
    {
      id: "azar-negh",
      title: {
        en: "Aẓar Neɣ · Algerian Marketplace",
        fr: "Aẓar Neɣ · Marketplace Algérie",
        ar: "أظار نغ · منصة التجارة والإعلانات",
      },
      category: {
        en: "Web Platform · E-Commerce & Classifieds",
        fr: "Plateforme Web · E-Commerce & Petites Annonces",
        ar: "منصة ويب · تجارة إلكترونية وإعلانات مبوبة",
      },
      description: {
        en: "Modern Algerian marketplace and classifieds platform engineered with React and Next.js. Features multimodal search (image upload + voice input), multilingual support, and real price verification.",
        fr: "Plateforme moderne de commerce et d'annonces en Algérie conçue avec Next.js et React. Intègre recherche visuelle par photo, reconnaissance vocale, support multilingue et système de vérification des prix réels.",
        ar: "منصة تجارة وإعلانات مبوبة متطورة في الجزائر مبنية بـ Next.js و React. تتيح البحث بالصور والأوامر الصوتية، دعم لغات متعددة، ونظام للتحقق الصارم من صحة الأسعار.",
      },
      languages: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "PostgreSQL",
      ],
      tags: [
        "Web",
        "Marketplace",
        "Visual Search",
        "Voice Commands",
        "Algeria",
      ],
      videoSrc: "/videos/projects/azar-negh.mp4",
      posterSrc: "/videos/projects/azar-negh.jpg",
      linkedinUrl:
        "https://www.linkedin.com/posts/lounes-benseba-a07549393_reactjs-nextjs-webdevelopment-activity-7517779887089332224-oTVk",
      featured: true,
    },
    {
      id: "reel-1",
      title: {
        en: "Maktabat Al-I'tissam",
        fr: "Bibliothèque El-I'tissam",
        ar: "مكتبة الإعتصام",
      },
      category: {
        en: "Mobile App · Education & Books",
        fr: "Application Mobile · Éducation & Lecture",
        ar: "تطبيق موبايل · تعليم وقراءة",
      },
      description: {
        en: "A digital gateway and educational reading platform featuring fluid book browsing and offline-first catalog caching.",
        fr: "Portail numérique et plateforme de lecture éducative moderne avec consultation hors ligne et animations fluides.",
        ar: "بوابة رقمية ومنصة قراءة تعليمية حديثة مع دعم التصفح بدون إنترنت وانسيابية عالية.",
      },
      languages: ["Flutter", "Dart"],
      tags: ["Mobile", "E-Learning", "UI/UX", "Offline-First"],
      videoSrc: "/videos/reels/reel-1.mp4",
      posterSrc: "/videos/reels/reel-1.jpg",
      instagramUrl: "https://www.instagram.com/reel/DYKh5Sqsq-D/",
      featured: false,
    },
    {
      id: "reel-2",
      title: {
        en: "Golden Goal",
        fr: "Golden Goal",
        ar: "غولدن غول (Golden Goal)",
      },
      category: {
        en: "Mobile App · Sports & Football",
        fr: "Application Mobile · Football & Sport",
        ar: "تطبيق موبايل · رياضة وكرة قدم",
      },
      description: {
        en: "Full-featured football match tracker and live scores management application engineered with dynamic real-time updates.",
        fr: "Application mobile de suivi de matchs et scores en temps réel avec interface sombre dynamique.",
        ar: "تطبيق موبايل لمتابعة المباريات، النتائج الحية وإدارة البطولات الرياضية بواجهة عصرية.",
      },
      languages: ["Flutter", "Dart"],
      tags: ["Mobile", "Sports Tech", "Live Scores", "Dark Theme"],
      videoSrc: "/videos/reels/reel-2.mp4",
      posterSrc: "/videos/reels/reel-2.jpg",
      instagramUrl: "https://www.instagram.com/reel/DdZVdfpg3A3/",
      featured: false,
    },
    {
      id: "reel-3",
      title: {
        en: "Kamir Gym",
        fr: "Kamir Gym Club",
        ar: "كامير جيم (Kamir Gym)",
      },
      category: {
        en: "Mobile App · Fitness & Wellness",
        fr: "Application Mobile · Salle de Sport & Fitness",
        ar: "تطبيق موبايل · نادي لياقة بدنية",
      },
      description: {
        en: "Mobile fitness companion application featuring workout schedules, member passes, and QR code access control.",
        fr: "Application mobile pour salle de sport : gestion des abonnements, planning, séances et contrôle d'accès par QR code.",
        ar: "تطبيق متطور لنادي رياضي لإدارة الاشتراكات، جداول التمارين والحجوزات الرياضية والتحقق برمز QR.",
      },
      languages: ["Flutter", "Dart"],
      tags: ["Mobile", "Fitness", "Memberships", "QR Check-in"],
      videoSrc: "/videos/reels/reel-3.mp4",
      posterSrc: "/videos/reels/reel-3.jpg",
      instagramUrl: "https://www.instagram.com/reel/DalqMdjAV1V/",
      featured: false,
    },
    {
      id: "reel-4",
      title: {
        en: "CUBE 3 App (Bab Ezzouar)",
        fr: "Application CUBE 3 (Bab Ezzouar 3)",
        ar: "تطبيق CUBE 3 (إقامة باب الزوار 3)",
      },
      category: {
        en: "Campus Management & Student Services",
        fr: "Gestion de Campus & Services Étudiants",
        ar: "تطبيق الحرم والخدمات الجامعية",
      },
      description: {
        en: "Campus utility application for Bab Ezzouar 3 university residence with automated resident verification and services.",
        fr: "Application de gestion et de services pour les résidents du campus universitaire Bab Ezzouar 3.",
        ar: "تطبيق لإدارة الخدمات الطلابية بالإقامة الجامعية باب الزوار 3 مع تحقق آلي للطلبة المقيمين.",
      },
      languages: ["Flutter", "Dart"],
      tags: ["Mobile", "Campus Tech", "Student Portal", "Auth"],
      videoSrc: "/videos/reels/reel-4.mp4",
      posterSrc: "/videos/reels/reel-4.jpg",
      instagramUrl: "https://www.instagram.com/reel/DdwbGVtABHQ/",
      featured: false,
    },
    {
      id: "reel-5",
      title: {
        en: "Ascent Club (نادي رفعة)",
        fr: "Ascent Club (نادي رفعة)",
        ar: "نادي رفعة العلمي والثقافي",
      },
      category: {
        en: "Web Platform · Club & Community",
        fr: "Plateforme Web · Club Scientifique & Culturel",
        ar: "منصة ويب · نادي علمي وثقافي",
      },
      description: {
        en: "Digital hub for club activities, technical workshops, scientific conferences, and structured member onboarding.",
        fr: "Plateforme communautaire pour la gestion d'ateliers techniques, conférences scientifiques et inscriptions.",
        ar: "منصة رقمية للأنشطة والورش العلمية والثقافية والمحاضرات وانضمام الأعضاء.",
      },
      languages: ["Next.js", "TypeScript", "Tailwind CSS"],
      tags: ["Web", "Community", "Workshops", "Responsive"],
      videoSrc: "/videos/reels/reel-5.mp4",
      posterSrc: "/videos/reels/reel-5.jpg",
      instagramUrl: "https://www.instagram.com/reel/Dd7Ygdmg2MG/",
      featured: false,
    },
    {
      id: "reel-6",
      title: {
        en: "Interactive Portfolio Showcase",
        fr: "Portfolio Interactif",
        ar: "معرض البورتفوليو التفاعلي",
      },
      category: {
        en: "Web Platform · Creative Engineering",
        fr: "Plateforme Web · Ingénierie Créative",
        ar: "منصة ويب · هندسة برمجية إبداعية",
      },
      description: {
        en: "High-performance bilingual engineer portfolio with refined motion, dark mode, and edge rendering on Cloudflare.",
        fr: "Portfolio d'ingénieur logiciel bilingue haute performance avec animations soignées, mode sombre et rendu edge.",
        ar: "بورتفوليو مهندس برمجيات عالي الأداء مع حركة انسيابية، وضع داكن وتشغيل على خوادم Edge السحابية.",
      },
      languages: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      tags: ["Web", "Portfolio", "Motion", "Edge"],
      videoSrc: "/videos/reels/reel-6.mp4",
      posterSrc: "/videos/reels/reel-6.jpg",
      instagramUrl: "https://www.instagram.com/reel/DeQIoWBM4Da/",
      featured: false,
    },
    {
      id: "reel-7",
      title: {
        en: "Volagro DZ",
        fr: "Volagro DZ",
        ar: "فولاقرو الجزائر (Volagro DZ)",
      },
      category: {
        en: "Corporate Web Platform · Agribusiness",
        fr: "Plateforme Web Entreprise · Agroalimentaire",
        ar: "منصة ويب مؤسساتية · الصناعات الغذائية",
      },
      description: {
        en: "Enterprise digital showcase for animal nutrition and livestock solutions in Algeria with structured online quotation.",
        fr: "Plateforme d'entreprise vitrine dédiée aux filières animales et nutrition en Algérie avec devis en ligne.",
        ar: "منصة ويب لشركة متخصصة في التغذية وتربية الحيوانات في الجزائر مع طلب عروض أسعار تفاعلي.",
      },
      languages: ["Next.js", "TypeScript", "Tailwind CSS"],
      tags: ["Web", "Enterprise", "Agribusiness", "Quotation"],
      videoSrc: "/videos/reels/reel-7.mp4",
      posterSrc: "/videos/reels/reel-7.jpg",
      instagramUrl: "https://www.instagram.com/reel/DeShTg0gDNx/",
      featured: false,
    },
  ],
  "src/content/reels.ts",
);
