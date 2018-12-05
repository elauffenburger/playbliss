export function toHashParams(hash: string): any {
  return hash
    .slice(1)
    .split("&")
    .reduce((acc, kvp) => {
      const [key, value] = kvp.split("=");
      (acc as any)[key] = value;

      return acc;
    }, {});
}
