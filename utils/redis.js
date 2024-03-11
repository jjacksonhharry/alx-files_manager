// utils/redis.js
import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Display any errors in the console
    this.client.on('error', (err) => {
      console.error(`Redis client error: ${err}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  async set(key, value, durationInSeconds) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value, 'EX', durationInSeconds);
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();

export default redisClient;
