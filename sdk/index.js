const axios = require("axios");
const jwt = require("jsonwebtoken");

const RULE_CACHE = new Map();

async function getRules(service, userAgent) {
  const cacheKey = `${service}-${userAgent}`;
  const cached = RULE_CACHE.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.fetchedAt < 5 * 60 * 1000) {
    return cached.rules;
  }

  const res = await axios.get(`http://localhost:4000/rules`, {
    params: { service, userAgent },
  });

  RULE_CACHE.set(cacheKey, { rules: res.data, fetchedAt: now });
  return res.data;
}

async function getContext(userId, orgId, service) {
  const res = await axios.get(`http://localhost:4000/context`, {
    params: { userId, orgId, service },
  });
  return res.data;
}

function rateLimiterMiddleware() {
  return async (req, res, next) => {
    try {
      // Step 1: Token extraction
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "secret123"); // Use your shared secret
      const { userId, orgId } = decoded;

      // Step 2: Header validation
      const service = req.headers["x-service-name"];
      const userAgent = req.headers["user-agent"];

      if (!service || !userAgent) {
        return res
          .status(400)
          .json({ message: "Missing service name or user agent" });
      }

      // Step 3: Fetch rules + context
      const rules = await getRules(service, userAgent);
      const context = await getContext(userId, orgId, service);

      console.log("Rules fetched:", rules);
      console.log("Context fetched:", context);

      // Step 4: Rule Evaluation
      const matchingRule = rules.find(
        (r) =>
          context.usage < r.quota && context.userTier === r.userTier
      );

      if (!matchingRule) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded", code: "LIMIT_EXCEEDED" });
      }

      // Step 5: Set headers and forward
      const remaining = matchingRule.quota - context.usage;
      res.setHeader("X-Quota-Remaining", remaining);
      next();
    } catch (err) {
      console.error("RateLimiter Error:", err.message);
      console.error("Stack Trace:", err.stack);
      return res
        .status(500)
        .json({ message: "Rate limiter failed", error: err.message });
    }
  };
}

module.exports = rateLimiterMiddleware;
