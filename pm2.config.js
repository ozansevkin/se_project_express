module.exports = {
  apps: [{ name: "app", script: "./app.js" }],
  // Deployment Configuration
  deploy: {
    production: {
      user: "sevkinozan",
      host: ["34.168.61.220"],
      key: "~/.ssh/id_ed25519.pub",
      ref: "origin/main",
      repo: "git@github.com:ozansevkin/se_project_express.git",
      path: "/sevkinozan/se_project_express",
      "post-deploy": "npm install && pm2 startOrRestart pm2.config.js",
    },
  },
};
