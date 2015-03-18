var recSta;
var medSta;
var mediaRec;
var mediaPlay;
var mediaTimer;
var recInterval;
var beep;
var topicNO = 1;

document.addEventListener("deviceready", onDeviceReady, false);

function playAudio(src)
{
   console.log("RUN playAudio()");
   stopRec();
   stopAudio();
         // Create Media object from src
         if(src!=null){
           mediaPlay = new Media(src, onSuccess, onError, mediaStatus);
           document.getElementById('test').innerHTML = "play src: " + src;
       }
       document.getElementById("player").removeAttribute("hidden");
       document.getElementById("recorder").setAttribute("hidden");

       mediaPlay.play();


   }

   function mediaStatus(sta){
    medSta = sta;
    console.log("medSta="+medSta);
    switch(medSta){
        case 1:
            showdiv("player");
            document.getElementById("exId").setAttribute("disabled", true);
            document.getElementById("ansId").setAttribute("disabled", true);
            document.getElementById("canStart").setAttribute("disabled", true);
            document.getElementById("stopP").setAttribute("disabled", true);
            document.getElementById("pauseP").setAttribute("disabled", true);
            document.getElementById("rangeId2").setAttribute("disabled", true);
            document.getElementById("audio_position").innerHTML = "loading...";
            break;
        case 2://render
            document.getElementById("exId").removeAttribute("disabled");
            document.getElementById("ansId").removeAttribute("disabled");
            document.getElementById("canStart").removeAttribute("disabled");
            document.getElementById("stopP").removeAttribute("disabled");
            document.getElementById("rangeId2").removeAttribute("disabled");
            document.getElementById("pauseP").removeAttribute("disabled");
            setInterval_mediaTimer();
            break;
        case 4:
            clearInterval(mediaTimer);
            break;
    }

   }

   function stopAudio(){
    if(medSta==2||medSta==3)
        mediaPlay.stop();
}

   function pauseAudio(){
   if (medSta == 2){
       mediaPlay.pause();
   }
}
    // Record audio
    function recordAudio() {
        var src = "myrecording.wav";
        mediaRec = new Media(src, onSuccess, onError, recStatus);
        stopAudio();
        stopRec();
        // Record audio
        mediaRec.startRecord();
        document.getElementById("rangeId").max=10;
    }

    function recStatus(sta){
    console.log("recStatus="+sta);
    recSta = sta;
    switch(recSta) {
    case 2:
        switchTo("stop");
        beep.play();
        showdiv("recorder");
        setInterval_recInterval();
        break;
    case 4:
        switchTo("start");
        beep.play();
        showdiv("player");
        clearInterval(recInterval);
        break;
    }
    }

    function showdiv(s){
        if(s=="recorder"){
            document.getElementById("recorder").removeAttribute("hidden");
            document.getElementById("player").setAttribute("hidden");
        }else if(s=="player"){
            document.getElementById("player").removeAttribute("hidden");
            document.getElementById("recorder").setAttribute("hidden");
        }
    }

    function stopRec() {
    if(recSta == 2){
        console.log("stoping");
        mediaRec.stopRecord();
        //mediaPlay = new Media()
    }else{
        console.log("have stopped");
    }
    //mediaRec.play();Play instantly will cause error in android rec+play
    }
    
    function setInterval_mediaTimer(){
 
         mediaTimer = setInterval(function() //setInterval is a render function
         {
             //show the total duration (idk when mp3 finish downloading...)
             var duration = mediaPlay.getDuration();
             document.getElementById("rangeId2").max = duration*100;
             //console.log("duration = "+document.getElementById("rangeId2").max);   
             document.getElementById("duration").innerHTML = parseInt(duration / 60) +":"+    parseInt(duration % 60) + " sec";
             
             //if(test<5){console.log("RUN mediaTimer. duration="+duration); test+=1;}       
              
             // get mediaPlay position
             mediaPlay.getCurrentPosition(
                 // success callback
                 
                 function(position)
                 {
                     if (position > -1)
                     {
                         document.getElementById("audio_position").innerHTML = (parseInt(position/60) + ":" + parseInt(position % 60) +" sec");
                         document.getElementById("rangeId2").value = position*100;
                         //console.log("position = "+document.getElementById("rangeId2").value );       
                     }
                 },
                 // error callback
                 function(e)
                 {
                     console.log("Error getting audio position=" + e);
                 });
         }, 200);
 }

 function setInterval_recInterval(){
     var recTime = 0;
     recInterval = setInterval(function() //render
     {
         
         recTime = recTime + 1;
         console.log(recTime + " sec");
         var myNumber = parseInt(recTime);
         myNumber = ("0" + myNumber).slice(-2);
         document.getElementById("Rec_audio_position").innerHTML = "00:" + myNumber;
         document.getElementById("rangeId").value = recTime;
         //console.log("rangeId"+document.getElementById("rangeId").value );
         //document.getElementById("timerBar").value = recTime;
         if (recTime >= document.getElementById("rangeId").max)
         {
             stopRec();
         }
     }, 1000);
 }

 function next() {
    stopAudio();
    //reactive recorder UI
     document.getElementById("recorder").removeAttribute("hidden");
     document.getElementById("player").setAttribute("hidden");
    console.log("clicked next"); 
    if (topicNO >= document.getElementsByClassName("T1").length) {topicNO = 1;}
    else {topicNO += 1;}
    
    document.getElementById('topic').innerHTML = document.getElementsByClassName("T1")[(topicNO-1)].innerHTML;
  }

 function last() {
    stopAudio();
    //reactive recorder UI
     document.getElementById("recorder").removeAttribute("hidden");
     document.getElementById("player").setAttribute("hidden");
    console.log("clicked last"); 
    if (topicNO <= 1) {topicNO = document.getElementsByClassName("T1").length;}
    else {topicNO -=1;}
    document.getElementById('topic').innerHTML = document.getElementsByClassName("T1")[(topicNO-1)].innerHTML;
  }

  function rangeClick()
 {
     console.log("RUN rangeClick()");
     var sec = (document.getElementById("rangeId2").value)/100;
     if (medSta == 2 )
     {
         mediaPlay.seekTo(sec * 1000);
     }
     else if(medSta == 4||medSta == 3){
         playAudio();
         mediaPlay.seekTo(sec * 1000);
         //console.log("mediaPlay.seekTo" + (sec * 1000));
     }else alert("Media is Null");
 }

  function playEx(){
    console.log("playEx clicked"); 
    src = document.getElementsByClassName("EX1")[(topicNO-1)].innerHTML;
    console.log("src =" + src + "NO=="+topicNO); 
    //src = "https://dl.dropboxusercontent.com/u/47631918/Sk2App/1.%20Compulsory%20education%20is%20required%20for%20all%20children%20before%20age%2016.m4a";
    playAudio(src);  
 }
    // device APIs are available
    //
    function onDeviceReady() {
        recordAudio();
        //set topic
        document.getElementById('topic').innerHTML = document.getElementsByClassName("T1")[(topicNO-1)].innerHTML;
        //set beep
        function getPhoneGapPath() {
           var path = window.location.pathname;
           path = path.substr( path, path.length - 10 );
           console.log("device_platform will =>>");
           console.log("device_platform = "+ device.platform);
           if(device.platform == "Android"){
            path = 'file://' + path; 
            }
            console.log("beep path = "+path);
           return path;
       };
       beep = new Media(getPhoneGapPath()+"beep.mp3", onSuccess, onError); 
   }

    // onSuccess Callback
    //
    function onSuccess() {
        console.log("recordAudio():Audio Success");
    }

    // onError Callback
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    function switchTo(s){
        //console.log("RUN switchTo");

        if(s == "start"){
        //console.log("RUN switchTo to Start");
        document.getElementById("canStop").id = "canStart";
        document.getElementById("canStart").innerHTML = "Start Test <i class='ion-record'></i>";
        document.getElementById("canStart").onclick = function(){recordAudio();};    
    }else if(s == "stop"){
        //console.log("RUN switchTo to Stop");
        document.getElementById("canStart").id = "canStop";
        document.getElementById("canStop").innerHTML = "Stop Test <i class='ion-stop'></i>";
        document.getElementById("canStop").onclick = function(){stopRec();};
    }
    }
