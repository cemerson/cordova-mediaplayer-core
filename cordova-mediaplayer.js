var audioElement = null;                      // Cordova Media element or HTML <audio> element
var audioPlaybackProgressCheckInterval = null;                    // interval that watches audioElement progress/position
var prevTimeLeftInFile;                   // helper var to determine when audio finishes
var useCordovaMediaElement = false;       // boolean to determine type of element audioElement is
var currentMediaPath;                   // ...
var currentMediaPaused = undefined;       // ...
var currentMediaAlreadyLoaded = false;    // ...
var currentMediaPlaying = false;          // ...
var delayedAudioPlaybackTimeout;          // ...
var delayedVideoPlaybackInterval;
var cmpHeight, cmpWidth;
var termLoading = "Loading";
// unused for now:
// var videoFileExt = "m4v"; // iOS
// if(isMobile.Android()) videoFileExt = "mp4";


/* ===================== AUDIO SPECIFIC STUFF ===================== */

/* --------------------------------------- */
function playAudio(src) {

  // alert('playAudio [' + src + ']...');
  report('TEST','playAudio(' + src + ')...');
  try{

    prevTimeLeftInFile = 0;

    // [useCordovaMediaElement]
    // I have found that iOS does better playing audio via a
    // HTML <audio> element vs the Cordova Media element - so
    // I ONLY use Cordova Media for Android (which does well with it).
    // But set this boolean however you'd like.
    if(isMobile.Android()) useCordovaMediaElement = true;


    // create/init [audioElement]
    if(useCordovaMediaElement){
      // (Cordova MEDIA element)
      audioElement = new Media(src, onSuccess, onError);
    }else{
      // (HTML5 Audio)
      audioElement = document.getElementById("app_audio");
    }

    audioElement.play();


  }catch(e){
    report('ERROR','!! ERROR: audio.js playAudio() [' + e.message + ']');
  }

  // Update audioElement position every second
  if (audioPlaybackProgressCheckInterval == null) {
    audioPlaybackProgressCheckInterval = setInterval(function() {
      try{
          if(currentMediaAlreadyLoaded && currentMediaPaused) return;

          var position;
          if(useCordovaMediaElement){
            position = audioElement.getCurrentPosition(cordovaMediaGetCurrentPositionSuccess, cordovaMediaGetCurrentPositionError);
          }else{
            report('TEST','HTML <audio>....processing [duration] {' + audioElement.duration + ' (' + parseInt(audioElement.duration) + ')} <' + audioElement.readyState + '>');
            if(parseInt(audioElement.duration)){
              report('TEST','audioPlaybackProgressCheckInterval(pos:' + audioElement.currentTime + ', dur:' + audioElement.duration + ')...');
              processAudioPosition(audioElement.currentTime,audioElement.duration);
            }else{
              report('TEST','audioPlaybackProgressCheckInterval waiting on duration...');
            }
          }

      }catch(e){
        report('ERROR','!! ERROR: audio.js playAudio().audioPlaybackProgressCheckInterval [' + e.message + ']');
      }

    }, 1000);
  }
}

/* --------------------------------------- */
function cordovaMediaGetCurrentPositionSuccess(position) {
  try{
    report('TEST','CORDOVA <media>....processing [position] {' + position + '}');
    processAudioPosition(position);
  }catch(e){
    report('ERROR','!! ERROR: audio.js cordovaMediaGetCurrentPositionSuccess() [' + e.message + ']');
  }
}


/* --------------------------------------- */
function cordovaMediaGetCurrentPositionError(e) {
  console.log("Error getting pos=" + e);
  refreshMediaPositionLabel("00:00"); //Error: " + e);
}

/* --------------------------------------- */
function processAudioPosition(position,duration){
 if(!duration) duration = audioElement.getDuration();
 report('TEST','[CMP].processAudioPosition(pos:' + parseInt(position) + ',dur:' + duration + ')...');
  try{
    if (parseInt(position) > 0){ //-1) {
      if(currentMediaAlreadyLoaded && currentMediaPaused) return;

      _mediaPlaybackHasStarted();


      var timeLeft = duration - position;
      refreshMediaPositionLabel(Utility.formatTime(timeLeft)); // + " sec");

      // trigger stopped method when reaching end of file
      // since there is no STOPPED or COMPLETE property at the moment
      if((prevTimeLeftInFile >= 1) && (timeLeft <= 1)){
        report('TEST','calling _mediaPlaybackHasBeenStopped() because we think we\'ve reached the end of the file ..');
        _mediaPlaybackHasBeenStopped();
      }
      prevTimeLeftInFile = timeLeft;
    }
  }catch(e){
    report('ERROR','!! ERROR: audio.js processAudioPosition(pos:' + position + ',dur:' + duration + ') [' + e.message + ']');
  }
}

/* --------------------------------------- */
function pauseAudio() {
  if(typeof(mediaPlaybackHasBeenPaused) == 'function') mediaPlaybackHasBeenPaused();

  if ((audioElement) && ($('#app_audio').length)){
    audioElement.pause();
  }

}

/* --------------------------------------- */
function resumeAudio() {
  if (audioElement) {
    audioElement.play();
  }
  if(typeof(_mediaPlaybackHasStarted) == 'function') _mediaPlaybackHasStarted();
}

/* --------------------------------------- */
function stopAudio() {

  if ($('#app_audio').length){
    if (audioElement) {
      if(useCordovaMediaElement){
        audioElement.stop();
      }else{
        audioElement.pause();
      }
    }
  }

  clearTimeoutVar(delayedAudioPlaybackTimeout);

  clearIntervalVar(audioPlaybackProgressCheckInterval);
  audioPlaybackProgressCheckInterval = null;

  _mediaPlaybackHasBeenStopped();
}

/* --------------------------------------- */
function onSuccess() {
  console.log("AUDIO.JS: playAudio():Audio Success");
}

/* --------------------------------------- */
function onError(error) {
  console.log('AUDIO.JS ERROR: code: '    + error.code    + '\nmessage: ' + error.message + '\n');
}

/* --------------------------------------- */
function refreshMediaPositionLabel(labelString) {
  $('#cmp_status_or_position').html(labelString);
console.log('Media Label Change [' + labelString + ']');
}



/* ----------------------------------------------------------- */
function initMediaPlayerForAudio(audioTitle,audioPath,audioThumbPath,audioDesc){
  report('TEST','[CMP].initMediaPlayerForAudio(audioPath:' + audioPath + ')..');
  try{

    _closeMediaPlayer();

    $('#cordova_mediaplayer')
      .removeClass('playing disabled');

    // VARS
    var audioTitle = audioTitle;
    if(!audioDesc) audioDesc = "No audio description provided.";
    var audioDesc = audioDesc;

    $('#cordova_mediaplayer').removeClass('video').addClass('audio');
    $('#cmp_header h1').html(audioTitle);
    $('#cordova_mediaplayer #cmp_desc').html(audioDesc);
    $('#media_details').show();


    $('#app_audio').remove();
    var _audioTagHTML = '<audio id="app_audio" ' +
                                  ' audio_path="' + audioPath  + '" ' +// '?cachedID=' + cacheVersionID + '" ' +
                                  ' src="' + audioPath + '" ' + //'?cachedID=' + cacheVersionID + '" ' +
                                  ' preload="auto" class="jp-audio" type="audio/mp3"/>';
    $('#cmp_media_container').append(_audioTagHTML);

    initMediaLoading('AUDIO',audioPath,audioThumbPath);

  }catch(e){ catchError('initMediaPlayerForAudio()',e); }
}





/* ----------------------------------------------------------- */
function initMediaPlayerForVideo(videoTitle,videoPath,videoThumbPath,videoDesc){
  report('TEST','[CMP].initMediaPlayerForVideo(videoPath:' + videoPath + ')..');
  try{

    _closeMediaPlayer();

    // REFRESH UI

    $('#cordova_mediaplayer,#media_playpause').removeClass('playing disabled');
    $('#audio_item,#media_loading_msg').hide();

    // VARS
    var videoTitle = videoTitle;
    if(!videoDesc) videoDesc = "No video description provided.";
    var videoDesc = videoDesc;

    $('#cordova_mediaplayer').removeClass('audio').addClass('video');
    $('#cmp_header h1').html(videoTitle);
    $('#cordova_mediaplayer #cmp_desc').html(videoDesc);
    $('#media_details').show();

    // Remove and Re-Append <video> tag each time
    var _videoTagHTML = '<video id="app_video" type="video/mp4" video_path="' + videoPath + '"/>'; //class="media_controls"
    $('#app_video').remove();
    $('#cmp_media_container').append(_videoTagHTML);

    if(isMobile.Android()){
      // ANDROID: provide the src on the <video> tag
      $('#app_video')
        .attr('src',videoPath);
    }else{
      // iOS:
      //    do NOT provide the src on the <video> tag
      //    Instead add <source> node with the src
      $('#app_video source').remove(); // remove previous <source> nodes if exist
      $('#app_video')
        .attr('webkit-playsinline','')
        .attr('controls','controls')
        .append('<source src="' + videoPath + '" type="video/mp4"/>');
    }

    initMediaLoading('VIDEO',videoPath,videoThumbPath);

  }catch(e){ catchError('initMediaPlayerForVideo()',e); }
}



/* ----------------------------------------------------------- /
  _prepUIElementsForMediaPlayback
/ ----------------------------------------------------------- */
function _prepUIElementsForMediaPlayback(){
  report('TEST','[CMP]._prepUIElementsForMediaPlayback()..');
  try{

    // $('#app_media_thumb').css('backgroundImage','url(' + currentMediaThumbPath + ')');

    var _appMediaThumbHeight = Math.min(Math.round($('#app_media_thumb').height()*90),480);
    var _appMediaThumbWidth = Math.round(window.innerWidth*.90); //$('#app_media_thumb').width();

    // DETAILS BOX HEIGHT
    // $("#cordova_mediaplayer")//  ;;_elements")
    //   .css("height",_appMediaThumbHeight+"px")
    //   .css("width",_appMediaThumbWidth+"px");

    // update the click/touch event on video play/pause button
    $('#media_playpause')
      .unbind(clickOrTouchEvent)
      .bind(clickOrTouchEvent,function(e){
        toggleMediaPlayback();
        e.stopPropagation();
      });

    // Then remove loading class we're done!
    $('#cordova_mediaplayer').removeClass('loading');

    if(typeof(prepUIElementsForMediaPlayback) == 'function') prepUIElementsForMediaPlayback();


  }catch(e){ catchError('_prepUIElementsForMediaPlayback()',e); }
}


/* ----------------------------------------------------------- /
  toggleMediaPlayback
/ ----------------------------------------------------------- */
function toggleMediaPlayback(forceMode){


  try{

    if(!isConnectedToInternet()){ // alert('getConnectionType() [' + getConnectionType() + '] | isConnectedToInternet() [' + isConnectedToInternet() + ']');
      doAlert('Video playback requires an internet connection. Please connect this device to a WiFi or a 3G/4G network and try again.','Internet Connection Required');
      return false;
    }

    var _mediaMode = "VIDEO";
    if($('#app_audio').length) _mediaMode = "AUDIO";

    switch(_mediaMode){

      // ===== VIDEO ====================================

      case 'VIDEO':
        report('TEST','[CMP]. toggleMediaPlayback(VIDEO)..');

        var video = document.getElementById("app_video");
        // var _paused = ((isMediaPlayerPaused(video)) || (forceMode == 'PAUSED'));

        if(currentMediaPaused){ //_paused){
          report('TEST','\t ... VIDEO WAS paused ... trying to PLAY ');

          initMediaPlayerBuffering('START');

          //if(!isMobile.Android()){
          var _videoPath = $('#app_video').attr('video_path');
          var _currentVideoPath = video.getAttribute("src");
          if(_videoPath != currentMediaPath){ //} _currentVideoPath != _videoPath){
            video.setAttribute("src", _videoPath);
          }
          //}

          playVideo();


        }else{
          report('TEST','\t ... VIDEO was NOT paused ... trying to PAUSE ');
          currentMediaPlaying = true;
          currentMediaPaused = true;
          $('#cordova_mediaplayer').removeClass('playing').addClass('paused');
          video.pause();
        }
        break;


      // ===== AUDIO ==============================
      case 'AUDIO':
        report('TEST','[CMP].toggleMediaPlayback(AUDIO)..'); // report('TEST','** AUDIO: paused=' + _paused + ' | currentMediaPaused:' + currentMediaPaused + ' | currentMediaPlaying:' + currentMediaPlaying + '|');

        if(currentMediaPaused){
          report('TEST','\t ... AUDIO WAS paused ... trying to PLAY ');

          if(!currentMediaAlreadyLoaded){
            stopAudio();
            initMediaPlayerBuffering('START');
            clearTimeoutVar(delayedAudioPlaybackTimeout);
            delayedAudioPlaybackTimeout = window.setTimeout(function(){
                playAudio(currentMediaPath);
            },800);
          }else{
            resumeAudio();
          }


        }else{
          report('TEST','\t ... AUDIO was NOT paused ... trying to PAUSE ');
          pauseAudio();

        }

        break;
    }


  }catch(e){ catchError('toggleMediaPlayback()',e); }
}




/* ----------------------------------------------------------- /
  _mediaPlaybackHasBeenStopped
/ ----------------------------------------------------------- */
function _mediaPlaybackHasBeenStopped(){
  report('TEST','[CMP]._mediaPlaybackHasBeenStopped()..');
  try{

      if(typeof(currentMediaAlreadyLoaded) == 'undefined'){
        // alert('setting it!');
        currentMediaAlreadyLoaded = false;
      }
      if(
          (currentMediaAlreadyLoaded) ||
          (currentMediaPlaying)
        ){
        // only run if one of above vars arent flagged false yet
        currentMediaAlreadyLoaded = false;
        currentMediaPlaying = false;
        currentMediaPaused = true;
        initMediaPlayerBuffering('END');
      }

      $('#cordova_mediaplayer')
        .removeClass('playing')
        .addClass('paused');

      clearAllMediaTimersAndIntervals();

      if(typeof(mediaPlaybackHasBeenStopped) == 'function') mediaPlaybackHasBeenStopped();

  }catch(e){ catchError('_mediaPlaybackHasBeenStopped()',e); }
}

/* ----------------------------------------------------------- /
  _mediaPlaybackHasStarted
/ ----------------------------------------------------------- */
function _mediaPlaybackHasStarted(){
  report('TEST','[CMP]._mediaPlaybackHasStarted().. [currentMediaAlreadyLoaded:' + currentMediaAlreadyLoaded + ' | currentMediaPlaying:' + currentMediaPlaying + ']');
  try{
      //only run if one of main vars is false
      if(!currentMediaAlreadyLoaded || !currentMediaPlaying){

        report('TEST','!!!!! _mediaPlaybackHasStarted().. SETTING currentMediaAlreadyLoaded to TRUE!');

        currentMediaAlreadyLoaded = true;
        currentMediaPlaying = true;
        currentMediaPaused = false;
        initMediaPlayerBuffering('END');


        if(!cordovaIsLoaded){
          // css flag so we know when we're not in device playback mode
          $('#cordova_mediaplayer').addClass('playing_non_device_mode');
        }else{
          // reset play/pause button on devices
          $('#cordova_mediaplayer').removeClass('playing').addClass('paused');
          currentMediaAlreadyLoaded = false;
          currentMediaPlaying = false;
          currentMediaPaused = false;
        }

        $('#cordova_mediaplayer').removeClass('paused').addClass('playing');
      }

      if(typeof(mediaPlaybackHasStarted) == 'function') mediaPlaybackHasStarted();


  }catch(e){ catchError('_mediaPlaybackHasStarted()',e); }
}

/* ----------------------------------------------------------- /
  mediaPlaybackHasBeenPaused
/ ----------------------------------------------------------- */
function mediaPlaybackHasBeenPaused(){
  report('TEST','[CMP].mediaPlaybackHasBeenPaused()..');
  try{

      currentMediaPlaying = false;
      currentMediaPaused = true;

      $('#cordova_mediaplayer')
        .removeClass('playing loading buffering')
        .addClass('paused');

  }catch(e){ catchError('mediaPlaybackHasBeenPaused()',e); }
}


/* ----------------------------------------------------------- */
function clearAllMediaTimersAndIntervals(){
  report('TEST','[CMP].clearAllMediaTimersAndIntervals()..');
  try{
    clearIntervalVar(audioPlaybackProgressCheckInterval);
    clearTimeoutVar(delayedAudioPlaybackTimeout);
    clearIntervalVar(delayedVideoPlaybackInterval);

  }catch(e){ catchError('clearAllMediaTimersAndIntervals()',e); }
}

function stopVideo(){

  //PWreenableAutoLock();
  currentMediaPlaying = false;
  try{

    $('#app_video').remove();

  }catch(e){ catchError('stopVideo()',e); }

}

/* -------------------------------------- */
function _closeMediaPlayer(){
  report('TEST','_closeMediaPlayer()...');

  stopAudio();
  stopVideo();

  clearAllMediaTimersAndIntervals();

  currentMediaAlreadyLoaded = false;
  currentMediaPlaying = false;
  currentMediaPaused = false;
  mediaPlayerClosed = true;
  initMediaPlayerBuffering('END');

  // PWreenableAutoLock();

  // DOM stuff
  $('#app_video,#app_audio').remove();
  $('#cordova_mediaplayer')
    .removeClass('playing paused video audio buffering playing_non_device_mode');
  $('#cmp_status_or_position').html("");
  $("body").removeClass('media_playback_mode');
  $('#cmp_header h1').html("");
  $('#cmp_desc').html("");


  if(typeof(closeMediaPlayer) == 'function') closeMediaPlayer();

}

/* ----------------------------------------------------------- */
function initMediaGallery(){
  report('TEST','[CMP].initMediaGallery()..');
  try{
    initOrUpdatePodcastList();
    initOrUpdateVideoList();
    initMediaGalleryEvents();
    initMediaGalleryScrolling();
    toggleMediaList("SHOW");

  }catch(e){ catchError('initMediaGallery()',e); }
}

/* ----------------------------------------------------------- */
function setupCordovaMediaPlayer(playerWidth,playerHeight,defaultTitle, defaultText,defaultThumb){
  report('TEST','\nCordova Media Player initializing ... [CMP]\n');
  report('TEST','[CMP].setupCordovaMediaPlayer(playerWidth:' + playerWidth + ',playerHeight:' + playerHeight + ')..');
  try{

    _defaultText = '';
    _defaultTitle = '';
    if(defaultText) _defaultText = defaultText;
    if(defaultTitle) _defaultTitle = defaultTitle;

    if($('#cordova_mediaplayer')){
      cmpHeight = 270;
      cmpWidth = 480;
      if(playerHeight) cmpHeight = playerHeight;
      if(playerWidth) cmpWidth = playerWidth;
      var mediaPlayerHTML = "";
      mediaPlayerHTML += '<div id="cmp_loading_spinner" class="processing_spinner rotate"></div>' +
                          '<div id="cmp_header">' +
                          '   <div class="label_new"></div>' +
                          '   <h1>' + _defaultTitle + '</h1>' +
                          '</div>' +
                          '<div id="cmp_media_container">' +
                          ' <div id="app_media_thumb"><img/></div>' +
                          '   <div id="cmp_status_or_position"></div>' +
                          '   <div id="cmp_controls" class="media_controls ">' +
                          '       <div id="media_playpause" class="media_button image_icon playpause_button"></div>' +
                          '   </div>' +
                          '   <div id="cmp_media_elements">' +
                          '   </div>' +
                          '</div>' +
                          '<div id="cmp_details">' +
                          '     <div id="cmp_desc">' + _defaultText + '</div>' +
                          '</div>';

      $('#cordova_mediaplayer')
        .html(mediaPlayerHTML)
        .css({
                'width':cmpWidth + 'px'//,
                //'height':cmpHeight + 'px'
            });

      var headerHeight = $('#cmp_header').height();
      var availableHeight = cmpHeight-headerHeight;
      var controlsHeight = $('#media_playpause').height();
      var spinnerHeight = $('#cmp_loading_spinner').height();
      // alert('a: ' + headerHeight + ', b:' + availableHeight + ', c:' + controlsHeight);

      // base media thumb sizing
      $('#cmp_media_container').css('height',availableHeight + 'px');
      $('#app_media_thumb').css({
                                  'width':cmpWidth + 'px',
                                  'height':availableHeight + 'px'
                                });

       // status label position
       //$('#cmp_status_or_position').css('top',(headerHeight+10) + 'px');
       // control buttons position
       $('#cmp_controls').css('top',(availableHeight-(controlsHeight+20)) + 'px');
       $('#cmp_media_elements').css('top',(availableHeight + 10) + 'px');
       $('#cmp_loading_spinner').css('top', ((availableHeight/2) + (spinnerHeight/2)) + 'px');


        if(defaultThumb) refreshMediaThumbnail(defaultThumb);



      // DEVICE MODE
      // if we're on an actual device, this class will always hide the
      // <video> element since we never actually play it inline in this example
      // project. Note if inline playback is desired this class can be overridden via CSS
      // such as body.tablet_mode #cordova_mediaplayer.device_mode video { display:block !important; }
      if(cordovaIsLoaded){
        $('#cordova_mediaplayer').addClass('device_mode');
      }
    }
  }catch(e){ catchError('setupCordovaMediaPlayer()',e); }
}


/* ----------------------------------------------------------- */
function pauseAllMedia(){
  report('TEST','[CMP].pauseAllMedia()..');
  try{

  if(currentMediaPlaying){
    toggleMediaPlayback('PAUSE');
  }

  }catch(e){ catchError('pauseAllMedia()',e); }
}





/* ----------------------------------------------------------- /
  isMediaPlayerPaused
/ ----------------------------------------------------------- */
function isMediaPlayerPaused(audioOrVideoItem){
  var p = false;
  var _mediaElementIsPaused = false;
  try{
    _mediaElementIsPaused = (audioOrVideoItem.paused);
  }catch(e){ catchError('isMediaPlayerPaused()',e); }

  try{
    p = _mediaElementIsPaused;

  }catch(e){ catchError('isMediaPlayerPaused()',e); }

  report('TEST','[CMP].isMediaPlayerPaused()..paused:' + p + '? [_mediaElementIsPaused:' + _mediaElementIsPaused + '], [currentMediaPlaying:' + currentMediaPlaying + '], [currentMediaPaused:' + currentMediaPaused + ']');
  return p;
}

/* ----------------------------------------------------------- /
  initMediaLoading
/ ----------------------------------------------------------- */
function initMediaLoading(videoOrPodcast,mediaPath,mediaThumbPath){
  report('TEST','[CMP].initMediaLoading(videoOrPodcast:' + videoOrPodcast + ', mediaPath:' + mediaPath + ', mediaThumbPath:' + mediaThumbPath  + ')..');
  try{

    $('#cordova_mediaplayer').addClass('loading');
    $('#cordova_mediaplayer div.label_new').hide();
    currentMediaPlaying = false;
    currentMediaPaused = true;
    currentMediaAlreadyLoaded = false;
    currentMediaPath = fixLocalFilePathsForAndroid(mediaPath);
    currentMediaThumbPath = mediaThumbPath;

    // MEDIA THUMB
    $('#app_media_thumb').css('background-image','none');
    $('#cordova_mediaplayer').addClass('loading');

    refreshMediaThumbnail(currentMediaThumbPath,_prepUIElementsForMediaPlayback);

  }catch(e){ catchError('initMediaLoading()',e); }
}


function refreshMediaThumbnail(thumbPath,postThumbLoadCallback){

  try{

    $('<img/>').attr('src', thumbPath).load(function() {
       $(this).remove();
       $('#app_media_thumb').css({'background-image':'url(' + thumbPath + ')'});
       // run callback after loading finished if desired
       if(postThumbLoadCallback) postThumbLoadCallback();
    });

  }catch(e){ catchError('refreshMediaThumbnail()',e); }

}

function initMediaPlayerBuffering(startOrEnd){
  report('TEST','[CMP].initMediaPlayerBuffering(' + startOrEnd + ')...');
  try{

    $('#media_playpause').empty();

    switch(startOrEnd){
      case 'START':
        refreshMediaPositionLabel(termLoading + " ...");
        $('#cordova_mediaplayer').addClass('buffering');
        $('#media_playpause')
          .append('<div class="processing_spinner rotate">');
        break;

      case 'END':
      default:
        $('#cordova_mediaplayer .media_button .processing_spinner').remove();
        $('#cordova_mediaplayer').removeClass('buffering');
        clearIntervalVar(delayedVideoPlaybackInterval);
        clearTimeoutVar(delayedAudioPlaybackTimeout);
        break;
    }
  }catch(e){ catchError('initMediaPlayerBuffering()',e); }

}


function androidLocalVideoPlaybackMethodRequired(){
  if(!isMobile.Android()) return false;
  var isRequired = false;
  try{
    isRequired = ((isMobile.Android()));
  }catch(e){
    catchError('androidLocalVideoPlaybackMethodRequired()',e);
  }
  report('TEST','[CMP].androidLocalVideoPlaybackMethodRequired() [' + isRequired + ']');
  return isRequired;
}


/* ----------------------------------------------------------- /
  playVideo
/ ----------------------------------------------------------- */
function playVideo(){

  try{

      // stop existing video?
      report('TEST','[CMP].playVideo() [currentMediaPath:' + currentMediaPath + ']');

      var video = document.getElementById("app_video");
      initMediaPlayerBuffering('START');
      clearIntervalVar(delayedVideoPlaybackInterval);

      if(androidLocalVideoPlaybackMethodRequired()){
        window.plugins.videoPlayer.play(currentMediaPath);
        initMediaPlayerBuffering('END');
        return true;
      }else{
        // OTHERWISE CONTINUE
        video.play();
        video.pause();
      }

      delayedVideoPlaybackInterval = window.setInterval(function(){
        var seek = 0;
        try{
          if(video.seekable) seek = video.seekable.end(0);
        }catch(e){
          // we tried
        }

        report('TEST','playVideo() [CMP].video play interval: readyState=[' + video.readyState + '] seek=[' + seek + '] androidLocalVideoPlaybackMethodRequired=[' + androidLocalVideoPlaybackMethodRequired() + ']');
        var videoReadyForPlayback = (
                                      (parseInt(video.readyState) >= 3) ||
                                      ((seek > 30) && (parseInt(seek) != 6000)) ||
                                      (androidLocalVideoPlaybackMethodRequired())
                                      );


        if(videoReadyForPlayback){
          report('TEST','\t... READY FOR PLAYBACK(?) [playVideo() [CMP].video.play()]');

          _mediaPlaybackHasStarted();

          // FINALLY start video playback!
          if(androidLocalVideoPlaybackMethodRequired()){
            // video already playing via Android video plugin
          }else{
            // jump back to start of video (ios sometimes caches/saved last played video's currentTIme)
            video.currentTime=0;
            video.play();
          }

        }else{
          report('TEST','\t... playVideo() [CMP].buffering...');
          // keep waiting...
        }
      },2000);


  }catch(e){ catchError('playVideo()',e); }

}

console.log('[cordova-mediaplayer.js] LOADED...');
