import { InputGroup } from "@blueprintjs/core";
import { useRecoilState } from "recoil";
import { $searchQuery } from "../../state";

export function SearchBox({}: {}) {
  const [query, setQuery] = useRecoilState($searchQuery);

  return (
    <div style={{ padding: "10px 16px", width: "100%" }}>
      <InputGroup
        fill
        style={{ width: "100%" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></InputGroup>
    </div>
  );
}
