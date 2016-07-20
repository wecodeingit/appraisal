"use strict";

var db = require('./index.js');

var insertQuery = "INSERT INTO appraisal_score.overall_score(employeeID,overallScore) values ?";
var updateQuery = "UPDATE appraisal_score.overall_score SET overallScore = ? WHERE employeeID = ?";
var getOverallScoreForAllEmployeesQuery = "SELECT o.employeeID, e.name, o.overallScore" + " ";
getOverallScoreForAllEmployeesQuery += "FROM appraisal_score.overall_score AS o" + " ";
getOverallScoreForAllEmployeesQuery += "INNER JOIN appraisal_score.employee as e on o.employeeID = e.id";

var getOverallScoreByEmployeeIdQuery = getOverallScoreForAllEmployeesQuery + " " + "WHERE o.employeeID=?";

var overallScoreDao = {
    insertOverallScore: function(conn, overallScoreRecord) {
        return conn.query(insertQuery, [
            [overallScoreRecord]
        ]);
    },
    updateOverallScore: function(conn, overallScoreRecord) {
        return conn.query(updateQuery, overallScoreRecord);
    },
    getOverallScoreForAllEmployees: function(callback) {
        var connection = db.createDatabaseConnection();
        connection
            .then(function(conn) {
                return conn.query(getOverallScoreForAllEmployeesQuery)
                    .then(function(rows) {
                        db.terminateDatabaseConnection(conn);
                        callback({ type: 'SUCCESS', result: rows });
                    });
            })
            .catch(function(error) {
                console.log(error);
                callback({ type: 'ERROR', result: error });
            });
    },
    getOverallScoreByEmployeeId: function(employeeId, callback) {
        var connection = db.createDatabaseConnection();
        connection
            .then(function(conn) {
                return conn.query(getOverallScoreByEmployeeIdQuery, [employeeId])
                    .then(function(rows) {
                        db.terminateDatabaseConnection(conn);
                        callback({ type: 'SUCCESS', result: rows });
                    });
            })
            .catch(function(error) {
                console.log(error);
                callback({ type: 'ERROR', result: error });
            });

    }
};

module.exports = overallScoreDao;
