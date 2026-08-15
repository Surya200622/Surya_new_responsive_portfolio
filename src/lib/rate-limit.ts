interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimiter = new Map<string, RateLimitInfo>();

export function checkRateLimit(
  ip: string,
  action: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `${action}:${ip}`;
  const info = rateLimiter.get(key);

  // Simple garbage collection for stale entries (1% chance to run)
  if (Math.random() < 0.01) {
    for (const [k, value] of rateLimiter.entries()) {
      if (now > value.resetTime) {
        rateLimiter.delete(k);
      }
    }
  }

  if (!info || now > info.resetTime) {
    rateLimiter.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (info.count >= limit) {
    return { success: false, remaining: 0, resetTime: info.resetTime };
  }

  info.count += 1;
  return { success: true, remaining: limit - info.count, resetTime: info.resetTime };
}

// Utility to extract IP from a Request or NextAuth req
export function getIp(req: Request | any): string {
  let forwarded = null;
  let realIp = null;
  
  if (req && req.headers && typeof req.headers.get === 'function') {
    forwarded = req.headers.get('x-forwarded-for');
    realIp = req.headers.get('x-real-ip');
  } else if (req && req.headers) {
    forwarded = req.headers['x-forwarded-for'];
    realIp = req.headers['x-real-ip'];
  }
    
  if (Array.isArray(forwarded)) forwarded = forwarded[0];
  if (Array.isArray(realIp)) realIp = realIp[0];
  
  return (forwarded ? forwarded.split(',')[0].trim() : null) || realIp || req?.ip || '127.0.0.1';
}
