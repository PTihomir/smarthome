const store = require('../store/electricity_store');
// const querystring = require('querystring');

function list(req, res/* , query*/) {
  Promise.all([store.readAll(), store.readAllProcessed()])
    .then((lists) => {
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');

      const json = JSON.stringify({
        list_raw: lists[0],
        list_cons: lists[1],
      });
      res.end(json);
    });
}

function get(req, res/* , query*/) {
  store.readAll()
    .then((rows) => {
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');

      const json = JSON.stringify(rows);
      res.end(json);
    });
}

function save(req, res, query) {
  var jsonstring = '';

  req.on('data', (data) => {
    jsonstring += data;
    // Too big
    if (jsonstring.length > 1e6) {
      jsonstring = '';
      res.writeHead(413, {'Content-Type': 'text/plain'}).end();
      req.connection.destroy();
    }
  })
  .on('end', () => {
    req.post_data = JSON.parse(jsonstring);

    store.addOrReplace(req.post_data)
      .then(() => {
        return store.processElectricity();
      })
      .then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        const json = JSON.stringify({status: 'ok'});
        res.end(json);
      });
  });
}

function remove(req, res/* , query*/) {
  var jsonstring = '';

  req.on('data', (data) => {
    jsonstring += data;
    // Too big
    if (jsonstring.length > 1e6) {
      jsonstring = '';
      res.writeHead(413, {'Content-Type': 'text/plain'}).end();
      req.connection.destroy();
    }
  })
  .on('end', () => {
    req.post_data = JSON.parse(jsonstring);

    store.remove(req.post_data.timestamp)
      .then(() => {
        return store.processElectricity();
      })
      .then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        const json = JSON.stringify({status: 'ok'});
        res.end(json);
      });
  });
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
      save(req, res, params.query);
      break;
    case 'delete':
      remove(req, res, params.query);
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
