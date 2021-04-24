import { captureStackTrace } from "../utils/captureStackTrace";
import { Extractor } from "./assertions";

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

export type ScopeFunction = (scope: Scope, app: App) => Scope | Promise<Scope>;

export type PropertyControl = { type: any; value: any };

type PropertyControls<Args> = Record<keyof Args, PropertyControl>;

export type ApibotNode<Type, Args, Config = PropertyControls<Args>> = {
  id: string;
  type: Type;
  title: string;
  fn: ScopeFunction;
  args: Args;
  config: Config;
};

export type ExecNode =
  | ApibotNode<"apibot.chain", { fns: ExecNode[] }>
  | ApibotNode<"apibot.assert-status", { from: number; to: number }>
  | ApibotNode<"apibot.http-node", HttpRequest>
  | ApibotNode<"apibot.config", { configuration: Record<string, any> }>
  | ApibotNode<"apibot.extract-header", { headerName: string; as: string }>
  | ApibotNode<"apibot.extract-body", { extract: Extractor; as: string }>
  | ApibotNode<"apibot.extract-response", { extract: Extractor; as: string }>
  | ApibotNode<"apibot.eval", undefined, undefined>;

export function isExecNode(x: any): x is ExecNode {
  return x && typeof x.type === "string" && typeof x.fn === "function";
}

export type AnyNode = ExecNode | ScopeFunction;

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
      config: undefined,
      args: undefined,
    };
  }
  return {
    ...anyNode,
    id: childId,
  };
}

export async function executeNode(node: ExecNode, scope: Scope, app: App) {
  const { fn } = node;
  try {
    const resultingScope = await fn(scope, app);
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
