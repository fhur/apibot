import fetch, { Headers, Response } from "node-fetch";
import { renderTemplate } from "../template";
import {
  AnyNode,
  callerId,
  HttpRequest,
  HttpResponse,
  Scope,
  writeLastResponse,
} from "./node";

function serializeBody(body: any) {
  if (typeof body === "string") {
    return body;
  }
  return JSON.stringify(body);
}

function normalizeHeaders(headers: Headers): HttpResponse["headers"] {
  return Array.from(headers.entries()).reduce(
    (red: Record<string, string>, [key, val]) => {
      red[key] = val;
      return red;
    },
    {}
  );
}

async function normalizeBody(resp: Response): Promise<HttpResponse["body"]> {
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function encodeQueryParams(queryParams: Record<string, string>) {
  const entries = Object.entries(queryParams);
  if (entries.length === 0) {
    return "";
  }
  const encoded = entries
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return `?` + encoded;
}

export function http(args: HttpRequest): AnyNode {
  async function http(scope: Scope): Promise<Scope> {
    const request = renderTemplate(scope, args);
    const {
      method = "GET",
      url,
      body,
      headers = {},
      queryParams = {},
    } = request;

    const urlWithQueryParams = url + encodeQueryParams(queryParams);
    const requestInit = {
      method,
      headers,
      body: serializeBody(body),
    };
    // TODO: encodeQueryParams should check that the url doesn't already have params
    const response = await fetch(urlWithQueryParams, requestInit);

    console.warn(method, urlWithQueryParams, response.status);

    return writeLastResponse(
      scope,
      { ...requestInit, url: urlWithQueryParams, body: body },
      {
        status: response.status,
        headers: normalizeHeaders(response.headers),
        body: await normalizeBody(response),
      }
    );
  }
  const { id, title } = callerId();

  return {
    id,
    type: "apibot.http-node",
    title,
    fn: http,
    config: {
      method: { type: "string", value: args.method },
      url: { type: "string", value: args.url },
      body: { type: "string", value: args.body },
      headers: { type: "string", value: args.headers },
      queryParams: { type: "string", value: args.queryParams },
    },
  };
}
