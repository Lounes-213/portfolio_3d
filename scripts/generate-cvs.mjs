import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const cvEnglishHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 28px 36px; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.35; font-size: 9.5pt; }
    .header { margin-bottom: 12px; }
    .name { font-size: 20pt; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; }
    .title { font-size: 11pt; font-weight: 700; color: #334155; margin-top: 1px; }
    .contact { font-size: 8.5pt; color: #64748b; margin-top: 3px; }
    .divider { border-bottom: 2px solid #1e3a8a; margin-top: 6px; margin-bottom: 12px; }
    .section-title { font-size: 9.5pt; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-top: 10px; margin-bottom: 6px; }
    .summary { font-size: 9pt; color: #334155; line-height: 1.4; text-align: justify; }
    .skills-table { width: 100%; border-collapse: collapse; font-size: 8.8pt; }
    .skills-table td { padding: 1.5px 0; vertical-align: top; }
    .skills-table td.label { font-weight: 700; color: #1e293b; width: 110px; }
    .skills-table td.val { color: #334155; }
    .job { margin-bottom: 6px; }
    .job-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 9.2pt; color: #0f172a; }
    .job-sub { font-size: 8.5pt; color: #64748b; font-style: italic; margin-bottom: 2px; }
    ul { list-style-type: disc; margin-left: 16px; font-size: 8.8pt; color: #334155; }
    li { margin-bottom: 1.5px; }
    .project { margin-bottom: 5px; }
    .project-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 9pt; color: #0f172a; }
    .project-tech { font-size: 8.5pt; color: #64748b; font-weight: normal; }
    .project-desc { font-size: 8.5pt; color: #475569; }
    .edu-item { display: flex; justify-content: space-between; font-size: 8.8pt; margin-bottom: 2.5px; }
    .edu-title { font-weight: 700; color: #0f172a; }
    .edu-inst { color: #64748b; font-weight: normal; }
    .edu-date { font-weight: 600; color: #475569; font-size: 8.5pt; }
    .languages { font-size: 8.8pt; color: #334155; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">LOUNES BENSEBA</div>
    <div class="title">Full-Stack &amp; Mobile Developer</div>
    <div class="contact">Tizi Ouzou, Algeria &nbsp;|&nbsp; +213 82 53 54 27 &nbsp;|&nbsp; bensebalounes7@gmail.com</div>
    <div class="contact">Portfolio: benseba-lounes.vercel.app &nbsp;|&nbsp; GitHub: github.com/Lounes-213 &nbsp;|&nbsp; LinkedIn: linkedin.com/in/lounes-benseba</div>
  </div>
  <div class="divider"></div>

  <div class="section-title">Professional Summary</div>
  <div class="summary">
    Full-stack and mobile developer with 2+ years of hands-on experience building and delivering complete mobile and web products for real clients. Combines a Computer Science and Bioinformatics background with a focus on clean, reliable and user-friendly applications.
  </div>

  <div class="section-title">Technical Skills</div>
  <table class="skills-table">
    <tr><td class="label">Mobile</td><td class="val">Flutter, Dart, Riverpod, Bloc, Provider</td></tr>
    <tr><td class="label">Frontend</td><td class="val">React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS</td></tr>
    <tr><td class="label">Backend &amp; APIs</td><td class="val">Node.js, FastAPI, REST APIs, WebSockets</td></tr>
    <tr><td class="label">Databases</td><td class="val">PostgreSQL, MySQL, MongoDB, Cloud Firestore, Firebase Realtime Database, Cloudflare D1</td></tr>
    <tr><td class="label">Cloud &amp; DevOps</td><td class="val">Firebase Auth, Supabase, Cloudflare Workers &amp; R2, Docker, Git, GitHub</td></tr>
    <tr><td class="label">Languages</td><td class="val">Dart, JavaScript, TypeScript, Python, Java, R</td></tr>
    <tr><td class="label">AI &amp; Data</td><td class="val">TensorFlow, Keras, OpenCV, Pandas, Streamlit, Plotly</td></tr>
    <tr><td class="label">AI Dev Tools</td><td class="val">Claude Code, OpenAI Codex, GitHub Copilot, Google Antigravity, OpenCode</td></tr>
  </table>

  <div class="section-title">Professional Experience</div>
  <div class="job">
    <div class="job-header">
      <span>Freelance Full-Stack &amp; Mobile Developer</span>
      <span>Jun 2024 – Present</span>
    </div>
    <div class="job-sub">Self-employed | Remote</div>
    <ul>
      <li>Built and delivered cross-platform mobile apps and responsive web apps for clients.</li>
      <li>Developed cloud backends: authentication, file storage, notifications and admin dashboards.</li>
      <li>Implemented real-time features and QR-based check-in flows in production apps.</li>
      <li>Kept codebases clean and maintainable with structured state management.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-header">
      <span>Software Development Intern</span>
      <span>Jan 2024 – Jun 2024</span>
    </div>
    <div class="job-sub">EURL Matrix Software Development | Algiers</div>
    <ul>
      <li>Contributed to an Android parcel-delivery application.</li>
      <li>Developed logistics management and route-optimisation features.</li>
    </ul>
  </div>

  <div class="section-title">Selected Projects</div>
  <div class="project">
    <div class="project-header"><span>KAMIR GYM – Gym Management App</span><span class="project-tech">Flutter, Firebase</span></div>
    <div class="project-desc">QR check-ins, progress tracking, notifications, in-app store and admin dashboard.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Golden Goal – Football App</span><span class="project-tech">Flutter</span></div>
    <div class="project-desc">Live scores, timelines, league tables and video highlights.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Meshaal El Chabab – Community Platform</span><span class="project-tech">Web, WebSockets</span></div>
    <div class="project-desc">Events, sign-ups, news, galleries and real-time updates.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Maktabat Al-I'tissam – Digital Library</span><span class="project-tech">Mobile</span></div>
    <div class="project-desc">Educational resources by category; launched with a student-community campaign.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Cooper's Restaurant – Digital Menu</span><span class="project-tech">HTML, CSS, JavaScript</span></div>
    <div class="project-desc">Mobile-friendly menu with search and interactive food previews.</div>
  </div>

  <div class="section-title">Education</div>
  <div class="edu-item">
    <span class="edu-title">Master's Degree in Bioinformatics <span class="edu-inst">| USTHB, Algiers</span></span>
    <span class="edu-date">2024 – 2026</span>
  </div>
  <div class="edu-item">
    <span class="edu-title">Bachelor's Degree in Computer Science <span class="edu-inst">| USTHB, Algiers</span></span>
    <span class="edu-date">2020 – 2024</span>
  </div>
  <div class="edu-item">
    <span class="edu-title">Baccalaureate <span class="edu-inst">| Oudiai Mohamed High School, Tizi Ouzou</span></span>
    <span class="edu-date">2017 – 2020</span>
  </div>

  <div class="section-title">Languages</div>
  <div class="languages">
    Arabic – Native &nbsp;|&nbsp; French – B2 &nbsp;|&nbsp; English – B2
  </div>
</body>
</html>`;

const cvFrenchHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 28px 36px; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.35; font-size: 9.5pt; }
    .header { margin-bottom: 12px; }
    .name { font-size: 20pt; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; }
    .title { font-size: 11pt; font-weight: 700; color: #334155; margin-top: 1px; }
    .contact { font-size: 8.5pt; color: #64748b; margin-top: 3px; }
    .divider { border-bottom: 2px solid #1e3a8a; margin-top: 6px; margin-bottom: 12px; }
    .section-title { font-size: 9.5pt; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-top: 10px; margin-bottom: 6px; }
    .summary { font-size: 9pt; color: #334155; line-height: 1.4; text-align: justify; }
    .skills-table { width: 100%; border-collapse: collapse; font-size: 8.8pt; }
    .skills-table td { padding: 1.5px 0; vertical-align: top; }
    .skills-table td.label { font-weight: 700; color: #1e293b; width: 125px; }
    .skills-table td.val { color: #334155; }
    .job { margin-bottom: 6px; }
    .job-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 9.2pt; color: #0f172a; }
    .job-sub { font-size: 8.5pt; color: #64748b; font-style: italic; margin-bottom: 2px; }
    ul { list-style-type: disc; margin-left: 16px; font-size: 8.8pt; color: #334155; }
    li { margin-bottom: 1.5px; }
    .project { margin-bottom: 5px; }
    .project-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 9pt; color: #0f172a; }
    .project-tech { font-size: 8.5pt; color: #64748b; font-weight: normal; }
    .project-desc { font-size: 8.5pt; color: #475569; }
    .edu-item { display: flex; justify-content: space-between; font-size: 8.8pt; margin-bottom: 2.5px; }
    .edu-title { font-weight: 700; color: #0f172a; }
    .edu-inst { color: #64748b; font-weight: normal; }
    .edu-date { font-weight: 600; color: #475569; font-size: 8.5pt; }
    .languages { font-size: 8.8pt; color: #334155; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">LOUNES BENSEBA</div>
    <div class="title">Développeur Full-Stack &amp; Mobile</div>
    <div class="contact">Tizi Ouzou, Algérie &nbsp;|&nbsp; +213 82 53 54 27 &nbsp;|&nbsp; bensebalounes7@gmail.com</div>
    <div class="contact">Portfolio: benseba-lounes.vercel.app &nbsp;|&nbsp; GitHub: github.com/Lounes-213 &nbsp;|&nbsp; LinkedIn: linkedin.com/in/lounes-benseba</div>
  </div>
  <div class="divider"></div>

  <div class="section-title">Profil Professionnel</div>
  <div class="summary">
    Développeur full-stack et mobile avec plus de 2 ans d'expérience dans la conception et la livraison de produits mobiles et web complets pour de vrais clients. Allie une formation en informatique et en bioinformatique à un souci d'applications propres, fiables et agréables à utiliser.
  </div>

  <div class="section-title">Compétences Techniques</div>
  <table class="skills-table">
    <tr><td class="label">Mobile</td><td class="val">Flutter, Dart, Riverpod, Bloc, Provider</td></tr>
    <tr><td class="label">Frontend</td><td class="val">React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS</td></tr>
    <tr><td class="label">Backend &amp; API</td><td class="val">Node.js, FastAPI, REST APIs, WebSockets</td></tr>
    <tr><td class="label">Bases de données</td><td class="val">PostgreSQL, MySQL, MongoDB, Cloud Firestore, Firebase Realtime Database, Cloudflare D1</td></tr>
    <tr><td class="label">Cloud &amp; DevOps</td><td class="val">Firebase Auth, Supabase, Cloudflare Workers &amp; R2, Docker, Git, GitHub</td></tr>
    <tr><td class="label">Langages</td><td class="val">Dart, JavaScript, TypeScript, Python, Java, R</td></tr>
    <tr><td class="label">IA &amp; Données</td><td class="val">TensorFlow, Keras, OpenCV, Pandas, Streamlit, Plotly</td></tr>
    <tr><td class="label">Outils IA</td><td class="val">Claude Code, OpenAI Codex, GitHub Copilot, Google Antigravity, OpenCode</td></tr>
  </table>

  <div class="section-title">Expérience Professionnelle</div>
  <div class="job">
    <div class="job-header">
      <span>Développeur Full-Stack &amp; Mobile freelance</span>
      <span>Juin 2024 – Présent</span>
    </div>
    <div class="job-sub">Indépendant | À distance</div>
    <ul>
      <li>Conception et livraison d'applications mobiles multiplateformes et d'applications web responsive pour des clients.</li>
      <li>Développement de backends cloud : authentification, stockage de fichiers, notifications et tableaux de bord d'administration.</li>
      <li>Mise en place de fonctionnalités temps réel et de check-in par QR code dans des applications en production.</li>
      <li>Code propre et maintenable grâce à une gestion d'état structurée.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-header">
      <span>Stagiaire en développement logiciel</span>
      <span>Janv. 2024 – Juin 2024</span>
    </div>
    <div class="job-sub">EURL Matrix Software Development | Alger</div>
    <ul>
      <li>Contribution à une application Android de livraison de colis.</li>
      <li>Développement de fonctionnalités de gestion logistique et d'optimisation d'itinéraires.</li>
    </ul>
  </div>

  <div class="section-title">Projets Sélectionnés</div>
  <div class="project">
    <div class="project-header"><span>KAMIR GYM – Application de gestion de salle de sport</span><span class="project-tech">Flutter, Firebase</span></div>
    <div class="project-desc">Check-in par QR code, suivi de progression, notifications, boutique intégrée et tableau de bord admin.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Golden Goal – Application de football</span><span class="project-tech">Flutter</span></div>
    <div class="project-desc">Scores en direct, chronologie des matchs, classements et résumés vidéo.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Meshaal El Chabab – Plateforme communautaire</span><span class="project-tech">Web, WebSockets</span></div>
    <div class="project-desc">Événements, inscriptions, actualités, galeries et mises à jour en temps réel.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Maktabat Al-I'tissam – Bibliothèque numérique</span><span class="project-tech">Mobile</span></div>
    <div class="project-desc">Ressources éducatives par catégorie ; lancée avec une campagne auprès de la communauté étudiante.</div>
  </div>
  <div class="project">
    <div class="project-header"><span>Cooper's Restaurant – Menu numérique</span><span class="project-tech">HTML, CSS, JavaScript</span></div>
    <div class="project-desc">Menu adapté au mobile avec recherche et aperçus interactifs des plats.</div>
  </div>

  <div class="section-title">Formation</div>
  <div class="edu-item">
    <span class="edu-title">Master en Bioinformatique <span class="edu-inst">| USTHB, Alger</span></span>
    <span class="edu-date">2024 – 2026</span>
  </div>
  <div class="edu-item">
    <span class="edu-title">Licence en Informatique <span class="edu-inst">| USTHB, Alger</span></span>
    <span class="edu-date">2020 – 2024</span>
  </div>
  <div class="edu-item">
    <span class="edu-title">Baccalauréat <span class="edu-inst">| Lycée Oudiai Mohamed, Tizi Ouzou</span></span>
    <span class="edu-date">2017 – 2020</span>
  </div>

  <div class="section-title">Langues</div>
  <div class="languages">
    Arabe – Langue maternelle &nbsp;|&nbsp; Français – B2 &nbsp;|&nbsp; Anglais – B2
  </div>
</body>
</html>`;

async function generate() {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage();

  // 1. English CV
  await page.setContent(cvEnglishHtml, { waitUntil: "networkidle" });
  await page.pdf({
    path: path.join("public", "cv-lounes-benseba-en.pdf"),
    format: "A4",
    printBackground: true,
  });
  console.log("Generated public/cv-lounes-benseba-en.pdf");

  // 2. French CV
  await page.setContent(cvFrenchHtml, { waitUntil: "networkidle" });
  await page.pdf({
    path: path.join("public", "cv-lounes-benseba-fr.pdf"),
    format: "A4",
    printBackground: true,
  });
  console.log("Generated public/cv-lounes-benseba-fr.pdf");

  // 3. Fallback default
  fs.copyFileSync(
    path.join("public", "cv-lounes-benseba-en.pdf"),
    path.join("public", "cv-lounes-benseba.pdf"),
  );
  console.log("Updated public/cv-lounes-benseba.pdf");

  await browser.close();
}

generate().catch(console.error);
