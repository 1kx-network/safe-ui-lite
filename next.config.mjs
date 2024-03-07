import webpackConfig from './webpack.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack(config) {
    // const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

    config.module.rules.push(
      ...webpackConfig.rules

      // // Reapply the existing rule, but only for svg imports ending in ?url
      // {
      //   ...fileLoaderRule,
      //   test: /\.svg$/i,
      //   resourceQuery: /url/, // *.svg?url
      // },
      // // Convert all other *.svg imports to React components
      // {
      //   test: /\.svg$/i,
      //   issuer: fileLoaderRule.issuer,
      //   resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
      //   use: ['@svgr/webpack'],
      // }
    );
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
