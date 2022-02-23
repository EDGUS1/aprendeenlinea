const getExpeditiousCache = require('express-expeditious');

const cacheInit = getExpeditiousCache({
  namespace: 'expresscache',
  defaultTtl: '5 minute',
});

module.exports = { cacheInit };
