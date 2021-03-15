import { Scope } from "./nodes/node";

function assertPresent(x: any, msg: string = "") {
  if (!x) {
    throw new Error("assert present failed: " + msg);
  }
  return x;
}

function renderStringTemplate(scope: Scope, str: string) {
  return str
    .split(/\{(\w+)\}/)
    .map((part, index) => {
      const isVariable = index % 2;
      if (isVariable) {
        return assertPresent(
          scope[part],
          "Expected scope to contain key " + part
        );
      }
      return part;
    })
    .join("");
}

export function renderTemplate<
  T extends Record<string, any> | string | boolean | number | Array<any>
>(scope: Scope, obj: T): T {
  if (typeof obj === "boolean" || typeof obj === "number") {
    return obj;
  }
  if (typeof obj === "string") {
    return renderStringTemplate(scope, obj) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => renderTemplate(scope, item)) as T;
  }
  if (Object.keys(obj).length > 0) {
    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      copy[key] = renderTemplate(scope, value);
    }
    return copy as T;
  }
  return obj;
}
