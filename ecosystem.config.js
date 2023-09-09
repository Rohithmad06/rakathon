module.exports = {
    apps: [
      {
        name: "my-node-app",
        script: "app.js", // Replace with the path to your Node.js application entry file
        env: {
          PORT: 8080, // Specify the port you want to use
          NODE_ENV: "production", // Set the environment mode (e.g., production, development)
        },
      },
    ],
  };
  