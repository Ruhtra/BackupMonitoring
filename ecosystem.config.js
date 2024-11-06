module.exports = {
  apps: [
    {
      name: "ExpressApp", // Nome da aplicação Express
      script: "node",
      args: "--env-file=.env.production ./dist/index.js",
      cwd: "./backupMonitoring.server", // Caminho para o servidor Express
      env: {
        NODE_ENV: "production",
        PORT: 7403, // Porta da aplicação Express
      },
    },
    {
      name: "ViteReactApp", // Nome da aplicação React em produção
      script: "serve",
      args: "./dist 7404", // Serve a pasta `dist` como uma SPA na porta 7404
      cwd: "./backupMonitoring.client", // Caminho para a pasta do projeto React
      env: {
        // NODE_ENV: "production",
        // PORT: 7404, // Porta da aplicação React
      },
    },
  ],
};
