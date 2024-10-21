module.exports = {
    apps: [
      {
        name: "Backup_7403",
        script: "node",
        args: "--env-file=.env.production ./dist/index.js",
        env: {
          NODE_ENV: "production",
          PORT:  7403
        }
      }
    ]
  };
  