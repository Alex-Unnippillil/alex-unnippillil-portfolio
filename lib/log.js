// Structured JSON logger
// Connect a Vercel Log Drain to ship these logs to an external provider.
module.exports = function logRequest(req, route, extra = {}) {
  const entry = {
    requestId: req.headers && (req.headers['x-request-id'] || req.id),
    userAgent: req.headers && req.headers['user-agent'],
    route,
    timestamp: new Date().toISOString(),
    ...extra,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
};

