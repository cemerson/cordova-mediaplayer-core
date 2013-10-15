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

    initMediaPlayerForAudio() or initMediaPlayerForVideo()

Examples:

    initMediaPlayerForVideo("VIDEO: Remote Example (HTTP://)",
                            "http://www.mysite.com/video.mp4",
                            "http://www.mysite.com/video_thumb.jpg",
                            "The greatest online video ever.");

    initMediaPlayerForVideo("VIDEO: Local Example (FILE:\\\\)",
                            "example-media/example_video.mp4",
                            "example-media/example_video.png",
                            "The greatest offline video ever.");

    initMediaPlayerForAudio("AUDIO: Remote Example (HTTP://)",
                            "http://www.mysite.com/example.mp3",
                            "http://www.mysite.com/thumb.jpg",
                            "The greatest online audio ever.");

    initMediaPlayerForAudio("AUDIO: : Local Example (FILE:\\\\)",
                            "example-media/example_audio.mp3",
                            "example-media/example_audio.jpg",
                            "The greatest offline audio ever.");

Confirm you have the related "[common/js](https://github.com/cemerson/common)" repo loaded in your project as well

If you have problems or questions getting this to work you can see "Cordova-MediaPlayer" in action by cloning and trying out the full test project here: https://github.com/cemerson/Cordova-MediaPlayer
