// Codemod: replace `cond && (<JSX/>)` with `cond ? (<JSX/>) : null`
// Usage:
//   npm run codemod:jsx-ternary -- "src/app/kb/**/*.tsx"
//   # or: npm run codemod:jsx-ternary:kb
const { readFileSync, writeFileSync } = require('fs');
const { globSync } = require('glob');
const fse = require('fs-extra');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const targetsFromCli = process.argv.slice(2);
const patterns = targetsFromCli.length ? targetsFromCli : ['src/app/kb/**/*.tsx'];
const files = patterns.flatMap((p) => globSync(p, { absolute: true, nodir: true }));

let changedCount = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const ast = parser.parse(src, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  let fileChanged = false;

  traverse(ast, {
    JSXExpressionContainer(path) {
      const node = path.node.expression;
      if (!t.isLogicalExpression(node)) return;
      if (node.operator !== '&&') return;

      const rhs = node.right;
      const rhsIsJsx =
        t.isJSXElement(rhs) ||
        t.isJSXFragment(rhs) ||
        (t.isParenthesizedExpression(rhs) && (t.isJSXElement(rhs.expression) || t.isJSXFragment(rhs.expression)));
      if (!rhsIsJsx) return;

      const test = node.left;
      const consequent = rhs;
      const alternate = t.nullLiteral();
      const conditional = t.conditionalExpression(test, consequent, alternate);

      path.replaceWith(t.JSXExpressionContainer(t.parenthesizedExpression(conditional)));
      fileChanged = true;
    },
  });

  if (fileChanged) {
    const output = generate(ast, { retainLines: true, jsescOption: { minimal: true } }, src).code;
    fse.ensureFileSync(file);
    writeFileSync(file, output, 'utf8');
    console.log(`✔ Rewrote conditional JSX: ${file}`);
    changedCount++;
  }
}

console.log(`\nDone. Files changed: ${changedCount}`);
