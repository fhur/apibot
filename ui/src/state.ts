import { CompiledGraph } from "@apibot/compiler";
import { ExecNode, Scope } from "@apibot/runtime";
import { atom, selector } from "recoil";
import { ipc } from "./model/ipc";
import * as Nodes from "./model/nodes";

export const $searchQuery = atom({
  key: "searchQuery",
  default: "",
});

export const $currentConfigPath = atom({
  key: "currentConfigPath",
  default:
    "/Users/fernandohur/iptiq/iptiq-policy-admin-tester/apibot.config.json",
});

export const $compiledProject = selector({
  key: "compiledProjec",
  get: async ({ get }) => {
    const configPath = get($currentConfigPath);

    return ipc.compileProject(configPath);
  },
});

export const $currentConfig = selector({
  key: "currentConfig",
  get: ({ get }) => {
    const compiledProject = get($compiledProject);
    return compiledProject.projectConfig;
  },
});

export const $showDrawer = atom<boolean>({
  key: "showDrawer",
  default: false,
});

type AlertType =
  | "omnibox"
  | "confirm-execute-node"
  | "confirm-execute-graph"
  | undefined;

export const $showAlert = atom<AlertType>({
  key: "showAlert",
  default: undefined,
});

export const $omniboxQuery = atom<string>({
  key: "omniboxQuery",
  default: "",
});

export const $omniboxResults = selector<CompiledGraph[]>({
  key: "omniboxResults",
  get: ({ get }) => {
    const omniboxQuery = get($omniboxQuery).trim().toLowerCase();
    if (omniboxQuery.length === 0) {
      return [];
    }
    const nodes = get($nodes);
    const filtered = nodes.filter((n) => {
      return (n.root.title || "").toLowerCase().includes(omniboxQuery);
    });
    return filtered;
  },
});

export const $selectedNodeId = atom<string | undefined>({
  key: "selectedNodeId",
  default: undefined,
});

export const $selectedNode = selector<ExecNode | undefined>({
  key: "selectedNode",
  get: ({ get }) => {
    const selectedGraph = get($selectedGraph);
    if (!selectedGraph) {
      return undefined;
    }

    const selectedNodeId = get($selectedNodeId);
    const children = Nodes.getChildren(selectedGraph.root);
    return children.find((c) => c.id === selectedNodeId);
  },
});

export const $executionRequestId = atom<string | undefined>({
  key: "executionRequestId",
  default: undefined,
});

export const $selectedGraphId = atom<string | undefined>({
  key: "selectedGraphId",
  default: undefined,
});

export const $selectedGraph = selector<CompiledGraph | undefined>({
  key: "selectedGraph",
  get: ({ get }) => {
    const _selectedGraphId = get($selectedGraphId);
    return get($nodes).find((n) => n.id === _selectedGraphId);
  },
});

export const $currentExecution = atom<Scope>({
  key: "currentExecution",
  default: {},
});

export const $nodes = selector<CompiledGraph[]>({
  key: "nodes",
  get: ({ get }) => {
    const { graphs } = get($compiledProject);
    return graphs;
  },
});

export const $searchResultNodes = selector({
  key: "searchResultNodes",
  get: ({ get }) => {
    const _searchQuery = get($searchQuery).trim().toLowerCase();
    const _nodes = get($nodes);
    const filtered = _nodes.filter((n) => {
      return (n.root.title || "").toLowerCase().includes(_searchQuery);
    });
    return filtered;
  },
});

export const $selectedEnvironmentId = atom<string | undefined>({
  key: "selectedEnvironmentId",
  default: "dint",
});

export const $environments = selector<string[]>({
  key: "environments",
  get: ({ get }) => {
    const currentConfig = get($currentConfig);
    return Object.keys(currentConfig.envs);
  },
});
