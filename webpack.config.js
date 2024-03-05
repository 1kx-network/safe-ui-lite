module.exports = {
  rules: [
    {
      test: /(?<!\.s\.)\.svg$/,
      enforce: 'pre',
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
          },
        },
      ],
    },
  ],
};
