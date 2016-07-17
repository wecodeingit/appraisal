"use strict";

var express = require('express');
var router = express.Router();
var employeeDao = require('../models/employeeDao');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/getAllEmployees', function(req, res) {
  employeeDao.getAllEmployees(function(result) {
    res.send({
      employee: result
    });
  });
});

router.get('/getEmployeeById/:id', function(req, res) {
  var employeeId = req.params.id;
  employeeDao.getEmployeeById(employeeId, function(result) {
    res.send({
      employee: result
    });
  });
});