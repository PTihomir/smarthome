const http = require('http');
const url = require('url');

const electricity_handler = require('./electricity/electricity_handler');

const PORT = 4080;

function handleRequest(req, res) {
  const parsed = url.parse(req.url);
  const paths = parsed.path.split('/').filter((value) => value !== '');

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4040');
  // res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (paths.length === 0) {
    console.error(`path not defined`);
    res.statusCode = 404;
    res.end();
    return;
  }

  switch (paths[0]) {
    case 'electricity':
      console.log(`path ${paths[0]}`);
      electricity_handler.handle(req, res, paths, parsed);
      break;
    case 'temperature':
      console.log(`path ${paths[0]}`);
      break;
    case 'fuel':
      console.log(`path ${paths[0]}`);
      break;
    case 'recipe':
      console.log(`path ${paths[0]}`);
      break;
    default:
      console.error(`path ${paths[0]} is not handled`);
      res.statusCode = 404;
      res.end();
  }
}

var server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
