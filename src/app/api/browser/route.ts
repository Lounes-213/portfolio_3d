import { NextRequest, NextResponse } from "next/server";

export interface BrowserSearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "Lounes Benseba Flutter Next.js").trim();

  const results: BrowserSearchResult[] = [];

  try {
    // 1. Live Wikipedia REST Search
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      q,
    )}&utf8=&format=json&srlimit=5`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { "User-Agent": "LounesPortfolioBrowser/1.0" },
    });
    if (wikiRes.ok) {
      const wikiData = (await wikiRes.json()) as {
        query?: {
          search?: Array<{ title: string; snippet: string; pageid: number }>;
        };
      };
      for (const item of wikiData.query?.search ?? []) {
        const cleanSnippet = item.snippet.replace(/<[^>]+>/g, "");
        results.push({
          title: `${item.title} — Wikipedia`,
          snippet: cleanSnippet,
          url: `https://en.m.wikipedia.org/wiki/${encodeURIComponent(
            item.title.replace(/ /g, "_"),
          )}`,
          source: "wikipedia.org",
        });
      }
    }
  } catch {
    // Ignore external network errors
  }

  try {
    // 2. Live GitHub Repositories Search if query relates to code/projects/lounes
    const ghUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      q,
    )}&per_page=3`;
    const ghRes = await fetch(ghUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "LounesPortfolioBrowser/1.0",
      },
    });
    if (ghRes.ok) {
      const ghData = (await ghRes.json()) as {
        items?: Array<{
          full_name: string;
          description: string | null;
          html_url: string;
          stargazers_count: number;
        }>;
      };
      for (const repo of ghData.items ?? []) {
        results.push({
          title: `${repo.full_name} (★ ${repo.stargazers_count})`,
          snippet: repo.description || "Open-source GitHub repository.",
          url: repo.html_url,
          source: "github.com",
        });
      }
    }
  } catch {
    // Ignore GitHub rate limits
  }

  return NextResponse.json({
    query: q,
    results,
  });
}
