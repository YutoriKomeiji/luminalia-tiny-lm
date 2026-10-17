// Bounded offline smoke tests for the embedded Tiny LM engine.
// Uses no external dependencies or services.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const found = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(found, 'embedded script exists');
const elements = new Map();
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, {value: '', disabled: false, textContent: '', click() {}});
    return elements.get(id);
  }
};
const context = vm.createContext({document, console, Float64Array, Math, Number, Set, Map, Array, Error, Blob, URL, Date, setTimeout});
vm.runInContext(found[1] + '\n globalThis.testSurface = {init, trainOne, forward, soft, rng, averageLoss};', context, {timeout: 5000});
const {init, trainOne, forward, soft, averageLoss} = context.testSurface;
const text = 'abcabcabcabcabcabc';
const m = init(text, 42);
assert.ok(m.V >= 4);
assert.equal(m.E.length, m.V * 8);
const indices = Array.from(text, c => m.vocab.indexOf(c));
const testLoss = () => {
  let sum = 0, count = 0;
  for (let i = 0; i < indices.length - 3; i++) {
    const p = soft(forward(m, indices.slice(i, i + 3)).logits);
    sum -= Math.log(p[indices[i + 3]]);
    count++;
  }
  return sum / count;
};
const before = testLoss();
assert.ok(Math.abs(before - averageLoss(m,indices)) < 1e-10, "UI loss matches independent loss measurement");
for (let epoch = 0; epoch < 130; epoch++) {
  for (let i = 0; i < indices.length - 3; i++) trainOne(m, indices.slice(i, i + 3), indices[i + 3], 0.05);
}
const after = testLoss();
assert.ok(Math.abs(after - averageLoss(m,indices)) < 1e-10, "UI loss remains accurate after training");
assert.ok(Number.isFinite(after) && after < before * 0.55, 'learning must reduce loss');
assert.equal(soft([1, 2, 3]).reduce((a, b) => a + b, 0).toFixed(8), '1.00000000');
assert.throws(() => init('aaaaaa', 42), /2〜150/);
console.log('Tiny LM smoke PASS', {vocab: m.V, parameters: m.E.length + m.W.length + m.b.length + m.U.length + m.c.length, before, after});
