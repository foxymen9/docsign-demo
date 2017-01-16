var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var path = require('path');

var bankService = require('server/services/bank.service');

router.get('/', function (req, res) {
    var viewData = req.session;
    delete req.session.success;
    delete req.session.error;

    bankService.findAll()
        .then(function (banks) {
            if (banks) {
                viewData.banks = banks;
            } else {
                viewData.banks = [];
            }
            res.render('banks', viewData);
        })
        .catch(function (err) {
            viewData.error = err.message;
            res.render('banks', viewData);
        });
});

router.get('/delete/:bankId', function (req, res) {
    var bankId = req.params.bankId;
    
    bankService.delete(bankId)
        .then(function () {
            return res.redirect('/banks');
        })
        .catch(function (err) {
            res.render('banks', {error: err.message});
        });
});

router.post('/', function (req, res) {
    var bankName = req.body.bankName;
    var color = req.body.color;

    if(!req.files.uploadFile) {
        res.render('banks', {error: "Please upload a logo file.", bankName: bankName, color: color});
    }
    else {
        var uploadFile = req.files.uploadFile;
        var images = ['.png', '.jpg', '.jpeg'];
        
        if(images.indexOf(path.extname(uploadFile.name)) === -1) {
            res.render('banks', {error: "Please upload a image file.", bankName: bankName, color: color});
        }
        else {
            var newPath = '/uploads/logos/' + req.files.uploadFile.name;
            uploadFile.mv('public' + newPath, function(writeErr) {
                if(writeErr) {
                    res.render('banks', {error: writeErr.message, bankName: bankName, color: color});
                }
                else {
                    bankService.create({name: bankName, logo: newPath, color: color})
                        .then(function (bank) {
                            return res.redirect('/banks');
                        })
                        .catch(function (err) {
                            res.render('banks', {error: err.message, bankName: bankName, color: color});
                        });
                }
            });
        }
    }
    
});


module.exports = router;