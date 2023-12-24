/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["ru"],
    defaultLocale: "ru",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mineatar.io',
        port: '',
        pathname: '/face/**',
      },
      {
        protocol: 'https',
        hostname: 'visage.surgeplay.com',
        port: '',
        pathname: '/front/512/**',
      },
    ],
  },
};

export default config;
