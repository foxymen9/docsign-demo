var config = require('config.json');
var express = require('express');
var fs = require('fs');
var router = express.Router();

var utils = require('server/utils');
var bankService = require('server/services/bank.service');

// routes
router.get('/', getAllBanks);

module.exports = router;

function getAllBanks(req, res) {
    bankService.findAll()
        .then(function (banks) {
            if (banks) {
                res.send(banks);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
