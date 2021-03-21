import { findLastResponse, ScopeFunction, writeAssertionFailed } from "./node";

export function assertOk(): ScopeFunction {
  return assertStatus({ from: 200, to: 299 });
}

function deepEquals(thiz: any, that: any) {
  // TODO not exactly deep, fix later
  return thiz === that;
}

export function assertStatus({
  from,
  to,
}: {
  from: number;
  to: number;
}): ScopeFunction {
  return function assertStatus(scope) {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `assertStatus failed: No previous HTTP response found.`,
      });
    }

    const statusInRange =
      from <= httpResponse.status && httpResponse.status <= to;

    if (!statusInRange) {
      return writeAssertionFailed(scope, {
        message: `Expected status to be in the range [${from}, ${to}], but got ${httpResponse.status}`,
      });
    }

    return scope;
  };
}

export type Extractor = (x: any) => any;

export function jsonPathToFunction(extractor: Extractor | string) {
  if (typeof extractor === "function") {
    return extractor;
  }
  return ($: any) => {
    // TODO: not exactly safe, but then again, this is a test runner.
    // if you don't trust your own tests...
    return eval(extractor);
  };
}

export function assertBodyEquals({
  expected,
  extract,
}: {
  extract: string | ((body: any) => any);
  expected: any;
}): ScopeFunction {
  const extractor = jsonPathToFunction(extract);

  return function assertBodyEquals(scope) {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `assertBodyEquals failed: No previous HTTP response found.`,
      });
    }

    let extracted;
    try {
      extracted = extractor(httpResponse.body);
    } catch (e) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract from body: ${e}`,
      });
    }

    if (!deepEquals(extracted, expected)) {
      return writeAssertionFailed(scope, {
        message: `assertBodyEquals failed: `,
        expected,
        actual: extracted,
      });
    }

    return scope;
  };
}

export function assertBodyOneOf({
  options,
  extract,
}: {
  extract: string | ((body: any) => any);
  options: any[];
}): ScopeFunction {
  const extractor = jsonPathToFunction(extract);

  return function assertBodyOneOf(scope) {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `No previous HTTP response found.`,
      });
    }

    let extracted: any;
    try {
      extracted = extractor(httpResponse.body);
    } catch (e) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract from body: ${e}`,
      });
    }

    const match = options.find((option) => {
      return deepEquals(option, extracted);
    });

    if (!match) {
      return writeAssertionFailed(scope, {
        message: `assertBodyOneOf failed: `,
        expected: options,
        actual: extracted,
      });
    }

    return scope;
  };
}
