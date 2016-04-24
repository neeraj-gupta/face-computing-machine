var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});

router.post('/upload', function (req, res){
  var imageName = uuid.v1() + ".png";
  var imageBase64 = req.body.image;

  fs.writeFile(__dirname + "/" + imageName, imageBase64, 'base64', function(err) {
    console.log(err);
    console.log("Image path: " + __dirname + "/" + imageName);
  });

  res.json("Success");
});

module.exports = router;
