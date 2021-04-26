import { captureStackTrace } from "../utils/captureStackTrace";
import { PropertyControl } from "./propertyControls";
import { ExecNode } from "./types";

const namespace = "apibot";

const keyLastResponse = `${namespace}.lastResponse`;
const keyLastRequest = `${namespace}.lastRequest`;
const keyAssertionFailed = `${namespace}.lastFailedAssertion`;

export type Scope = { [str: string]: any };

interface ExecutionHistory {
  append(scope: Scope, metadata: { node: ExecNode }): void;
}

export type ExecutionResult = {
  scope: Scope;
  timestamp: number;
};

export type App = {
  executionHistory: ExecutionHistory;
};

export type ScopeFunction<Args = unknown> =
  | ((scope: Scope, args: Args, app: App) => Promise<Scope>)
  | ((scope: Scope, args: Args, app: App) => Scope);

type PropertyControls<Args> = Record<keyof Args, PropertyControl>;

export type ApibotNode<
  Type,
  Args,
  Config extends PropertyControls<Args> = PropertyControls<Args>
> = {
  id: string;
  type: Type;
  title: string;
  fn: ScopeFunction<Args>;
  args: Args;
  config: Config;
};

export function isExecNode(x: any): x is ExecNode {
  return x && typeof x.type === "string" && typeof x.fn === "function";
}

export type AnyNode = ExecNode | ScopeFunction<any>;

export function createNode(
  parentId: string,
  index: number | string,
  anyNode: AnyNode
): ExecNode {
  const childId = `${parentId}.${index}`;
  if (typeof anyNode === "function") {
    return {
      fn: anyNode,
      type: "apibot.eval",
      title: anyNode.name,
      id: childId,
      config: {},
      args: undefined,
    };
  }
  return {
    ...anyNode,
    id: childId,
  };
}

export async function executeNode(node: ExecNode, scope: Scope, app: App) {
  const fn = node.fn as ScopeFunction<any>;
  const args = (node.args as unknown) as any;
  try {
    const resultingScope = await fn(scope, args, app);
    app.executionHistory.append(resultingScope, { node });
    return resultingScope;
  } catch (error) {
    const err = error as Error;
    const resultingScope = writeAssertionFailed(scope, {
      message: `Failed to execute node: ${node.id}`,
      error: `${err.name}: ${err.message}\n${err.stack}`,
    });
    app.executionHistory.append(resultingScope, { node });
    return resultingScope;
  }
}

export type HttpResponse = {
  status: number;
  headers: Record<string, string>;
  body: any;
};

export type Assertion = {
  message: string;
  expected?: any;
  actual?: any;
  error?: any;
};

export type HttpRequest = {
  method?: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
};

export function findHeader(res: HttpResponse, headerName: string) {
  for (const [key, value] of Object.entries(res.headers)) {
    if (key.toLowerCase() === headerName) {
      return value;
    }
  }
  return undefined;
}

export function findLastResponse(scope: Scope): HttpResponse | undefined {
  return scope[keyLastResponse];
}

export function containsFailedAssertion(scope: Scope): boolean {
  return !!scope[keyAssertionFailed];
}

export function findFailedAssertion(scope: Scope): Assertion | undefined {
  return scope[keyAssertionFailed];
}

export function clearAssertionFailure({
  [keyAssertionFailed]: _,
  ...rest
}: Scope): Scope {
  return rest;
}

export function writeLastResponse(
  scope: Scope,
  request: HttpRequest,
  response: HttpResponse
): Scope {
  return {
    ...scope,
    [keyLastRequest]: request,
    [keyLastResponse]: response,
  };
}

export function writeAssertionFailed(
  scope: Scope,
  assertionFailed: Assertion
): Scope {
  return {
    ...scope,
    [keyAssertionFailed]: assertionFailed,
  };
}

export function callerId() {
  const stack = captureStackTrace();
  const item = stack[3];
  const symbol = item.symbol.replace("Object.", "");
  return {
    id: `${item.file.replace(/.+\/build\//, "")} ${symbol}`,
    title: symbol,
  };
}
