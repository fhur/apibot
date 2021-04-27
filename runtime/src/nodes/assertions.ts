import { renderTemplate } from "../template";
import {
  AnyNode,
  ApibotNode,
  callerId,
  findLastResponse,
  ScopeFunction,
  writeAssertionFailed,
} from "./node";

export function assertOk(): AnyNode {
  return assertStatus({ from: 200, to: 299 });
}

function deepEquals(thiz: any, that: any) {
  // TODO not exactly deep, fix later
  return thiz === that;
}

type AssertStatusArgs = {
  from: number;
  to: number;
};
export type NodeAssertStatus = ApibotNode<
  "apibot.assert-status",
  AssertStatusArgs
>;

export function assertStatus(args: AssertStatusArgs): NodeAssertStatus {
  const fn: ScopeFunction<AssertStatusArgs> = async (scope, { from, to }) => {
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

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.assert-status",
    title,
    fn,
    args: args,
    config: {
      from: {
        type: "number",
        value: args.from,
        min: 0,
        max: 500,
        label: "HTTP Status from",
      },
      to: {
        type: "number",
        value: args.to,
        min: 0,
        max: 500,
        label: "HTTP Status to",
      },
    },
  };
}

export type Extractor = string;

export function jsonPathToFunction(extractor: Extractor) {
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
  extract: Extractor;
  expected: any;
}): ScopeFunction<void> {
  const extractor = jsonPathToFunction(extract);

  return async function assertBodyEquals(scope) {
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
  extract: Extractor;
  options: any[];
}): ScopeFunction<void> {
  const extractor = jsonPathToFunction(extract);

  return async function assertBodyOneOf(scope) {
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
    const temlpatedOptions = renderTemplate(scope, options);
    const match = temlpatedOptions.find((option) => {
      return deepEquals(option, extracted);
    });

    if (!match) {
      return writeAssertionFailed(scope, {
        message: `assertBodyOneOf failed: `,
        expected: options,
        actual: extracted,
      });
    }

    return {};
  };
}
