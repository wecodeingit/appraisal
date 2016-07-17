"use strict";

var express = require('express');
var  router = express.Router();
var  sectionDao = require('../models/sectionDao');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/saveSectionConfiguration', function (req, res) {
  sectionDao.postSection(req.body.section,function(result){
    res.send({
        section: result
    });
  });
});

router.get('/getSectionConfiguration', function (req, res) {
  sectionDao.getSection(function(result){
    res.send({
        section: result
    });
  });
});
