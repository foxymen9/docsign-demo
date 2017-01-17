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
service.delete = _delete;

module.exports = service;

function findAll() {
    var deferred = Q.defer();

    db.documents.find({}).toArray(function(err, documents) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(documents);
    });

    return deferred.promise;
}

function create(params) {
    var deferred = Q.defer();

    var document = params;

    db.documents.insert(
        document,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.documents.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}