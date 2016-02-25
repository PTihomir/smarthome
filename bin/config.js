var config = {
  env: process.env.NODE_ENV || 'development',
  db_name_production: 'mydb.db',
  db_name_test: ':memory:',
};

config.db_name = config.env === 'test' ? config.db_name_test : config.db_name_production;

module.exports = config;
