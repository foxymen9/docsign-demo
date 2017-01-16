var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('documents');

var service = {};

service.findAll = findAll;
service.create = create;

module.exports = service;

function findAll() {
    var deferred = Q.defer();

    db.documents.find({}, function (err, documents) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(documents);
    });

    return deferred.promise;
}

function create(url) {
    var deferred = Q.defer();

    var document = {url: url};

    db.documents.insert(
        document,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });

    return deferred.promise;
}
