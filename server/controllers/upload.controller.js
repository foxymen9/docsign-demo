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

    return render(req, res, viewData);
});

router.get('/delete/:documentId', function (req, res) {
    var documentId = req.params.documentId;
    
    documentService.delete(documentId)
        .then(function () {
            return res.redirect('/upload');
        })
        .catch(function (err) {
            return render(req, res, {error: err.message});
        });
});

router.post('/', function (req, res) {
    var documentName = req.body.documentName;

    if(!req.files.uploadFile) {
        return render(req, res, {error: "Please upload a docx file.", documentName: documentName});
    }
    else {
        var uploadFile = req.files.uploadFile;
        var exts = ['.docx', '.pdf', '.png', '.jpg', '.jpeg'];
        
        if(exts.indexOf(path.extname(uploadFile.name)) === -1) {
            return render(req, res, {error: "Please upload a file in formats " + exts.join(', '), documentName: documentName});
        }
        else {
            var newPath = '/uploads/documents/' + req.files.uploadFile.name;
            uploadFile.mv('public' + newPath, function(writeErr) {
                if(writeErr) {
                    return render(req, res, {error: writeErr.message, documentName: documentName});
                }
                else {
                    documentService.create({name: documentName, url: newPath})
                        .then(function (document) {
                            return res.redirect('/upload');
                        })
                        .catch(function (err) {
                            return render(req, res, {error: err.message, documentName: documentName});
                        });
                }
            });
        }
    }
    
});

function render(req, res, renderData) {
    documentService.findAll()
        .then(function (documents) {
            if (documents) {
                renderData.documents = documents;
            } else {
                renderData.documents = [];
            }
            res.render('upload', renderData);
        })
        .catch(function (err) {
            renderData.error = err.message;
            res.render('upload', renderData);
        });
}


module.exports = router;