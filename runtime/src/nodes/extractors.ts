import { Extractor, jsonPathToFunction } from "./assertions";
import {
  AnyNode,
  callerId,
  findHeader,
  findLastResponse,
  HttpResponse,
  Scope,
  ScopeFunction,
  writeAssertionFailed,
} from "./node";

export function extractHeader(args: {
  headerName: string;
  as: string;
}): AnyNode {
  const fn: ScopeFunction = (scope) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract header ${args.headerName}. No previous HTTP response found.`,
      });
    }

    const header = findHeader(httpResponse, args.headerName);
    if (!header) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract header ${args.headerName}. No header found with that name.`,
      });
    }

    return {
      ...scope,
      [args.as]: header,
    };
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.extract-header",
    title,
    fn,
    args: args,
    config: {
      headerName: { type: "string", value: args.headerName },
      as: { type: "string", value: args.as },
    },
  };
}

export function extractResponse(args: {
  extract: Extractor;
  as: string;
}): AnyNode {
  const fn: ScopeFunction = (scope) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `extractResponse failed: no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse, args.as, args.extract);
  };

  return {
    id: "TODO",
    type: "apibot.extract-response",
    title: "Extract Response",
    fn,
    args,
    config: {
      extract: { type: "string", value: args.extract },
      as: { type: "string", value: args.as },
    },
  };
}

export function extractFrom(
  scope: Scope,
  from: any,
  as: string,
  extractor: Extractor
): Scope {
  try {
    const extracted = jsonPathToFunction(extractor)(from);

    if (extracted === undefined) {
      return writeAssertionFailed(scope, {
        message: `Nothing was found when extracting using ${extractor}`,
      });
    }

    return {
      ...scope,
      [as]: extracted,
    };
  } catch (e) {
    return writeAssertionFailed(scope, {
      message: `Failed to extract: ${e}`,
    });
  }
}

export function extractBody(args: { extract: Extractor; as: string }): AnyNode {
  const fn: ScopeFunction = (scope) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract, no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse.body, args.as, args.extract);
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.extract-body",
    title,
    fn,
    args,
    config: {
      extract: { type: "string", value: args.extract },
      as: { type: "string", value: args.as },
    },
  };
}
