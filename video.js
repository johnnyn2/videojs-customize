const playbackUrl = 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8';

// We can set the element position in control bar so setting children elements
// https://stackoverflow.com/questions/45727017/how-to-change-the-position-of-videojs-control-bar-elements-order

// Initialize player
(function () {
    // Get the Component base class from Video.js
    var Component = videojs.getComponent('Component');

    // The videojs.extend function is used to assist with inheritance. In
    // an ES6 environment, `class TitleBar extends Component` would work
    // identically.
    var TitleBar = videojs.extend(Component, {

        // The constructor of a component receives two arguments: the
        // player it will be associated with and an object of options.
        constructor: function (player, options) {

            // It is important to invoke the superclass before anything else, 
            // to get all the features of components out of the box!
            Component.apply(this, arguments);

            // If a `text` option was passed in, update the text content of 
            // the component.
            if (options.text) {
                this.updateTextContent(options.text);
            }
        },

        // The `createEl` function of a component creates its DOM element.
        createEl: function () {
            return videojs.dom.createEl('div', {

                // Prefixing classes of elements within a player with "vjs-" 
                // is a convention used in Video.js.
                className: 'vjs-title-bar'
            });
        },

        // This function could be called at any time to update the text 
        // contents of the component.
        updateTextContent: function (text) {

            // If no text was provided, default to "Title Unknown"
            if (typeof text !== 'string') {
                text = 'Title Unknown';
            }

            // Use Video.js utility DOM methods to manipulate the content
            // of the component's element.
            videojs.dom.emptyEl(this.el());
            videojs.dom.appendContent(this.el(), text);
        }
    });

    // Register the component with Video.js, so it can be used in players.
    videojs.registerComponent('TitleBar', TitleBar);

    var player = videojs('videoPlayer', {
        autoplay: 'muted',
        controls: true,
        poster: 'https://picsum.photos/800/450',
        loop: true, // loop the video when end
        // fluid: true, // responsive display
        // aspectRatio: '4:3',
        playbackRates: [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
        plugins: {
            hotkeys: {
                enableModifiersForNumbers: false, // disable command + (number) to (number)% of the video; some people use mac; this command can switch tab
                seekStep: 30
            } // space: play/pause; m: mute/unmute; f: fullsreen; left: backward; right: forward; up: volume increase; down: volume decrease
        },
        responsive: true,
        controlBar: {
            children: [
                'playToggle',
                'volumePanel',
                'progressControl',
                'playbackRateMenuButton',
                'qualitySelector',
                // 'pictureInPictureToggle',
                'fullscreenToggle',
            ],
        }
    });

    player.src([
        {
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: 'video/mp4',
            label: '720P',
            selected: true,
        },
        {
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            type: 'video/mp4',
            label: '480P',
        },
        {
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            type: 'video/mp4',
            label: '360P',
        },
    ]);

    // Add the TitleBar as a child of the player and provide it some text 
    // in its options.
    player.addChild('TitleBar', { text: 'Simple Cartoon' });

    registerIVSTech(videojs);
    registerIVSQualityPlugin(videojs);

    const videoJSPlayer = videojs("liveVideo", {
        techOrder: ["AmazonIVS"],
        controlBar: {
            playToggle: {
                replay: false
            }, // Hides the replay button for VOD
            pictureInPictureToggle: false, // Hides the PiP button
        }
    });

    // Use the player API once the player instance's ready callback is fired
    const readyCallback = function () {
        // This executes after video.js is initialized and ready
        window.videoJSPlayer = videoJSPlayer;

        // Get reference to Amazon IVS player
        const ivsPlayer = videoJSPlayer.getIVSPlayer();

        // Show the "big play" button when the stream is paused
        const videoContainerEl = document.querySelector("#liveVideo");
        videoContainerEl.addEventListener("click", function() {
            if (videoJSPlayer.paused()) {
                videoContainerEl.classList.remove("vjs-has-started");
            } else {
                videoContainerEl.classList.add("vjs-has-started");
            }
        });

        // Logs low latency setting and latency value 5s after playback starts
        const PlayerState = videoJSPlayer.getIVSEvents().PlayerState;
        ivsPlayer.addEventListener(PlayerState.PLAYING, function() {
            console.log("Player State - PLAYING");
            setTimeout(function() {
                console.log(
                    `This stream is ${ivsPlayer.isLiveLowLatency() ? "" : "not "
                    }playing in ultra low latency mode`
                );
                console.log(`Stream Latency: ${ivsPlayer.getLiveLatency()}s`);
            }, 5000);
        });

        // Log errors
        const PlayerEventType = videoJSPlayer.getIVSEvents().PlayerEventType;
        ivsPlayer.addEventListener(PlayerEventType.ERROR, function(type, source) {
            console.warn("Player Event - ERROR: ", type, source);
        });

        // Log and display timed metadata
        ivsPlayer.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function(cue) {
            const metadataText = cue.text;
            const position = ivsPlayer.getPosition().toFixed(2);
            console.log(
                `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
            );
        });

        // Enables manual quality selection plugin
        videoJSPlayer.enableIVSQualityPlugin();

        // Set volume and play default stream
        videoJSPlayer.volume(0.5);
        videoJSPlayer.src(playbackUrl);
    };

    // Register ready callback
    videoJSPlayer.ready(readyCallback);
})();
