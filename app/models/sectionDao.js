"use strict";

var db = require('./index.js');
var DISABLE_FOREIGN_KEY_CHECKS = "SET FOREIGN_KEY_CHECKS=0";
var ENABLE_FOREIGN_KEY_CHECKS = "SET FOREIGN_KEY_CHECKS=1";
var selectQuery = "select * from appraisal_score.criteria";
var truncateCriteriaQuery = "truncate table appraisal_score.criteria";
var truncateCriteriaScoreQuery = "truncate table appraisal_score.section_score;";
var truncateFinalScoreQuery = "truncate table appraisal_score.overall_score";
var insertQuery = "INSERT INTO appraisal_score.criteria(measureName,weightage) values ?";

var sectionDao = {
    postSection: function(sectionRecords, callback) {
        var connection = db.createDatabaseConnection();
        var refinedSectionRecords = sectionRecords.map(function(item) {
            return [item.sectionName, item.sectionWeightage];
        });
        connection
            .then(function(conn) {
                return conn.query(truncateFinalScoreQuery) && conn;
            })
            .then(function(conn) {
                return conn.query(truncateCriteriaScoreQuery) && conn;
            })
            .then(function(conn) {
                return conn.query(DISABLE_FOREIGN_KEY_CHECKS) && conn;
            })
            .then(function(conn) {
                return conn.query(truncateCriteriaQuery) && conn;
            })
            .then(function(conn) {
                return conn.query(ENABLE_FOREIGN_KEY_CHECKS) && conn;
            })
            .then(function(conn) {
                return conn.query(insertQuery, [refinedSectionRecords])
                    .then(function(response) {
                        db.terminateDatabaseConnection(conn);
                        callback({ type: 'SUCCESS', result: "Inserted Successfully" });
                    });
            })
            .catch(function(error) {
                console.log(error);
                callback({ type: 'ERROR', result: error });
            });
    },
    getSection: function(callback) {
        var connection = db.createDatabaseConnection();
        connection
            .then(function(conn) {
                return conn.query(selectQuery)
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

module.exports = sectionDao;
