class Cache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private TTL = 5 * 60 * 1000; // 5 минут

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.TTL) {
      return item.data;
    }
    return null;
  }

  clear() {
    this.cache.clear();
  }
}

export const cache = new Cache();
