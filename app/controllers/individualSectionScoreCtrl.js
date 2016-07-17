"use strict";

var express = require('express');
var router = express.Router();
var individualSectionScoreDao = require('../models/individualSectionScoreDao');

module.exports = function(app) {
  app.use('/', router);
};

router.post('/saveIndividualScore', function(req, res) {
  individualSectionScoreDao.insertScore(req.body.scores, function(result) {
    res.send({
      score: result
    });
  });
});

router.get('/getAllIndividualScoreForAllEmployees', function(req, res) {
  individualSectionScoreDao.getAllIndividualScoreForAllEmployees(function(result) {
    res.send({
      score: result
    });
  });
});

router.get('/getAllIndividualScoreByEmployeeId/:id', function(req, res) {
  var employeeId = req.params.id;
  individualSectionScoreDao.getAllIndividualScoreByEmployeeId(employeeId, function(result) {
    res.send({
      score: result
    });
  });
});

router.get('/getIndividualScoreByIdForEmployeeId/:employeeId/:sectionId', function(req, res) {
  var employeeId = req.params.employeeId;
  var sectionId = req.params.sectionId;
  individualSectionScoreDao.getIndividualScoreByIdForEmployeeId(employeeId, sectionId, function(result) {
    res.send({
      score: result
    });
  });
});