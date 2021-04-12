export function randomChoice<T>(list: Array<T>): T | undefined {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function randomInt(
  from: number,
  to: number = Number.MAX_SAFE_INTEGER
): number {
  return from + Math.floor(Math.random() * (to - from));
}

export function pickRandomDate(from: Date, to: Date) {
  return new Date(randomInt(from.getTime(), to.getTime()));
}

export function randomLetter(from: string, to: string) {
  const fromCode = from.charCodeAt(0);
  const toCode = to.charCodeAt(0);
  return String.fromCharCode(randomInt(fromCode, toCode));
}

export function randomLicensePlate(countryCode: string) {}
