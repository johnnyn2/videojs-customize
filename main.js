import {RippleButton} from './button/index.js';

(function() {
    const buttons = document.getElementsByTagName("button");
    for(const button of buttons) {
        RippleButton(button);
    }
})()