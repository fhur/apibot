import { Extractor, jsonPathToFunction } from "./assertions";
import {
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
}): ScopeFunction {
  return function extractHeader(scope) {
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
}

export function extractResponse(opts: {
  extractor: (response: HttpResponse) => any;
  as: string;
}): ScopeFunction {
  return function extractResponse(scope) {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `extractResponse failed: no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse, opts.as, opts.extractor);
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
}): ScopeFunction {
  return async function extractBody(scope) {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract, no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse.body, opts.as, opts.extract);
  };
}
