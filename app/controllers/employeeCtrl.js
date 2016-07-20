"use strict";

var express = require('express');
var router = express.Router();
var employeeDao = require('../models/employeeDao');
var constants = require('../../config/constants');
module.exports = function(app) {
    app.use('/', router);
};

router.get('/getAllEmployees', function(req, res) {
    employeeDao.getAllEmployees(function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            employee: response.result
        });
    });
});

router.get('/getEmployeeById/:id', function(req, res) {
    var employeeId = req.params.id;
    employeeDao.getEmployeeById(employeeId, function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            employee: response.result
        });
    });
});
