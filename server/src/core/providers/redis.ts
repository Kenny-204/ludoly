import { Redis } from "ioredis";
import config from "../config/config.js";

 class RedisClient {
  private client!: Redis;

  async connect() {
    this.client = new Redis(config.redis.uri);

    this.client.on("connect", () =>
      console.log("Connected successfully to redis"),
    );

    this.client.on("error", () =>
      console.log("There was an error connecting to redis"),
    );
  }

  async set(key: string, data: string) {
    return this.client.set(key, data);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async expire(key: string, seconds: number) {
    return this.client.expire(key, seconds);
  }
}

export const redisClient = new RedisClient()