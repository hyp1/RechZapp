

function scriptTest(){
    alert("HALLO scriptTest")
}



//Browser File Select

function webpreviewFile(filefield,previewid){
    return new Promise(function (resolve,reject){
   // console.log(previewid);
if(typeof filefield.files!=='undefined'){
    var preview = document.querySelector(previewid); //selects the query named img
    var file    =filefield.files[0]; //sames as here
    var reader  = new FileReader();
    if(!file.name)return;
 //   preview.setAttribute('name',file.name);
    filefield.label=file.name;
    reader.onloadend = function () {
        preview.name = file.name;
        preview.src = reader.result;
        resolve(preview);      
    }     
    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
        return;
    } else {
        preview.src = "";
        reject(preview);
    }            
}
});

}

var stream = null;
function stopVideo(){
if(stream!=null)stream.getVideoTracks()[0].stop();
stream=null;
}
var front=true; 
var constraints = { audio: false, video: { facingMode: (front? "user" : "environment")}}; 

function startVideo(video){

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  var video = document.querySelector('video#video1');
  stream=mediaStream;
  video.srcObject = stream;
  video.onloadedmetadata = function(e) {
    video.play();
  };
}).catch(function(err){
    alert(err);
});
    /*
    // Grab elements, create settings, etc.
var video = document.getElementById('video1');

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => {
      video.srcObject = stream;
      video.onloadedmetadata = function(e) {
        video.play();
      };

    })
  .catch(e => console.log(e.name + ": "+ e.message));
*/

 /* 
navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


navigator.getMedia(
{
video: true,
audio: false
},
function(stream) {
if (navigator.mozGetUserMedia) {
video.mozSrcObject = stream;
} else {
var vendorURL = window.URL || window.webkitURL;
video.src = vendorURL.createObjectURL(stream);
}
video.play();
},
function(err) {
console.log("An error occured! " + err);
})

*/

}


function snapShot(imageelem){    
    var preview= document.querySelector('img#'+imageelem);
    var video = document.querySelector('video#video1');
    var canvas = document.querySelector('canvas#canvas1');
    var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 640, 480);
//        var image = new Image();
var name='snapshot_'+Date.now()+'.jpg';
preview.src = canvas.toDataURL("image/png");        
        preview.setAttribute('name',name);
    
return preview;

    }