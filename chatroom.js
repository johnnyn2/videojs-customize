Date.prototype.messageTime = function() {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
}

const Message = ({userId, message}) => {
    const block = document.createElement('div');
    block.classList.add('message');
    const user = document.createElement('div');
    user.classList.add('user');
    user.innerHTML = userId;
    const txt = document.createElement('p');
    txt.classList.add('text');
    txt.innerHTML = message;
    const timestamp = document.createElement('small');
    timestamp.classList.add('timestamp');
    const currentDate = new Date();
    timestamp.innerHTML = currentDate.messageTime();
    if (currentDate.getHours() >= 12) {
        timestamp.innerHTML = timestamp.innerHTML + ' p.m.';
    } else {
        timestamp.innerHTML = timestamp.innerHTML + ' a.m.';
    }
    block.append(user);
    block.append(txt);
    block.append(timestamp);
    return block;
}
(() => {
    let sendTime = Date.now();
    const connectButton = document.getElementById("connectBtn");
    connectButton.addEventListener('click', () => {
        const userId = document.getElementById('username').value;
        const channelId = document.getElementById('channelId').value;
        console.log('username: ', userId);
        console.log('channel id: ', channelId);
        if (userId !== '' && channelId !== '') {
            const ws = new WebSocket('wss://defr3qxgz0.execute-api.ap-east-1.amazonaws.com/production');
            const overlay = document.getElementsByClassName('overlay')[0];
            overlay.remove();
            document.getElementsByClassName('greet')[0].innerHTML = `
                <div>Channel ID: ${channelId}</div>
                <div>Hi, ${userId}. You're connected to the chatroom.</div>`;
            ws.onopen = e => {
                console.log('open connection');
                ws.send(JSON.stringify({
                    action: 'livechatConnect',
                    data: {userId, channelId,}
                }))
            }

            ws.onmessage = e => {
                const data = JSON.parse(e.data);
                const latency = Date.now() - sendTime;
                console.log(`From server: ${e.data}, latency = ${latency}ms, at ${new Date().toTimeString()}`);
                const element = Message(data);
                console.log('ws receive message: ', element);
                document.getElementsByClassName('chat')[0].append(element);
            }

            const sendBtn = document.getElementById('sendBtn');
            sendBtn.addEventListener('click', e => {
                const message = document.getElementById('message-input').value;
                console.log('input message: ', message);
                if (message !== '') {
                    const msg = JSON.stringify({
                        action: 'livechatMessage',
                        data: {
                            channelId,
                            streamId: 's1',
                            userId,
                            userName: 'front',
                            message,
                        }
                    });
                    console.log('msg: ', msg);
                    sendTime = Date.now();
                    ws.send(msg);
                    document.getElementById('message-input').value = '';
                    console.log('ws sent the message!');
                }
            })

            ws.onclose = e => {
                console.log(`closing connection: ${new Date().toTimeString()}`);
                console.log(e);
            }

            ping = setInterval(() => {
                console.log(`send ping at ${new Date().toTimeString()}`);
                ws.send('{action:livechatHeartbeat}');
            }, 9*60*1000);
        }
    })
})()