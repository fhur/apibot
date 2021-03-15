import fetch from "node-fetch";

type QueryParamSpec = {
  name: string;
  required: boolean;
};

type HeadersSpec = {
  name: string;
  required: boolean;
};

export type RequestSpec = {
  id: string;
  url: string;
  method: string;
  queryParams: QueryParamSpec[];
  headers: HeadersSpec[];
};

function convertQueryParams(parameters: any[]): QueryParamSpec[] {
  return parameters
    .filter((p: any) => p.in === "query")
    .map((p: any) => {
      return {
        name: p.name,
        required: p.required,
        schema: p.schema,
      };
    });
}

function convertHeaderParams(parameters: any[]): HeadersSpec[] {
  return parameters
    .filter((p: any) => p.in === "header")
    .map((p: any) => {
      return {
        name: p.name,
        required: p.required,
        schema: p.schema,
      };
    });
}

function convertComponentSecuritySchemeHeaders(
  securitySchemes: Record<string, any>
): HeadersSpec[] {
  return Object.values(securitySchemes)
    .filter((x) => x.in === "header" && x.type === "apiKey")
    .map(
      (x): HeadersSpec => {
        return { name: x.name, required: true };
      }
    );
}

export async function parseSwaggerSpecUrls(swaggerSpecUrls: string[]) {
  const results = await Promise.all(swaggerSpecUrls.map(parseSwaggerSpecUrl));
  const endpoints: RequestSpec[] = [];
  for (const result of results) {
    endpoints.push(...result);
  }
  return endpoints;
}

export async function parseSwaggerSpecUrl(swaggerSpecUrl: string) {
  const res = await fetch(swaggerSpecUrl);
  const json = await res.json();

  const globalHeaders: HeadersSpec[] = convertComponentSecuritySchemeHeaders(
    json.components.securitySchemes
  );

  return Object.entries(json.paths).flatMap(
    ([url, swaggerPathObject]: [string, any]) => {
      const methods = ["get", "put", "delete", "post"];

      return methods
        .flatMap((method) => {
          const endpoint = swaggerPathObject[method];
          if (!endpoint) {
            return [];
          }
          return [{ method, endpoint }];
        })
        .map(
          ({ method, endpoint }): RequestSpec => {
            const parameters = endpoint.parameters || [];
            return {
              id: endpoint.operationId,
              url,
              method: method.toUpperCase(),
              queryParams: convertQueryParams(parameters),
              headers: convertHeaderParams(parameters).concat(globalHeaders),
            };
          }
        );
    }
  );
}
