export function captureStackTrace(): Array<{
  symbol: string;
  file: string;
  line: string;
  row: string;
}> {
  const regex = /at (\S+) \((\S+)\)/;
  const stack = new Error().stack || "";
  return stack
    .split("\n")
    .slice(1)
    .map((s) => {
      const res = s.match(regex);
      if (!res) {
        return res;
      }
      return Array.from(res).slice(1);
    })
    .filter(Array.isArray)
    .map(([symbol, location]) => {
      const [file, line, row] = location.split(":");
      return {
        symbol,
        file,
        line,
        row,
      };
    });
}
