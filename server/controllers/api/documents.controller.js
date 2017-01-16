var config = require('config.json');
var express = require('express');
var fs = require('fs');
var router = express.Router();
var Docxtemplater = require('docxtemplater');
var ImageModule = require('docxtemplater-image-module');
var JSZip = require('jszip');
var ImageSize = require('image-size');

var utils = require('server/utils');
var documentService = require('server/services/document.service');

// routes
router.get('/', getAllDocuments);
router.post('/signature', addSignature);
router.post('/upload', upload);

module.exports = router;

var signatureFilePath = '/temp/signature.png';
var testDocfile = '/temp/template.docx';
var signedDocfile = '/temp/template_signed.docx';

function addSignature(req, res) {
    var signature = req.body.signature;
    var employeeName = req.body.employeeName;

    try {
        var imageBuffer = utils.decodeBase64Image(signature);

        var options = {
            centered: false,
            getImage: function(tagValue, tagName) {
                return imageBuffer.data;
            },
            getSize: function(img, tagValue, tagName) {
                var size = ImageSize(img);
                return [size.width, size.height];
            }
        };

        var imageModule = new ImageModule(options);
        
        var content = fs.readFileSync('public' + testDocfile, 'binary');
    
        var zip = new JSZip(content);
        var docx = new Docxtemplater()
            .attachModule(imageModule)
            .loadZip(zip)
            .setData({signature: 'public' + signatureFilePath, employee_name: employeeName})
            .render();

        var buffer= docx
            .getZip()
            .generate({type:"nodebuffer"});

        fs.writeFileSync('public' + signedDocfile, buffer);

        res.send(signedDocfile);
    }
    catch(error) {
        console.log(error);
        res.status(404).send(error);
    }
}

function upload(req, res) {
    fs.readFile(req.files.uploadFile.path, function(readErr, data) {
        if(readErr) {
            res.status(404).send(readErr);       
        }

        var newPath = '/uploads/documents/' + req.files.uploadFile.name;
        fs.writeFile('public' + newPath, data, function(writeErr) {
            if(writeErr) {
                res.status(404).send(writeErr);
            }
            else {
                documentService.create(newPath)
                    .then(function (document) {
                        res.sendStatus(200).send(document);
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
            }
        });
    });
}

function getAllDocuments(req, res) {
    documentService.findAll()
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
