// Unit tests for the route validators. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLayer, parseRegion, parseTileCoords } from "../src/utils/validate.js";

test("parseLayer accepts known layers", () => {
  assert.equal(parseLayer("transect"), "transect");
});

test("parseLayer rejects unknown layers", () => {
  assert.throws(() => parseLayer("drop-table"), /unknown layer/);
});

test("parseRegion normalizes empty to null", () => {
  assert.equal(parseRegion(""), null);
  assert.equal(parseRegion("sindh"), "sindh");
  assert.throws(() => parseRegion("mars"), /unknown region/);
});

test("parseTileCoords bounds check", () => {
  assert.deepEqual(parseTileCoords("2", "1", "1"), { z: 2, x: 1, y: 1 });
  assert.throws(() => parseTileCoords("2", "9", "1"), /out of range/);
});
