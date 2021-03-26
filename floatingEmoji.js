let isDone = false;
let x = parseFloat(12);
let y = parseFloat(12);

let phase = Math.random() * 360;
let radius = Math.random() * 1;
let speed = 1 + Math.random() * 2;
let scale = 0.2 + Math.random() * 0.8;
let grow = 0.1;
let alpha = 2;

const reset = () => {
    isDone = false;
    x = parseFloat(12);
    y = parseFloat(12);
    
    phase = Math.random() * 360;
    radius = Math.random() * 1;
    speed = 1 + Math.random() * 2;
    scale = 0.2 + Math.random() * 0.8;
    grow = 0.1;
    alpha = 2;
}

const draw = () => {
    const emoji = document.getElementById('emoji-btn');
    emoji.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${grow})`;
    emoji.style.opacity = alpha;
};

const update = () => {
    if (alpha > 0) {
        alpha -= 0.009;
    }

    if (alpha < 0) {
        alpha = 0;
    }

    x += Math.cos(phase / 20) * radius;
    y -= speed;

    grow += (scale - grow) / 10;
    phase += 1;

    const emojiBtn = document.getElementById('emoji-btn');
    const parent = emojiBtn.parentElement;
    const done = alpha <= 0 || -y > parent.clientHeight - 0.3 * parent.clientHeight;
    // console.log('ypdate: ...', document.getElementById('emoji-btn').style.y);

    isDone = done;
    if (isDone) {
        console.log('y: ', y);
        console.log('');
    }
};

function startAnimation() {
    requestAnimationFrame(animation);
    function animation() {
        if (!isDone) {
            update();
            draw();
            
            requestAnimationFrame(animation);
        } else {
            const emojiBtn = document.getElementById('emoji-btn');
            emojiBtn.style.transform = 'scale(0)';
            emojiBtn.style.opacity = '';
            reset();
            startAnimation();
        }
    }
}

(function () {
    startAnimation();
})()