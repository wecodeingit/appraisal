"use strict";

var mysql = require("promise-mysql");
var _ = require("lodash");
var config = require('../../config/config');
var db = {};
/* mysql connection string */
var createDatabaseConnection = function() {
  var connection = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
  });

  return connection;

};

var terminateDatabaseConnection = function(connection) {
  connection.end()
    .then(function() {
      console.log("The connection is terminated now");
    });
};

var groupByRecord = function(record, groupByParameter, childRecordKey) {
  return _.chain(record)
    .groupBy(groupByParameter)
    .toPairs()
    .map(function(currentItem) {
      return _.zipObject([groupByParameter, childRecordKey], currentItem);
    })
    .value();
};

db.createDatabaseConnection = createDatabaseConnection;
db.terminateDatabaseConnection = terminateDatabaseConnection;
db.groupByRecord = groupByRecord;

module.exports = db;