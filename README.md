cordova-mediaplayer-core
========================

# Summary

The core functionality behind the "[Cordova-MediaPlayer](dfdf)" project.

# Usage

To use "Cordova-MediaPlayer" in your Cordova app project:

Add following to your index.html <head>

    <link rel="stylesheet" type="text/css" href="js/cordova-mediaplayer/cordova-mediaplayer.css" />

Add following to your index.html <body>

    <div id="cordova_media_player"></div>
    <script type="text/javascript" src="js/cordova-mediaplayer/cordova-mediaplayer.js"></script>

Call this method on your body load (or similar) event:

    setupCordovaMediaPlayer();

Then call the following methods as needed:

    initMediaPlayerForAudio(audioTtleText,audioPath,audioThumbPath,audioDescriptionText);
    initMediaPlayerForVideo(videoTtleText,videoPath,videoThumbPath,videoDescriptionText);

Confirm you have the related "[common/js](https://github.com/cemerson/common)" repo loaded in your project as well

If you have problems or questions getting this to work you can see "Cordova-MediaPlayer" in action by cloning and trying out the full test project here: https://github.com/cemerson/Cordova-MediaPlayer
