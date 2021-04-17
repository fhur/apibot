export const keySelectedGraphId = "SelectedGraphId";

export function read(key: string): any | undefined {
  return localStorage.getItem(key) ?? undefined;
}

export function write(key: string, value: string): void {
  return localStorage.setItem(key, value);
}
