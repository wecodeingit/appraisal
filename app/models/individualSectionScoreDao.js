"use strict";

var db = require('./index.js');
var overallScoreDao = require('./overallScoreDao');
var insertIndividualScoreQuery = "INSERT INTO appraisal_score.section_score(employeeID,sectionID,sectionScore) values ?";
var updateIndividualScoreQuery = "UPDATE appraisal_score.section_score SET sectionScore = ? WHERE sectionID = ? AND employeeID = ?";
var selectQuery = "select * from appraisal_score.section_score where employeeID = ?";
var getAllIndividualScoreForAllEmployeesQuery = "SELECT s.employeeID, e.name, s.sectionID, c.measureName, s.sectionScore" + " ";
getAllIndividualScoreForAllEmployeesQuery += "FROM appraisal_score.section_score AS s" + " ";
getAllIndividualScoreForAllEmployeesQuery += "INNER JOIN appraisal_score.employee as e on s.employeeID = e.id" + " ";
getAllIndividualScoreForAllEmployeesQuery += "INNER JOIN appraisal_score.criteria AS c on s.sectionID = c.id";
var getAllIndividualScoreByEmployeeIdQuery = getAllIndividualScoreForAllEmployeesQuery + " " + "WHERE s.employeeID = ?";
var getIndividualScoreByIdForEmployeeId = getAllIndividualScoreByEmployeeIdQuery + " " + "AND s.sectionID = ?";
var RECORD_ZERO = 0;
var individualSectionScoreDao = {
    insertScore: function(scoreRecords, callback) {
        var connection = db.createDatabaseConnection();

        function getRefinedInsertRecords() {
            var refinedInsertRecords = [];
            for (var i = 0, len = scoreRecords.individualScore.length; i < len; i++) {
                refinedInsertRecords.push([scoreRecords.employeeID, scoreRecords.individualScore[i].score_id,
                    scoreRecords.individualScore[i].score_value
                ]);
            }
            return [refinedInsertRecords];
        }

        function getRefinedUpdateRecords(index) {
            var refinedUpdateRecords = [];
            refinedUpdateRecords.push(scoreRecords.individualScore[index].score_value,
                scoreRecords.individualScore[index].score_id, scoreRecords.employeeID);
            return refinedUpdateRecords;
        }


        function updateRecords(conn, index) {

            if (index < scoreRecords.individualScore.length) {
                //updates section records recursively
                return conn.query(updateIndividualScoreQuery, getRefinedUpdateRecords(index))
                    .then(function(response) {
                        updateRecords(conn, ++index);
                    }).catch(function(error) {
                        console.log(error);
                        callback({ type: 'ERROR', result: error });
                    });

            } else {
                //updates overall score
                return overallScoreDao.updateOverallScore(conn, [scoreRecords.overallScore, scoreRecords.employeeID])
                    .then(function(response) {
                        db.terminateDatabaseConnection(conn);
                        return response.affectedRows ? "Updated Successfully" : "Error while Updating";
                    }).catch(function(error) {
                        console.log(error);
                        callback({ type: 'ERROR', result: error });
                    });
            }
        }

        function addRecords(conn) {

            return conn.query(insertIndividualScoreQuery, getRefinedInsertRecords())
                .then(function(response) {
                    return conn;
                })
                .then(function(conn) {
                    return overallScoreDao.insertOverallScore(conn, [scoreRecords.employeeID, scoreRecords.overallScore])
                        .then(function(response) {
                            db.terminateDatabaseConnection(conn);
                            return response.affectedRows ? "Inserted Successfully" : "Error while inserting";
                        });
                })
                .catch(function(error) {
                    console.log(error);
                    callback({ type: 'ERROR', result: error });
                });
        }

        connection
            .then(function(conn) {
                return conn.query(selectQuery, [scoreRecords.employeeID])
                    .then(function(rows) {

                        if (rows.length) {
                            callback({ type: 'SUCCESS', result: updateRecords(conn, RECORD_ZERO) });
                        } else {
                            callback({ type: 'SUCCESS', result: addRecords(conn) });
                        }

                    });
            });

    },
    getAllIndividualScoreForAllEmployees: function(callback) {
        var connection = db.createDatabaseConnection();
        connection
            .then(function(conn) {
                return conn.query(getAllIndividualScoreForAllEmployeesQuery)
                    .then(function(rows) {
                        db.terminateDatabaseConnection(conn);
                        callback({ type: 'SUCCESS', result: db.groupByRecord(rows, 'employeeID', 'scores') });
                    });
            })
            .catch(function(error) {
                console.log(error);
                callback({ type: 'ERROR', result: error });
            });
    },
    getAllIndividualScoreByEmployeeId: function(employeeId, callback) {
        var connection = db.createDatabaseConnection();
        connection
            .then(function(conn) {
                return conn.query(getAllIndividualScoreByEmployeeIdQuery, [employeeId])
                    .then(function(rows) {
                        db.terminateDatabaseConnection(conn);
                        callback({ type: 'SUCCESS', result: db.groupByRecord(rows, 'employeeID', 'scores') });
                    });
            })
            .catch(function(error) {
                console.log(error);
                callback({ type: 'ERROR', result: error });
            });
    },
    getIndividualScoreByIdForEmployeeId: function(employeeId, sectionId, callback) {
        var connection = db.createDatabaseConnection();
        connection
            .then(function(conn) {
                return conn.query(getIndividualScoreByIdForEmployeeId, [employeeId, sectionId])
                    .then(function(rows) {
                        db.terminateDatabaseConnection(conn);
                        callback({ type: 'SUCCESS', result: db.groupByRecord(rows, 'employeeID', 'scores') });
                    });
            })
            .catch(function(error) {
                console.log(error);
                callback({ type: 'ERROR', result: error });
            });
    }
};

module.exports = individualSectionScoreDao;
