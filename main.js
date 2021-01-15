import {RippleButton} from '/button/index.js';

(() => {
    const connectButton = document.getElementById("connectBtn");
    const sendButton = document.getElementById("sendBtn");
    RippleButton(connectButton);
    RippleButton(sendButton);
})()