/**
 * Created by Neeraj on 4/21/2016.
 */

var fcm = function(){
    var webCamStream;
    var videoPlaying = false;
};

fcm.prototype.initializeCamera = function() {
    // Now we can use it
    if( userMedia() ){
        var constraints = {
            video: true,
            audio:false
        };
        var video = document.getElementById('v');
        var media = navigator.getUserMedia(constraints, function(stream){
            // URL Object is different in WebKit
            var url = window.URL || window.webkitURL;
            // create the url and set the source of the video element
            video.src = url ? url.createObjectURL(stream) : stream;
            // Start the video
            video.play();
            this.videoPlaying  = true;
            this.webCamStream = stream;
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
                document.getElementById('photo').setAttribute('src', data);
            }
        }, false);
    } else {
        alert("KO");
    }
};

fcm.prototype.getUserMedia = function(){
    return navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia || null;
};

fcm.prototype.openModal = function(){
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
};

fcm.prototype.upload = function(){
    var canvas = document.getElementById('canvas');
    var image = canvas.toDataURL("image/png");

    var imageBase64 = image.replace(/^data:image\/(png|jpg);base64,/, "");

    $.ajax({
        url: 'localhost:3000/upload',
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
}
