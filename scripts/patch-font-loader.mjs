import { readFileSync, writeFileSync, existsSync } from "node:fs";

const loaderPath = "node_modules/next/dist/compiled/@next/font/dist/google/loader.js";

if (existsSync(loaderPath)) {
  try {
    let content = readFileSync(loaderPath, "utf8");
    const target = "const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];";
    const replacement =
      "const extMatch = /\\.(woff|woff2|eot|ttf|otf)/i.exec(googleFontFileUrl); const ext = extMatch ? extMatch[1] : 'woff2';";

    if (content.includes(target)) {
      content = content.replace(target, replacement);
      writeFileSync(loaderPath, content, "utf8");
      console.log("✓ Patched Next.js Google font loader regex");
    } else {
      console.log("• Next.js font loader already patched or different version");
    }
  } catch (err) {
    console.error("Warning: Could not patch font loader:", err.message);
  }
}
