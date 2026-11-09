import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { API, SignatureKind, SymbolFlags, TypeFlags } from "typescript/unstable/sync";

const root = join(import.meta.dirname, "..");
const config = join(root, "tsconfig.json");
const DOM_PROPS = new Set(["children", "onClick", "disabled"]);
const api = new API({ cwd: root });
const project = api.updateSnapshot({ openProjects: [config] }).getProject(config);
const { checker } = project;
const own = (symbol) => symbol.declarations.some((declaration) => declaration.path.includes("/src/"));
const has = (flags, flag) => (flags & flag) !== 0;

const EMPTY = TypeFlags.Undefined | TypeFlags.Null | TypeFlags.Void;

function kindOf(type) {
  const text = checker.typeToString(type);
  if (/ReactNode|ReactElement|JSX\.Element/.test(text)) return { kind: "node" };
  const parts = (type.isUnionType() ? type.getTypes() : [type]).filter((part) => !has(part.flags, EMPTY));
  if (parts.length === 1 && parts[0] !== type) return kindOf(parts[0]);
  if (parts.some((part) => checker.getSignaturesOfType(part, SignatureKind.Call).length)) return { kind: "action" };
  if (parts.length > 1 && parts.every((part) => part.isNumberLiteralType())) return { kind: "enum", values: parts.map((part) => part.value) };
  if (parts.every((part) => part.isStringLiteralType())) return parts.length > 1 ? { kind: "enum", values: parts.map((part) => part.value) } : { kind: "string" };
  if (parts.every((part) => has(part.flags, TypeFlags.BooleanLike))) return { kind: "boolean" };
  if (parts.every((part) => has(part.flags, TypeFlags.StringLike))) return { kind: "string" };
  if (parts.every((part) => has(part.flags, TypeFlags.NumberLike))) return { kind: "number" };
  if (parts.every((part) => has(part.flags, TypeFlags.StringLike | TypeFlags.NumberLike))) return { kind: "scalar" };
  if (text.endsWith("[]") || text.startsWith("readonly ") || text.startsWith("Array<")) return { kind: "list", type: text };
  return { kind: "object", type: text };
}

const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(project.program.getSourceFile(join(root, "src/index.ts"))));
const components = exports
  .filter((symbol) => /^[A-Z]/.test(symbol.name))
  .map((symbol) => ({ name: symbol.name, target: has(symbol.flags, SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : symbol }))
  .filter(({ target }) => has(target.flags, SymbolFlags.Function))
  .map(({ name, target }) => {
    const [signature] = checker.getSignaturesOfType(checker.getTypeOfSymbol(target), SignatureKind.Call);
    const param = signature && checker.getParameterType(signature, 0);
    const props = param
      ? checker
          .getPropertiesOfType(param)
          .filter((prop) => own(prop) || DOM_PROPS.has(prop.name))
          .map((prop) => ({ name: prop.name, optional: has(prop.flags, SymbolFlags.Optional), ...kindOf(checker.getTypeOfSymbol(prop)) }))
      : [];
    return { name, props };
  });
api.close();

writeFileSync(join(root, "dist/components.json"), `${JSON.stringify({ components }, null, 2)}\n`);
console.log(`components: ${components.length} schemas`);
