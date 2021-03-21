const namespace = "apibot";

const keyLastResponse = `${namespace}.lastResponse`;
const keyLastRequest = `${namespace}.lastRequest`;
const keyAssertionFailed = `${namespace}.lastFailedAssertion`;

export type Scope = { [str: string]: any };

interface ExecutionHistory {
  append(scope: Scope, metadata: { node: string }): Scope;
}

export type ExecutionResult = {
  scope: Scope;
  timestamp: number;
};

export type App = {
  executionHistory: ExecutionHistory;
};

export type ScopeFunction = (scope: Scope, app: App) => Scope | Promise<Scope>;

export type Node = {
  fn: ScopeFunction;
  id: string;
};

export async function executeNode(fn: ScopeFunction, scope: Scope, app: App) {
  try {
    const resultingScope = await fn(scope, app);
    app.executionHistory.append(resultingScope, { node: fn.name });
    return resultingScope;
  } catch (error) {
    const err = error as Error;
    const resultingScope = writeAssertionFailed(scope, {
      message: "Failed to execute node",
      error: `${err.name}: ${err.message}\n${err.stack}`,
    });
    app.executionHistory.append(resultingScope, { node: fn.name });
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
