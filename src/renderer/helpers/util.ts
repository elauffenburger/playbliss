const DEBOUNCE_INTERVAL = 700;

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

export function debouncer(): (callback: () => any) => void {
  let timeout: any;

  return function(callback: () => any): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback();
    }, DEBOUNCE_INTERVAL);
  };
}
