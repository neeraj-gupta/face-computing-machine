/**
 * Created by Neeraj on 4/21/2016.
 */

function Fcm() {

};

Fcm.prototype.initializeCamera = function() {
    var webCamStream;
    var videoPlaying = false;
    // Now we can use it
    if( this.isUserMedia() ){
        var constraints = {
            video: true,
            audio:false
        };
        var self = this;
        var video = document.getElementById('v');
        var media = navigator.getUserMedia(constraints, function(stream){
            // URL Object is different in WebKit
            var url = window.URL || window.webkitURL;
            // create the url and set the source of the video element
            video.src = url ? url.createObjectURL(stream) : stream;
            // Start the video
            video.play();
            videoPlaying  = true;
            webCamStream = stream;
        }, function(error){
            console.log("ERROR");
            console.log(error);
        });
        // Listen for user click on the "take a photo" button
        document.getElementById('take').addEventListener('click', function(){
            if (videoPlaying){
                var canvas = document.getElementById('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                var data = canvas.toDataURL('image/webp');
                //document.getElementById('photo').setAttribute('src', data);
                webCamStream.stop();
                self.upload(data);
            }
        },false);
        document.getElementsByClassName("close")[0].addEventListener('click', function(){
            var modal = document.getElementById('myModal');
            modal.style.display = "none";
            webCamStream.stop();
            videoPlaying = false;
        });
    } else {
        alert("KO");
    }
};

Fcm.prototype.isUserMedia = function(){
    return navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia || null;
};

Fcm.prototype.closeCamera = function(){ alert('hi')
    this.webCamStream.stop();
    this.videoPlaying = false;
}

Fcm.prototype.openModal = function(){
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.initializeCamera();
};

Fcm.prototype.upload = function(data){
    //var canvas = document.getElementById('canvas');
    //var image = canvas.toDataURL("image/png");
    alert('data: ' + data);
    var imageBase64 = data.replace(/^data:image\/(png|jpg);base64,/, "");

    $.ajax({
        url: 'http://localhost:3000/upload',
        //url: 'http://52.10.196.93:3000/upload',
        dataType: "json",
        data: {
            image: imageBase64
        },
        type: "POST",
        success: function(data) {
            console.log("D: " + data);
        }
    });
};

var fcm = new Fcm();