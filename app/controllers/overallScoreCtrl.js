"use strict";

var express = require('express');
var router = express.Router();
var overallScoreDao = require('../models/overallScoreDao');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/getOverallScoreForAllEmployees', function(req, res) {
  overallScoreDao.getOverallScoreForAllEmployees(function(result) {
    res.send({
      score: result
    });
  });
});

router.get('/getOverallScoreByEmployeeId/:id', function(req, res) {
  var employeeId = req.params.id;
  overallScoreDao.getOverallScoreByEmployeeId(employeeId, function(result) {
    res.send({
      score: result
    });
  });
});