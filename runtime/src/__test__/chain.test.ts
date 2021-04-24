import { chain } from "../nodes/chain";
import { http } from "../nodes/http";
import { ExecNode } from "../nodes/node";

describe("chain", () => {
  function example() {
    return chain(http({ url: "https://foo.com" }));
  }

  test("structure", () => {
    const ex = example() as ExecNode;

    const httpNode: ExecNode = {
      id:
        "/Users/fernandohur/personal/apibot/runtime/src/__test__/chain.test.ts example.0",
      title: "",
      type: "apibot.http-node",
      config: {},
    };

    expect(ex).toEqual({
      id:
        "/Users/fernandohur/personal/apibot/runtime/src/__test__/chain.test.ts example",
      type: "apibot.chain",
      title: "example",
      config: { fns: { type: "fns", value: [httpNode] } },
      fn: ex.fn,
    });
  });
});

function someNode(config: { foo: number; bar: string }) {}
