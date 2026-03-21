module.exports = ({ env }) => {
  const corsOrigin = env('CORS_ORIGIN');
  const allowVercel = env.bool('CORS_ALLOW_VERCEL', false);

  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
  ];

  const explicitOrigins = corsOrigin
    ? corsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  /** @param {string | undefined} origin */
  const isHttpsVercelApp = (origin) => {
    if (!origin) return false;
    try {
      const { protocol, hostname } = new URL(origin);
      return protocol === 'https:' && hostname.endsWith('.vercel.app');
    } catch {
      return false;
    }
  };

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        headers: '*',
        origin: async (ctx) => {
          const requestOrigin = ctx.get('Origin');
          const list = [...new Set([...explicitOrigins, ...defaultOrigins])];
          if (allowVercel && requestOrigin && isHttpsVercelApp(requestOrigin)) {
            list.push(requestOrigin);
          }
          return list;
        },
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
