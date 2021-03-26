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
    constructor: function (player, options) {
        Component.apply(this, arguments);
        if (options.code) {
            this.updateTextContent(options.code);
        }
        emojiArr.push(new defaultEmojiConfig());
        const index = emojiArr.length - 1;
        startAnimation(emojiArr[index], index);
    },
    createEl: function () {
        return videojs.dom.createEl('p', {
            className: 'vjs-emoji',
            innerHTML: '',
            id: "vjs-emoji-" + emojiArr.length,
        });
    },
    updateTextContent: function (text) {
        videojs.dom.addClass(this.el(), text);
    }
});

videojs.registerComponent('Emoji', Emoji);

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