var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var path = require('path');

var documentService = require('server/services/document.service');

router.get('/', function (req, res) {
    var viewData = req.session;
    delete req.session.success;
    delete req.session.error;

    res.render('upload', viewData);
});

router.post('/', function (req, res) {
    var documentName = req.body.documentName;

    if(!req.files.uploadFile) {
        res.render('upload', {error: "Please upload a docx file.", documentName: documentName});
    }
    else {
        var uploadFile = req.files.uploadFile;
        
        if(path.extname(uploadFile.name) !== '.docx') {
            res.render('upload', {error: "Please upload a docx file.", documentName: documentName});
        }
        else {
            var newPath = '/uploads/documents/' + req.files.uploadFile.name;
            uploadFile.mv('public' + newPath, function(writeErr) {
                if(writeErr) {
                    res.render('upload', {error: writeErr.message, documentName: documentName});
                }
                else {
                    documentService.create({name: documentName, url: newPath})
                        .then(function (document) {
                            res.render('upload', {success: 'Upload successful'});
                        })
                        .catch(function (err) {
                            res.render('upload', {error: err.message, documentName: documentName});
                        });
                }
            });
        }
    }
    
});


module.exports = router;