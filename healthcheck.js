/* eslint-disable unicorn/no-process-exit */
import http from 'node:http';

const options = {
  host: 'localhost',
  port: '3001',
  timeout: 2000,
};
const request = http.request(options, (response) => {
  console.log(`STATUS: ${response.statusCode}`);
  if (response.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
request.on('error', (error) => {
  console.log(`ERROR: ${error}`);
  process.exit(1);
});
request.end();
