import { test } from "node:test";
import assert from "node:assert/strict";
import { EMOJI, EMOJI_CATEGORIES, emojiOf, initials, searchEmoji } from "../src/lib/emoji.ts";

const first = (query) => searchEmoji(query)[0]?.emoji;

test("every category holds sixteen distinct emoji with Korean and English keywords", () => {
  const all = EMOJI_CATEGORIES.flatMap((category) => EMOJI[category]);
  for (const category of EMOJI_CATEGORIES) assert.equal(EMOJI[category].length, 16, category);
  assert.equal(new Set(all.map((item) => item.emoji)).size, all.length);
  for (const item of all) assert.ok(item.ko.length > 0 && item.en.length > 0, item.emoji);
});

test("search matches Korean, English and Korean initial consonants", () => {
  assert.equal(first("좋아요"), "👍");
  assert.equal(first("Thumbs"), "👍");
  assert.equal(first("ㅊㅎ"), "🎉");
  assert.equal(first("로켓"), "🚀");
});

test("prefix matches rank before substring matches", () => {
  const found = searchEmoji("art").map((item) => item.emoji);
  assert.equal(found[0], "🎨");
  assert.ok(found.includes("❤️"));
});

test("blank and unknown queries find nothing", () => {
  assert.deepEqual(searchEmoji("  "), []);
  assert.deepEqual(searchEmoji("zzzz"), []);
});

test("an emoji outside the set keeps its character with no keywords", () => {
  assert.deepEqual(emojiOf("🦖"), { emoji: "🦖", ko: [], en: [] });
  assert.equal(emojiOf("✅").ko[0], "완료");
});

test("initials turn Hangul syllables into their first consonants", () => {
  assert.equal(initials("축하 Party"), "ㅊㅎ party");
});

test("names keep their spaces so screen readers read whole phrases", () => {
  assert.equal(emojiOf("👍").en[0], "thumbs up");
  assert.equal(emojiOf("👀").ko[1], "확인 중");
  assert.equal(first("thumbs d"), "👎");
});
