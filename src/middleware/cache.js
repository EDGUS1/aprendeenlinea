const getExpeditiousCache = require('express-expeditious');

const cacheInit = getExpeditiousCache({
  namespace: 'expresscache',
  defaultTtl: '15 minute',
});

module.exports = { cacheInit };
