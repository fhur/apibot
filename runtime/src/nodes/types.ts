import { NodeAssertStatus } from "./assertions";
import { NodeChain } from "./chain";
import { NodeConfig } from "./config";
import {
  NodeExtractBody,
  NodeExtractHeader,
  NodeExtractResponse,
} from "./extractors";
import { NodeHttp } from "./http";
import { ApibotNode } from "./node";

export type ExecNode =
  | NodeChain
  | NodeAssertStatus
  | NodeHttp
  | NodeConfig
  | NodeExtractHeader
  | NodeExtractBody
  | NodeExtractResponse
  | ApibotNode<"apibot.eval", undefined>;
