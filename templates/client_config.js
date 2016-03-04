const config = {
  env : process.env.NODE_ENV,

  // production_server_url: '192.168.0.1',
  // dev_server_url: 'localhost',

  production_server_port: 4080,
  dev_server_port: 4080,
};

if (config.env === 'production') {
  config.base_url = `http://${config.production_server_url}:${config.production_server_port}`;
} else {
  config.base_url = `http://${config.dev_server_url}:${config.dev_server_port}`;
}

export default config;
