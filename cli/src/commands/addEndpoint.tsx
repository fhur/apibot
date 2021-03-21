import * as React from "react";
import path from "path";
import fs from "fs";
import { render, Text, Box, useInput, useApp } from "ink";
import { parseSwaggerSpecUrls, RequestSpec } from "../swagger";
import { format } from "prettier";

export type ProjectConfig = {
  swaggerUrls: string[];
  envs: Record<string, object>;
  defaultEnv?: string;

  // Added by apibot
  logsDir: string;
};

function Endpoint({
  request,
  selected,
}: {
  selected: boolean;
  request: RequestSpec;
}) {
  const colorsByMethod = {
    GET: "green",
    DELETE: "red",
    POST: "yellow",
    PUT: "yellowBright",
  };
  const color = colorsByMethod[request.method as "GET"];
  return (
    <Text>
      <Text>{selected ? "➡️" : " "}</Text>
      <Text bold={selected} color={color}>
        {request.method.padStart(10, " ") + " "}
      </Text>
      <Text bold={selected} underline={selected} italic={selected}>
        {request.url}
      </Text>
    </Text>
  );
}

function matchesQuery(req: RequestSpec, query: string) {
  let remainingChars = `${req.method} ${req.url}`.split("");
  let startingIndex = 0;
  for (const queryChar of query) {
    let match = false;
    for (let i = startingIndex; i < remainingChars.length; i++) {
      if (remainingChars[i] === queryChar) {
        match = true;
        startingIndex = i + 1;
        break;
      }
    }
    if (match === false) {
      return false;
    }
  }

  return true;
}

function AddSwaggerEndpoint({
  endpoints,
  onEndpointSelected,
}: {
  endpoints: RequestSpec[];
  onEndpointSelected: (req: RequestSpec) => void;
}) {
  const { exit } = useApp();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const filteredEndpoints = endpoints
    .filter((e) => matchesQuery(e, query))
    .slice(0, 20);

  useInput((input, key) => {
    if (key.delete) {
      setQuery((q) => q.substring(0, q.length - 1));
    } else if (key.upArrow) {
      setSelectedIndex((i) => Math.max(0, i - 1));
    } else if (key.downArrow) {
      setSelectedIndex((i) => Math.max(0, i + 1));
    } else if (key.return) {
      onEndpointSelected(filteredEndpoints[selectedIndex]);
      exit();
    } else {
      setQuery((q) => q + input);
      setSelectedIndex(0);
    }
  });

  return (
    <Box flexDirection="column">
      <Text color="green">
        ✅ Swagger Spec loaded, {endpoints.length} endpoint(s) found
      </Text>
      <Text>🔍 Type to filter endpoints</Text>
      <Text>{query.length === 0 ? " " : query}</Text>
      {filteredEndpoints.map((e, index) => (
        <Endpoint key={e.id} request={e} selected={index === selectedIndex} />
      ))}
      <Text color="gray">
        Showing {filteredEndpoints.length} of {endpoints.length} results
      </Text>
    </Box>
  );
}

function Spinner() {
  const [ticks, setTicks] = React.useState(0);
  React.useEffect(() => {
    const timerId = setInterval(() => setTicks((s) => s + 1), 10);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <Text>{Array(ticks).fill(".").join("")}</Text>;
}

export async function addEndpoint({
  path: pathToEndpoint,
  config,
}: {
  path: string;
  config: ProjectConfig;
}) {
  if (config.swaggerUrls) {
    const endpointPromise = parseSwaggerSpecUrls(config.swaggerUrls);
    render(
      <Box flexDirection="column">
        <Text color="green">✅ Swagger URL found</Text>
        {config.swaggerUrls.map((swaggerUrl) => (
          <Text>
            Loading spec at <Text color="blueBright">{swaggerUrl}</Text>
          </Text>
        ))}
        <Spinner />
      </Box>
    );

    const endpoints = await endpointPromise;
    render(
      <AddSwaggerEndpoint
        endpoints={endpoints}
        onEndpointSelected={(request) =>
          generateEndpoint({ pathToEndpoint, request })
        }
      />
    );
  }
}

function lispCaseToCamelCase(x: string) {
  return x
    .split("-")
    .map((s, index) => {
      if (index === 0) {
        return s;
      }
      return s.substring(0, 1).toUpperCase() + s.substring(1);
    })
    .join("");
}

function generateEndpoint({
  pathToEndpoint,
  request,
}: {
  pathToEndpoint: string;
  request: RequestSpec;
}) {
  const args: Record<string, any> = {
    method: request.method,
    url: `{rootUrl}${request.url}`,
    headers: request.headers.reduce<Record<string, string>>((red, current) => {
      red[current.name] = `{${lispCaseToCamelCase(current.name)}}`;
      return red;
    }, {}),
    queryParams: request.queryParams.reduce<Record<string, string>>(
      (red, current) => {
        red[current.name] = ``;
        return red;
      },
      {}
    ),
  };

  if (Object.keys(args.headers).length === 0) {
    delete args.headers;
  }

  if (Object.keys(args.queryParams).length === 0) {
    delete args.queryParams;
  }

  const parts = pathToEndpoint.split(path.sep);
  const functionName = parts[parts.length - 1];

  const template = `
    import { http } from "@apibot/runtime";

    export function ${functionName}() {
      return http(${JSON.stringify(args)});
    }
  
  `;

  const out = format(template, { parser: "typescript" });

  const withExtension =
    path.extname(pathToEndpoint) === ".ts"
      ? pathToEndpoint
      : pathToEndpoint + ".ts";

  fs.writeFileSync(withExtension, out);

  render(
    <Box flexDirection="column">
      <Text>
        Endpoint generated <Text color="green">successfully</Text> at:{" "}
      </Text>
      <Text> </Text>
      <Text color="gray">
        {"         "}
        {withExtension}
      </Text>
      <Text> </Text>
      <Text>To test endpoint, run the following command: </Text>
      <Text> </Text>
      <Text color="gray">
        {"         "}apibot run {withExtension}
      </Text>
      <Spinner />
    </Box>
  );
}
