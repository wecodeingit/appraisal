"use strict";

var db = require('./index.js');
var overallScoreDao = require('./overallScoreDao');
var insertQuery = "INSERT INTO appraisal_score.section_score(employeeID,sectionID,sectionScore) values ?";

var getAllIndividualScoreForAllEmployeesQuery = "SELECT s.employeeID, e.name, s.sectionID, c.measureName, s.sectionScore" + " ";
getAllIndividualScoreForAllEmployeesQuery += "FROM appraisal_score.section_score AS s" + " ";
getAllIndividualScoreForAllEmployeesQuery += "INNER JOIN appraisal_score.employee as e on s.employeeID = e.id" + " ";
getAllIndividualScoreForAllEmployeesQuery += "INNER JOIN appraisal_score.criteria AS c on s.sectionID = c.id";
var getAllIndividualScoreByEmployeeIdQuery = getAllIndividualScoreForAllEmployeesQuery + " " + "WHERE s.employeeID = ?";
var getIndividualScoreByIdForEmployeeId = getAllIndividualScoreByEmployeeIdQuery + " " + "AND s.sectionID = ?";

var individualSectionScoreDao = {
  insertScore: function(scoreRecords, callback) {
    var connection = db.createDatabaseConnection();
    var refinedScoreRecords = [];
    for (var i = 0, len = scoreRecords.individualScore.length; i < len; i++) {
      refinedScoreRecords.push([scoreRecords.employeeID, scoreRecords.individualScore[i].score_id,
        scoreRecords.individualScore[i].score_value]);
    }
    connection
      .then(function(conn) {
        return conn.query(insertQuery, [refinedScoreRecords])
          .then(function() {
            return conn;
          });
      })
      .then(function(conn) {
        return overallScoreDao.insertOverallScore(conn, [scoreRecords.employeeID, scoreRecords.overallScore])
          .then(function(response) {
            var result = response.affectedRows ? "Inserted Successfully" : "Error while inserting";
            db.terminateDatabaseConnection(conn);
            callback(result);
          });
      })
      .catch(function(error) {
        console.log(error);
        callback(error);
      });
  },
  getAllIndividualScoreForAllEmployees: function(callback) {
    var connection = db.createDatabaseConnection();
    connection
      .then(function(conn) {
        return conn.query(getAllIndividualScoreForAllEmployeesQuery)
          .then(function(rows) {
            db.terminateDatabaseConnection(conn);
            callback(db.groupByRecord(rows, 'employeeID', 'scores'));
          });
      })
      .catch(function(error) {
        console.log(error);
        callback(error);
      });
  },
  getAllIndividualScoreByEmployeeId: function(employeeId, callback) {
    var connection = db.createDatabaseConnection();
    connection
      .then(function(conn) {
        return conn.query(getAllIndividualScoreByEmployeeIdQuery, [employeeId])
          .then(function(rows) {
            db.terminateDatabaseConnection(conn);
            callback(db.groupByRecord(rows, 'employeeID', 'scores'));
          });
      })
      .catch(function(error) {
        console.log(error);
        callback(error);
      });
  },
  getIndividualScoreByIdForEmployeeId: function(employeeId, sectionId, callback) {
    var connection = db.createDatabaseConnection();
    connection
      .then(function(conn) {
        return conn.query(getIndividualScoreByIdForEmployeeId, [employeeId, sectionId])
          .then(function(rows) {
            db.terminateDatabaseConnection(conn);
            callback(db.groupByRecord(rows, 'employeeID', 'scores'));
          });
      })
      .catch(function(error) {
        console.log(error);
        callback(error);
      });
  }
};

module.exports = individualSectionScoreDao;