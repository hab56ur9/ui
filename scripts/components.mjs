import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { API, SignatureKind, SymbolFlags, TypeFlags } from "typescript/unstable/sync";
import { specSchema } from "../bin/spec.mjs";

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

const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(project.program.getSourceFile(join(root, "src/lib/index.ts"))));
const callable = (type) => checker.getSignaturesOfType(type, SignatureKind.Call).length > 0;

function describe(name, type) {
  const [signature] = checker.getSignaturesOfType(type, SignatureKind.Call);
  const param = signature && checker.getParameterType(signature, 0);
  const props = param
    ? checker
        .getPropertiesOfType(param)
        .filter((prop) => own(prop) || DOM_PROPS.has(prop.name))
        .map((prop) => ({ name: prop.name, optional: has(prop.flags, SymbolFlags.Optional), ...kindOf(checker.getTypeOfSymbol(prop)), type: checker.typeToString(checker.getTypeOfSymbol(prop)) }))
    : [];
  return { name, props };
}

const roots = exports
  .filter((symbol) => /^[A-Z]/.test(symbol.name))
  .map((symbol) => ({ name: symbol.name, target: has(symbol.flags, SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : symbol }))
  .map(({ name, target }) => ({ name, plain: has(target.flags, SymbolFlags.Function), type: checker.getTypeOfSymbol(target) }))
  .filter(({ type }) => callable(type));
const parts = roots
  .filter(({ plain }) => !plain)
  .flatMap(({ name, type }) =>
    checker
      .getPropertiesOfType(type)
      .filter((member) => /^[A-Z]/.test(member.name))
      .map((member) => ({ name: `${name}.${member.name}`, type: checker.getTypeOfSymbol(member) }))
      .filter((member) => callable(member.type)),
  );
const components = [...roots, ...parts].map(({ name, type }) => describe(name, type));
const plainNames = new Set(roots.filter(({ plain }) => plain).map(({ name }) => name));
api.close();

writeFileSync(join(root, "dist/components.json"), `${JSON.stringify({ components }, null, 2)}\n`);
writeFileSync(join(root, "dist/spec.schema.json"), `${JSON.stringify(specSchema(components.filter(({ name }) => plainNames.has(name))), null, 2)}\n`);
console.log(`components: ${components.length} schemas`);
