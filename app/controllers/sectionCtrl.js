"use strict";

var express = require('express');
var router = express.Router();
var constants = require('../../config/constants');
var sectionDao = require('../models/sectionDao');

module.exports = function(app) {
    app.use('/', router);
};

router.post('/saveSectionConfiguration', function(req, res) {
    sectionDao.postSection(req.body.section, function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            section: response.result
        });
    });
});

router.get('/getSectionConfiguration', function(req, res) {
    sectionDao.getSection(function(response) {
        res.status(constants.responseCode[response.type]);
        res.send({
            section: response.result
        });
    });
});
