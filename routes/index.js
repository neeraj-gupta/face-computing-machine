var express = require('express');
var http = require('http');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
var host_ip = "52.10.196.93";
var api_key = "AIzaSyAqEPptR9Y5xz8tcC8ClaXhisLaLJKbmRE";

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
    var responseStr = "";
    var options = {
      hostname: host_ip,
      port: 5000,
      path: '/',
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    //var postData = {key: api_key, imagePath: __dirname + "/" + imageName};
    var postData = {key: api_key, imagePath: __dirname + "/" + imageName};
    var postStr = JSON.stringify(postData);
    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');
      res.on('data', function(data){
        responseStr += data;
      });

      res.on('end', function(){
        var resultObject = JSON.parse(responseStr);
        console.log(resultObject);
      });
    });

    req.on('error', function(e){
      console.log(e);
    })

    req.write(postStr);
    req.end();
  });

  res.json("Success");
});

module.exports = router;
