import {Redis} from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(retryCount * 50, 500),
  },
  enableAutoPipelining: true,
})

export default redis