"use strict";

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV && process.env.NODE_ENV.indexOf("production") >= 0 ? 'production' : 'development';

var database = {
    host: process.env.IP,
    port: 3306,
    user: 'testuser',
    password: '',
    name: 'appraisal_score',
};

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    database:database,
    port: process.env.PORT || 3000
  },

  test: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    database:database,
    port: process.env.PORT || 3000
  },

  production: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    database:database,
    port: process.env.PORT || 3000
  }
};

module.exports = config[env];
