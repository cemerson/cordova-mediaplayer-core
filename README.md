cordova-mediaplayer-core
========================

# Updates

20131106:
 - Stripped down the CSS to just the bare essentials
 - Add some parameters to the setupCordovaMediaPlayer() method: width, height, default title/description/thumbnail
 - Added a new file for css customization example/abstraction: (cordova-mediaplayer-style.css)[https://github.com/cemerson/cordova-mediaplayer-core/blob/master/cordova-mediaplayer-theme.css]
 - Added few more 'callback' type methods (see "Optional Methods" section below)
 - Updated how video playback on device works - so the play/pause button should work better now after video is dismissed
 - ...
 
201310014:
 - Moved the "core" cordova-mediaplayer functionality to a seperate repo here: [cordova-mediaplayer-core](https://github.com/cemerson/cordova-mediaplayer-core)
 - Setup this project to use the above as a submodule

# Summary

![Screenshot](http://farm8.staticflickr.com/7413/9790015075_6f30de9917_o.png)

This repo contains the core files needed to add iOS and Android compatible audio and video playback functionality to a Cordova/Phonegap app. This is by no means from perfect but after going through sheer hell getting this working for a project I decided to extract the base audio/video functionality for later use and figured I'd share w/anyone else who might need this kind of functionality and isn't interested in travelling through the 7 levels of hell to get it working.

Special thanks to [Simon McDonald](https://github.com/macdonst/VideoPlayer) and [Justin Obney](https://github.com/justinobney/PhoneGap-Video). The Android video functionality is using Simon's VideoPlayer plugin (and Justin's Cordova 3.0 update to it).

Depending on various things I may clean things up so it resembles a pseudo Cordova Plugin - not in the traditional sense but in the sense that this can be "plugged" into a Cordova project and used as easily as a plugin with a couple javascript calls. Technically it's at that point now I suppose but it's not clean/abstract enough IMO yet.

# Current Features:

- Working examples of AUDIO and VIDEO playback in a Cordova app using local (file:\\) and remote (http://) audio or video files
- Works on iOS and Android!
- Includes:
    - Play/pause button
    - Very basic countdown progress label for audio

# Usage

To see these files in action in an actual app go check out my [PhoneGap 3 Boilerplate project](https://github.com/cemerson/PhoneGap-3-Boilerplate). But if all you need is the functionality for your app this repo is what you need.

To use "Cordova-MediaPlayer" in your Cordova app project:

Add following to your index.html <head>

    <link rel="stylesheet" type="text/css" href="js/cordova-mediaplayer/cordova-mediaplayer.css" />
    (Optional) <link rel="stylesheet" type="text/css" href="js/cordova-mediaplayer/cordova-mediaplayer-theme.css" />

Add following to your index.html <body>

    <div id="cordova_media_player"></div>
    <script type="text/javascript" src="js/cordova-mediaplayer/cordova-mediaplayer.js"></script>

Call this method on your body load (or similar) event:

    setupCordovaMediaPlayer(playerWidth,playerHeight,defaultTitle, defaultText,defaultThumb);

Example:

    setupCordovaMediaPlayer(320,240,'Cordova Media Player','Hello world.','images/player_background.png');

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

# Optional Methods

If you create methods with any of the following names the cordova mediaplayer will call them at the corresponding moments.

- mediaPlaybackHasBeenStopped()
- mediaPlaybackHasStarted()
- closeMediaPlayer()
- prepUIElementsForMediaPlayback()
- mediaPlaybackHasBeenPaused()

# Notes

- iPad/Tablet use still needs to tweaking - test/use this on 'phones' for demonstration purposes.
- Only file formats tested so far are: MP4 (for video) and MP3 (for audio)
- There is a method called fixLocalFilePathsForAndroid() in /js/common/mobile.js that adds "/android_asset/www/" to the front of local file paths so local audio and video file paths can simply assume the current folder is www. This may evolve or go away if/when Blackberry/Windows support is added.
- Windows and Blackberry compatibility may be added later
- config.xml needs this line for iOS: &lt;preference name="AllowInlineMediaPlayback" value="true" /&gt;
- Plugins currently setup in project:
    - [File](https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git)
    - [Media](https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git)
    - [Console](https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git)
    - [PhoneGap-Video](https://github.com/justinobney/PhoneGap-Video)
    - [~~Network-Information~~](https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.githttps://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git)
- For some reason the Network-Information plugin wonked out after setting this up on GitHub. I've noticed odd things with adding/removing Cordova plugins via command line so this isn't super shocking. In any case this project does require this plugin so I've added the necessary extra steps to the usage section above.

# Disclaimers:

- This is an unofficial, unsupported project! Please use if you find it helpful but I can't provide much support for it. I will hopefully get a chance to expand on it in the future though.
- CSS not optimized/fancy (Android may layout imperfectly)
- Only tested so far on Android 2.3 (best device I have on hand)

# Background
Some of the topics or issues I processed before or during the making of this project:
- [Media Player Error in Android error(1, -2147483648)](http://stackoverflow.com/questions/11897318/media-player-error-in-android-error1-2147483648)
- [Android mediaplayer MediaPlayer(658): error (1, -2147483648)](http://stackoverflow.com/questions/8236095/android-mediaplayer-mediaplayer658-error-1-2147483648)
- [Android MediaPlayer error: MediaPlayer error(1, -2147483648) on Stream from internet](http://stackoverflow.com/questions/10795388/android-mediaplayer-error-mediaplayer-error1-2147483648-on-stream-from-inte)
- [Simon MacDonald's VideoPlayer (for Android)](http://simonmacdonald.blogspot.com/2011/11/video-player-plugin-for-phonegap.html?commentPage=2) [GitHub Link](https://github.com/macdonst/VideoPlayer)
- [Justin's Cordova 3.0 Update to Simon's VideoPlayer](https://github.com/justinobney/PhoneGap-Video)
- [html5 video tag not working in android phonegap](http://stackoverflow.com/questions/9716526/html5-video-tag-not-working-in-android-phonegap)
- [video via phonegap on android](http://stackoverflow.com/questions/9415602/video-via-phonegap-on-android)
- [PhoneGap Video Plugin?](http://stackoverflow.com/questions/10881824/phonegap-video-plugin)
- [Is it possible to play an MP3 local file in Android (phonegap) using HTML5 <audio> tag?](https://groups.google.com/forum/#!topic/phonegap/PneF6j47yFY)
-




