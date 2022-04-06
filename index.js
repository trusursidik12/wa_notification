const { countReset, count } = require('console');
const fs = require('fs');
const moment = require('moment');
const { Client , LegacySessionAuth} = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
const getNotif = require('./include/getNotification')
const intervalCheck = 60000; // ms | 1 mins
const delaySending = 5000; // ms | 10 sec

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) { // Restore session
    sessionData = require(SESSION_FILE_PATH);
}
const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    })
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('qr', (qr) => {
    var QRCode = require('qrcode')
    var qrCodeTerminal = require('qrcode-terminal');
    qrCodeTerminal.generate(qr,{small:true});
    QRCode.toFile('qr.png',qr,{type:'terminal', width:1},()=>{
        console.log(`QR Code telah update! Harap Scan QR Code terbaru! \nqr.png`);
    })
});
let getNow = ()=>{

    return moment().locale('id').utcOffset(7).format('dddd, D MMMM YYYY H:mm:ss')
}
let countNotification = 0;
client.on('ready', async () => {
    console.log(`[${getNow()}] - Bot WhatsApp already running!`);
    try{
        countNotification = 0;
        setInterval(async () => {
            if(countNotification <= 1){
                console.log(`[${getNow()}] - Get new notifications...`);
                const notifications = await getNotif.getNotif();
                countNotification = notifications.length;
                console.log(`[${getNow()}] - Waiting list : ${countNotification} notifications`);
                await notifications.forEach(async (value,index)=>{
                    const chatId = getNotif.getChatId(value);
                    setTimeout(async() => {
                        console.log(`[${getNow()}] - Remain : ${countNotification} notifications`)
                        /**
                         * sendMessage(chatId[string], content[string|image|etc])
                         */
                        client.sendMessage(chatId, value.content)
                        .then(()=>{
                            countNotification--;
                            getNotif.updateStatus(value.id)
                            .then(()=>{
                                console.log(`[${getNow()}] - Message sent to ${value.receiver}`);
                            }).catch((e) => {
                                console.log(`[${getNow()}] - [Error] : Cant update status was sent ID:${value.id}`)
                            });
                        }).catch((e)=>{
                            console.log(`[${getNow()}] - [Error] : Cant sent to :${value.receiver}`)
                        })
                    }, ((index+1) * delaySending));
                })
            }else{
                console.log(`[${getNow()}] - Waiting ${countNotification} sent successfully`);
            }
         }, intervalCheck);
    }catch(err){
        console.log(`Apps was forced to close. Because : ${err}`);
    }
});
client.on('message',msg =>{
    const request = msg.body.toLocaleLowerCase() ;
    if (request == '!ping') {
        msg.reply(`pong`);
    }
    if (request == '!test' || request == 'test') {
        msg.reply(`Bot is running!`);
    }
});
client.on('disconnected', () => {
    console.log('Bot WhatsApp berhenti berjalan!');
    console.log('Disconnected from Device! Please Reconnect!');
    countNotification = 0;
});


client.initialize();