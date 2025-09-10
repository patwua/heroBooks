/* 
  Codemod: replace `cond && (<JSX/>)` with `cond ? (<JSX/>) : null`
  Usage:
    npm run codemod:jsx-ternary -- "src/app/kb/**/*.tsx"
    # or: npm run codemod:jsx-ternary:kb
*/
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import * as fse from "fs-extra";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const targetsFromCli = process.argv.slice(2);
const patterns = targetsFromCli.length ? targetsFromCli : ["src/app/kb/**/*.tsx"];
const files = patterns.flatMap((p) => globSync(p, { absolute: true, nodir: true })) as string[];

let changedCount = 0;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const ast = parse(src, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  let fileChanged = false;

  traverse(ast, {
    JSXExpressionContainer(path) {
      const node = path.node.expression as t.Node;
      if (!t.isLogicalExpression(node)) return;
      if (node.operator !== "&&") return;

      const rhs = node.right as t.Node;
      const rhsIsJsx =
        t.isJSXElement(rhs) ||
        t.isJSXFragment(rhs) ||
        (t.isParenthesizedExpression(rhs) &&
          (t.isJSXElement(rhs.expression) || t.isJSXFragment(rhs.expression)));
      if (!rhsIsJsx) return;

      const test = node.left as t.Expression;
      const consequent = rhs as t.Expression;
      const alternate = t.nullLiteral();
      const conditional = t.conditionalExpression(test, consequent, alternate);

      path.replaceWith(t.JSXExpressionContainer(t.parenthesizedExpression(conditional)));
      fileChanged = true;
    },
  });

  if (fileChanged) {
    const output = generate(ast, { retainLines: true, jsescOption: { minimal: true } }, src).code;
    fse.ensureFileSync(file);
    writeFileSync(file, output, "utf8");
    changedCount++;
    // eslint-disable-next-line no-console
    console.log(`✔ Rewrote conditional JSX: ${file}`);
  }
}

// eslint-disable-next-line no-console
console.log(`\nDone. Files changed: ${changedCount}`);

