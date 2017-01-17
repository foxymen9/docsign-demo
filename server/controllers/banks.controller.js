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

    return render(req, res, viewData);
});

router.get('/delete/:bankId', function (req, res) {
    var bankId = req.params.bankId;
    
    bankService.delete(bankId)
        .then(function () {
            return res.redirect('/banks');
        })
        .catch(function (err) {
            return render(req, res, {error: err.message});
        });
});

router.post('/', function (req, res) {
    var bankName = req.body.bankName;
    var color = req.body.color;

    if(!req.files.uploadFile) {
        return render(req, res, {error: "Please upload a logo file.", bankName: bankName, color: color});
    }
    else {
        var uploadFile = req.files.uploadFile;
        var exts = ['.png', '.jpg', '.jpeg'];
        
        if(exts.indexOf(path.extname(uploadFile.name)) === -1) {
            return render(req, res, {error: "Please upload a image file.", bankName: bankName, color: color});
        }
        else {
            var newPath = '/uploads/logos/' + req.files.uploadFile.name;
            uploadFile.mv('public' + newPath, function(writeErr) {
                if(writeErr) {
                    return render(req, res, {error: writeErr.message, bankName: bankName, color: color});
                }
                else {
                    bankService.create({name: bankName, logo: newPath, color: color})
                        .then(function (bank) {
                            return res.redirect('/banks');
                        })
                        .catch(function (err) {
                            return render(req, res, {error: err.message, bankName: bankName, color: color});
                        });
                }
            });
        }
    }
    
});

function render(req, res, renderData) {
    bankService.findAll()
        .then(function (banks) {
            if (banks) {
                renderData.banks = banks;
            } else {
                renderData.banks = [];
            }
            res.render('banks', renderData);
        })
        .catch(function (err) {
            renderData.error = err.message;
            res.render('banks', renderData);
        });
}


module.exports = router;