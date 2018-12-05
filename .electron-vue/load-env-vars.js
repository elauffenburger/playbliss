const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = function loadEnvVars() {
  const envFileName = path.resolve(__dirname, '../.env');
  const envFile = fs.readFileSync(envFileName).toString();

  console.log('Setting env vars...');

  envFile.split(os.EOL).forEach(line => {
    const [key, value] = line.split('=', 2);

    process.env[key] = value;
  });
}