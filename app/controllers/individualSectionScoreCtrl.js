"use strict";

var express = require('express');
var router = express.Router();
var constants = require('../../config/constants');
var individualSectionScoreDao = require('../models/individualSectionScoreDao');

module.exports = function(app) {
    app.use('/', router);
};

router.post('/saveIndividualScore', function(req, res) {
    individualSectionScoreDao.insertScore(req.body.scores, function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            score: response.result
        });
    });
});

router.get('/getAllIndividualScoreForAllEmployees', function(req, res) {
    individualSectionScoreDao.getAllIndividualScoreForAllEmployees(function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            score: response.result
        });
    });
});

router.get('/getAllIndividualScoreByEmployeeId/:id', function(req, res) {
    var employeeId = req.params.id;
    individualSectionScoreDao.getAllIndividualScoreByEmployeeId(employeeId, function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            score: response.result
        });
    });
});

router.get('/getIndividualScoreByIdForEmployeeId/:employeeId/:sectionId', function(req, res) {
    var employeeId = req.params.employeeId;
    var sectionId = req.params.sectionId;
    individualSectionScoreDao.getIndividualScoreByIdForEmployeeId(employeeId, sectionId, function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            score: response.result
        });
    });
});
