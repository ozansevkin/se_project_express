module.exports = {
  apps: [{ name: "app", script: "npm start" }],
  // Deployment Configuration
  deploy: {
    production: {
      user: "sevkinozan",
      host: ["34.168.61.220"],
      ref: "origin/main",
      repo: "https://github.com/ozansevkin/se_project_express.git",
      path: "/home/sevkinozan/se_project_express",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js",
    },
  },
};
