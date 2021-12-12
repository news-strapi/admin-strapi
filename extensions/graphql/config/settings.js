const apolloServerPluginResponseCache = require("apollo-server-plugin-response-cache");
const { RedisCache } = require("apollo-server-cache-redis");

// set this to whatever you believe should be the max age for your cache control
const MAX_AGE = process.env.CACHE_TIME;

module.exports = {
  federation: false,
  apolloServer: {
    tracing: "production" !== strapi.config.environment ? true : false,
    persistedQueries: { ttl: 10 * MAX_AGE }, // we set this to be a factor of 10, somewhat arbitrary
    cacheControl: { defaultMaxAge: MAX_AGE },
    plugins: [
      apolloServerPluginResponseCache({
        shouldReadFromCache,
        shouldWriteToCache,
        extraCacheKeyData,
        sessionId,
      }),
      injectCacheControl(),
    ],
  },
};

if ("development" !== strapi.config.environment && process.env.REDIS_URL) {
  const cache = new RedisCache(process.env.REDIS_URL);
  module.exports.apolloServer.cache = cache;
  module.exports.apolloServer.persistedQueries.cache = cache;
}

async function sessionId(requestContext) {
  // return a session ID here, if there is one for this request
  return null;
}

async function shouldReadFromCache(requestContext) {
  // decide if we should write to the cache in this request
  return true;
}

async function shouldWriteToCache(requestContext) {
  // decide if we should write to the cache in this request
  return true;
}

async function extraCacheKeyData(requestContext) {
  // use this to create any extra data that can be used for the cache key
}

function injectCacheControl() {
  return {
    requestDidStart(requestContext) {
      requestContext.overallCachePolicy = {
        scope: "PUBLIC", // or 'PRIVATE'
        maxAge: MAX_AGE,
      };
    },
  };
}
