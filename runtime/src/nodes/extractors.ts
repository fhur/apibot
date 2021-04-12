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

export function extractHeader(opts: {
  headerName: string;
  name: string;
}): AnyNode {
  const fn: ScopeFunction = (scope) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract header ${opts.headerName}. No previous HTTP response found.`,
      });
    }

    const header = findHeader(httpResponse, opts.headerName);
    if (!header) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract header ${opts.headerName}. No header found with that name.`,
      });
    }

    return {
      ...scope,
      [opts.name]: header,
    };
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.extract-header",
    title,
    fn,
    config: [
      { name: "headerName", value: opts.headerName },
      { name: "name", value: opts.name },
    ],
  };
}

export function extractResponse(opts: {
  extractor: string | ((response: HttpResponse) => any);
  as: string;
}): AnyNode {
  const fn: ScopeFunction = (scope) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `extractResponse failed: no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse, opts.as, opts.extractor);
  };

  return {
    id: "TODO",
    type: "apibot.extract-response",
    title: "Extract Response",
    fn,
    config: [
      { name: "extractor", value: opts.extractor },
      { name: "as", value: opts.as },
    ],
  };
}

export function extractFrom(
  scope: Scope,
  from: any,
  as: string,
  extractor: Extractor | string
): Scope {
  try {
    const extracted = jsonPathToFunction(extractor)(from);
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

export function extractBody(opts: {
  extract: Extractor | string;
  as: string;
}): AnyNode {
  const fn: ScopeFunction = (scope) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract, no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse.body, opts.as, opts.extract);
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.extract-body",
    title,
    fn,
    config: [
      { name: "extract", value: opts.extract },
      { name: "as", value: opts.as },
    ],
  };
}
