/**
 * Created by Neeraj on 4/21/2016.
 */
var videoPlaying = false;
var webCamStream;
var video = document.getElementById('v');

function Fcm() {

};

Fcm.prototype.sendPhoto = function() {
    if (videoPlaying){
        var canvas = document.getElementById('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        var data = canvas.toDataURL('image/webp');
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
        webCamStream.stop();
        $('#thumbnail').css({'height':'auto', 'width' : 'auto'});
        this.upload(data);
    }
};

Fcm.prototype.initializeCamera = function() {
    //var webCamStream;
    videoPlaying = false;
    // Now we can use it
    if( this.isUserMedia() ){
        var constraints = {
            video: true,
            audio:false
        };
        var self = this;
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

Fcm.prototype.usePhoto = function(){
    var id = $('.ScrollArea .selected').attr('id');
    var img = document.getElementById(id);

    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL();
    this.upload(dataURL);
};

Fcm.prototype.selPhoto = function(input){
    var self = this;
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var elem = document.createElement("img");
            elem.setAttribute("src", e.target.result);

            // Create an empty canvas element
            var canvas = document.createElement("canvas");
            canvas.width = elem.width;
            canvas.height = elem.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(elem, 0, 0);

            var dataURL = canvas.toDataURL();
            self.upload(dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }
};


Fcm.prototype.openModal = function(){
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    this.initializeCamera();
};

Fcm.prototype.upload = function(data){

    var imageBase64 = data.replace(/^data:image\/(png|jpg);base64,/, "");
    $('#results').show();
    $('#selectImage').hide();
    $.ajax({
        //url: 'http://localhost:3000/upload',
        url: 'http://52.10.196.93:3000/upload',
        dataType: 'json',
        crossOrigin: true,
        data: {
            image: imageBase64
        },
        beforeSend: function() {
            $('#analyzingLabel').show();
        },
        type: "POST",
        success: function(data) {
            $('#analyzingLabel').hide();
            $('#thumbContainer').show();
            $("[data-toggle=tooltip]").popover({
                trigger: "hover",
                html: true,
                content: function() {
                    return $('#popover-content').html();
                }
            });
            var srcData = 'data:image/jpg;base64,' + data.outputBase64;
            var labels = data.labelFromImage.substring(1,data.labelFromImage.length+1);
            $('#gender').text(data.gender);
            $('#mood').text(data.mood);
            $('#age').text(data.age);
            $('#labels').text(labels);
            $('#thumbnail').attr('src',srcData);
        }
    });
};

Fcm.prototype.tryAnother = function(){
    $('#results').hide();
    $('#selectImage').show();
    $('#thumbContainer').hide();
    $('#thumbnail').attr('src','');
}

var fcm = new Fcm();