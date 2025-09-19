const http = require('http');

const data = JSON.stringify({
  description: "A simple blog platform with users, posts, and comments",
  options: {
    temperature: 0.7,
    maxTokens: 6000
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/generate-backend',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing backend generation API...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:');
    try {
      const result = JSON.parse(body);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('Raw response:', body);
      console.log('Parse error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.write(data);
req.end();