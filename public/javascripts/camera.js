/**
 * Created by Neeraj on 4/21/2016.
 */
(function(){
    function userMedia(){
        return navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia || null;
    }

    // Now we can use it
    if( userMedia() ){
        var webCamStream;
        var videoPlaying = false;
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
                document.getElementById('photo').setAttribute('src', data);
                webCamStream.stop();
                videoPlaying = false;
            }
        }, false);
        document.getElementById('nav-links').addEventListener('click', toggleNav);
    } else {
        alert("KO");
    }

    $('#upload').click(function() {
        var canvas = document.getElementById('canvas');
        var image = canvas.toDataURL("image/png");

        var imageBase64 = image.replace(/^data:image\/(png|jpg);base64,/, "");

        $.ajax({
            url: 'http://localhost:3000/upload',
            dataType: "json",
            data: {
                image: imageBase64
            },
            type: "POST",
            success: function(data) {
                console.log(data);
            }
        });
    });

    function toggleNav (){
        if ($('#camera').css('display') == 'none') {
            $('#camera').show();
            $('#fileUpload').hide();
        } else {
            $('#camera').hide();
            $('#fileUpload').show();
        }
    }
})();