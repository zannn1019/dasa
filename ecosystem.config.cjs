module.exports = {
  apps: [
    {
      name: "dasa-cms",
      cwd: "./dasa-cms",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "dasa-frontend",
      cwd: "./dasa-frontend",
      script: "node",
      args: ".output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
