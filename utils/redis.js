// utils/redis.js

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis server');
    });

    // Connect to the Redis server
    this.connectClient();
  }

  async connectClient() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error('Redis client connection error:', err);
    }
  }

  isAlive() {
    return this.client.isReady;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error(`Error getting value for key ${key}:`, err);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      // Using a simpler format for the SET command
      await this.client.set(key, value);
      await this.client.expire(key, duration);
    } catch (err) {
      console.error(`Error setting value for key ${key}:`, err);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting key ${key}:`, err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
