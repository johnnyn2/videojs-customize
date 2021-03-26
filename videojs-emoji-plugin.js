/** Author: Johnny Ho 
 *  This is an plugin to create and manage floating emojis in videojs player
*/
function defaultEmojiConfig() {
    this.isDone = false;
    this.x = parseFloat(12);
    this.y= parseFloat(12);
    this.phase= Math.random() * 360;
    this.radius = Math.random() * 1;
    this.speed= 1 + Math.random() * 2;
    this.scale = 0.2 + Math.random() * 0.8;
    this.grow = 0.1;
    this.alpha = 2;
}
var emojiArr = [];
var Component = videojs.getComponent('Component');
var Emoji = videojs.extend(Component, {

    // The constructor of a component receives two arguments: the
    // player it will be associated with and an object of options.
    constructor: function (player, options) {
        // It is important to invoke the superclass before anything else, 
        // to get all the features of components out of the box!
        Component.apply(this, arguments);

        // If a `text` option was passed in, update the text content of 
        // the component.
        if (options.code) {
            this.updateTextContent(options.code);
        }

        emojiArr.push(new defaultEmojiConfig());
        const index = emojiArr.length - 1;
        startAnimation(emojiArr[index], index);
    },

    // The `createEl` function of a component creates its DOM element.
    createEl: function () {
        return videojs.dom.createEl('p', {

            // Prefixing classes of elements within a player with "vjs-" 
            // is a convention used in Video.js.
            className: 'vjs-emoji',
            innerHTML: '',
            id: "vjs-emoji-" + emojiArr.length,
        });
    },

    // This function could be called at any time to update the text 
    // contents of the component.
    updateTextContent: function (text) {
        // Use Video.js utility DOM methods to manipulate the content
        // of the component's element.
        // videojs.dom.emptyEl(this.el());
        // videojs.dom.appendContent(this.el(), text);
        videojs.dom.addClass(this.el(), text);
    }
});

videojs.registerComponent('Emoji', Emoji);

const reset = (emojiCfg) => {
    emojiCfg = {
        isDone: false,
        x: parseFloat(12),
        y: parseFloat(12),
        phase: Math.random() * 360,
        radius: Math.random() * 1,
        speed: 1 + Math.random() * 2,
        scale: 0.2 + Math.random() * 0.8,
        grow: 0.1,
        alpha: 2,
    };
}

const draw = (emojiCfg, emoji) => {
    emoji.style.transform = `translateX(${emojiCfg.x}px) translateY(${emojiCfg.y}px) translateZ(0) scale(${emojiCfg.grow})`;
    emoji.style.opacity = emojiCfg.alpha;
};

const update = (emojiCfg) => {
    if (emojiCfg.alpha > 0) {
        emojiCfg.alpha -= 0.009;
    }

    if (emojiCfg.alpha < 0) {
        emojiCfg.alpha = 0;
    }

    emojiCfg.x += Math.cos(emojiCfg.phase / 20) * emojiCfg.radius;
    emojiCfg.y -= emojiCfg.speed;

    emojiCfg.grow += (emojiCfg.scale - emojiCfg.grow) / 10;
    emojiCfg.phase += 1;

    const emojiBtn = document.getElementsByClassName('vjs-emoji');
    const parent = emojiBtn[0].parentElement;
    const done = emojiCfg.alpha <= 0 || -emojiCfg.y > parent.clientHeight - 0.3 * parent.clientHeight;

    emojiCfg.isDone = done;
};

function startAnimation(emojiCfg, index) {
    requestAnimationFrame(animation);
    function animation() {
        if (!emojiCfg.isDone) {
            update(emojiCfg);
            draw(emojiCfg, document.getElementById('vjs-emoji-' + index));
            requestAnimationFrame(animation);
        } else {
            emojiArr[index] = null;
            emojiArr.slice(index, 1);
            document.getElementById('vjs-emoji-' + index).remove();
        } 
    }
}