import { Component } from '@angular/core';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
  webmedia.js WebRTC Video adapter.js
 https://github.com/webrtc/adapter
 */
 declare var webpreviewFile;  //Browser Datei Image select
 declare var startVideo;      //start Video 
 declare var stopVideo;       //stop
 declare var snapShot;        //Video Camera Snapshot  

 @Component({
  selector: 'upload',
  templateUrl: 'upload.html'
})
export class UploadComponent {
  MAX_UPLOADS:number=5;
  text: string;
  files: Array<{fid: number, name:string, src:string}>;
  hideUpl:boolean=false;
  toggleVideo:boolean=false;
  toggleFiles:boolean=false;
  toggleCamera:boolean=false;
  togglePhoto:boolean=false;
  awri:AwriConnectProvider;

  constructor(awri:AwriConnectProvider,private camera: Camera) {
    this.text = 'Sie können bis zu 5 Bilddateien anhängen.';
    this.awri=awri;
    this.files = [];
    for(var i=0;i<this.MAX_UPLOADS;i++)this.files.push({fid:-1,name:'',src:''});
  }

  nativeSelectFile(){
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let id=this.getImageID();
      this.files[id].fid=-1;
      this.files[id].src=base64Image;
      this.files[id].name=this.awri.uid+"-nativecam-"+Date.now()+".jpg";
      let input:any = document.getElementById('image'+id); 
      input.name = this.files[id].name;    
      input.src=this.files[id].src;
      this.hideUpload();
    }, (err) => {
      console.log(err);
      this.awri.showError(err);
    });
  }

  nativeCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let id=this.getImageID();
      this.files[id].fid=-1;
      this.files[id].src=base64Image;
      this.files[id].name=this.awri.uid+"-nativecam-"+Date.now()+".jpg";
      let input:any = document.getElementById('image'+id);
      input.src=this.files[id].src;
      input.name = this.files[id].name;    
      this.hideUpload();
    }, (err) => {
      console.log(err);
      this.awri.showError(err);
    });
  }

  toggleVid(){
    if(this.toggleVideo)this.toggleVideo=false;
    else this.toggleVideo=true;
    this.toggleFiles=false;
  }

  toggleFil(){
    if(this.toggleFiles)this.toggleFiles=false;
    else this.toggleFiles=true;
    this.toggleVideo=false;
 }

  toggleCam(evt){
    if(this.toggleCamera){
    //webmedia.js
    stopVideo();
    this.togglePhoto=false;
    this.toggleCamera=false;
    this.toggleVideo=false;
    evt.target.innerHTML="Start Kamera"
    } else{
      //webmedia.js 
      startVideo('video1');
      this.togglePhoto=true;
      this.toggleCamera=true;
      evt.target.innerHTML="Stop Kamera"
    }
  }

  getFiles(){
    let f=[]
    for(var i=0;i<this.MAX_UPLOADS;i++){
      let input:any=document.getElementById('image'+i);
      if(input.fid!=-1&&input.name!='')f.push({fid:input.fid});
    }
  return f;
  }

  removeImage(index){
    let input:any = document.getElementById('image'+index);
    input.src='';
    this.files[index].fid=-1;
    this.files[index].name='';
    this.files[index].src='';
    this.hideUpl=false;
  }

  selectWebFile(elem){
    let i=this.getImageID();
      //webmedia.js
    webpreviewFile(elem.srcElement,'img#image'+i).then(data=>{
      this.files[i].fid=-1;
      this.files[i].src=data.src;
      this.files[i].name=data.name;
      this.hideUpload();
    }).catch(err=>{
      console.log(err);
      this.awri.showError(err);
    }) 
  }

  selectWebVideo(elem){
    var i=this.getImageID();
    //webmedia.js
    var data=snapShot('image'+i);
    this.files[i].fid=-1;
    this.files[i].src=data.src;
    this.files[i].name=data.name;
    this.hideUpload();
  }


  getImageID(){
    for(var i=0;i<5;i++)
      if(this.files[i].src==='')return i;      
  }

  hideUpload() {
    for(var i=0;i<this.files.length;i++){
      if(this.files[i].src==='')return this.hideUpl=false;
    }  
  this.hideUpl=true;
  }

  uploadFile(imgid){ 
    let input:any = document.getElementById('image'+imgid);
    let dataURI=this.files[imgid].src;
    dataURI=dataURI.substring(dataURI.indexOf(',')+1,dataURI.length);     
    let ext=input.name.split('.').pop();
    let filedata={
      "filesize":dataURI.length,
      "filename": input.name,
      "filemime":"image/"+ext,
       "filepath":'public://attachments/'+input.name,
       "status": 0,
       "file": dataURI 
    };   
    if(this.files[imgid].fid==-1&&this.files[imgid].name!=='')this.awri.uploadFile(filedata).then(data=>{
        let dat:any=data;
        input.fid=dat.fid;
        this.files[imgid].name=input.name;
        this.files[imgid].fid=dat.fid;
     }).catch(err=>{
        console.log(err);
        this.awri.showError(err);
     });
  }


  uploadAllFiles(){
    for(var i=0;i<this.MAX_UPLOADS;i++)    
      if(this.files[i].fid==-1&&this.files[i].name!='')this.uploadFile(i);     
  }

}
