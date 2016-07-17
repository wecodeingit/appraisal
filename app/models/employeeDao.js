"use strict";

var db = require('./index.js');

var selectQuery = "select * from appraisal_score.employee";
var selectQueryWithClause = "select * from appraisal_score.employee where id=?";

var employeeDao = {
  getAllEmployees: function(callback) {
    var connection = db.createDatabaseConnection();

    connection
      .then(function(conn) {
        return conn.query(selectQuery)
          .then(function(rows) {
            db.terminateDatabaseConnection(conn);
            callback(rows);
          });
      })
      .catch(function(error) {
        console.log(error);
        callback(error);
      });
  },
  getEmployeeById: function(employeeId, callback) {
    var connection = db.createDatabaseConnection();
    connection
      .then(function(conn) {
        return conn.query(selectQueryWithClause, employeeId)
          .then(function(rows) {
            db.terminateDatabaseConnection(conn);
            callback(rows);
          });
      })
      .catch(function(error) {
        console.log(error);
        callback(error);
      });
  }
};

module.exports = employeeDao;