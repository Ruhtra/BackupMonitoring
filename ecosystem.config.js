module.exports = {
  apps: [
    {
      name: "ExpressApp",
      watch: true,
      script: "node",
      args: "--env-file=.env.production ./dist/index.js",
      cwd: "./backupMonitoring.server",

      env: {
        NODE_ENV: "production",
        PORT: 7403,
      },
    },
    {
      name: "ViteReactApp",
      watch: true,
      script: "serve",
      args: "./dist 7404",
      cwd: "./backupMonitoring.client",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
