var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('employees');

var service = {};

service.findAll = findAll;

module.exports = service;

function findAll() {
    var deferred = Q.defer();

    db.employees.find({}).toArray(function (err, employees) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(employees);
    });

    return deferred.promise;
}
