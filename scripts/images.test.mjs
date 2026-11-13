import { test } from "node:test";
import assert from "node:assert/strict";
import { showsImage } from "../src/lib/markdown/images.ts";

const page = "http://localhost:4411/app/";
const hosts = ["localhost:4411", "img.example"];

test("showsImage loads every image when no hosts are given", () => {
  assert.equal(showsImage("https://evil.example/x.png", undefined, page), true);
});

test("showsImage loads images from listed hosts", () => {
  assert.equal(showsImage("https://img.example/x.png", hosts, page), true);
  assert.equal(showsImage("https://IMG.example/x.png", hosts, page), true);
});

test("showsImage loads same-origin images", () => {
  assert.equal(showsImage("/x.png", ["img.example"], page), true);
  assert.equal(showsImage("./x.png", ["img.example"], page), true);
});

test("showsImage links images from other hosts", () => {
  assert.equal(showsImage("https://evil.example/x.png", hosts, page), false);
  assert.equal(showsImage("https://user@evil.example/x.png", hosts, page), false);
  assert.equal(showsImage("https://img.example.evil.example/x.png", hosts, page), false);
});

test("showsImage links hosts hidden by lenient URL parsing", () => {
  assert.equal(showsImage("https:/evil.example/x.png", hosts, page), false);
  assert.equal(showsImage("https:evil.example/x.png", hosts, page), false);
  assert.equal(showsImage("https:\\\\evil.example\\x.png", hosts, page), false);
});

test("showsImage matches the port as part of the host", () => {
  assert.equal(showsImage("http://localhost:9999/x.png", hosts, page), false);
});

test("showsImage links relative images when the page URL is unknown", () => {
  assert.equal(showsImage("/x.png", hosts, undefined), false);
});
