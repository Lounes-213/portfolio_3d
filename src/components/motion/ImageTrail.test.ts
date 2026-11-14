import { describe, expect, it } from "vitest";
import { STICKER_LIST } from "../../content/stickers";

describe("Sticker Assets & Image Trail", () => {
  it("includes all custom crafted organic stickers including open-to-work, kotlin, and cloudflare", () => {
    expect(STICKER_LIST).toContain("/stickers/anti-slop.svg");
    expect(STICKER_LIST).toContain("/stickers/open-to-work-badge.svg");
    expect(STICKER_LIST).toContain("/stickers/kotlin-dev.svg");
    expect(STICKER_LIST).toContain("/stickers/cloudflare-edge.svg");
    expect(STICKER_LIST).toContain("/stickers/badge-starburst.svg");
    expect(STICKER_LIST).toContain("/stickers/bubble-talk.svg");
    expect(STICKER_LIST).toContain("/stickers/shield-hexagon.svg");
    expect(STICKER_LIST).toContain("/stickers/vliegensvlug-speed.svg");
    expect(STICKER_LIST).toContain("/stickers/flutter-architect.svg");
    expect(STICKER_LIST).toContain("/stickers/lb-seal.svg");
  });
});
