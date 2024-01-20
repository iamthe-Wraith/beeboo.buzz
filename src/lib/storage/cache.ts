import { Logger } from '$lib/services/logger';
import Redis from 'ioredis';
import { REDIS_URL } from '$env/static/private';

const redisClient = new Redis(REDIS_URL);

redisClient.on('error', err => Logger.error('Cache Client Error', err));

export const cache = redisClient;