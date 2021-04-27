import { Extractor, jsonPathToFunction } from "./assertions";
import {
  ApibotNode,
  callerId,
  findHeader,
  findLastResponse,
  Scope,
  writeAssertionFailed,
} from "./node";
import {
  PropertyControlJsonPath,
  PropertyControlScopeIdentifier,
} from "./propertyControls";

export type NodeExtractHeader = ApibotNode<
  "apibot.extract-header",
  { headerName: string; as: string }
>;

function createAsPropertyControl(
  value: string
): PropertyControlScopeIdentifier {
  return {
    type: "scope-identifier",
    value: value,
    label: "Variable Name",
    description: "The name of the variable",
  };
}

function createExtractPropertyControl(value: string): PropertyControlJsonPath {
  return {
    type: "json-path",
    value: value,
    label: "Extractor",
    description: "A json path used to extract a value from the scope",
  };
}

export function extractHeader(
  defaultArgs: NodeExtractHeader["args"]
): NodeExtractHeader {
  const fn: NodeExtractHeader["fn"] = async (scope, args) => {
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
      [args.as]: header,
    };
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.extract-header",
    title,
    fn,
    args: defaultArgs,
    config: {
      headerName: {
        type: "string",
        value: defaultArgs.headerName,
        label: "Header Name",
        description:
          "The case insensitive name of the header to extract e.g. x-authentication",
      },
      as: createAsPropertyControl(defaultArgs.as),
    },
  };
}

export type NodeExtractResponse = ApibotNode<
  "apibot.extract-response",
  { extract: Extractor; as: string }
>;

export function extractResponse(
  defaultArgs: NodeExtractResponse["args"]
): NodeExtractResponse {
  const fn: NodeExtractResponse["fn"] = async (scope, args) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `extractResponse failed: no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse, args.as, args.extract);
  };

  const { id, title } = callerId();

  return {
    id,
    type: "apibot.extract-response",
    title,
    fn,
    args: defaultArgs,
    config: {
      extract: createExtractPropertyControl(defaultArgs.extract),
      as: createAsPropertyControl(defaultArgs.as),
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
      [as]: extracted,
    };
  } catch (e) {
    return writeAssertionFailed(scope, {
      message: `Failed to extract: ${e}`,
    });
  }
}

export type NodeExtractBody = ApibotNode<
  "apibot.extract-body",
  { extract: Extractor; as: string }
>;

export function extractBody(
  defaultArgs: NodeExtractBody["args"]
): NodeExtractBody {
  const fn: NodeExtractBody["fn"] = async (scope, { extract, as }) => {
    const httpResponse = findLastResponse(scope);
    if (!httpResponse) {
      return writeAssertionFailed(scope, {
        message: `Failed to extract, no previous HTTP response found.`,
      });
    }

    return extractFrom(scope, httpResponse.body, as, extract);
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.extract-body",
    title,
    fn,
    args: defaultArgs,
    config: {
      extract: createExtractPropertyControl(defaultArgs.extract),
      as: createAsPropertyControl(defaultArgs.as),
    },
  };
}
