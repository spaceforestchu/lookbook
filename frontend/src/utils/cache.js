// Simple in-memory cache with TTL and request deduplication
class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.pendingRequests = new Map(); // For request deduplication
  }

  set(key, value, ttl = 60000) { // Default 60 seconds TTL
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      // Expired or doesn't exist
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
    this.pendingRequests.clear();
  }

  has(key) {
    const value = this.get(key);
    return value !== null;
  }

  // Get or set a pending request to deduplicate simultaneous calls
  getPendingRequest(key) {
    return this.pendingRequests.get(key);
  }

  setPendingRequest(key, promise) {
    this.pendingRequests.set(key, promise);
    // Clean up when promise resolves or rejects
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }
}

export const apiCache = new SimpleCache();

