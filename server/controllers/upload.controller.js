var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var fs = require('fs');
var multer = require('multer');

var documentService = require('server/services/document.service');

router.get('/', function (req, res) {
    var viewData = req.session;
    delete req.session.success;
    delete req.session.error;

    res.render('upload', viewData);
});

router.post('/', function (req, res) {
    /*
    if(req.files.uploadFile.name.indexOf('.docx') !== -1) {
        res.render('upload', {error: "Please upload docx file."});
    }
    else {
        fs.readFile(req.files.uploadFile.path, function(readErr, data) {
            if(readErr) {
                return res.render('upload', {error: readErr.message});
            }

            var newPath = '/uploads/documents/' + req.files.uploadFile.name;
            fs.writeFile('public' + newPath, data, function(writeErr) {
                if(writeErr) {
                    return res.render('upload', {error: writeErr.message});
                }
                else {
                    documentService.create(newPath)
                        .then(function (document) {
                            req.session.success = 'Upload successful';
                            return res.render('upload');
                        })
                        .catch(function (err) {
                            res.render('upload', {error: err.message});
                        });
                }
            });
        });
    }
    */
    
    var newPath = '';
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'public/uploads/documents');
        },
        filename: function(req, file, callback) {
            newPath = '/uploads/documents/' + file.originalname;
            callback(null, file.originalname);
        },
        onFileUploadStart: function(file) {
            console.log('file.originalname', file.originalname.indexOf('.docx'));
            if(file.originalname.indexOf('.docx') === -1) {
                return false;
            }
        }
    });
    var upload = multer({storage: storage}).single('uploadFile');

    upload(req, res, function(err) {
        if(err) {
            return res.render('upload', {error: err.message});
        }
        else {
            documentService.create(newPath)
                .then(function (document) {
                    req.session.success = 'Upload successful';
                    return res.render('upload');
                })
                .catch(function (err) {
                    res.render('upload', {error: err.message});
                });
        }
    });
    
});


module.exports = router;