"use strict";

var express = require('express');
var router = express.Router();
var constants = require('../../config/constants');
var overallScoreDao = require('../models/overallScoreDao');

module.exports = function(app) {
    app.use('/', router);
};

router.get('/getOverallScoreForAllEmployees', function(req, res) {
    overallScoreDao.getOverallScoreForAllEmployees(function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            score: response.result
        });
    });
});

router.get('/getOverallScoreByEmployeeId/:id', function(req, res) {
    var employeeId = req.params.id;
    overallScoreDao.getOverallScoreByEmployeeId(employeeId, function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            score: response.result
        });
    });
});
