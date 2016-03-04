const store = require('../store/electricity_store');
// const querystring = require('querystring');

function list(req, res/* , query*/) {
  store.readAll()
    .then((rows) => {
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');

      const json = JSON.stringify(rows);
      res.end(json);
    });
}

function get() {
}

function save() {
}

function remove() {
}

function handle(req, res, paths, params) {
  if (paths.length < 2) {
    res.statusCode = 404;
    res.end();
    return;
  }

  switch (paths[1]) {
    case 'list':
      list(req, res, params.query);
      break;
    case 'get':
      break;
    case 'save':
      break;
    case 'delete':
      break;
    default:
      console.log('Unhandled operation');
      res.statusCode = 404;
      res.end();
  }
}

module.exports = {
  handle,
};
