module.exports = {
  apps: [{ name: "app", script: "./app.js" }],
  // Deployment Configuration
  deploy: {
    production: {
      user: "sevkinozan",
      host: ["34.168.61.220"],
      ref: "origin/main",
      repo: "https://github.com/ozansevkin/se_project_express.git",
      path: "/home/sevkinozan",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js",
    },
  },
};
