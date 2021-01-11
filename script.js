const playbackUrl = 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

// We can set the element position in control bar so setting children elements
// https://stackoverflow.com/questions/45727017/how-to-change-the-position-of-videojs-control-bar-elements-order

// Initialize player
(function () {
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
            pictureInPictureToggle: false,
        }
    });
    
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
        videoContainerEl.addEventListener("click", () => {
            if (videoJSPlayer.paused()) {
                videoContainerEl.classList.remove("vjs-has-started");
            } else {
                videoContainerEl.classList.add("vjs-has-started");
            }
        });
    
        // Logs low latency setting and latency value 5s after playback starts
        const PlayerState = videoJSPlayer.getIVSEvents().PlayerState;
        ivsPlayer.addEventListener(PlayerState.PLAYING, () => {
            console.log("Player State - PLAYING");
            setTimeout(() => {
                console.log(
                    `This stream is ${
                        ivsPlayer.isLiveLowLatency() ? "" : "not "
                    }playing in ultra low latency mode`
                );
                console.log(`Stream Latency: ${ivsPlayer.getLiveLatency()}s`);
            }, 5000);
        });
    
        // Log errors
        const PlayerEventType = videoJSPlayer.getIVSEvents().PlayerEventType;
        ivsPlayer.addEventListener(PlayerEventType.ERROR, (type, source) => {
            console.warn("Player Event - ERROR: ", type, source);
        });
    
        // Log and display timed metadata
        ivsPlayer.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => {
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
