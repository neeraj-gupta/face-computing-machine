var express = require('express');
var http = require('http');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
var Client = require('node-rest-client').Client;
var client = new Client();
var host_ip = "52.10.196.93";
var api_key = "AIzaSyAqEPptR9Y5xz8tcC8ClaXhisLaLJKbmRE";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});

router.post('/upload', function (req, res){
  var imageName = uuid.v1() + ".jpg";
  var imageBase64 = req.body.image;
  var imagePath = __dirname + "/../images/";

  fs.writeFile(imagePath + imageName, imageBase64, 'base64', function(err) {
        console.log(err);
        callToPython(imagePath + imageName);
  });

  function callToPython(imagePath){
    var responseStr = "";
    var args = {
      data: { key: api_key, imagePath:imagePath },
      headers: { "Content-Type": "application/json" }
    };
    
    client.post("http://52.10.196.93:5000/getData", args, function(data, response){
    	var jsonString = JSON.stringify(data);
    	console.log(jsonString);
    	var jsonObject = data;
	    res.send(jsonObject);
    });
   }
});

module.exports = router;	
