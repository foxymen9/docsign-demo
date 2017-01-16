var config = require('config.json');
var express = require('express');
var fs = require('fs');
var router = express.Router();

var utils = require('server/utils');
var employeeService = require('server/services/employee.service');

// routes
router.get('/', getAllEmployees);

module.exports = router;

function getAllEmployees(req, res) {
    employeeService.findAll()
        .then(function (documents) {
            if (documents) {
                res.send(documents);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
